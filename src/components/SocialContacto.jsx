import socialPhoto from '../../Img/photo_2021-01-26_12-21-22.jpg'
import contactoImg from '../../Img/contacto.png'

export default function SocialContacto() {
  return (
    <section className="social-contacto">
      <div className="social-contacto-inner">
        {/* Social */}
        <div className="social-col">
          <img src={socialPhoto} alt="Parkour Integral Buenos Aires" loading="lazy" />
          <div className="social-icons">
            <a
              className="social-icon fb"
              href="https://www.facebook.com/Escuela-Integral-de-Parkour-Buenos-Aires-1579156352315583"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f" />
            </a>
            <a
              className="social-icon ig"
              href="https://www.instagram.com/parkourintegral/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram" />
            </a>
          </div>
          <h2 className="seguinos-heading">👆¡SEGUINOS!</h2>
        </div>

        {/* Contacto */}
        <div className="contacto-col" id="contacto">
          <a
            href="https://api.whatsapp.com/send?phone=5491157605525&text="
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={contactoImg}
              alt="Contacto WhatsApp Parkour Integral"
              loading="lazy"
              width="750"
              height="638"
            />
          </a>
        </div>

      </div>
    </section>
  )
}
