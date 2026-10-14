import { ChevronLeft, ChevronRight, Pause, Play, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { usePlayback } from "@/hooks/usePlayback"
import { cn } from "@/lib/utils"

type Props = {
    playback: ReturnType<typeof usePlayback>
    total: number
}

// h-11 on touch screens (44px target), back to the default compact size from sm up
const tap = "h-11 sm:h-9"

export function Controls({ playback, total }: Props) {
    const { idx, playing, delay, setDelay, togglePlay, prev, next, toEnd } = playback

    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border bg-card p-3">
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="lg" className={tap} onClick={prev} disabled={idx === 0}>
                    <ChevronLeft data-icon="inline-start" />ก่อนหน้า
                </Button>
                <Button size="lg" className={cn(tap, "min-w-24")} onClick={togglePlay}>
                    {playing ? <><Pause data-icon="inline-start" />หยุด</> : <><Play data-icon="inline-start" />เล่น</>}
                </Button>
                <Button variant="outline" size="lg" className={tap} onClick={next} disabled={idx === total - 1}>
                    ถัดไป<ChevronRight data-icon="inline-end" />
                </Button>
                <Button variant="ghost" size="lg" className={tap} onClick={toEnd} disabled={idx === total - 1}>
                    <SkipForward data-icon="inline-start" />ข้ามไปผลลัพธ์
                </Button>
            </div>

            <div className="flex min-w-56 flex-1 items-center gap-3">
                <span id="delay-label" className="text-sm whitespace-nowrap text-muted-foreground">ความหน่วง</span>
                <Slider
                    aria-labelledby="delay-label"
                    min={200}
                    max={3000}
                    step={100}
                    value={delay}
                    onValueChange={v => setDelay(v as number)}
                    className="flex-1"
                />
                <span className="w-16 text-right font-mono text-xs text-muted-foreground tabular-nums">{delay} ms</span>
            </div>

            <span className="font-mono text-sm tabular-nums" aria-live="polite">
                {idx + 1} <span className="text-muted-foreground">/ {total}</span>
            </span>
        </div>
    )
}
