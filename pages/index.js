import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Manga Admin</title>
        <meta name="description" content="Manga Admin Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={{ padding: '40px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <h1>Manga Admin Platform</h1>
        <p>Welcome to your manga admin dashboard.</p>
        <p>This is the starting point. More features coming soon!</p>
      </main>
    </div>
  );
}
