import Icon from './Icon'
import { MAPS_URL, WHATSAPP_URL } from '../constants'

const FEATURES = [
  { icon: 'home', text: 'Espacio techado y equipado' },
  { icon: 'users', text: 'Clases para peques, niños/as, juveniles y adultos' },
  { icon: 'shield', text: 'Método progresivo y seguro' },
]

export default function Mapa() {
  return (
    <section className="section ubicacion" id="ubicacion">
      <div className="ubicacion-bg" aria-hidden="true">VILLA CRESPO</div>
      <div className="container ubicacion-grid">
        <div className="ubicacion-info" data-reveal>
          <h2 className="section-title">Encontranos</h2>

          <a className="address" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
            <span className="address-icon"><Icon name="pin" size={26} /></span>
            <span>
              <strong>Murillo 765</strong>
              <small>Villa Crespo · C1414AFO · CABA</small>
            </span>
          </a>

          <ul className="features">
            {FEATURES.map((f) => (
              <li key={f.text}>
                <Icon name={f.icon} size={20} />
                {f.text}
              </li>
            ))}
          </ul>

          <div className="ubicacion-actions">
            <a className="btn btn--primary" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
              <Icon name="route" size={18} /> Cómo llegar
            </a>
            <a className="btn btn--ghost" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Escribinos
            </a>
          </div>
        </div>

        <div className="mapa-frame" data-reveal>
          <iframe
            loading="lazy"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.172258186147!2d-58.4444326!3d-34.5998054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca09b47f77cb%3A0xf15a75abf9bdcf9c!2sParkour%20Integral%20(Escuela%20Integral%20de%20Parkour)!5e0!3m2!1ses!2sar!4v1777245543563!5m2!1ses!2sar"
            title="Mapa: Parkour Integral, Murillo 765, Villa Crespo"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <span className="mapa-corner mapa-corner--tl" aria-hidden="true" />
          <span className="mapa-corner mapa-corner--br" aria-hidden="true" />
          <span className="mapa-coords" aria-hidden="true">34°35′59″S · 58°26′40″O</span>
        </div>
      </div>
    </section>
  )
}
