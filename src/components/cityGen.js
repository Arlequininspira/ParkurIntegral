/* Generador de la ciudad: edificios variados + plataformas por donde corren los traceurs.
   Determinístico (semilla fija): la ciudad sale igual en cada carga. */

export const W = 1600
export const H = 900

function rng(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const f = (n) => Math.round(n * 10) / 10

/* Una fila de edificios. Devuelve formas para dibujar, plataformas y ventanas. */
function genRow(r, o) {
  const shapes = [] // { k: 'r'|'p'|'l', ... }
  const plats = [] // { x0, x1, yL, yR }
  const windows = []
  const beacons = []
  const rect = (x, y, w, h, c = o.body, extra) => shapes.push({ k: 'r', x: f(x), y: f(y), w: f(w), h: f(h), c, ...extra })
  const poly = (d, c = o.body) => shapes.push({ k: 'p', d, c })
  const line = (d, s = o.line, sw = 1.5, op) => shapes.push({ k: 'l', d, s, sw, op })
  const rim = (x, y, w) => rect(x, y, w, 1.6, '#c81f26', { o: o.rimO })
  const walk = (prev) => Math.min(o.hi, Math.max(o.lo, prev + (r() - 0.5) * o.step))
  const addWindows = (x, w, top) => {
    if (!o.windows) return
    for (let wy = top + 10; wy < 870; wy += 16) {
      for (let wx = x + 7; wx < x + w - 9; wx += 10) {
        const p = r()
        if (p < 0.15) windows.push({ x: f(wx), y: f(wy), red: p < 0.022, flick: r() < 0.18, d: (r() * 9).toFixed(1) })
      }
    }
  }

  /* detalles de terraza (decorativos: los traceurs pasan por delante) */
  const roofDetail = (x, w, y) => {
    const p = r()
    if (p < 0.2 && w > 60) {
      // tanque de agua
      rect(x + 10, y - 26 * o.k, 26 * o.k, 20 * o.k)
      rect(x + 12, y - 6 * o.k, 2, 6 * o.k)
      rect(x + 32 * o.k, y - 6 * o.k, 2, 6 * o.k)
    } else if (p < 0.38) {
      // casilla de la escalera, con puerta
      const hx = x + w - 30 * o.k
      rect(hx, y - 17 * o.k, 20 * o.k, 17 * o.k)
      rect(hx + 6 * o.k, y - 12 * o.k, 6 * o.k, 12 * o.k, o.detail)
    } else if (p < 0.52 && w > 80) {
      // cartel sobre patas
      const bx = x + w * 0.3
      rect(bx + 6, y - 14 * o.k, 2, 14 * o.k)
      rect(bx + 40 * o.k, y - 14 * o.k, 2, 14 * o.k)
      rect(bx, y - 36 * o.k, 50 * o.k, 22 * o.k, o.detail, { st: '#c81f26', so: 0.35 })
    } else if (p < 0.68) {
      // aires acondicionados
      for (let i = 0; i < 2 + Math.floor(r() * 2); i++) rect(x + 12 + i * 15 * o.k, y - 7 * o.k, 11 * o.k, 7 * o.k, o.detail)
    } else if (p < 0.8 && o.windows) {
      // antena con baliza
      rect(x + w - 16, y - 54 * o.k, 2, 54 * o.k)
      beacons.push({ x: x + w - 15, y: y - 56 * o.k })
    }
  }

  /* escalera de incendio en zigzag sobre la fachada */
  const fireEscape = (x, top) => {
    const x0 = x + 5
    const x1 = x + 5 + 26 * o.k
    let d = ''
    for (let y = top + 18; y < 860; y += 30 * o.k) {
      d += `M${f(x0)} ${f(y)}H${f(x1)}M${f(x1)} ${f(y)}L${f(x0)} ${f(y + 30 * o.k)}`
      d += `M${f(x0)} ${f(y - 7)}H${f(x1)}`
    }
    line(d, o.line, 1.2)
  }

  let x = o.start
  let top = (o.lo + o.hi) / 2
  let forceFlat = null // el edificio siguiente arranca a la altura del puente
  while (x < W + 40) {
    const w = o.minW + r() * (o.maxW - o.minW)
    const pick = forceFlat !== null ? 0 : r()
    const T = forceFlat !== null ? forceFlat : walk(top)
    forceFlat = null
    let rightY = T

    if (pick < o.pStepped && w > 120) {
      /* ESCALONADO: terraza baja, escalera y nivel alto */
      const h2 = 20 + r() * 14
      const tw = w * 0.42
      const sw = h2 * 1.4
      const right = r() < 0.5
      const tierX = right ? x + w - tw : x
      const a = right ? x + w - tw - sw : x + tw
      const b = right ? x + w - tw : x + tw + sw
      rect(x, T, w, H - T)
      rect(tierX, T - h2, tw, h2 + 1)
      rim(tierX, T - h2, tw)
      // escalera: bloque escalonado
      const n = Math.max(4, Math.round(h2 / 5))
      let d = right ? `M${f(a)} ${f(T)}` : `M${f(b)} ${f(T)}`
      for (let i = 0; i < n; i++) {
        const sx = right ? a + (sw / n) * i : b - (sw / n) * i
        const sy = T - (h2 / n) * (i + 1)
        d += `L${f(sx)} ${f(sy)}L${f(right ? sx + sw / n : sx - sw / n)} ${f(sy)}`
      }
      d += `L${f(right ? b : a)} ${f(T)}Z`
      poly(d)
      line(`M${f(a)} ${f(T - 9)}L${f(b)} ${f(T - h2 - 9)}`, o.line, 1.2) // baranda
      if (right) {
        rim(x, T, a - x)
        plats.push({ x0: x, x1: a, yL: T, yR: T }, { x0: a, x1: b, yL: T, yR: T - h2 }, { x0: b, x1: x + w, yL: T - h2, yR: T - h2 })
        rightY = T - h2
      } else {
        rim(b, T, x + w - b)
        plats.push({ x0: x, x1: a, yL: T - h2, yR: T - h2 }, { x0: a, x1: b, yL: T - h2, yR: T }, { x0: b, x1: x + w, yL: T, yR: T })
      }
      addWindows(x, w, T)
    } else if (pick < o.pStepped + o.pShed) {
      /* TECHO INCLINADO */
      const s = 14 + r() * 16
      const up = r() < 0.5
      const yL = up ? T : T - s
      const yR = up ? T - s : T
      poly(`M${f(x)} ${f(yL)}L${f(x + w)} ${f(yR)}L${f(x + w)} ${H}L${f(x)} ${H}Z`)
      line(`M${f(x)} ${f(yL)}L${f(x + w)} ${f(yR)}`, '#c81f26', 1.6, o.rimO)
      plats.push({ x0: x, x1: x + w, yL, yR })
      rightY = yR
      addWindows(x, w, Math.max(yL, yR))
    } else if (pick < o.pStepped + o.pShed + o.pClassic) {
      /* CLÁSICO PORTEÑO: cornisa, balcones y cúpula en la esquina */
      rect(x, T, w, H - T)
      rect(x - 4, T - 4, w + 8, 6, o.detail)
      rim(x - 4, T - 4, w + 8)
      rect(x, T + 6, w, 3, o.detail)
      let bal = ''
      for (let y = T + 40; y < 860; y += 32) bal += `M${f(x + 6)} ${f(y)}H${f(x + w - 6)}`
      line(bal, o.line, 1.4)
      if (r() < 0.6 && w > 70) {
        const cx = r() < 0.5 ? x + 8 : x + w - 30
        rect(cx, T - 22, 22, 22)
        poly(`M${f(cx)} ${f(T - 22)}A11 11 0 0 1 ${f(cx + 22)} ${f(T - 22)}Z`)
        rect(cx + 10, T - 46, 2, 14)
      }
      plats.push({ x0: x - 4, x1: x + w + 4, yL: T - 4, yR: T - 4 })
      rightY = T - 4
      addWindows(x, w, T + 6)
    } else {
      /* BLOQUE con detalles de terraza */
      rect(x, T, w, H - T)
      rim(x, T, w)
      roofDetail(x, w, T)
      plats.push({ x0: x, x1: x + w, yL: T, yR: T })
      addWindows(x, w, T)
    }
    if (o.windows && r() < 0.3) fireEscape(x, T)

    top = rightY
    let gap = o.gap[0] + r() * (o.gap[1] - o.gap[0])
    /* PUENTE peatonal hacia el próximo edificio */
    if (o.bridges && r() < 0.24 && x + w < W - 60) {
      gap = 46 + r() * 34
      const bx0 = x + w
      const bx1 = x + w + gap
      rect(bx0, rightY, gap, 5, o.detail)
      let truss = `M${f(bx0)} ${f(rightY + 5)}`
      for (let i = 0, n = Math.round(gap / 10); i <= n; i++) truss += `L${f(bx0 + (gap / n) * i)} ${f(rightY + (i % 2 ? 15 : 5))}`
      line(truss, o.line, 1.3)
      let rail = `M${f(bx0)} ${f(rightY - 9)}H${f(bx1)}`
      for (let px = bx0; px <= bx1; px += 8) rail += `M${f(px)} ${f(rightY - 9)}V${f(rightY)}`
      line(rail, o.line, 1.1)
      plats.push({ x0: bx0, x1: bx1, yL: rightY, yR: rightY, kind: 'bridge' })
      forceFlat = rightY
    }
    x += w + gap
  }
  return { shapes, plats, windows, beacons }
}

/* Torres altas del horizonte y una grúa (sin traceurs) */
function genSkyline(r) {
  const shapes = []
  const beacons = []
  const xs = [60, 420, 520, 1000, 1150, 1380, 1520]
  xs.forEach((cx) => {
    const w = 30 + r() * 34
    const top = 400 + r() * 130
    shapes.push({ k: 'r', x: f(cx), y: f(top), w: f(w), h: f(H - top) })
    const p = r()
    if (p < 0.4) {
      shapes.push({ k: 'r', x: f(cx + w / 2 - 1), y: f(top - 46), w: 2, h: 46 })
      beacons.push({ x: cx + w / 2, y: top - 48 })
    } else if (p < 0.7) {
      shapes.push({ k: 'p', d: `M${f(cx)} ${f(top)}L${f(cx + w / 2)} ${f(top - 34)}L${f(cx + w)} ${f(top)}Z` })
    } else {
      shapes.push({ k: 'r', x: f(cx + w * 0.2), y: f(top - 18), w: f(w * 0.6), h: 18 })
    }
  })
  /* grúa de obra */
  const gx = 200
  const gTop = 455
  let lattice = `M${gx} ${H}V${gTop}M${gx + 7} ${H}V${gTop}`
  for (let y = gTop; y < H; y += 14) lattice += `M${gx} ${y}L${gx + 7} ${y + 14}`
  lattice += `M${gx - 70} ${gTop}H${gx + 210}M${gx - 70} ${gTop + 6}H${gx + 210}`
  for (let x = gx - 70; x < gx + 210; x += 12) lattice += `M${x} ${gTop + 6}L${x + 6} ${gTop}`
  lattice += `M${gx + 3} ${gTop}L${gx + 3} ${gTop - 30}L${gx + 210} ${gTop}M${gx + 3} ${gTop - 30}L${gx - 70} ${gTop}`
  lattice += `M${gx + 150} ${gTop + 6}V${gTop + 70}`
  shapes.push({ k: 'l', d: lattice, s: '#1f2546', sw: 2 })
  shapes.push({ k: 'r', x: gx - 70, y: gTop + 2, w: 22, h: 16 })
  shapes.push({ k: 'r', x: gx + 144, y: gTop + 70, w: 12, h: 8 })
  beacons.push({ x: gx + 3, y: gTop - 32 })
  return { shapes, beacons }
}

/* Nubes: racimos de "copos" (elipses) con base aplanada */
function genClouds(r) {
  const defs = [
    { y: 175, s: 0.9, far: true },
    { y: 250, s: 1.25, far: false },
    { y: 330, s: 0.75, far: true },
    { y: 395, s: 1.1, far: false },
    { y: 460, s: 0.6, far: true },
    { y: 215, s: 0.65, far: true },
    { y: 300, s: 0.95, far: false },
    { y: 140, s: 0.55, far: true },
  ]
  return defs.map((c, i) => {
    const n = 6 + Math.floor(r() * 5)
    const width = 160 + r() * 170
    const puffs = Array.from({ length: n }, (_, k) => {
      const t = k / (n - 1) + (r() - 0.5) * 0.08
      const mid = Math.max(0, 1 - Math.abs(t - 0.45) * 2.1) ** 0.8 // cúmulo: alto en el centro
      const rx = 16 + mid * 30 + r() * 16
      return {
        cx: f(t * width),
        cy: f(-mid * (26 + r() * 22) - r() * 6),
        rx: f(rx),
        ry: f(rx * (0.72 + r() * 0.22)),
      }
    })
    /* base: elipse ancha y chata que une los copos */
    puffs.push({ cx: f(width * 0.48), cy: 4, rx: f(width * 0.52), ry: 11 })
    const dur = (c.far ? 260 : 190) + r() * 80
    return { ...c, puffs, width, dur: Math.round(dur), delay: -Math.round(r() * dur), key: i }
  })
}

export function buildCity() {
  const r = rng(2026)
  const stars = Array.from({ length: 90 }, () => ({
    x: r() * W,
    y: r() * 470,
    s: 0.6 + r() * 1.6,
    d: (r() * 4).toFixed(2),
  }))
  const clouds = genClouds(r)
  const skyline = genSkyline(r)
  const far = genRow(r, {
    start: -40, lo: 560, hi: 668, step: 44, minW: 50, maxW: 120, gap: [2, 10],
    pStepped: 0.18, pShed: 0.2, pClassic: 0.12, k: 0.6,
    body: '#262c4c', detail: '#222844', line: '#323a60', windows: false, bridges: true, rimO: 0.2,
  })
  const mid = genRow(r, {
    start: -30, lo: 628, hi: 722, step: 42, minW: 80, maxW: 190, gap: [6, 20],
    pStepped: 0.2, pShed: 0.16, pClassic: 0.2, k: 1,
    body: '#141a30', detail: '#10152a', line: '#262f55', windows: true, bridges: true, rimO: 0.4,
  })
  return { stars, clouds, skyline, far, mid }
}
