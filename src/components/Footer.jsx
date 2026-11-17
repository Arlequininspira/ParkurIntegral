import logo from '../../Img/Escudo-Parkour-blanco-fondo-negro-01-768x768.png'

export default function Footer() {
  return (
    <footer className="footer">
      <img src={logo} alt="" width="56" height="56" loading="lazy" />
      <p>© Parkour Integral 2026 · Escuela Integral de Parkour · Buenos Aires</p>
      <p className="footer-credit">
        Página creada y diseñada por{' '}
        <a href="https://www.arlequin.com.ar" target="_blank" rel="noopener noreferrer">www.arlequin.com.ar</a>
      </p>
    </footer>
  )
}
