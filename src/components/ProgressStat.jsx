import { useEffect, useState } from 'react'

export default function ProgressStat({ count }) {
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

  return (
    <div className="progress-stat">
      <div className="progress-stat__row">
        <span className="progress-stat__count">{display}</span>
        <span className="progress-stat__label">phrases collected so far</span>
      </div>
    </div>
  )
}
