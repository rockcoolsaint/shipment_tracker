import '@/styles/globals.css'

// INTERNAL IMPORT
import { TrackingProvider } from '@/context/TrackingContext';
import { NavBar, Footer } from '@/components';

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
