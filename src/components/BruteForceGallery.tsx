import { CircleAlert } from "lucide-react"
import { BRUTE_LIMIT, VIEW } from "@/config"
import type { Solution } from "@/lib/solve"
import { cn } from "@/lib/utils"
import { range, type Projection } from "@/lib/viewport"

type Props = {
    sol: Solution
    proj: Projection
}

export function BruteForceGallery({ sol, proj }: Props) {
    const { brute, n, answer } = sol

    return (
        <section className="flex flex-col gap-4" aria-labelledby="brute-title">
            <div>
                <h2 id="brute-title" className="text-lg font-semibold">Brute force · ไล่ทุกวิธีที่เป็นไปได้</h2>
                {brute && (
                    <p className="text-sm text-muted-foreground">
                        พบ {brute.total} วิธี · ต่ำสุด <span className="font-mono">{brute.bestCost.toFixed(4)}</span>{" "}
                        {brute.matches
                            ? <>ตรงกับ DP (<span className="font-mono">{answer.toFixed(4)}</span>)</>
                            : <span className="inline-flex items-center gap-1 text-destructive"><CircleAlert className="size-4" />ไม่ตรงกับ DP ({answer.toFixed(4)})</span>}
                        {brute.total > brute.items.length && ` · แสดง ${brute.items.length} แบบแรก`}
                    </p>
                )}
            </div>

            {!brute
                ? (
                    <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
                        ข้ามขั้นนี้เพราะ n = {n} เกิน {BRUTE_LIMIT} จุด จำนวนวิธีแบ่งโตตาม Catalan number จนไล่ครบไม่ไหว
                    </p>
                )
                : (
                    <ul className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-3">
                        {brute.items.map((it, ix) => {
                            const isBest = Math.abs(it.cost - brute.bestCost) < 1e-9
                            return (
                                <li key={ix} className={cn("flex flex-col gap-1 rounded-lg border bg-card p-2", isBest && "border-viz-tri ring-1 ring-viz-tri")}>
                                    <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="block h-auto w-full" aria-hidden>
                                        <polygon points={proj.pts(range(0, n - 1))} className="fill-none stroke-muted-foreground" strokeWidth={3} />
                                        {it.tris.map(t => (
                                            <polygon
                                                key={t.join("-")}
                                                points={proj.pts(t)}
                                                className={isBest ? "fill-viz-tri/25 stroke-viz-tri" : "fill-viz-range/10 stroke-viz-range"}
                                                strokeWidth={4}
                                            />
                                        ))}
                                    </svg>
                                    <p className={cn("text-center text-sm", isBest ? "font-medium text-viz-tri-text" : "text-muted-foreground")}>
                                        <span className="font-mono tabular-nums">{it.cost.toFixed(4)}</span>
                                        {isBest && " · ต่ำสุด"}
                                    </p>
                                </li>
                            )
                        })}
                    </ul>
                )}
        </section>
    )
}
