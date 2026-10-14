import { VIEW } from "@/config"
import type { Point } from "@/lib/triangulation"

export type Projection = ReturnType<typeof project>

// map polygon coordinates into a VIEW x VIEW svg box, keeping the aspect ratio and flipping y
export function project(points: Point[]) {
    const xs = points.map(p => p[0]), ys = points.map(p => p[1])
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys)
    const s = (VIEW * 0.8) / Math.max(maxX - minX || 1, maxY - minY || 1)
    const ox = (VIEW - (maxX - minX) * s) / 2, oy = (VIEW - (maxY - minY) * s) / 2

    const X = (x: number) => ox + (x - minX) * s
    const Y = (y: number) => VIEW - oy - (y - minY) * s
    return {
        X,
        Y,
        center: [X((minX + maxX) / 2), Y((minY + maxY) / 2)] as const,
        // svg "points" attribute for a list of vertex indices
        pts: (idxs: number[]) => idxs.map(q => X(points[q][0]) + "," + Y(points[q][1])).join(" "),
    }
}

export const range = (i: number, j: number) => Array.from({ length: j - i + 1 }, (_, t) => i + t)
