import { CircleAlert } from "lucide-react"
import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { PRESETS } from "@/config"
import { parseInput, type Point } from "@/lib/triangulation"

type Props = {
    initial: string
    onSubmit: (points: Point[]) => void
}

// replaces the command-line argument of index.ts: paste points (or pick a preset), then run
export function PointsForm({ initial, onSubmit }: Props) {
    const [text, setText] = useState(initial)
    const [error, setError] = useState("")
    const count = parseInput(text).length // regex over a few KB, cheap enough to run on every keystroke
    const activePreset = PRESETS.find(p => p.input === text)?.label

    const run = (input: string) => {
        const points = parseInput(input)
        if (points.length < 3) {
            setError(`ต้องมีอย่างน้อย 3 จุด เช่น {0, 0}, {1, 0}, {2, 1} (ตอนนี้อ่านได้ ${points.length} จุด)`)
            return
        }
        setError("")
        onSubmit(points)
    }

    const submit = (e: FormEvent) => {
        e.preventDefault()
        run(text)
    }

    const pickPreset = (label: string | undefined) => {
        // clicking the active preset again unselects it in the group, so fall back to re-running it
        const preset = PRESETS.find(p => p.label === (label ?? activePreset))
        if (!preset) return
        setText(preset.input)
        run(preset.input)
    }

    return (
        <Card>
            <CardContent>
                <form className="flex flex-col gap-4" onSubmit={submit}>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                        <span className="text-sm text-muted-foreground">ชุดข้อมูลตัวอย่าง</span>
                        <ToggleGroup
                            variant="outline"
                            className="flex-wrap"
                            value={activePreset ? [activePreset] : []}
                            onValueChange={v => pickPreset(v[0])}
                        >
                            {PRESETS.map(p => (
                                <ToggleGroupItem
                                    key={p.label}
                                    value={p.label}
                                    className="h-11 px-3 text-sm aria-pressed:border-primary/40 aria-pressed:bg-accent aria-pressed:text-accent-foreground sm:h-9"
                                >
                                    {p.label}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                            <Label htmlFor="points">พิกัดจุด</Label>
                            <span className="font-mono text-xs text-muted-foreground">
                                {"{0, 0}, {1, 0}, …"} หรือ {"[[0, 0], [1, 0], …]"}
                            </span>
                        </div>
                        <Textarea
                            id="points"
                            rows={3}
                            value={text}
                            onChange={e => setText(e.target.value)}
                            spellCheck={false}
                            aria-invalid={!!error}
                            aria-describedby="points-status"
                            className="max-h-40 font-mono text-sm"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button type="submit" size="lg" className="h-11 px-5 sm:h-9">คำนวณ</Button>
                        <p id="points-status" role="status" className="text-sm text-muted-foreground">
                            {error
                                ? <span className="inline-flex items-center gap-1.5 text-destructive"><CircleAlert className="size-4 shrink-0" />{error}</span>
                                : `อ่านได้ ${count} จุด`}
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
