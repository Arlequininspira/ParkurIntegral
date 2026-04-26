import { Routes, Route } from 'react-router-dom'
import logo from '../Img/Escudo-Parkour-blanco-fondo-negro-01-768x768.png'
import SEO from './components/SEO'
import Header from './components/Header'
import Hero from './components/Hero'
import QuienesSomos from './components/QuienesSomos'
import Horarios from './components/Horarios'
import Mapa from './components/Mapa'
import SocialContacto from './components/SocialContacto'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import QuienesSomosPage from './pages/QuienesSomosPage'

function HomePage() {
  return (
    <>
      <SEO />
      <Header />
      <Hero />
      <QuienesSomos />
      <Horarios />
      <Mapa />
      <SocialContacto />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <>
      <div
        className="bg-watermark"
        style={{ backgroundImage: `url(${logo})` }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quienes-somos" element={<QuienesSomosPage />} />
      </Routes>
      <WhatsAppButton />
    </>
  )
}
