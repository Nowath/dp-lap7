import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { fmt } from "@/lib/format"
import type { Solution } from "@/lib/solve"
import type { Step } from "@/lib/triangulation"

const cellVariants = cva("rounded-sm px-1.5 py-1 text-center font-mono text-xs tabular-nums", {
    variants: {
        state: {
            unused: "text-muted-foreground/50",       // j < i
            empty: "bg-muted",                        // not filled yet
            done: "bg-muted text-foreground",
            current: "bg-accent font-medium text-accent-foreground ring-1 ring-primary",
            answer: "bg-viz-tri/15 font-medium text-viz-tri-text ring-1 ring-viz-tri",
        },
        // one of the two smaller dp cells this "try" adds together
        source: { true: "ring-1 ring-viz-tri" },
    },
})

type Props = {
    sol: Solution
    idx: number
    step: Step | undefined // undefined on the final frame
}

export function DpTable({ sol, idx, step }: Props) {
    const { n, setAt, dp } = sol
    const final = !step
    const cols = Array.from({ length: n }, (_, j) => j)

    const cell = (i: number, j: number) => {
        if (j < i) return <td key={j} className={cellVariants({ state: "unused" })}>–</td>

        const filled = j - i < 2 || final || setAt[i][j] < idx
        let state: "empty" | "done" | "current" | "answer" = filled ? "done" : "empty"
        let text = filled ? fmt(dp[i][j]) : ""

        if (step && i === step.i && j === step.j) {
            state = "current"
            text = step.type === "set" ? fmt(step.value) : "?"
        } else if (final && i === 0 && j === n - 1) {
            state = "answer"
        }
        const source = step?.type === "try" && ((i === step.i && j === step.k) || (i === step.k && j === step.j))

        return <td key={j} className={cellVariants({ state, source })}>{text}</td>
    }

    const head = "px-1.5 py-1 text-center font-mono text-xs font-medium text-muted-foreground"

    // wide tables scroll inside their own box instead of pushing the page sideways
    return (
        <div className="-mx-4 overflow-x-auto px-4">
            <table className="w-full min-w-max border-separate border-spacing-1">
                <thead>
                    <tr>
                        <th className={head} scope="col"><span className="sr-only">แถว i, คอลัมน์ j</span>i\j</th>
                        {cols.map(j => <th key={j} className={head} scope="col">{j}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {cols.map(i => (
                        <tr key={i}>
                            <th className={cn(head, "text-left")} scope="row">{i}</th>
                            {cols.map(j => cell(i, j))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
