"use server";

import prisma from "@/lib/db";
import { INITIAL_MENU_DATA } from "@/lib/initialData";
import { revalidatePath } from "next/cache";

/**
 * UTILITY: Smart Sort Items
 * 1. Sorts by price (ascending)
 * 2. Pushes items containing "(Extra)" or starting with "Extra" to the bottom.
 */
function smartSortItems(items) {
  return [...items].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    const isExtraA = nameA.includes('extra') || nameA.includes('(extra)');
    const isExtraB = nameB.includes('extra') || nameB.includes('(extra)');
    
    // Extras always go to the bottom
    if (isExtraA && !isExtraB) return 1;
    if (!isExtraA && isExtraB) return -1;
    
    // Otherwise sort by numeric price
    const priceA = parseFloat(a.price) || 0;
    const priceB = parseFloat(b.price) || 0;
    return priceA - priceB;
  });
}

/**
 * Fetches everything from the database.
 * If empty, returns null so the client knows to trigger initial migration.
 */
export async function fetchFullMenu() {
  try {
    const info = await prisma.restaurantInfo.findFirst();
    const sections = await prisma.section.findMany({
      include: { items: true },
      orderBy: { order: 'asc' }
    });

    if (sections.length === 0) return null;

    return {
      restaurantName: info?.name || INITIAL_MENU_DATA.restaurantName,
      tagline: info?.tagline || INITIAL_MENU_DATA.tagline,
      contact: {
        phone: info?.phone || INITIAL_MENU_DATA.contact.phone,
        email: info?.email || INITIAL_MENU_DATA.contact.email,
        address: info?.address || INITIAL_MENU_DATA.contact.address,
      },
      page1: sections.filter(s => s.page === 'page1').map(s => ({
        ...s,
        items: smartSortItems(s.items)
      })),
      page2: sections.filter(s => s.page === 'page2').map(s => ({
        ...s,
        items: smartSortItems(s.items)
      })),
      version: 170
    };
  } catch (error) {
    console.error("[Database] Fetch Error:", error);
    return null;
  }
}

/**
 * Saves local storage data to the database for the first time.
 */
export async function syncLocalStorageToDB(menuData) {
  if (!menuData) return { success: false, error: "No data" };

  try {
    // 1. Save Info
    await prisma.restaurantInfo.upsert({
      where: { id: 1 },
      update: {
        name: menuData.restaurantName || "THE URBAN BITES",
        tagline: menuData.tagline || "",
        phone: menuData.contact?.phone || "",
        email: menuData.contact?.email || "",
        address: menuData.contact?.address || "",
      },
      create: {
        id: 1,
        name: menuData.restaurantName || "THE URBAN BITES",
        tagline: menuData.tagline || "",
        phone: menuData.contact?.phone || "",
        email: menuData.contact?.email || "",
        address: menuData.contact?.address || "",
      }
    });

    // 2. Atomic Clear and Save
    await prisma.$transaction(async (tx) => {
      await tx.item.deleteMany({});
      await tx.section.deleteMany({});

      const allSections = [
        ...(menuData.page1 || []).map((s, i) => ({ ...s, page: 'page1', order: i })),
        ...(menuData.page2 || []).map((s, i) => ({ ...s, page: 'page2', order: i }))
      ];

      for (const sectionData of allSections) {
        await tx.section.create({
          data: {
            id: sectionData.id,
            title: sectionData.title,
            image: sectionData.image,
            fit: sectionData.fit || 'cover',
            page: sectionData.page,
            order: sectionData.order,
            items: {
              create: (sectionData.items || []).map((item, idx) => ({
                id: item.id,
                name: item.name,
                description: item.description || "",
                price: String(item.price || "0"),
                order: idx
              }))
            }
          }
        });
      }
    }, { timeout: 15000 });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[Database] Sync Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateItemInDB(itemId, updates) {
  try {
    await prisma.item.update({
      where: { id: itemId },
      data: updates
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[Database] Update Error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function updateSectionInDB(sectionId, updates) {
  try {
    await prisma.section.update({
      where: { id: sectionId },
      data: updates
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[Database] Section Update Error:", error);
    return { success: false };
  }
}

export async function deleteItemFromDB(itemId) {
  try {
    await prisma.item.delete({ where: { id: itemId } });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[Database] Deletion Error:", error);
    return { success: false };
  }
}

export async function deleteSectionAction(sectionId) {
  try {
    await prisma.section.delete({ where: { id: sectionId } });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[Database] Section Deletion Error:", error);
    return { success: false };
  }
}

export async function addSectionAction(page, order) {
  try {
    const id = `sec-${Date.now()}`;
    const newSection = await prisma.section.create({
      data: { id, title: "New Section", page, order }
    });
    revalidatePath("/");
    return { success: true, section: newSection };
  } catch (error) {
    console.error("[Database] Section Add Error:", error);
    return { success: false };
  }
}

export async function addItemAction(sectionId, order) {
  try {
    const id = `item-${Date.now()}`;
    const newItem = await prisma.item.create({
      data: { id, name: "New Item", price: "0", order, sectionId }
    });
    revalidatePath("/");
    return { success: true, item: newItem };
  } catch (error) {
    console.error("[Database] Item Add Error:", error);
    return { success: false };
  }
}

export async function resetDatabaseToInitial() {
  try {
    return await syncLocalStorageToDB(INITIAL_MENU_DATA);
  } catch (error) {
    return { success: false };
  }
}
