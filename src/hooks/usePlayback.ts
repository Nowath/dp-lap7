import { useEffect, useState } from "react"

// step through frames 0..last on a timer; frame `last` is the final "done" frame
export function usePlayback(last: number, initialDelay: number) {
    const [idx, setIdx] = useState(0)
    const [wantPlay, setPlaying] = useState(true)
    const playing = wantPlay && idx < last // stops by itself on the last frame
    const [delay, setDelay] = useState(initialDelay)

    useEffect(() => {
        if (!playing) return
        const timer = setInterval(() => setIdx(i => Math.min(last, i + 1)), delay)
        return () => clearInterval(timer)
    }, [playing, delay, last])

    const pauseAnd = (next: (i: number) => number) => {
        setPlaying(false)
        setIdx(i => Math.min(last, Math.max(0, next(i))))
    }

    return {
        idx,
        playing,
        delay,
        setDelay,
        togglePlay: () => {
            // pressing play on the last frame starts over
            if (!playing && idx === last) setIdx(0)
            setPlaying(!playing)
        },
        next: () => pauseAnd(i => i + 1),
        prev: () => pauseAnd(i => i - 1),
        toEnd: () => pauseAnd(() => last),
    }
}
