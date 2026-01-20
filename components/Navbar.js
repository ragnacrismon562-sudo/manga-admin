import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    if (isDark) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  if (!user) return null

  return (
    <nav className="bg-blue-600 dark:bg-blue-800 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold">Manga Admin</h1>
          <div className="flex space-x-4">
            <Link href="/" className="hover:bg-blue-700 px-3 py-2 rounded">
              Dashboard
            </Link>
            <Link href="/add-manga" className="hover:bg-blue-700 px-3 py-2 rounded">
              Add Manga
            </Link>
            <Link href="/add-chapter" className="hover:bg-blue-700 px-3 py-2 rounded">
              Add Chapter
            </Link>
            <Link href="/upload-pages" className="hover:bg-blue-700 px-3 py-2 rounded">
              Upload Pages
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded"
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
          <span className="text-sm">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
