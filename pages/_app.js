import '@/styles/globals.css'

// INTERNAL IMPORT
import { TrackingProvider } from '@/context/TrackingContext';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function App({ Component, pageProps }) {
  return (
    <>
      <TrackingProvider>
        <NavBar />
        <Component {...pageProps} />
      </TrackingProvider>
      <Footer />
    </>
  )
}
