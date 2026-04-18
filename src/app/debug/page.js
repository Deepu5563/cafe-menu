export default function DebugPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>App Router: ALIVE</h1>
      <p>Deployment Timestamp: {new Date().toISOString()}</p>
      <p>If you can see this, the Vercel deployment is successful and routing is working.</p>
    </div>
  );
}
