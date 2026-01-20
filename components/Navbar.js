import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isDark, setIsDark] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

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

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/add-manga', label: 'Add Manga', icon: '📚' },
    { href: '/add-chapter', label: 'Add Chapter', icon: '📖' },
    { href: '/upload-pages', label: 'Upload Pages', icon: '📸' },
  ]

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📚</div>
            <Link href="/" className="font-bold text-xl hover:text-blue-100 transition-colors">
              Manga Admin
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <button className={`px-4 py-2 rounded-lg transition-colors ${
                  router.pathname === link.href
                    ? 'bg-blue-800 dark:bg-blue-700'
                    : 'hover:bg-blue-700 dark:hover:bg-blue-700'
                }`}>
                  {link.icon} {link.label}
                </button>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-blue-700 dark:hover:bg-blue-700 rounded-lg transition-colors"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* User Menu */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-blue-700 dark:bg-blue-800 rounded-lg">
              <span className="text-sm font-medium truncate max-w-[150px]">{user?.email}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-semibold text-sm"
            >
              Logout
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <button className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  router.pathname === link.href
                    ? 'bg-blue-800 dark:bg-blue-700'
                    : 'hover:bg-blue-700 dark:hover:bg-blue-700'
                }`}>
                  {link.icon} {link.label}
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
