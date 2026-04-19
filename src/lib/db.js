import { PrismaClient } from '@prisma/client'
import path from 'path'
import dotenv from 'dotenv'

// Ensure environment variables are loaded
dotenv.config()

/**
 * PRISMA 6 BOILERPLATE
 * We explicitly construct the database URL to be absolute.
 * This prevents the "Cannot read properties of undefined (reading 'replace')" error
 * by ensuring Prisma always receives a valid connection string.
 */
const getPrismaClient = () => {
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
  const datasourceUrl = `file:${dbPath}`

  console.log(`[Database] Connecting to: ${datasourceUrl}`)
  
  return new PrismaClient({
    datasources: {
      db: {
        url: datasourceUrl,
      },
    },
  })
}

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ?? getPrismaClient()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
