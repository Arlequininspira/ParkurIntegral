import { useEffect, useMemo, useRef, useState } from 'react'
import skyAtardecer from '../assets/hero/sky-atardecer.webp'
import skyAurora from '../assets/hero/sky-aurora.webp'
import skyManana from '../assets/hero/sky-manana.webp'
import skyRosa from '../assets/hero/sky-rosa.webp'
import fgAtardecer from '../assets/hero/fg-atardecer.webp'
import fgAurora from '../assets/hero/fg-aurora.webp'
import fgManana from '../assets/hero/fg-manana.webp'
import fgRosa from '../assets/hero/fg-rosa.webp'
import REAL_STARS from './realStars.json'
import { DEER_D } from './deerPath'
import './LakesideScene.css'

/* ------------------------------------------------------------------
   Escena del hero sobre la ilustración original (2048 x 857).
   - La imagen base tiene los pájaros y la cabeza del ciervo borrados.
   - Encima: cabeza del ciervo vectorizada (se mueve), cielo vivo,
     estrellas, sol que late, nubes, bandada, brillos del lago,
     niebla y luciérnagas. Parallax con mouse y scroll.
------------------------------------------------------------------- */

const W = 2048
const H = 857
const SUN = { x: 1157, y: 490 }
/* Ciervo CC0: ubicación en la escena y separación cabeza/cuerpo (coords del path original) */
const DEER_T = 'translate(926 557) scale(-2.24 2.24) translate(-102.72887 -58.175744)'
const OX = 102.72887
const OY = 58.175744
const pts = (arr) => arr.map(([x, y]) => `${(x + OX).toFixed(2)},${(y + OY).toFixed(2)}`).join(' ')
// cuerpo: todo lo que está debajo de la línea del cuello
const BODY_CLIP = pts([[0, 36], [12, 34.5], [19, 33], [21.5, 30], [26, 29.2], [95, 29.2], [95, 100], [0, 100]])
// cabeza: todo lo de arriba, bajando un poco más (se superpone con el cuello del cuerpo)
const HEAD_CLIP = pts([[0, -2], [42, -2], [42, 27], [23.5, 28.5], [21, 35], [17, 37], [12, 38], [0, 38.5]])
const PIVOT = { x: 14 + OX, y: 36 + OY }
const FOCUS_X = 930 // en pantallas angostas se centra en ciervo + sol

/* Ambientes: misma escena, distinta luz. Cada uno ajusta las capas animadas. */
export const AMBIENTES = [
  { id: 'atardecer', label: 'Atardecer', sky: skyAtardecer, fg: fgAtardecer,
    vars: { deer: '#2e243f', bird: '#5b2a4b', shimmer: '#fff4cf', firefly: '#ffe08a', mist: '#ffd6c6', sun: 1, stars: 1, ff: 1, sky: 1, birds: 1 } },
  { id: 'rosa', label: 'Rosa', sky: skyRosa, fg: fgRosa,
    vars: { deer: '#241f5c', bird: '#3d1a52', shimmer: '#ffe3f0', firefly: '#ffd0e6', mist: '#ffc6e0', sun: 0.85, stars: 0.6, ff: 0.7, sky: 0.6, birds: 1 } },
  { id: 'aurora', label: 'Aurora', sky: skyAurora, fg: fgAurora,
    vars: { deer: '#05072c', bird: '#05072c', shimmer: '#bfe6ff', firefly: '#9ff5ff', mist: '#9fb8ff', sun: 0, stars: 1, ff: 0.9, sky: 0, birds: 0 } },
  { id: 'manana', label: 'Mañana', sky: skyManana, fg: fgManana,
    vars: { deer: '#115261', bird: '#0f4e5c', shimmer: '#ffffff', firefly: '#ffffff', mist: '#e4fbff', sun: 0, stars: 0, ff: 0, sky: 0, birds: 1 } },
]
/* la imagen se dibuja un poco más grande que el viewBox (margen para el scroll) */
const IMG_T = `translate(-30 -14) scale(${(W + 60) / W} ${(H + 28) / H})`
const SKY_H = ((H + 28) * 1254) / 1608 // la capa de cielo es el 78% superior
const SKY_PAD = (225 * (W + 60)) / 3840 // margen extra a los costados del cielo (para que pueda desplazarse)
const HOLD = 14000 // cuánto se queda cada momento del día
const FADE = 6000 // duración del fundido entre momentos

function rng(seed) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function LakesideScene() {
  const rootRef = useRef(null)
  /* El tiempo pasa solo: atardecer → rosa → aurora → mañana → atardecer… */
  const [cycle, setCycle] = useState({ cur: 0, prev: -1 })
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      if (document.hidden) return
      setCycle(({ cur }) => ({ cur: (cur + 1) % AMBIENTES.length, prev: cur }))
    }, HOLD + FADE)
    return () => clearInterval(id)
  }, [])
  const active = AMBIENTES[cycle.cur]
  /* carga diferida: las otras imágenes se piden recién después del primer render */
  const [loaded, setLoaded] = useState(() => new Set([active.id]))
  useEffect(() => {
    setLoaded((prev) => (prev.has(active.id) ? prev : new Set(prev).add(active.id)))
  }, [active.id])
  useEffect(() => {
    const t = setTimeout(() => setLoaded(new Set(AMBIENTES.map((a) => a.id))), 2500)
    return () => clearTimeout(t)
  }, [])
  const [viewBox, setViewBox] = useState(`0 0 ${W} ${H}`)
  const [alert, setAlert] = useState(false)

  const g = useMemo(() => {
    const r = rng(9)
    const stars = Array.from({ length: 70 }, () => ({
      x: 640 + r() * 1100,
      y: 10 + r() * 190,
      r: 0.8 + r() * 1.6,
      d: (r() * 6).toFixed(2),
      t: (2 + r() * 4).toFixed(2),
    }))
    const birds = Array.from({ length: 13 }, (_, i) => ({
      x: i * 22 + r() * 16,
      y: Math.abs(i - 6) * 7 + r() * 12,
      s: 0.8 + r() * 0.5,
      d: (r() * 0.6).toFixed(2),
    }))
    const fireflies = Array.from({ length: 26 }, () => ({
      x: r() * W,
      y: 690 + r() * 160,
      d: (r() * 8).toFixed(2),
      t: (6 + r() * 6).toFixed(2),
    }))
    const shimmer = Array.from({ length: 22 }, (_, i) => ({
      x: 1070 + r() * 190,
      y: 600 + i * 6.4,
      w: 14 + r() * 34,
      d: (-r() * 3).toFixed(2),
    }))
    const wisps = [
      { y: 255, w: 520, dur: 140, delay: -30, op: 0.16 },
      { y: 300, w: 380, dur: 110, delay: -80, op: 0.12 },
      { y: 215, w: 640, dur: 170, delay: -120, op: 0.1 },
    ]
    return { stars, birds, fireflies, shimmer, wisps }
  }, [])

  /* viewBox adaptable: en mobile recorta alrededor del ciervo y el sol */
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const fit = () => {
      const { width, height } = el.getBoundingClientRect()
      if (!width || !height) return
      const aspect = width / height
      if (aspect >= W / H) {
        setViewBox(`0 0 ${W} ${H}`)
      } else {
        const vw = H * aspect
        const x = Math.min(Math.max(FOCUS_X - vw / 2, 0), W - vw)
        setViewBox(`${x.toFixed(1)} 0 ${vw.toFixed(1)} ${H}`)
      }
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* Parallax solo con el scroll (sin mouse), mientras se ve */
  useEffect(() => {
    const el = rootRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0, on = true
    const tick = () => {
      el.style.setProperty('--sy', Math.min(window.scrollY, 1000).toFixed(1))
      if (on) raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting
      cancelAnimationFrame(raf)
      if (on) raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => {
      on = false
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  const depth = (d, s = 0) => ({
    transform: `translate3d(0, calc(var(--sy,0) * ${s}px), 0)`,
  })

  /* Fundido sin "bajón": la imagen de arriba es la que se anima, la de abajo queda fija */
  const imgStyle = (i) => {
    const { cur, prev } = cycle
    const upward = cur > prev
    if (i === cur) return { opacity: 1, transition: upward ? `opacity ${FADE}ms ease-in-out` : 'none' }
    if (i === prev) return { opacity: 0, transition: upward ? `opacity 0s ${FADE}ms` : `opacity ${FADE}ms ease-in-out` }
    return { opacity: 0, transition: 'none' }
  }

  const poke = () => {
    if (alert) return
    setAlert(true)
    setTimeout(() => setAlert(false), 2400)
  }

  return (
    <div
      ref={rootRef}
      className="lake"
      data-ambiente={active.id}
      aria-hidden="true"
      style={Object.fromEntries(Object.entries(active.vars).map(([k, v]) => [`--lk-${k}`, v]))}
    >
      <svg viewBox={viewBox} preserveAspectRatio="xMidYMax slice">
        <defs>
          <radialGradient id="lk-sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fff6c8" stopOpacity="0.9" />
            <stop offset="0.3" stopColor="#ffc56b" stopOpacity="0.45" />
            <stop offset="1" stopColor="#ff7a50" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lk-skyshift" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a2a8a" />
            <stop offset="0.6" stopColor="#c0507a" />
            <stop offset="1" stopColor="#c0507a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lk-reflect" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff2b8" stopOpacity="0.75" />
            <stop offset="1" stopColor="#ffb36b" stopOpacity="0" />
          </linearGradient>
          <filter id="lk-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <filter id="lk-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="2.6" />
          </filter>
          <clipPath id="lk-deer-body" clipPathUnits="userSpaceOnUse">
            <polygon points={BODY_CLIP} />
          </clipPath>
          <clipPath id="lk-deer-head" clipPathUnits="userSpaceOnUse">
            <polygon points={HEAD_CLIP} />
          </clipPath>
          <clipPath id="lk-lake">
            <path d="M1040,585 C1100,580 1160,580 1190,590 L1150,612 C1190,630 1240,660 1250,690 C1230,720 1180,740 1100,748 L820,748 C770,730 750,690 760,650 C800,630 900,615 960,605 C1000,598 1020,590 1040,585 Z" />
          </clipPath>
        </defs>

        {/* Ilustración + ciervo: misma capa, se mueven juntos */}
        <g className="lk-base" style={depth(10, 0.12)}>
          {/* Cada momento del día = 2 capas: cielo (se mueve) + paisaje (fijo, con transparencia) */}
          <g className="lk-enter">
            {AMBIENTES.map((a, i) =>
              loaded.has(a.id) ? (
                <g key={a.id} className="lk-img" style={imgStyle(i)}>
                  <g className="lk-skydrift">
                    <image href={a.sky} x={-30 - SKY_PAD} y="-14" width={W + 60 + SKY_PAD * 2} height={SKY_H} preserveAspectRatio="none" />
                    {(i === cycle.cur || i === cycle.prev) && (
                      <g transform={IMG_T} style={{ mixBlendMode: 'screen', opacity: 'var(--lk-stars)' }}>
                        {REAL_STARS[a.id].map(([x, y, r], j) => (
                          <circle
                            key={j}
                            className="lk-star"
                            cx={x}
                            cy={y}
                            r={r * 1.7}
                            fill="#eaf3ff"
                            style={{ animationDelay: `${-((j * 37) % 50) / 10}s`, animationDuration: `${2.2 + ((j * 13) % 30) / 10}s` }}
                          />
                        ))}
                      </g>
                    )}
                  </g>
                  <image href={a.fg} x="-30" y="-14" width={W + 60} height={H + 28} preserveAspectRatio="none" />
                </g>
              ) : null
            )}
          </g>
          <g transform={IMG_T}>
            {/* sol que late */}
            <g className="lk-sunwrap"><g className="lk-sun" style={{ mixBlendMode: 'screen' }}>
              <circle cx={SUN.x} cy={SUN.y} r="210" fill="url(#lk-sun)" />
              {[150, 110, 72].map((r, i) => (
                <circle key={r} className="lk-ring" cx={SUN.x} cy={SUN.y} r={r} fill="none" stroke="#ffe2a0" strokeWidth="1.5" style={{ animationDelay: `${-i * 1.6}s` }} />
              ))}
            </g></g>

            {/* brillos del lago */}
            <g clipPath="url(#lk-lake)" style={{ mixBlendMode: 'screen' }}>
              <ellipse className="lk-reflect" style={{ opacity: "calc(var(--lk-sun) * 0.45)" }} cx="1160" cy="640" rx="60" ry="115" fill="url(#lk-reflect)" />
              {g.shimmer.map((s, i) => (
                <line key={i} className="lk-shimmer" x1={s.x} x2={s.x + s.w} y1={s.y} y2={s.y} stroke="var(--lk-shimmer)" strokeWidth="1.4" strokeLinecap="round" style={{ animationDelay: `${s.d}s` }} />
              ))}
            </g>
            <ellipse className="lk-mist" cx="1120" cy="664" rx="190" ry="20" fill="var(--lk-mist)" opacity="0.18" filter="url(#lk-soft)" />

            {/* Ciervo (silueta CC0): cuerpo fijo que respira + cabeza que gira */}
            <g className={`lk-deer ${alert ? 'is-alert' : ''}`} onClick={poke} transform={DEER_T}>
              <title>¡Hola!</title>
              <path className="lk-body" d={DEER_D} fill="var(--lk-deer)" clipPath="url(#lk-deer-body)" />
              <path
                className="lk-head"
                d={DEER_D}
                fill="var(--lk-deer)"
                clipPath="url(#lk-deer-head)"
                style={{ transformOrigin: `${PIVOT.x}px ${PIVOT.y}px` }}
              />
              <rect x={OX} y={OY} width="88" height="92" fill="transparent" />
            </g>
          </g>
        </g>

        {/* Cielo vivo: el color respira */}
        <g style={{ mixBlendMode: 'soft-light', opacity: 'var(--lk-sky)', transition: 'opacity 6s ease-in-out' }}>
          <rect className="lk-skyshift" width={W} height="470" fill="url(#lk-skyshift)" />
        </g>

        {/* Estrella fugaz */}
        <g className="lk-stars">
          <line className="lk-shooting" x1="0" y1="0" x2="150" y2="46" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Bandada */}
        <g className="lk-birds" style={depth(20, 0.1)}>
          <g className="lk-flock">
            {g.birds.map((b, i) => (
              <g key={i} transform={`translate(${b.x} ${b.y}) scale(${b.s})`}>
                <path className="lk-bird" style={{ animationDelay: `${b.d}s` }} d="M-7,0 Q-3.5,-4.5 0,0 Q3.5,-4.5 7,0" fill="none" stroke="var(--lk-bird)" strokeWidth="2" strokeLinecap="round" />
              </g>
            ))}
          </g>
        </g>

        {/* Luciérnagas en primer plano */}
        <g className="lk-fireflies" style={depth(40, 0.2)}>
          {g.fireflies.map((f, i) => (
            <circle key={i} className="lk-firefly" cx={f.x} cy={f.y} r="2.6" fill="var(--lk-firefly)" filter="url(#lk-glow)" style={{ animationDelay: `${-f.d}s`, animationDuration: `${f.t}s` }} />
          ))}
        </g>
      </svg>
      <div className="lake-fade" />
    </div>
  )
}
