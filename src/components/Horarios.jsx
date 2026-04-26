import horarioImg from '../../Img/horario-parkour-4-768x598.png'

export default function Horarios() {
  return (
    <>
      <div id="horario" />
      <section className="horarios-section">
        <img
          src={horarioImg}
          alt="Horarios de clases de Parkour"
          width="768"
          height="598"
          loading="lazy"
        />
      </section>
    </>
  )
}
