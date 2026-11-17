import { useEffect, useId, useMemo, useRef } from 'react'
import { PARTS, buildRoute, runnerAt } from './runners'
import './CityScene.css'

/*
  Íconos de horarios: mini escenas nocturnas con el mismo estilo del hero.
  Quieto muestra el momento del salto; al pasar el mouse la escena se anima en loop.
  viewBox 0 0 100 100.
*/

const SCENES = {
  /* Pekes: saltitos entre bloques bajos */
  pekes: {
    moon: { x: 74, y: 28, r: 13 },
    plats: [
      { x0: -10, x1: 36, y: 82 },
      { x0: 46, x1: 66, y: 76 },
      { x0: 74, x1: 110, y: 82 },
    ],
    run: { scale: 0.56, speed: 40, flip: false },
    draw: 'blocks',
  },
  /* Niños: saltos de precisión entre cajas de distinta altura */
  ninos: {
    moon: { x: 24, y: 26, r: 12 },
    plats: [
      { x0: -10, x1: 30, y: 82 },
      { x0: 42, x1: 60, y: 68 },
      { x0: 72, x1: 110, y: 76 },
    ],
    run: { scale: 0.62, speed: 44, flip: false },
    draw: 'blocks',
  },
  /* Juveniles: pasa una pared (vault) */
  juveniles: {
    moon: { x: 76, y: 24, r: 12 },
    plats: [
      { x0: -10, x1: 42, y: 82 },
      { x0: 42, x1: 58, y: 64 },
      { x0: 58, x1: 110, y: 82 },
    ],
    run: { scale: 0.66, speed: 46, flip: false },
    draw: 'wall',
  },
  /* Adultos: salto entre terrazas con mortal */
  adultos: {
    moon: { x: 50, y: 30, r: 16 },
    plats: [
      { x0: -10, x1: 38, y: 70 },
      { x0: 60, x1: 110, y: 76 },
    ],
    run: { scale: 0.7, speed: 50, flip: true },
    draw: 'roofs',
  },
  /* Espacios verdes: parque, árbol y tronco */
  verdes: {
    moon: { x: 22, y: 24, r: 11 },
    plats: [
      { x0: -10, x1: 40, y: 84 },
      { x0: 44, x1: 62, y: 76 },
      { x0: 66, x1: 110, y: 84 },
    ],
    run: { scale: 0.62, speed: 44, flip: false },
    draw: 'park',
  },
}

function Scene({ id, accent, plats }) {
  const body = '#0c1122'
  const facade = '#151b33'
  const top = (p) => (
    <rect x={Math.max(p.x0, -2)} y={p.y} width={Math.min(p.x1, 102) - Math.max(p.x0, -2)} height="1.4" fill={accent} opacity="0.85" />
  )
  const block = (p, fill = body) => (
    <rect x={Math.max(p.x0, -2)} y={p.y} width={Math.min(p.x1, 102) - Math.max(p.x0, -2)} height={100 - p.y} fill={fill} />
  )
  const draw = SCENES[id].draw

  if (draw === 'blocks')
    return (
      <g>
        {plats.map((p, i) => (
          <g key={i}>
            {block(p)}
            {top(p)}
          </g>
        ))}
      </g>
    )

  if (draw === 'wall')
    return (
      <g>
        {block({ x0: -2, x1: 102, y: 82 })}
        {top({ x0: -2, x1: 102, y: 82 })}
        <rect x="42" y="64" width="16" height="18" fill={facade} />
        <path d="M42 70H58M42 76H58M50 64V70M46 70V76M54 70V76M50 76V82" stroke={body} strokeWidth="0.8" />
        {top({ x0: 42, x1: 58, y: 64 })}
      </g>
    )

  if (draw === 'roofs')
    return (
      <g>
        {[plats[0], plats[1]].map((p, i) => (
          <g key={i}>
            {block(p, facade)}
            {top(p)}
            {Array.from({ length: 4 }, (_, r) =>
              Array.from({ length: 4 }, (_, c) => {
                const x = Math.max(p.x0, -2) + 5 + c * 9
                if (x > Math.min(p.x1, 102) - 5) return null
                const lit = (r * 4 + c + i) % 5 === 1
                return <rect key={`${r}-${c}`} x={x} y={p.y + 6 + r * 7} width="3" height="4" fill={lit ? '#ffb760' : body} opacity={lit ? 0.9 : 1} />
              }),
            )}
          </g>
        ))}
      </g>
    )

  /* parque: pasto, árbol y tronco */
  return (
    <g>
      <path d="M-2 84 Q 25 81 50 84 T 102 83 V100 H-2Z" fill="#0c1a18" />
      <path d="M-2 84 Q 25 81 50 84 T 102 83" fill="none" stroke={accent} strokeWidth="1.3" opacity="0.85" />
      <g fill="#0a1516">
        <rect x="82" y="56" width="3.5" height="28" />
        <circle cx="84" cy="50" r="11" />
        <circle cx="76" cy="55" r="7.5" />
        <circle cx="92" cy="56" r="7" />
      </g>
      <rect x="44" y="76" width="18" height="8" rx="4" fill="#130f12" />
      <ellipse cx="62" cy="80" rx="2" ry="4" fill="#2a1d1a" />
    </g>
  )
}

export default function ScheduleIcon({ id, accent, active }) {
  const uid = useId().replace(/:/g, '')
  const figRef = useRef(null)
  const scene = SCENES[id]
  const route = useMemo(
    () => buildRoute(scene.plats, { dir: 1, ...scene.run, pause: 0.5, enter: 18, exitX: 116 }),
    [scene],
  )
  /* momento "foto": mitad del primer salto */
  const still = useMemo(() => {
    const j = route.segs.find((s) => s.type === 'jump')
    return j ? j.t0 + j.dur * (j.flip ? 0.1 : 0.4) : 0
  }, [route])

  useEffect(() => {
    const g = figRef.current
    if (!g) return
    const draw = (t) => {
      const st = runnerAt(route, t)
      if (!st) {
        g.setAttribute('visibility', 'hidden')
        return
      }
      const s = route.scale
      g.setAttribute('visibility', 'visible')
      g.setAttribute(
        'transform',
        `translate(${st.x.toFixed(2)} ${st.y.toFixed(2)}) scale(${s} ${s}) rotate(${st.rot.toFixed(1)} 0 ${st.cy.toFixed(1)})`,
      )
      g.querySelectorAll('path').forEach((el, k) => el.setAttribute('d', st.d[PARTS[k].id]))
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!active || reduce) {
      draw(still)
      return
    }
    let raf = 0
    const t0 = performance.now() - still * 1000
    const tick = (now) => {
      draw((now - t0) / 1000)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, route, still])

  const m = scene.moon
  return (
    <svg className="grupo-icon" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0f20" />
          <stop offset="0.55" stopColor="#1b1838" />
          <stop offset="1" stopColor="#7d1420" />
        </linearGradient>
        <radialGradient id={`moon-${uid}`} cx="0.4" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#f04a3c" />
          <stop offset="1" stopColor="#a3121c" />
        </radialGradient>
        <filter id={`rim-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="2.2" result="d" />
          <feFlood floodColor={accent} floodOpacity="0.9" />
          <feComposite in2="d" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="100" height="100" fill={`url(#sky-${uid})`} />
      <circle cx={m.x} cy={m.y} r={m.r * 1.9} fill="#ff3b30" opacity="0.12" />
      <circle cx={m.x} cy={m.y} r={m.r} fill={`url(#moon-${uid})`} />
      {[
        [12, 12], [40, 9], [88, 14], [60, 20], [30, 36], [92, 40],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.7" fill="#fff" opacity="0.7" />
      ))}
      {/* skyline lejano */}
      <path d="M0 70H8V62H15V67H22V58H30V66H38V61H47V68H55V57H63V64H71V60H79V66H88V59H95V65H100V100H0Z" fill="#1d2342" />
      <Scene id={id} accent={accent} plats={scene.plats} />
      <g ref={figRef} className="ct-runner" filter={`url(#rim-${uid})`}>
        {PARTS.map((pt) => (
          <path key={pt.id} className={`ct-p ct-p--${pt.kind}${pt.far ? ' is-far' : ''}`} strokeWidth={pt.w} />
        ))}
      </g>
    </svg>
  )
}
