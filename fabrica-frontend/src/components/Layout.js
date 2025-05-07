import Link from 'next/link';
import Head from 'next/head';

export default function Layout({ children, title = 'Fabrica Real Estate' }) {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Fabrica Real Estate - Premium Properties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className="bg-black border-b border-[#c7a565]/20 shadow-[0_0_30px_rgba(199,165,101,0.15)]">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-[#c7a565]">
              Fabrica Real Estate
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-[#c7a565] transition-colors">
              Home
            </Link>
            <Link href="/properties" className="text-white hover:text-[#c7a565] transition-colors">
              Properties
            </Link>
            <Link href="/login" className="bg-[#c7a565] hover:bg-[#d9b87c] text-black px-4 py-2 rounded-lg font-medium transition-colors">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-black">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-[#c7a565]/20 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-white mb-4">Fabrica Real Estate</h3>
              <p className="text-gray-400">Quality properties for discerning clients.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-[#c7a565] transition-colors">Home</Link></li>
                <li><Link href="/properties" className="text-gray-400 hover:text-[#c7a565] transition-colors">Properties</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-[#c7a565] transition-colors">Admin Login</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#c7a565]/20 mt-8 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Fabrica Real Estate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}