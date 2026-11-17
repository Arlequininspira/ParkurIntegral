import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import SEO from './components/SEO'
import Header from './components/Header'
import Hero from './components/Hero'
import QuienesSomos from './components/QuienesSomos'
import Horarios from './components/Horarios'
// Galería lista para cuando haya fotos: import Galeria from './components/Galeria'
import Mapa from './components/Mapa'
import SocialContacto from './components/SocialContacto'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ClickSpark from './components/rb/ClickSpark'
import QuienesSomosPage from './pages/QuienesSomosPage'
import { useReveal } from './hooks'

function HomePage() {
  useReveal()
  return (
    <>
      <SEO />
      <Hero />
      <main>
        <QuienesSomos />
        <Horarios />
        <Mapa />
        <SocialContacto />
      </main>
      <Footer />
    </>
  )
}

/* Al cambiar de ruta: ir al ancla (/#horarios) o arriba de todo */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView())
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <ClickSpark sparkColor="#faa650" sparkSize={10} sparkRadius={22} sparkCount={8} duration={450} style={{ minHeight: '100vh' }}>
      <ScrollManager />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quienes-somos" element={<QuienesSomosPage />} />
      </Routes>
      <WhatsAppButton />
    </ClickSpark>
  )
}
