// src/pages/_app.js
import '../styles/globals.css'
import { AuthProvider } from '../contexts/AuthContext'

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}