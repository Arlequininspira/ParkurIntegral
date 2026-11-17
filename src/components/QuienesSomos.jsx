import { Link } from 'react-router-dom'
import CountUp from './rb/CountUp'
import Icon from './Icon'

const STATS = [
  { to: 20, prefix: '+', label: 'años de experiencia' },
  { to: 32000, prefix: '+', separator: '.', label: 'seguidores en redes' },
  { to: 2008, label: 'abrimos el primer espacio techado' },
]

const VALORES = ['Fortaleza', 'Salud', 'Conciencia', 'Disciplina', 'Honor', 'Integridad', 'Lealtad', 'Evolución']

export default function QuienesSomos() {
  return (
    <section className="section escuela" id="escuela">
      <div className="container escuela-grid">
        <div className="escuela-text" data-reveal>
          <h2 className="section-title">¿Quiénes somos?</h2>
          <p className="lead">
            Somos la Escuela Integral de Parkour y nuestro propósito es lograr tu evolución personal desde la
            práctica física.
          </p>
          <p>
            Con más de 20 años de experiencia te garantizamos una práctica segura, donde tu integridad física va a
            ser respetada al 100% para que vivas una experiencia única de auto superación, de manera agradable y
            divertida.
          </p>
          <p>
            Parkour es el arte de superarse a uno mismo: desde el movimiento generamos superación no solo en la
            práctica física sino también en la vida cotidiana.
          </p>
          <Link to="/quienes-somos" className="btn btn--primary">Conocé nuestra historia <Icon name="arrow" size={18} /></Link>
        </div>

        <ul className="escuela-stats">
          {STATS.map((s, i) => (
            <li key={s.label} data-reveal style={{ transitionDelay: `${i * 120}ms` }}>
              <span className="stat-num">
                <CountUp to={s.to} prefix={s.prefix} separator={s.separator || ''} duration={2.2} />
              </span>
              <span className="stat-label">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="marquee" aria-label="Nuestros valores">
        <div className="marquee-track">
          {[...VALORES, ...VALORES].map((v, i) => (
            <span key={i} aria-hidden={i >= VALORES.length}>
              {v} <i>✦</i>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
