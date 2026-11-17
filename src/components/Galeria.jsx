import CircularGallery from './rb/CircularGallery'

/*
  Para agregar fotos: copiá archivos .jpg / .png / .webp en  src/assets/galeria/
  El nombre del archivo se usa como título (ej: "02-salto-de-precision.jpg" → "salto de precision").
*/
const modules = import.meta.glob('../assets/galeria/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
})

const toTitle = (path) =>
  path
    .split('/')
    .pop()
    .replace(/\.[^.]+$/, '')
    .replace(/^\d+[-_ ]*/, '')
    .replace(/[-_]+/g, ' ')

const photos = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, url]) => ({ image: url, text: toTitle(path) }))

/* La galería circular necesita varias tarjetas: repetimos si hay pocas fotos */
const items = photos.length ? Array.from({ length: Math.max(6, photos.length) }, (_, i) => photos[i % photos.length]) : []

export default function Galeria() {
  if (!items.length) return null
  return (
    <section className="section galeria" id="galeria">
      <div className="container">
        <header className="section-head" data-reveal>
          <span className="eyebrow">Galería</span>
          <h2 className="section-title">En movimiento</h2>
          <p>Arrastrá o usá la rueda del mouse para recorrer.</p>
        </header>
      </div>
      <div className="galeria-stage" data-reveal>
        <CircularGallery items={items} bend={2.4} textColor="#ffffff" borderRadius={0.06} font="bold 28px Anton" scrollEase={0.04} />
      </div>
    </section>
  )
}
