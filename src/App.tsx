import { useMemo, useState } from "react"
import { PointsForm } from "@/components/PointsForm"
import { Visualizer } from "@/components/Visualizer"
import { DEFAULT_INPUT } from "@/config"
import { solve } from "@/lib/solve"
import { parseInput, type Point } from "@/lib/triangulation"

export default function App() {
    const [run, setRun] = useState({ id: 0, points: parseInput(DEFAULT_INPUT) })
    const sol = useMemo(() => solve(run.points), [run.points])

    const onSubmit = (points: Point[]) => setRun(r => ({ id: r.id + 1, points }))

    return (
        <div className="min-h-dvh">
            <header className="border-b bg-card">
                <div className="mx-auto max-w-6xl px-4 py-6">
                    <h1 className="text-xl font-semibold text-balance sm:text-2xl">
                        แบ่งรูปหลายเหลี่ยมเป็นสามเหลี่ยมให้ต้นทุนต่ำสุด
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Bottom-up DP เติมตารางตาม gap = j − i จาก 2 ถึง n − 1 แล้วเทียบกับ brute force
                    </p>
                    <p className="mt-4 overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-sm whitespace-nowrap">
                        dp[i][j] = min<sub>i&lt;k&lt;j</sub> ( dp[i][k] + dp[k][j] + perimeter(i, k, j) )
                    </p>
                </div>
            </header>
            <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
                <PointsForm initial={DEFAULT_INPUT} onSubmit={onSubmit} />
                {/* new key on every run so the playback restarts from step 0 */}
                <Visualizer key={run.id} sol={sol} />
            </main>
        </div>
    )
}
