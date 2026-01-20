import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabase'
import '../styles/globals.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/')
    })
  }, [router])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/')
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Admin Login - Manga Admin</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Manga Admin
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">Sign in to your admin account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
            Don't have an account? Contact your administrator
          </p>
        </div>
      </div>
    </>
  )
}
