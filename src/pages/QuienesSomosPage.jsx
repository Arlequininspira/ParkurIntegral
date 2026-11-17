import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Footer from '../components/Footer'
import CityScene from '../components/CityScene'
import Icon from '../components/Icon'
import { WHATSAPP_URL } from '../constants'
import { useReveal } from '../hooks'

const VALORES = ['Fortaleza', 'Salud', 'Conciencia', 'Disciplina', 'Honor', 'Integridad', 'Lealtad', 'Evolución']

const SEGURIDAD = [
  {
    icon: 'shield',
    title: 'Consciencia, no ego',
    text: 'Estamos en contra de las pruebas con riesgo de vida. Que un like no sea el motivo para hacer tonterías.',
  },
  {
    icon: 'route',
    title: 'Método paso a paso',
    text: 'Las técnicas complejas se aprenden de manera escalonada, fluida y sin riesgos.',
  },
  {
    icon: 'users',
    title: 'Con guías capacitados',
    text: 'Aprender solo en la calle llevó a muchos a lesiones graves. Se aprende con alguien avalado y con trayectoria.',
  },
  {
    icon: 'home',
    title: 'Volver a casa sano',
    text: 'Lo gratificante es entrenar sabiendo que volvés con el cuerpo sano.',
  },
]

const HITOS = [
  {
    year: '1999',
    title: 'El parkour llega a la Argentina',
    text: 'Un documental del grupo francés Yamakasi lo trae al país. Josué Di Stefano, con 11 años, empieza a entrenar en parques públicos, con videos de 5 segundos conseguidos en el viejo ARES.',
  },
  {
    year: '2000',
    title: 'Walter Bongard',
    text: 'Empieza a entrenar en distintos puntos de la ciudad y a difundir la disciplina para sumar practicantes.',
  },
  {
    year: '2004',
    title: 'Se cruzan los caminos',
    text: 'Walter, que lideraba las reuniones de traceurs de todo el país, conoce a Josué. Juntos dan inicio a una historia sin precedentes.',
  },
  {
    year: '2006',
    title: 'El legado',
    text: 'Walter le otorga a Josué el legado de su grupo. Josué pasa a guiar a los grupos y a transmitir el arte del desplazamiento en toda la región.',
  },
  {
    year: '2008',
    title: 'Primer espacio techado',
    text: 'Josué abre el primer espacio equipado para practicar de forma segura: Oxígeno Gym, donde nace la Escuela Integral.',
  },
  {
    year: '2011',
    title: 'Tecnópolis',
    text: 'Durante 2 años, cientos de personas entrenan con nosotros en el mítico "Espacio Joven".',
  },
  {
    year: '2013',
    title: 'Espacio Zero',
    text: 'Abrimos las puertas de Espacio Zero (escuela de circo) para ampliar la enseñanza de la actividad.',
  },
  {
    year: '2015',
    title: 'Clases para todas las edades',
    text: 'Empiezan las clases para pequeños, niños y adolescentes. Emma Grasset, coordinadora y vicedirectora, guía la actividad junto a Josué.',
  },
  {
    year: 'Hoy',
    title: 'Una comunidad que no para',
    text: 'Cientos de practicantes activos y más de 32 mil seguidores en redes, brindando el mejor entrenamiento de Latinoamérica.',
  },
]

export default function QuienesSomosPage() {
  useReveal()
  return (
    <>
      <Helmet>
        <title>¿Quiénes somos? - Parkour Integral Buenos Aires</title>
        <meta
          name="description"
          content="Somos la Escuela Integral de Parkour. Conocé nuestra historia, valores y método de entrenamiento. Más de 20 años de experiencia en Buenos Aires, Argentina."
        />
      </Helmet>

      <main className="qs">
        {/* ===== PORTADA con la ciudad animada ===== */}
        <header className="qs-cover">
          <CityScene />
          <div className="qs-cover-scrim" aria-hidden="true" />
          <div className="qs-cover-text container">
            <p className="qs-kicker">Escuela Integral de Parkour</p>
            <h1>Nuestra historia</h1>
            <p>Más de 20 años transmitiendo el arte del desplazamiento en Buenos Aires.</p>
          </div>
        </header>

        {/* ===== QUIÉNES SOMOS ===== */}
        <section className="qs-block container">
          <div className="qs-intro" data-reveal>
            <h2 className="qs-h2">¿Quiénes somos?</h2>
            <p className="qs-lead">
              Nuestro propósito es lograr <strong>tu evolución personal desde la práctica física.</strong>
            </p>
            <p>
              Con más de 20 años de experiencia te garantizamos una práctica segura y divertida, donde tu integridad
              física se respeta al 100%. Parkour es el arte de superarse a uno mismo: lo que superás en el movimiento lo
              llevás a la vida cotidiana.
            </p>
          </div>
          <div className="qs-values" data-reveal>
            <p className="qs-values-label">Parkour es sinónimo de</p>
            <ul>
              {VALORES.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
            <blockquote>
              “Parkour es un espejo de nosotros mismos: nos enseña a ver las fallas para superar cualquier obstáculo.
              Parkour es la evolución misma.”
            </blockquote>
          </div>
        </section>

        {/* ===== ¿ES PELIGROSO? ===== */}
        <section className="qs-block qs-safe">
          <div className="container">
            <header className="qs-safe-head" data-reveal>
              <h2 className="qs-h2">¿El parkour es peligroso?</h2>
              <p className="qs-answer">
                Con método, es una actividad <strong>totalmente segura</strong> guiada por profesionales.
              </p>
            </header>
            <ul className="qs-cards">
              {SEGURIDAD.map((c, i) => (
                <li key={c.title} className="qs-card" data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
                  <span className="qs-card-icon">
                    <Icon name={c.icon} size={22} />
                  </span>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </li>
              ))}
            </ul>
            <p className="qs-safe-foot" data-reveal>
              Por eso desarrollamos un <strong>Método de entrenamiento</strong> para que cada alumno/a recorra su
              aprendizaje paso a paso y de manera armónica. <em>Escuela Integral es igual a consciencia del entorno y de uno mismo.</em>
            </p>
          </div>
        </section>

        {/* ===== LÍNEA DE TIEMPO ===== */}
        <section className="qs-block container">
          <h2 className="qs-h2" data-reveal>
            Los inicios en Argentina
          </h2>
          <ol className="qs-timeline">
            {HITOS.map((h) => (
              <li key={h.year} data-reveal>
                <span className="qs-year">{h.year}</span>
                <div className="qs-hito">
                  <h3>{h.title}</h3>
                  <p>{h.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ===== CIERRE ===== */}
        <section className="qs-end container" data-reveal>
          <h2>Sumate a la historia</h2>
          <p>Seguinos en redes para estar al tanto de todo lo que pasa en EipK, o reservá tu clase de prueba.</p>
          <div className="qs-end-actions">
            <a className="btn btn--primary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Reservá tu clase <Icon name="arrow" size={18} />
            </a>
            <Link to="/" className="btn btn--ghost">
              Volver al inicio
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
