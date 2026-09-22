import horarioImg from '../../Img/horario-parkour-2026.jpg'

export default function Horarios() {
  return (
    <>
      <div id="horario" />
      <section className="horarios-section">
        <img
          src={horarioImg}
          alt="Horarios de clases de Parkour"
          width="1024"
          height="1024"
          loading="lazy"
        />
      </section>
    </>
  )
}
