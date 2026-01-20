import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import MangaCard from '../components/MangaCard'
import '../styles/globals.css'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [manga, setManga] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        fetchManga()
      }
    })
  }, [router])

  const fetchManga = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('manga').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setManga(data || [])
    } catch (error) {
      console.error('Error fetching manga:', error)
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this manga?')) {
      try {
        const { error } = await supabase.from('manga').delete().eq('id', id)
        if (error) throw error
        fetchManga()
      } catch (error) {
        alert('Error deleting manga: ' + error.message)
      }
    }
  }

  if (!user) return <div>Loading...</div>

  return (
    <>
      <Head>
        <title>Manga Admin Dashboard</title>
        <meta name="description" content="Manga Admin Panel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Manga</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{manga.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Ongoing</p>
              <p className="text-3xl font-bold text-green-600">{manga.filter(m => m.status === 'ongoing').length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-blue-600">{manga.filter(m => m.status === 'completed').length}</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manga Library</h2>
            
            {loading ? (
              <p className="text-center text-gray-600 dark:text-gray-400">Loading manga...</p>
            ) : manga.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400">No manga yet. Create one!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {manga.map((m) => (
                  <MangaCard key={m.id} manga={m} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

