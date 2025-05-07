import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/auth/login`, {
        email,
        password,
      });

      console.log('Token received:', res.data.token);
      setToken(res.data.token);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Login | Fabrica Real Estate">
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Access the Fabrica Real Estate CRM
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                className="bg-[#c7a565]/20 border border-[#c7a565]/50 text-black px-4 py-3 rounded relative"
                role="alert"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, type: 'spring', bounce: 0.5 }}
              >
                <span className="block sm:inline">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-600 text-black rounded-t-md focus:outline-none focus:ring-[#c7a565] focus:border-[#c7a565] focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-600 text-black rounded-b-md focus:outline-none focus:ring-[#c7a565] focus:border-[#c7a565] focus:z-10 sm:text-sm transition-all duration-200"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[#c7a565] hover:bg-[#d9b87c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c7a565] ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={{ scale: loading ? 1 : 1.05, boxShadow: loading ? 'none' : '0 0 10px rgba(199, 165, 101, 0.5)' }}
                transition={{ duration: 0.2 }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </motion.button>
            </div>

            <div className="text-center">
              <Link href="/" className="text-sm text-[#c7a565] hover:text-[#d9b87c]">
                Return to website
              </Link>
            </div>
          </form>

          <motion.div
            className="mt-6 border-t border-gray-200 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
          
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}