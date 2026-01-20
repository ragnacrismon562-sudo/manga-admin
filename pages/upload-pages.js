import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import '../styles/globals.css'

export default function UploadPages() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [mangaList, setMangaList] = useState([])
  const [chapterList, setChapterList] = useState([])
  const [selectedManga, setSelectedManga] = useState('')
  const [selectedChapter, setSelectedChapter] = useState('')
  const [files, setFiles] = useState([])
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

  const fetchChapters = async (mangaId) => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('id, chapter_number, title')
        .eq('manga_id', mangaId)
        .order('chapter_number')
      if (error) throw error
      setChapterList(data || [])
    } catch (error) {
      console.error('Error fetching chapters:', error)
    }
  }

  const handleMangaChange = (e) => {
    const mangaId = e.target.value
    setSelectedManga(mangaId)
    setSelectedChapter('')
    if (mangaId) {
      fetchChapters(mangaId)
    } else {
      setChapterList([])
    }
  }

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files || []))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedChapter) {
      setError('Please select a chapter')
      return
    }
    if (files.length === 0) {
      setError('Please select at least one image')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Get the highest page number for this chapter
      const { data: existingPages } = await supabase
        .from('pages')
        .select('page_number')
        .eq('chapter_id', selectedChapter)
        .order('page_number', { ascending: false })
        .limit(1)

      let nextPageNumber = 1
      if (existingPages && existingPages.length > 0) {
        nextPageNumber = existingPages[0].page_number + 1
      }

      // Upload each file
      const pagePromises = files.map(async (file, index) => {
        const fileName = `chapter-${selectedChapter}-page-${nextPageNumber + index}.jpg`
        
        // For now, store the image URL as a placeholder
        // In a real scenario, you'd upload to R2 and get the URL
        const imageUrl = `https://placeholder-image.com/${fileName}`

        return {
          chapter_id: selectedChapter,
          page_number: nextPageNumber + index,
          image_url: imageUrl,
        }
      })

      const pagesToInsert = await Promise.all(pagePromises)

      const { data, error } = await supabase
        .from('pages')
        .insert(pagesToInsert)

      if (error) throw error

      setSuccess(`Successfully uploaded ${files.length} pages!`)
      setFiles([])
      
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
        <title>Upload Pages - Manga Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        
        <main className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Upload Manga Pages</h1>

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
                value={selectedManga}
                onChange={handleMangaChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Choose a manga...</option>
                {mangaList.map(manga => (
                  <option key={manga.id} value={manga.id}>{manga.title}</option>
                ))}
              </select>
            </div>

            {selectedManga && (
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Select Chapter *</label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Choose a chapter...</option>
                  {chapterList.map(chapter => (
                    <option key={chapter.id} value={chapter.id}>
                      Chapter {chapter.chapter_number} {chapter.title && `- ${chapter.title}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Select Images *</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer block">
                  <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-8l-3.172-3.172a4 4 0 00-5.656 0L28 16M8 24h32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="mt-2 block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Click to upload or drag and drop
                  </span>
                  <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 10MB each
                  </span>
                </label>
              </div>
              {files.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Selected files: {files.length}
                  </p>
                  <ul className="space-y-1">
                    {files.map((file, idx) => (
                      <li key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {loading ? 'Uploading...' : 'Upload Pages'}
            </button>
          </form>
        </main>
      </div>
    </>
  )
}
