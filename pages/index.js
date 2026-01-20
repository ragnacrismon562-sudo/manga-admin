import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import MangaCard from '../components/MangaCard'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [manga, setManga] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    setError('')
    try {
      const { data, error: fetchError } = await supabase
        .from('manga')
        .select('*')
        .order('created_at', { ascending: false })
      if (fetchError) throw fetchError
      setManga(data || [])
    } catch (err) {
      console.error('Error fetching manga:', err)
      setError('Failed to load manga. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this manga? This cannot be undone.')) {
      try {
        const { error: deleteError } = await supabase.from('manga').delete().eq('id', id)
        if (deleteError) throw deleteError
        setManga(manga.filter(m => m.id !== id))
      } catch (err) {
        alert('Error deleting manga: ' + err.message)
      }
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  const ongoingCount = manga.filter(m => m.status === 'ongoing').length
  const completedCount = manga.filter(m => m.status === 'completed').length
  const totalChapters = manga.reduce((sum, m) => sum + (m.chapters_count || 0), 0)

  return (
    <>
      <Head>
        <title>Manga Admin Dashboard</title>
        <meta name="description" content="Professional Manga Admin Panel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">📚 Manga Collection Admin</h1>
              <p className="text-gray-600 dark:text-gray-400">Welcome back, {user?.email}</p>
            </div>
            <Link href="/add-manga">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors">
                + Add Manga
              </button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Manga</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{manga.length}</p>
                </div>
                <div className="text-4xl opacity-20">📚</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Ongoing Series</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{ongoingCount}</p>
                </div>
                <div className="text-4xl opacity-20">▶️</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{completedCount}</p>
                </div>
                <div className="text-4xl opacity-20">✓</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Chapters</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{totalChapters}</p>
                </div>
                <div className="text-4xl opacity-20">📖</div>
              </div>
            </div>
          </div>

          {/* Manga Library Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manga Library</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading your manga collection...</p>
                </div>
              </div>
            ) : manga.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">No manga yet. Start by adding your first series!</p>
                <Link href="/add-manga">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg">
                    Add First Manga
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

