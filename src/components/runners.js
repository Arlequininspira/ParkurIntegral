/* Traceurs animados: figura articulada con buzo con capucha y jogger holgado,
   que corre por plataformas y salta los huecos. Unidades del viewBox. */

const D2R = Math.PI / 180
const THIGH = 18
const SHIN = 18
const UPPER = 13
const FORE = 12
const TORSO = 22

const lerp = (a, b, t) => a + (b - a) * t
const smooth = (t) => t * t * (3 - 2 * t)
const f1 = (n) => n.toFixed(1)

/* Orden fijo de piezas (de atrás hacia adelante). Cada una es un <path>. */
export const PARTS = [
  { id: 'farThigh', kind: 'stroke', w: 12, far: true },
  { id: 'farShin', kind: 'stroke', w: 10, far: true },
  { id: 'farShoe', kind: 'stroke', w: 6, far: true },
  { id: 'farUpper', kind: 'stroke', w: 9.5, far: true },
  { id: 'farFore', kind: 'stroke', w: 8, far: true },
  { id: 'torso', kind: 'fill' },
  { id: 'hood', kind: 'fill' },
  { id: 'nearThigh', kind: 'stroke', w: 12 },
  { id: 'nearShin', kind: 'stroke', w: 10 },
  { id: 'nearShoe', kind: 'stroke', w: 6 },
  { id: 'nearUpper', kind: 'stroke', w: 9.5 },
  { id: 'nearFore', kind: 'stroke', w: 8 },
]

/* Poses clave del salto (grados): pierna/rodilla cerca y lejos, brazos, inclinación */
const KEY = {
  launch: { tN: -18, kN: 14, tF: 32, kF: 46, aN: 165, aF: 140, lean: 24 },
  tuck: { tN: 88, kN: 122, tF: 66, kF: 108, aN: 118, aF: 96, lean: 32 },
  reach: { tN: 38, kN: 22, tF: 16, kF: 34, aN: 92, aF: 62, lean: 16 },
}
const mixKey = (A, B, t) => Object.fromEntries(Object.keys(A).map((k) => [k, lerp(A[k], B[k], t)]))

/* Pose del salto según su progreso (u 0..1): impulso → encogido → busca el piso */
function jumpKey(u) {
  if (u < 0.12) return KEY.launch
  if (u < 0.46) return mixKey(KEY.launch, KEY.tuck, smooth((u - 0.12) / 0.34))
  if (u < 0.82) return mixKey(KEY.tuck, KEY.reach, smooth((u - 0.46) / 0.36))
  return KEY.reach
}

/* p = fase de carrera, j = cuánto pesa la pose de salto, c = agachado, ju = progreso del salto */
function pose(p, j, c, ju = 0, lag = 0) {
  const K = jumpKey(ju)
  const legAngles = (ph, ja, jk) => {
    const a = lerp(8 + 34 * Math.sin(ph), ja, j) + 28 * c
    const k = lerp(12 + 78 * Math.max(0, Math.cos(ph)) ** 1.3, jk, j) + 62 * c
    return [a * D2R, k * D2R]
  }
  /* los brazos van un poco atrasados respecto de las piernas (overlap) */
  const armAngles = (ph, ju2) => {
    const u = lerp(-38 * Math.sin(ph - 0.35), ju2, j) - 50 * c
    return [u * D2R, (u + lerp(72, 22, j)) * D2R]
  }
  const lean = (lerp(16, K.lean, j) + 22 * c) * D2R
  const hip = { x: 0, y: 0 }
  const legPts = ([a, k]) => {
    const knee = { x: THIGH * Math.sin(a), y: THIGH * Math.cos(a) }
    const sa = a - k
    const foot = { x: knee.x + SHIN * Math.sin(sa), y: knee.y + SHIN * Math.cos(sa) }
    /* la zapatilla apunta hacia adelante, perpendicular a la canilla */
    const toe = { x: foot.x + 8 * Math.cos(sa), y: foot.y - 8 * Math.sin(sa) }
    const heel = { x: foot.x - 2.5 * Math.cos(sa), y: foot.y + 2.5 * Math.sin(sa) }
    return { knee, foot, toe, heel }
  }
  const L1 = legPts(legAngles(p, K.tN, K.kN))
  const L2 = legPts(legAngles(p + Math.PI, K.tF, K.kF))
  const sh = { x: TORSO * Math.sin(lean), y: -TORSO * Math.cos(lean) }
  const armPts = ([u, f]) => {
    const el = { x: sh.x + UPPER * Math.sin(u), y: sh.y + UPPER * Math.cos(u) }
    const hand = { x: el.x + FORE * Math.sin(f), y: el.y + FORE * Math.cos(f) }
    return { el, hand }
  }
  const A1 = armPts(armAngles(p + Math.PI, K.aN))
  const A2 = armPts(armAngles(p, K.aF))

  /* apoyo: corriendo, el pie más bajo toca el piso; en el aire, cadera fija */
  const ground = -Math.max(L1.foot.y, L2.foot.y, L1.heel.y, L2.heel.y)
  /* en el aire la cadera sigue la trayectoria; al despegar y al tocar, el pie queda anclado */
  const air = j > 0 ? Math.min(smooth(Math.min(1, ju / 0.14)), 1 - smooth(Math.max(0, (ju - 0.72) / 0.28))) : 0
  const dy = lerp(ground, -34, air)
  const P = (q) => `${f1(q.x)} ${f1(q.y + dy)}`
  const seg = (a, b) => `M${P(a)}L${P(b)}`

  /* buzo holgado: trapecio del hombro a debajo de la cadera */
  const t = { x: Math.sin(lean), y: -Math.cos(lean) } // eje del torso (hacia arriba)
  const n = { x: Math.cos(lean), y: Math.sin(lean) } // normal (hacia adelante)
  const pt = (o, a, b) => ({ x: o.x + n.x * a + t.x * b, y: o.y + n.y * a + t.y * b })
  const torso =
    `M${P(pt(sh, -7.5, 2))}` +
    `Q${P(pt(sh, 1, 5))} ${P(pt(sh, 7, 0))}` +
    `L${P(pt(hip, 10, -4))}` +
    `Q${P(pt(hip, 0, -9))} ${P(pt(hip, -10.5, -5))}Z`

  /* capucha: cabeza grande con la punta hacia atrás, flamea en el aire */
  const hc = pt(sh, 1.5, 10)
  const r = 8.2
  const flap = 3 + 4 * j + 3 * Math.abs(lag)
  const tipA = pt(hc, -6.5, 5)
  /* la punta de la capucha queda atrasada: sube cuando cae, baja cuando sube */
  const tip = pt(hc, -11 - flap, -2 - flap * 0.3 + lag * 6)
  const tipB = pt(hc, -5, -6)
  const hood =
    `M${f1(hc.x - r)} ${f1(hc.y + dy)}` +
    `a${r} ${r} 0 1 0 ${f1(2 * r)} 0a${r} ${r} 0 1 0 ${f1(-2 * r)} 0Z` +
    `M${P(tipA)}L${P(tip)}L${P(tipB)}Z`

  return {
    cy: dy - 12,
    d: {
      farThigh: seg(hip, L2.knee),
      farShin: seg(L2.knee, L2.foot),
      farShoe: seg(L2.heel, L2.toe),
      farUpper: seg(sh, A2.el),
      farFore: seg(A2.el, A2.hand),
      torso,
      hood,
      nearThigh: seg(hip, L1.knee),
      nearShin: seg(L1.knee, L1.foot),
      nearShoe: seg(L1.heel, L1.toe),
      nearUpper: seg(sh, A1.el),
      nearFore: seg(A1.el, A1.hand),
    },
  }
}

/* Ruta: corre por las plataformas (ordenadas por x) y salta entre ellas */
/* Plataformas: { x0, x1, yL, yR } (yL/yR permiten escaleras y techos inclinados) */
export function buildRoute(platforms, { dir = 1, speed = 180, scale = 1, flip = false, pause = 4, enter = 80, exitX, minGap = 1, minStep = 6 }) {
  const plats = (dir > 0 ? platforms : [...platforms].reverse()).map((p) => ({
    yL: p.y,
    yR: p.y,
    ...p,
  }))
  const segs = []
  const edge = (pl, end) => ((dir > 0) === end ? pl.x1 : pl.x0)
  const yAt = (pl, xx) => lerp(pl.yL, pl.yR, (xx - pl.x0) / (pl.x1 - pl.x0 || 1))
  const clampX = (pl, xx) => Math.min(pl.x1, Math.max(pl.x0, xx))
  let x = dir > 0 ? plats[0].x0 - enter : plats[0].x1 + enter
  for (let i = 0; i < plats.length; i++) {
    const pl = plats[i]
    const next = plats[i + 1]
    const x0 = x
    const y0 = yAt(pl, clampX(pl, x0))
    const end = edge(pl, true)
    /* hueco con signo: negativo = se superponen (cornisas), 0 = pegados (puentes, escaleras) */
    const gap = next ? dir * (edge(next, false) - end) : 0
    const yEnd = yAt(pl, end)
    /* solo sigue corriendo si hay piso continuo; cualquier hueco real se salta */
    if (next && gap < minGap && Math.abs(yAt(next, edge(next, false)) - yEnd) < minStep) {
      segs.push({ type: 'run', x0, x1: end, y0, y1: yEnd })
      x = edge(next, false)
      continue
    }
    if (!next) {
      const out = exitX ?? (dir > 0 ? 1700 : -100)
      segs.push({ type: 'run', x0, x1: out, y0, y1: yAt(pl, clampX(pl, out)) })
      break
    }
    const takeoff = end - dir * 6 * scale
    const ty = yAt(pl, takeoff)
    segs.push({ type: 'run', x0, x1: takeoff, y0, y1: ty })
    const land = edge(next, false) + dir * 18 * scale
    const ly = yAt(next, clampX(next, land))
    const dist = Math.abs(land - takeoff)
    const h = Math.max(34 * scale, ty - ly + 24 * scale)
    segs.push({ type: 'jump', x0: takeoff, x1: land, y0: ty, y1: ly, h, flip: flip && dist > 50 * scale })
    x = land
  }
  let t = 0
  segs.forEach((s, i) => {
    const dist = Math.abs(s.x1 - s.x0)
    s.dur = s.type === 'run' ? dist / speed : 0.55 + dist / (speed * 1.3)
    s.t0 = t
    s.prevJump = segs[i - 1]?.type === 'jump'
    if (s.prevJump) {
      const jp = segs[i - 1]
      s.impact = Math.min(1, 0.6 + Math.max(0, jp.y1 - jp.y0 + jp.h) / (160 * scale))
    }
    s.nextJump = segs[i + 1]?.type === 'jump'
    t += s.dur
  })
  return { segs, total: t + pause, dir, scale, stride: 46 * scale }
}

/* Altura del salto: subida rápida, un instante arriba, caída acelerada (asimétrico) */
const APEX = 0.4
function lift(u) {
  if (u < APEX) return 1 - (1 - u / APEX) ** 2.2
  const v = (u - APEX) / (1 - APEX)
  return 1 - v ** 2.4
}

function stateAt(route, t) {
  const seg = route.segs.find((s) => t >= s.t0 && t < s.t0 + s.dur)
  if (!seg) return null
  const el = t - seg.t0
  const u = el / seg.dur
  if (seg.type === 'run') return { seg, u, el, x: lerp(seg.x0, seg.x1, u), y: lerp(seg.y0, seg.y1, u) }
  return { seg, u, el, x: lerp(seg.x0, seg.x1, u), y: lerp(seg.y0, seg.y1, smooth(u)) - seg.h * lift(u) }
}

/* Estado del corredor en el tiempo t (segundos): función pura del tiempo */
export function runnerAt(route, time) {
  const t = ((time % route.total) + route.total) % route.total
  const st = stateAt(route, t)
  if (!st) return null // pausa fuera de pantalla
  const { seg, u, el, x, y } = st
  let j = 0
  let c = 0
  let rot = 0
  let ju = 0
  if (seg.type === 'run') {
    /* amortigua la caída: más fuerte cuanto más alto venía */
    if (seg.prevJump && el < 0.26) c = Math.sin((el / 0.26) * Math.PI) * seg.impact
    /* anticipación: se carga antes de saltar */
    const left = seg.dur - el
    if (seg.nextJump && left < 0.18) c = Math.max(c, smooth(1 - left / 0.18) * 0.85)
  } else {
    ju = u
    j = Math.min(1, u / 0.06, (1 - u) / 0.04)
    if (seg.flip) rot = 360 * smooth(Math.min(1, Math.max(0, (u - 0.12) / 0.66)))
  }
  /* velocidad vertical (muestreada) para la capucha */
  const b = stateAt(route, Math.max(0, t - 0.05))
  const vy = b ? (y - b.y) / 0.05 : 0
  const lag = Math.max(-1, Math.min(1, vy / (300 * route.scale)))
  const p = ((route.dir * x) / route.stride) * Math.PI
  return { x, y, rot, ...pose(p, j, c, ju, lag) }
}
