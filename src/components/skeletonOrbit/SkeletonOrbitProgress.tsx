import type { CSSProperties } from 'react'

type SkeletonOrbitProgressProps = {
  progress: number
}

export function SkeletonOrbitProgress({ progress }: SkeletonOrbitProgressProps) {
  const style = {
    '--orbit-progress': progress,
  } as CSSProperties

  return (
    <div className="skeleton-orbit-progress" style={style}>
      <span className="skeleton-orbit-progress__label">Progress</span>
      <div className="skeleton-orbit-progress__bar">
        <span style={{ transform: `scaleY(${progress})` }} />
      </div>
    </div>
  )
}
