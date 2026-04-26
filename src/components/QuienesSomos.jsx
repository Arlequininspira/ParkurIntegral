import { Link } from 'react-router-dom'

export default function QuienesSomos() {
  return (
    <>
      <div id="quienessomos" />
      <section className="quienes-somos" style={{ marginTop: '46px', marginBottom: '46px' }}>
        <h3>¿Quiénes somos?</h3>
        <p>
          Somos la Escuela Integral de Parkour! y nuestro propósito es lograr tu evolución
          personal desde la práctica física.
        </p>
        <p>
          Con más de 20 años de experiencia te garantizamos una práctica segura, donde tu
          integridad física va a ser respetada al 100% para que logres vivir una experiencia
          única de auto superación de manera agradable y divertida.
          <br />
          Parkour es el arte de superarse a uno mismo, desde el movimiento generamos superación
          no solo en la práctica física sino también en la vida cotidiana.
        </p>
        <Link to="/quienes-somos" className="btn-leer-mas">Leer más</Link>
      </section>
    </>
  )
}
