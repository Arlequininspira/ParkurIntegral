import logo from '../../Img/Escudo-Parkour-blanco-fondo-negro-01-768x768.png'

export default function Header({ hideNav = false }) {
  return (
    <>
      <div className="logo-section">
        <a href="/">
          <img
            src={logo}
            alt="Parkour Integral - Escuela Integral de Parkour Buenos Aires"
            width="750"
            height="750"
            fetchPriority="high"
          />
        </a>
      </div>

      {!hideNav && (
        <nav className="nav">
          <div className="nav-inner">
            <div />
            <div className="nav-link fade-in">
              <h6><a href="#quienessomos">LA ESCUELA</a></h6>
            </div>
            <div className="nav-link fade-in">
              <h6><a href="#contacto">CONTACTO</a></h6>
            </div>
            <div className="nav-link fade-in">
              <h6><a href="#horario">HORARIOS</a></h6>
            </div>
            <div />
          </div>
        </nav>
      )}
    </>
  )
}
