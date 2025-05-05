// src/components/Layout.js
import Link from 'next/link'
import Head from 'next/head'

export default function Layout({ children, title = 'Fabrica Real Estate' }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Fabrica Real Estate - Premium Properties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">Fabrica Real Estate</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-800 hover:text-blue-600">
              Home
            </Link>
            <Link href="/properties" className="text-gray-800 hover:text-blue-600">
              Properties
            </Link>
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">Fabrica Real Estate</h3>
              <p className="text-gray-400">Quality properties for discerning clients.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link href="/properties" className="text-gray-400 hover:text-white">Properties</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white">Admin Login</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Fabrica Real Estate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}