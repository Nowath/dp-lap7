import { VIEW } from "@/config"
import type { Solution } from "@/lib/solve"
import type { Step } from "@/lib/triangulation"
import { range, type Projection } from "@/lib/viewport"

type Props = {
    sol: Solution
    proj: Projection
    step: Step | undefined // undefined on the final frame
}

export function PolygonView({ sol, proj, step }: Props) {
    const { points, n, detailed, triangles } = sol
    const { X, Y, pts, center: [cx, cy] } = proj

    return (
        <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="mx-auto block h-auto w-full max-w-md" role="img" aria-label={`รูปหลายเหลี่ยม ${n} จุด`}>
            <polygon points={pts(range(0, n - 1))} className="fill-none stroke-muted-foreground" strokeWidth={1.2} />

            {step
                ? <>
                    {/* sub-polygon P_i..P_j that dp[i][j] covers */}
                    <polygon points={pts(range(step.i, step.j))} className="fill-viz-range/15 stroke-viz-range" strokeWidth={2} />
                    <polygon points={pts([step.i, step.k, step.j])} className={step.type === "set" ? "fill-viz-tri/45 stroke-viz-tri" : "fill-viz-tri/25 stroke-viz-tri"} strokeWidth={2.5} />
                </>
                : triangles.map(t => (
                    <polygon key={t.join("-")} points={pts(t)} className="fill-viz-tri/20 stroke-viz-tri" strokeWidth={2} />
                ))}

            {points.map((p, t) => {
                const x = X(p[0]), y = Y(p[1])
                if (!detailed) return <circle key={t} cx={x} cy={y} r={1.5} className="fill-foreground" />
                // push the label outward from the center
                const dx = x - cx, dy = y - cy, L = Math.hypot(dx, dy) || 1
                const lx = x + dx / L * 20, ly = y + dy / L * 20
                return (
                    <g key={t}>
                        <circle cx={x} cy={y} r={4.5} className="fill-foreground" />
                        <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600} className="fill-foreground">P{t}</text>
                        <text x={lx} y={ly + 14} textAnchor="middle" dominantBaseline="central" fontSize={10} className="fill-muted-foreground font-mono">({p[0]},{p[1]})</text>
                    </g>
                )
            })}
        </svg>
    )
}
