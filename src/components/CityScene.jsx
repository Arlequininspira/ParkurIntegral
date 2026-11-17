import { useEffect, useMemo, useRef, useState } from 'react'
import './CityScene.css'
import { PARTS, buildRoute, runnerAt } from './runners'
import { W, H, buildCity } from './cityGen'

const FOCUS_X = 1120 // en pantallas angostas se centra en la luna y los techos

export default function CityScene() {
  const rootRef = useRef(null)
  const [viewBox, setViewBox] = useState(`0 0 ${W} ${H}`)
  const city = useMemo(buildCity, [])
  const runnerRefs = useRef([])

  /* 4 traceurs a lo lejos: dos por los edificios del medio y dos por los del fondo */
  const runners = useMemo(() => {
    const mid = city.mid.plats
    const far = city.far.plats
    return [
      { layer: 'mid', route: buildRoute(mid, { dir: 1, speed: 78, scale: 0.34, pause: 2 }), offset: 0 },
      { layer: 'mid', route: buildRoute(mid, { dir: -1, speed: 84, scale: 0.32, flip: true, pause: 3 }), offset: 7 },
      { layer: 'far', route: buildRoute(far, { dir: 1, speed: 52, scale: 0.23, pause: 2 }), offset: 4 },
      { layer: 'far', route: buildRoute(far, { dir: -1, speed: 56, scale: 0.22, flip: true, pause: 2 }), offset: 12 },
    ]
  }, [city])

  /* Animación de los traceurs (solo mientras el hero se ve) */
  useEffect(() => {
    const root = rootRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const draw = (time) => {
      runners.forEach((r, i) => {
        const g = runnerRefs.current[i]
        if (!g) return
        const st = runnerAt(r.route, reduce ? 2 + i * 1.7 : time + r.offset)
        if (!st) {
          g.setAttribute('visibility', 'hidden')
          return
        }
        const s = r.route.scale
        g.setAttribute('visibility', 'visible')
        g.setAttribute(
          'transform',
          `translate(${st.x.toFixed(1)} ${st.y.toFixed(1)}) scale(${(s * r.route.dir).toFixed(3)} ${s}) rotate(${st.rot.toFixed(1)} 0 ${st.cy.toFixed(1)})`,
        )
        g.querySelectorAll('path').forEach((el, k) => el.setAttribute('d', st.d[PARTS[k].id]))
      })
    }
    if (reduce) {
      draw(0)
      return
    }
    let raf = 0
    let on = true
    const start = performance.now()
    const tick = (now) => {
      draw((now - start) / 1000)
      if (on) raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting
      cancelAnimationFrame(raf)
      if (on) raf = requestAnimationFrame(tick)
    })
    io.observe(root)
    return () => {
      on = false
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [runners])

  const drawShapes = (shapes, fill) =>
    shapes.map((s, i) =>
      s.k === 'r' ? (
        <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} fill={s.c || fill} opacity={s.o} stroke={s.st} strokeOpacity={s.so} />
      ) : s.k === 'p' ? (
        <path key={i} d={s.d} fill={s.c || fill} />
      ) : (
        <path key={i} d={s.d} fill="none" stroke={s.s} strokeWidth={s.sw} strokeOpacity={s.op} />
      ),
    )

  const runnerEl = (i) => (
    <g key={i} ref={(el) => (runnerRefs.current[i] = el)} className="ct-runner" visibility="hidden" filter="url(#ct-rim)">
      {PARTS.map((pt) => (
        <path key={pt.id} className={`ct-p ct-p--${pt.kind}${pt.far ? ' is-far' : ''}`} strokeWidth={pt.w} />
      ))}
    </g>
  )

  /* viewBox adaptable: en mobile recorta alrededor de la luna */
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const fit = () => {
      const { width, height } = el.getBoundingClientRect()
      if (!width || !height) return
      const aspect = width / height
      if (aspect >= W / H) setViewBox(`0 0 ${W} ${H}`)
      else {
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

  /* Parallax con el scroll, solo mientras se ve */
  useEffect(() => {
    const el = rootRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let on = true
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

  const depth = (s) => ({ transform: `translate3d(0, calc(var(--sy,0) * ${s}px), 0)` })

  return (
    <div ref={rootRef} className="city" aria-hidden="true">
      <svg viewBox={viewBox} preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="ct-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#060914" />
            <stop offset="0.42" stopColor="#111833" />
            <stop offset="0.68" stopColor="#33132a" />
            <stop offset="0.84" stopColor="#8a1320" />
            <stop offset="1" stopColor="#c81f26" />
          </linearGradient>
          {/* el corte diagonal del escudo: azul a la izquierda, rojo a la derecha */}
          <linearGradient id="ct-split" x1="0.25" y1="0" x2="0.75" y2="0.35">
            <stop offset="0.48" stopColor="#a3121c" stopOpacity="0" />
            <stop offset="0.52" stopColor="#a3121c" stopOpacity="0.32" />
            <stop offset="1" stopColor="#a3121c" stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id="ct-moon" cx="0.42" cy="0.38" r="0.7">
            <stop offset="0" stopColor="#f04a3c" />
            <stop offset="0.7" stopColor="#c01b22" />
            <stop offset="1" stopColor="#8d0f18" />
          </radialGradient>
          <radialGradient id="ct-glow">
            <stop offset="0" stopColor="#ff3b30" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ff3b30" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ct-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c81f26" stopOpacity="0" />
            <stop offset="1" stopColor="#c81f26" stopOpacity="0.45" />
          </linearGradient>
          <filter id="ct-ink" colorInterpolationFilters="sRGB">
            <feFlood floodColor="#070a14" />
            <feComposite in2="SourceAlpha" operator="in" />
          </filter>
          {/* degradé de nube en coordenadas locales: arriba azul, base rojiza por la luna */}
          <linearGradient id="ct-cloud" gradientUnits="userSpaceOnUse" x1="0" y1="-80" x2="0" y2="16">
            <stop offset="0" stopColor="#2c355f" />
            <stop offset="0.55" stopColor="#1a2042" />
            <stop offset="0.85" stopColor="#3a1830" />
            <stop offset="1" stopColor="#6e1a28" />
          </linearGradient>
          <linearGradient id="ct-cloud-far" gradientUnits="userSpaceOnUse" x1="0" y1="-80" x2="0" y2="16">
            <stop offset="0" stopColor="#2a3158" />
            <stop offset="0.7" stopColor="#202748" />
            <stop offset="1" stopColor="#4a1a30" />
          </linearGradient>
          <filter id="ct-soft" x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
          <filter id="ct-soft-far" x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id="ct-rim" x="-30%" y="-30%" width="160%" height="160%">
            <feMorphology in="SourceAlpha" operator="dilate" radius="0.7" result="d" />
            <feFlood floodColor="#ff4a3d" floodOpacity="0.5" />
            <feComposite in2="d" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ct-ink-far" colorInterpolationFilters="sRGB">
            <feFlood floodColor="#1c2240" />
            <feComposite in2="SourceAlpha" operator="in" />
          </filter>
        </defs>

        {/* Cielo */}
        <rect width={W} height={H} fill="url(#ct-sky)" />
        <rect width={W} height={H} fill="url(#ct-split)" className="ct-split" />

        <g className="ct-stars">
          {city.stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.s} className="ct-star" style={{ animationDelay: `-${s.d}s` }} />
          ))}
        </g>

        {/* Luna roja */}
        <g style={depth(0.08)}>
          <circle cx="1210" cy="370" r="330" fill="url(#ct-glow)" className="ct-glow" />
          <circle cx="1210" cy="370" r="168" fill="url(#ct-moon)" />
          <circle cx="1210" cy="370" r="192" className="ct-ring" />
        </g>

        {/* Nubes alargadas que cruzan */}
        {/* Nubes: base iluminada en rojo por la luna, cuerpo azul noche */}
        <g className="ct-clouds">
          {city.clouds.map((c) => {
            const ell = (dy, fill) =>
              c.puffs.map((p, k) => <ellipse key={k} cx={p.cx} cy={p.cy + dy} rx={p.rx} ry={p.ry} fill={fill} />)
            return (
              <g
                key={c.key}
                className="ct-cloud"
                style={{ animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}
                opacity={c.far ? 0.55 : 0.85}
              >
                <g transform={`translate(0 ${c.y}) scale(${c.s})`} filter={c.far ? 'url(#ct-soft-far)' : 'url(#ct-soft)'}>
                  {ell(0, c.far ? 'url(#ct-cloud-far)' : 'url(#ct-cloud)')}
                </g>
              </g>
            )
          })}
        </g>

        {/* Horizonte: torres y grúa */}
        <g style={depth(0.08)} opacity="0.85">
          {drawShapes(city.skyline.shapes, '#1d2342')}
          {city.skyline.beacons.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r="2.5" className="ct-beacon" style={{ animationDelay: `-${i * 0.7}s` }} />
          ))}
        </g>

        {/* Ciudad lejana */}
        <g style={depth(0.14)}>
          <rect y="640" width={W} height="260" fill="url(#ct-haze)" />
          {drawShapes(city.far.shapes, '#262c4c')}
          {runners.map((r, i) => r.layer === 'far' && runnerEl(i))}
        </g>

        {/* Ciudad media con ventanas */}
        <g style={depth(0.24)}>
          {drawShapes(city.mid.shapes, '#141a30')}
          {city.mid.beacons.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r="3" className="ct-beacon" style={{ animationDelay: `-${i % 3}s` }} />
          ))}
          {city.mid.windows.map((w, i) => (
            <rect
              key={i}
              x={w.x}
              y={w.y}
              width="4"
              height="6.5"
              fill={w.red ? '#ff5a4a' : '#ffb760'}
              className={w.flick ? 'ct-win ct-win--flick' : 'ct-win'}
              style={w.flick ? { animationDelay: `-${w.d}s` } : undefined}
            />
          ))}
          {runners.map((r, i) => r.layer === 'mid' && runnerEl(i))}
        </g>

      </svg>
      <div className="city-fade" />
    </div>
  )
}
