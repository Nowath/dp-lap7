// ---------- geometry ----------
export type Point = [number, number]
export type Triangle = [number, number, number] // indices into the polygon

function distance([x1, y1]: Point, [x2, y2]: Point) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

function perimeter(points: Point[], [i, k, j]: Triangle) {
    return distance(points[i], points[k])
        + distance(points[k], points[j])
        + distance(points[i], points[j])
}

// sort points counter-clockwise around their center so the polygon edges don't cross
export function orderPolygon(points: Point[]) {
    const cx = points.reduce((s, p) => s + p[0], 0) / points.length
    const cy = points.reduce((s, p) => s + p[1], 0) / points.length
    const angle = ([x, y]: Point) => Math.atan2(y - cy, x - cx)
    return [...points].sort((a, b) => angle(a) - angle(b))
}

// ---------- bottom-up DP ----------
// steps are recorded only to animate the DP on the page
export type Step =
    | { type: "try", gap: number, i: number, j: number, k: number, left: number, right: number, cost: number, total: number }
    | { type: "set", gap: number, i: number, j: number, k: number, value: number }

export function triangulate(points: Point[], recordTries = true) {
    const n = points.length
    const dp: number[][] = Array.from({ length: n }, () => Array(n).fill(0))
    const split: number[][] = Array.from({ length: n }, () => Array(n).fill(-1))
    const steps: Step[] = []

    for (let gap = 2; gap < n; gap++) {
        for (let i = 0; i + gap < n; i++) {
            const j = i + gap
            dp[i][j] = Infinity
            for (let k = i + 1; k < j; k++) {
                const cost = perimeter(points, [i, k, j])
                const total = dp[i][k] + dp[k][j] + cost
                if (recordTries) steps.push({ type: "try", gap, i, j, k, left: dp[i][k], right: dp[k][j], cost, total })
                if (total < dp[i][j]) {
                    dp[i][j] = total
                    split[i][j] = k
                }
            }
            steps.push({ type: "set", gap, i, j, k: split[i][j], value: dp[i][j] })
        }
    }
    return { dp, split, steps }
}

// walk the split table to recover the triangles of the optimal answer
export function getTriangles(split: number[][], i: number, j: number, out: Triangle[] = []) {
    if (j - i < 2) return out
    const k = split[i][j]
    out.push([i, k, j])
    getTriangles(split, i, k, out)
    getTriangles(split, k, j, out)
    return out
}

// ---------- brute force: generate EVERY triangulation, no memo ----------
function allTriangulations(i: number, j: number): Triangle[][] {
    if (j - i < 2) return [[]]
    const result: Triangle[][] = []
    for (let k = i + 1; k < j; k++) {
        for (const left of allTriangulations(i, k)) {
            for (const right of allTriangulations(k, j)) {
                result.push([[i, k, j], ...left, ...right])
            }
        }
    }
    return result
}

export function bruteForce(points: Point[]) {
    const all = allTriangulations(0, points.length - 1).map(tris => ({
        tris,
        cost: tris.reduce((sum, t) => sum + perimeter(points, t), 0)
    }))
    const best = all.reduce((b, t, idx) => (t.cost < all[b].cost ? idx : b), 0)
    return { all, best }
}

// ---------- input: "{0, 0}, {1, 0}, {2, 1}" or "[[0, 0], [1, 0], [2, 1]]" ----------
export function parseInput(text: string): Point[] {
    const re = /[{[]\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*[}\]]/g
    return [...text.matchAll(re)].map(m => [Number(m[1]), Number(m[2])])
}

export const formatTriangles = (tris: Triangle[]) => tris.map(t => t.map(v => "P" + v).join("-")).join(", ")
