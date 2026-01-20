import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabase'

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
        <title>Login - Manga Admin</title>
        <meta name="description" content="Login to Manga Admin Panel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 sm:p-10">
            {/* Logo/Title */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">📚</div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manga Admin</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Professional Manga Management</p>
            </div>
            
            {/* Error Alert */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
                <p className="font-semibold text-sm">⚠️ Login Failed</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}
            
            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold text-sm mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@manga.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold text-sm mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-8 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
              Contact your administrator for access credentials
            </p>
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-white/10 backdrop-blur-md rounded-lg p-4 text-white border border-white/20">
            <p className="font-semibold mb-1 text-sm">💡 Admin Features</p>
            <ul className="text-xs text-white/80 space-y-1">
              <li>✓ Manage manga collections</li>
              <li>✓ Upload chapters and pages</li>
              <li>✓ Track reading progress</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
