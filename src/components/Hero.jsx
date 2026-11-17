import LakesideScene from './LakesideScene'
import BlurText from './rb/BlurText'
import ShinyText from './rb/ShinyText'
import Icon from './Icon'
import logo from '../../Img/Escudo-Parkour-blanco-fondo-negro-01-768x768.png'
import { WHATSAPP_URL } from '../constants'

const COLONIA_URL = `${WHATSAPP_URL}${encodeURIComponent('¡Hola! Quiero inscribirme a la Colonia de verano.')}`

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <LakesideScene />
      <div className="hero-content">
        <div className="hero-logo">
          <span className="hero-logo-halo" aria-hidden="true" />
          <img src={logo} alt="Escudo de la Escuela Integral de Parkour" width="768" height="768" fetchPriority="high" />
        </div>
        <h1 className="hero-title">
          <BlurText text="Escuela Integral de Parkour" delay={90} animateBy="words" direction="bottom" as="span" />
        </h1>
        <p className="hero-sub">
          <ShinyText text="Emoción · Palabra · Acción" color="#f3d6c4" shineColor="#ffffff" speed={3} />
        </p>
        <div className="hero-ctas">
          <a className="btn btn--primary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            Reservá tu clase <Icon name="arrow" size={18} />
          </a>
          <a className="btn btn--ghost" href="#horarios">
            Ver horarios
          </a>
        </div>
        <a className="hero-colonia" href={COLONIA_URL} target="_blank" rel="noopener noreferrer">
          <span className="hero-colonia-tag">Colonia de verano</span>
          <span className="hero-colonia-cta">
            Inscribite <Icon name="arrow" size={16} />
          </span>
        </a>
      </div>
      <a className="hero-scroll" href="#escuela" aria-label="Bajar a La escuela">
        <span />
      </a>
    </section>
  )
}
