import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function QuienesSomosPage() {
  return (
    <>
      <Helmet>
        <title>¿Quiénes somos? - Parkour Integral Buenos Aires</title>
        <meta
          name="description"
          content="Somos la Escuela Integral de Parkour. Conocé nuestra historia, valores y método de entrenamiento. Más de 20 años de experiencia en Buenos Aires, Argentina."
        />
      </Helmet>

      <Header hideNav />

      <main className="qs-page">

        {/* ===== QUIÉNES SOMOS ===== */}
        <section className="qs-section">
          <h2>¿Quiénes somos?</h2>
          <p>Somos la Escuela Integral de Parkour! y nuestro propósito es lograr tu evolución personal desde la práctica física.</p>
          <p>Con más de 20 años de experiencia te garantizamos una práctica segura, donde tu integridad física va a ser respetada al 100% para que logres vivir una experiencia única de auto superación de manera agradable y divertida.<br />Parkour es el arte de superarse a uno mismo, desde el movimiento generamos superación no solo en la práctica física sino también en la vida cotidiana.</p>
          <p>Parkour es sinónimo de fortaleza, salud, conciencia, disciplina, honor, integridad, lealtad y Evolución.</p>
          <p>Parkour se encuentra en todo lo que hacemos, parkour es un espejo de nosotros mismos, parkour nos enseña a ver las fallas para aprender a superar cualquier tipo de obstáculo.</p>
          <p>Parkour es la evolución misma, parkour es nueva Era.</p>
        </section>

        {/* ===== PARKOUR ES PELIGROSO ===== */}
        <section className="qs-section">
          <h2>¿El parkour es peligroso?</h2>
          <p>Lamentablemente, en la comunidad muchos deciden arriesgar la vida en sus pruebas, es por eso que la Escuela Integral difunde la importancia del valor a la vida y de no cometer actos desde el Ego.</p>
          <p>Que un like en las redes sociales no se transforme en el motivo que nos lleve a hacer tonterías.</p>
          <p>Es mucho más gratificante realizar una práctica donde sabemos que vamos a regresar a casa con el cuerpo sano, que practicar algo que tarde o temprano nos lleve a una tragedia.</p>
          <p>La Escuela Integral de Parkour está en contra totalmente de las pruebas con riesgo de vida. Si bien realizamos pruebas acrobáticas complejas existe un proceso para llevar a cabo dichas técnicas de manera escalonada fluida y sin riesgos.</p>
          <p>Andar en edificios saltando como locos es de inconscientes.</p>
          <p>La Escuela Integral de Parkour es igual a Consciencia del entorno y de uno mismo.</p>
          <p>Parkour es una actividad que hay que aprenderla sí o sí con alguien capacitado avalado por algún centro de entrenamiento específico de parkour con trayectoria.</p>
          <p>Muchos dicen que el parkour se aprende en las calles y sin guías. Ese es un gran error ya que en el pasado al no haber guías las personas iniciaban sus entrenamientos por cuenta propia y así muchas terminaban con graves lesiones.</p>
          <p>Es por eso que desarrollamos un Método de entrenamiento el cual permite que el alumno/a recorra paso a paso y de manera armónica su aprendizaje.</p>
          <p>Parkour es una actividad totalmente segura guiada por profesionales.</p>
        </section>

        {/* ===== LOS INICIOS EN ARGENTINA ===== */}
        <section className="qs-section">
          <h2>Los inicios en Argentina</h2>
          <p>Parkour llega a la Argentina en el año 1999 a través de un documental del grupo pionero Francés "Yamakasi".</p>
          <p>Josué Di Stefano siendo tan solo un niño de 11 años y sin saber que era quizás el único practicante Argentino en ese momento, iniciaba sus prácticas en parques públicos.</p>
          <p>Sin redes sociales ni celulares en ese entonces la información era muy escasa y valiosa, Josué siempre cuenta anécdotas de cómo con mucha suerte conseguía videos de 5 segundos obtenidos en el olvidado ARES.</p>
          <p>En el año 2000 aproximadamente Walter Bongard iniciaba sus entrenamientos en diferentes puntos de la ciudad queriendo expandir la cantidad de practicantes realizando acciones de difusión.</p>
          <p>A finales del 2004 Walter Bongard y Josué Di Stefano cruzaron sus caminos sin saber que juntos iban a dar inicio a una historia sin precedentes.</p>
          <p>Walter Bongard había formado a lo largo de los años reuniones que nucleaba a diferentes Traceurs (Practicantes) de todo el país. Él era el líder de la actividad a nivel grupal en ese entonces.</p>
          <p>Por motivos personales, Walter Bongard decide en el año 2006 otorgarle el legado de su grupo y la difusión de la disciplina a Josué Di Stefano.</p>
          <p>Josue siempre cuenta las historias junto a Walter Bongard y todas las enseñanzas de vida que recibió en los años que entrenaron juntos.</p>
          <p>Fue así como Josué inició a guiar a los diferentes grupos convirtiéndose en la única persona que nucleaba practicantes y transmitía el arte del desplazamiento en toda la región.</p>
          <p>En el año 2008 Josué decidió dar un paso enorme de evolución con respecto a la estructura de enseñanza que brindaba. Abrió el primer espacio techado para practicar la disciplina, totalmente equipado para transmitir un servicio mucho más seguro.</p>
          <p>"Oxígeno Gym" fue el primer espacio donde se puso en marcha la evolución del proyecto Escuela Integral.</p>
          <p>En el año 2011, la Escuela Integral siguió creciendo concretando la actividad en el fantástico Tecnópolis. Allí se dio actividad a cientos de personas a lo largo de 2 años en el mítico "Espacio Joven".</p>
          <p>En el año 2013 se abrieron las puertas de Espacio Zero (Escuela de circo) para amplificar la difusión y enseñanza de la actividad.</p>
          <p>En el año 2015 Escuela Integral estaba lista para crear un antes y un después en sus actividades. Fue así como dimos inicio a las clases para Pequeños, Niños y Adolescentes.</p>
          <p>Emma Grasset, Coordinadora de las clases para los más pequeños y Vicedirectora de la Escuela Integral, guía la actividad junto a Josue Di Stefano desde ese entonces.</p>
          <p>En el 2021, la Escuela integral tiene cientos de practicantes activos y más de 26.300 mil seguidores en las redes sociales, continúan con la actividad brindando el mejor servicio de entrenamiento de latino América.</p>
          <p>Si queres ver mas contenido, seguinos en las redes sociales! así estás al tanto de todo lo que sucede en EipK!</p>
        </section>

        <div style={{ textAlign: 'center', padding: '20px 0 40px' }}>
          <Link to="/" className="btn-leer-mas">Volver al inicio</Link>
        </div>

      </main>

      <Footer />
    </>
  )
}
