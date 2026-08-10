import { useEffect, useState } from 'react'

export default function ProgressStat({ count, milestone = 200 }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (count == null) return
    let frame
    const duration = 800
    const start = performance.now()

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * count))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [count])

  if (count == null) return null

  const pct = Math.min((count / milestone) * 100, 100)

  return (
    <div className="progress-stat">
      <div className="progress-stat__row">
        <span className="progress-stat__count">{display}</span>
        <span className="progress-stat__label">phrases collected so far</span>
      </div>
      <div className="progress-stat__bar">
        <div className="progress-stat__bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="progress-stat__milestone">
        {count >= milestone
          ? `Past our first goal of ${milestone} — thank you.`
          : `${milestone - count} more to reach our first goal of ${milestone}`}
      </p>
    </div>
  )
}
