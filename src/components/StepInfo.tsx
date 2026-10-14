import type { ReactNode } from "react"
import { fmt } from "@/lib/format"
import type { Step } from "@/lib/triangulation"

type Props = {
    step: Step | undefined // undefined on the final frame
    n: number
    answer: number
}

export function StepInfo({ step, n, answer }: Props) {
    let phase: string
    let eq: ReactNode

    if (!step) {
        phase = "เสร็จแล้ว"
        eq = <>dp[0][{n - 1}] = <b className="text-viz-tri-text">{fmt(answer)}</b></>
    } else {
        const { gap, i, j, k } = step
        const cell = `dp[${i}][${j}]`
        if (step.type === "try") {
            phase = `gap ${gap} · ${cell} (P${i}..P${j}) · ลอง k = ${k}`
            eq = <>
                dp[{i}][{k}] + dp[{k}][{j}] + per({i},{k},{j})
                <br />= {fmt(step.left)} + {fmt(step.right)} + {fmt(step.cost)} = <b>{fmt(step.total)}</b>
            </>
        } else {
            phase = `gap ${gap} · สรุปผล ${cell}`
            eq = <>k ที่ดีที่สุด = {k} → {cell} = <b>{fmt(step.value)}</b></>
        }
    }

    // fixed min height for two lines so the card doesn't jump between "try" and "set" steps
    return (
        <div className="flex min-h-24 flex-col gap-1 rounded-md bg-muted px-3 py-2">
            <p className="text-sm text-muted-foreground">{phase}</p>
            <p className="font-mono text-sm tabular-nums">{eq}</p>
        </div>
    )
}
