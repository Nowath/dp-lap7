import { BRUTE_LIMIT, DETAIL_LIMIT, SHOW_MAX } from "@/config"
import { bruteForce, getTriangles, orderPolygon, triangulate, type Point, type Triangle } from "@/lib/triangulation"

export type BruteResult = {
    total: number
    bestCost: number
    matches: boolean
    items: { tris: Triangle[], cost: number }[]
}

export type Solution = ReturnType<typeof solve>

// run the DP (and brute force for small n) and package everything the page needs
export function solve(input: Point[]) {
    const points = orderPolygon(input)
    const n = points.length
    const detailed = n <= DETAIL_LIMIT
    const { dp, split, steps } = triangulate(points, detailed)
    const answer = dp[0][n - 1]
    const triangles = getTriangles(split, 0, n - 1)

    // setAt[i][j] = index of the step that fills dp[i][j], so the table at step idx shows cells with setAt < idx
    const setAt: number[][] = Array.from({ length: n }, () => Array(n).fill(-1))
    steps.forEach((st, ix) => { if (st.type === "set") setAt[st.i][st.j] = ix })

    let brute: BruteResult | null = null
    if (n <= BRUTE_LIMIT) {
        const { all, best } = bruteForce(points)
        const bestCost = all[best].cost
        brute = {
            total: all.length,
            bestCost,
            matches: Math.abs(bestCost - answer) < 1e-9,
            // always include the best case, even when it's past SHOW_MAX
            items: all.slice(0, SHOW_MAX).concat(best >= SHOW_MAX ? [all[best]] : [])
        }
    }

    return { points, n, detailed, steps, setAt, dp, answer, triangles, brute }
}
