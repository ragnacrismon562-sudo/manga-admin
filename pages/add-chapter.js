import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function AddChapter() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [mangaList, setMangaList] = useState([])
  const [formData, setFormData] = useState({
    manga_id: '',
    chapter_number: '',
    title: '',
    release_date: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
    try {
      const { data, error } = await supabase.from('manga').select('id, title').order('title')
      if (error) throw error
      setMangaList(data || [])
    } catch (error) {
      console.error('Error fetching manga:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { data, error } = await supabase.from('chapters').insert([
        {
          manga_id: formData.manga_id,
          chapter_number: parseInt(formData.chapter_number),
          title: formData.title,
          release_date: formData.release_date,
        },
      ])

      if (error) throw error
      
      setSuccess('Chapter added successfully!')
      setFormData({
        manga_id: '',
        chapter_number: '',
        title: '',
        release_date: '',
      })

      setTimeout(() => router.push('/'), 2000)
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  if (!user) return <div>Loading...</div>

  return (
    <>
      <Head>
        <title>Add Chapter - Manga Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        
        <main className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Add New Chapter</h1>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
            {error && (
              <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Select Manga *</label>
              <select
                name="manga_id"
                value={formData.manga_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Choose a manga...</option>
                {mangaList.map(manga => (
                  <option key={manga.id} value={manga.id}>{manga.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Chapter Number *</label>
              <input
                type="number"
                name="chapter_number"
                value={formData.chapter_number}
                onChange={handleChange}
                placeholder="1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Chapter Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Chapter title..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Release Date</label>
              <input
                type="date"
                name="release_date"
                value={formData.release_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {loading ? 'Adding...' : 'Add Chapter'}
            </button>
          </form>
        </main>
      </div>
    </>
  )
}
