import heroImg from '../../Img/Parkourintegral_imagen.png'

export default function Hero() {
  return (
    <section className="hero-section">
      <img
        src={heroImg}
        alt=""
        width="2048"
        height="857"
        fetchPriority="high"
      />
    </section>
  )
}
