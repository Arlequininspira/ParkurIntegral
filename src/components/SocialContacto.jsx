import { useEffect, useRef } from 'react'
import socialPhoto from '../../Img/photo_2021-01-26_12-21-22.jpg'
import Icon from './Icon'
import { FACEBOOK_URL, INSTAGRAM_URL, WHATSAPP_URL } from '../constants'

const SOCIALS = [
  { href: INSTAGRAM_URL, icon: 'fab fa-instagram', name: 'Instagram', handle: '@parkourintegral', cls: 'ig' },
  { href: FACEBOOK_URL, icon: 'fab fa-facebook-f', name: 'Facebook', handle: 'Escuela Integral de Parkour', cls: 'fb' },
]

export default function SocialContacto() {
  const ref = useRef(null)

  /* Mientras la sección se ve, aparece la flecha que señala al botón de WhatsApp */
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => document.body.classList.toggle('show-wa-arrow', e.isIntersecting), {
      threshold: 0.35,
    })
    io.observe(el)
    return () => {
      io.disconnect()
      document.body.classList.remove('show-wa-arrow')
    }
  }, [])

  return (
    <section className="section contacto" id="contacto" ref={ref}>
      <div className="container contacto-grid">
        <figure className="contacto-photo" data-reveal>
          <img src={socialPhoto} alt="Mural del espacio de entrenamiento de Parkour Integral" loading="lazy" />
        </figure>

        <div className="contacto-body">
          <h2 className="seguinos" data-reveal>
            <span>¡Segui</span>
            <span>nos!</span>
          </h2>
          <p className="contacto-lead" data-reveal>
            Sumate a la comunidad, mirá nuestros entrenamientos y enterate de todo lo que pasa en la escuela.
          </p>

          <div className="socials">
            {SOCIALS.map((s, i) => (
              <a key={s.name} className={`social ${s.cls}`} href={s.href} target="_blank" rel="noopener noreferrer" data-reveal style={{ transitionDelay: `${i * 100}ms` }}>
                <span className="social-icon"><i className={s.icon} /></span>
                <span className="social-text">
                  <strong>{s.name}</strong>
                  <small>{s.handle}</small>
                </span>
                <Icon name="arrow" size={22} className="social-arrow" />
              </a>
            ))}
          </div>

          <a className="wa-block" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-reveal>
            <span className="wa-icon"><i className="fab fa-whatsapp" /></span>
            <span>
              <strong>Escribinos por WhatsApp</strong>
              <small>y nos ponemos en contacto a la brevedad.</small>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
