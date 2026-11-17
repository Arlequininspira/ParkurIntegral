import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../../Img/Escudo-Parkour-blanco-fondo-negro-01-768x768.png'
import { WHATSAPP_URL } from '../constants'

const LINKS = [
  { id: 'escuela', label: 'La escuela' },
  { id: 'horarios', label: 'Horarios' },
  { id: 'ubicacion', label: 'Ubicación' },
  { id: 'contacto', label: 'Contacto' },
]

export default function Header() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const href = (id) => (isHome ? `#${id}` : `/#${id}`)

  return (
    <header className={`nav ${scrolled || !isHome ? 'nav--solid' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-brand" onClick={() => setOpen(false)}>
          <img src={logo} alt="" width="40" height="40" />
          <span>Parkour Integral</span>
        </Link>

        <nav className="nav-links" aria-label="Principal">
          {LINKS.map((l) => (
            <a key={l.id} href={href(l.id)} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a className="btn btn--sm btn--primary nav-cta" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            Clase de prueba
          </a>
        </nav>

        <button
          className="nav-toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
