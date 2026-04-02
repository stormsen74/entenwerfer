import { useEffect, useMemo } from 'react'
import diskImg from '../../assets/disk.png'
import { FrisbeeDisc, FrisbeeLayer } from './styles.js'

export const FRISBEE_CONFIG = {
  count: 7, // number of disks
  minSize: 90, // px
  maxSize: 230, // px
  totalDuration: 1500, // ms before teams are revealed
  minFlightMs: 650, // individual disk animation min duration
  maxFlightMs: 800, // individual disk animation max duration
  maxDelay: 500, // max random start delay per disk (ms)
  maxYOffset: 750, // max vertical drift from entry Y to exit Y (px)
}

function generateDiskConfigs(cfg) {
  const w = window.innerWidth
  const h = window.innerHeight
  const { count, minSize, maxSize, minFlightMs, maxFlightMs, maxDelay, maxYOffset } = cfg

  // guaranteed ~50/50 left/right split
  const sides = Array.from({ length: count }, (_, i) => i < Math.ceil(count / 2))
  for (let i = sides.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[sides[i], sides[j]] = [sides[j], sides[i]]
  }

  return Array.from({ length: count }, (_, i) => {
    const size = Math.round(minSize + Math.random() * (maxSize - minSize))
    const fromLeft = sides[i]

    const fromY = Math.round(Math.random() * h)
    const yOffset = Math.round((Math.random() * 2 - 1) * maxYOffset)

    const fromX = fromLeft ? -size : w + size
    const toX = fromLeft ? w + size : -size
    const toY = fromY + yOffset

    const rotDeg = (180 + Math.random() * 540) * (fromLeft ? 1 : -1)

    return {
      size,
      fromX,
      fromY,
      toX,
      toY,
      rotation: `${Math.round(rotDeg)}deg`,
      duration: Math.round(minFlightMs + Math.random() * (maxFlightMs - minFlightMs)),
      delay: Math.round(Math.random() * maxDelay),
    }
  })
}

export function FrisbeeOverlay({ onDone, config = FRISBEE_CONFIG }) {
  const disks = useMemo(() => generateDiskConfigs(config), [config])

  useEffect(() => {
    const t = setTimeout(onDone, config.totalDuration)
    return () => clearTimeout(t)
  }, [onDone, config.totalDuration])

  return (
    <FrisbeeLayer>
      {disks.map((d, i) => (
        <FrisbeeDisc
          key={i}
          src={diskImg}
          alt=''
          style={{
            '--size': `${d.size}px`,
            '--from-x': `${d.fromX}px`,
            '--from-y': `${d.fromY}px`,
            '--to-x': `${d.toX}px`,
            '--to-y': `${d.toY}px`,
            '--rotation': d.rotation,
            '--duration': `${d.duration}ms`,
            '--delay': `${d.delay}ms`,
          }}
        />
      ))}
    </FrisbeeLayer>
  )
}
