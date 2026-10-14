import { useMemo } from "react"
import { BruteForceGallery } from "@/components/BruteForceGallery"
import { Controls } from "@/components/Controls"
import { DpTable } from "@/components/DpTable"
import { PolygonView } from "@/components/PolygonView"
import { StepInfo } from "@/components/StepInfo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DETAIL_LIMIT } from "@/config"
import { usePlayback } from "@/hooks/usePlayback"
import type { Solution } from "@/lib/solve"
import { formatTriangles } from "@/lib/triangulation"
import { project } from "@/lib/viewport"

// colors in the drawing carry meaning, so they get a text legend too
function Legend() {
    return (
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><span className="size-3 rounded-sm border border-viz-range bg-viz-range/20" />ช่วงที่ dp[i][j] ครอบคลุม</li>
            <li className="flex items-center gap-2"><span className="size-3 rounded-sm border border-viz-tri bg-viz-tri/30" />สามเหลี่ยม (i, k, j)</li>
        </ul>
    )
}

export function Visualizer({ sol }: { sol: Solution }) {
    const { n, detailed, steps, answer, triangles } = sol
    const proj = useMemo(() => project(sol.points), [sol.points])

    const last = steps.length // idx === last is the final "done" frame
    const playback = usePlayback(last, detailed ? 1400 : 200)
    const step = playback.idx === last ? undefined : steps[playback.idx]

    return (
        <>
            <section className="flex flex-col gap-4" aria-label="Bottom-up DP">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                    <Card>
                        <CardHeader>
                            <CardTitle>รูปหลายเหลี่ยม</CardTitle>
                            <CardDescription>n = {n} จุด เรียงทวนเข็มรอบจุดศูนย์กลาง</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <PolygonView sol={sol} proj={proj} step={step} />
                            <Legend />
                            <StepInfo step={step} n={n} answer={answer} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>ตาราง dp</CardTitle>
                            <CardDescription>
                                {detailed
                                    ? "แถว i คอลัมน์ j · ช่องที่ขอบส้มคือสองช่องที่นำมาบวกกัน"
                                    : `ซ่อนตารางเพราะ n = ${n} เกิน ${DETAIL_LIMIT} จุด แอนิเมชันจึงแสดงเฉพาะผลของแต่ละ dp[i][j]`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {detailed && <DpTable sol={sol} idx={playback.idx} step={step} />}
                            <div className="flex flex-col gap-1 border-t pt-4">
                                <span className="text-sm text-muted-foreground">คำตอบ dp[0][{n - 1}]</span>
                                <span className="font-mono text-3xl font-medium tabular-nums text-viz-tri-text">
                                    {step ? <span className="text-muted-foreground">?</span> : answer.toFixed(4)}
                                </span>
                                {!step && (
                                    <p className="font-mono text-xs text-muted-foreground">
                                        <span className="font-sans text-sm">สามเหลี่ยม {triangles.length} รูป: </span>
                                        {formatTriangles(triangles)}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Controls playback={playback} total={last + 1} />
            </section>
            <BruteForceGallery sol={sol} proj={proj} />
        </>
    )
}
