import iconPekes from '../assets/horarios/pekes.webp'
import iconNinos from '../assets/horarios/ninos.webp'
import iconJuveniles from '../assets/horarios/juveniles.webp'
import iconAdultos from '../assets/horarios/adultos.webp'
import iconVerdes from '../assets/horarios/verdes.webp'
import flyer from '../../Img/horario-parkour-2026.jpg'
import Icon from './Icon'
import { WHATSAPP_URL } from '../constants'

/*
  Horarios 2026 — para actualizar, editá esta lista.
  Cada turno: días + hora.
*/
const GRUPOS = [
  {
    id: 'pekes',
    nombre: 'Pekes',
    edad: '4–5 años',
    icon: iconPekes,
    color: '#f7953a',
    turnos: [{ dias: ['Lun', 'Jue'], hora: '16:45' }],
  },
  {
    id: 'ninos',
    nombre: 'Niños',
    edad: '6–10 años',
    icon: iconNinos,
    color: '#2196f3',
    turnos: [
      { dias: ['Mar', 'Mié', 'Vie'], hora: '17:00' },
      { dias: ['Lun', 'Mié', 'Vie', 'Sáb'], hora: '18:00' },
      { dias: ['Sáb'], hora: '10:00' },
      { dias: ['Sáb'], hora: '12:00' },
    ],
  },
  {
    id: 'juveniles',
    nombre: 'Juveniles',
    edad: '11–16 años',
    icon: iconJuveniles,
    color: '#2fbf5f',
    turnos: [
      { dias: ['Mar', 'Jue'], hora: '18:00' },
      { dias: ['Sáb'], hora: '14:30' },
    ],
  },
  {
    id: 'adultos',
    nombre: 'Adultos',
    edad: null,
    icon: iconAdultos,
    color: '#f2552c',
    turnos: [
      { dias: ['Mar', 'Jue'], hora: '10:00' },
      { dias: ['Lun', 'Jue', 'Vie'], hora: '19:45' },
    ],
  },
  {
    id: 'verdes',
    nombre: 'Espacios Verdes',
    sub: 'Niños',
    edad: '6–11 años',
    icon: iconVerdes,
    color: '#1e9be8',
    turnos: [{ dias: ['Mar', 'Jue'], hora: '17:00' }],
  },
]

const waLink = (grupo) =>
  `${WHATSAPP_URL}${encodeURIComponent(`¡Hola! Quiero info de las clases de ${grupo.nombre}${grupo.sub ? ` ${grupo.sub}` : ''}${grupo.edad ? ` (${grupo.edad})` : ''}.`)}`

export default function Horarios() {
  return (
    <section className="section horarios" id="horarios">
      <div className="container">
        <header className="horarios-head" data-reveal>
          <h2 className="section-title">Horarios 2026</h2>
          <p>Clases de parkour y movimiento en Buenos Aires. Elegí tu grupo y escribinos para reservar una clase de prueba.</p>
        </header>

        <ol className="grupos">
          {GRUPOS.map((g, i) => (
            <li
              key={g.id}
              className="grupo"
              style={{ '--grupo': g.color, transitionDelay: `${i * 70}ms` }}
              data-reveal
            >
              <img className="grupo-icon" src={g.icon} alt="" width="196" height="196" loading="lazy" />
              <div className="grupo-info">
                <h3>
                  {g.nombre}
                  {g.sub && <span className="grupo-sub"> — {g.sub}</span>}
                </h3>
                {g.edad && <span className="grupo-edad">{g.edad}</span>}
              </div>
              <ul className="turnos" aria-label={`Horarios de ${g.nombre}`}>
                {g.turnos.map((t, j) => (
                  <li key={j} className="turno">
                    <span className="turno-dias">{t.dias.join(' · ')}</span>
                    <span className="turno-hora">{t.hora}</span>
                  </li>
                ))}
              </ul>
              <a className="grupo-cta" href={waLink(g)} target="_blank" rel="noopener noreferrer" aria-label={`Consultar por ${g.nombre} en WhatsApp`}>
                Consultar <Icon name="arrow" size={16} />
              </a>
            </li>
          ))}
        </ol>

        <div className="horarios-foot" data-reveal>
          <a className="btn btn--primary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            Reservá tu clase de prueba <Icon name="arrow" size={18} />
          </a>
          <a className="horarios-flyer" href={flyer} target="_blank" rel="noopener noreferrer" download="horarios-parkour-integral-2026.jpg">
            Descargar flyer
          </a>
        </div>
      </div>
    </section>
  )
}
