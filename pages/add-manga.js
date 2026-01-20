import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import '../styles/globals.css'

export default function AddManga() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    status: 'ongoing',
    genres: '',
    cover_image: '',
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
      }
    })
  }, [router])

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
      const genresArray = formData.genres.split(',').map(g => g.trim()).filter(g => g)
      
      const { data, error } = await supabase.from('manga').insert([
        {
          title: formData.title,
          description: formData.description,
          author: formData.author,
          status: formData.status,
          genres: genresArray,
          cover_image: formData.cover_image,
        },
      ])

      if (error) throw error
      
      setSuccess('Manga added successfully!')
      setFormData({
        title: '',
        description: '',
        author: '',
        status: 'ongoing',
        genres: '',
        cover_image: '',
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
        <title>Add Manga - Manga Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        
        <main className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Add New Manga</h1>

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
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Manga Title"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Author *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Author Name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Manga description..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Genres (comma separated)</label>
              <input
                type="text"
                name="genres"
                value={formData.genres}
                onChange={handleChange}
                placeholder="Action, Adventure, Comedy"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Cover Image URL</label>
              <input
                type="url"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleChange}
                placeholder="https://example.com/cover.jpg"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {loading ? 'Adding...' : 'Add Manga'}
            </button>
          </form>
        </main>
      </div>
    </>
  )
}
