import { CubicBezierCurve3, Vector3 } from 'three'

export type VerticalJourneyCurve = {
  getPoint: (progress: number, target?: Vector3) => Vector3
  getPoints: (divisions?: number) => Vector3[]
  getTangent: (progress: number, target?: Vector3) => Vector3
}

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function getSegmentPosition(progress: number, segmentCount: number) {
  const scaledProgress = clamp01(progress) * segmentCount
  const segmentIndex = Math.min(Math.floor(scaledProgress), segmentCount - 1)
  const localProgress = segmentIndex === segmentCount - 1 ? Math.min(scaledProgress - segmentIndex, 1) : scaledProgress - segmentIndex

  return { localProgress, segmentIndex }
}

function getCurvedControls(start: Vector3, end: Vector3, index: number) {
  const delta = end.clone().sub(start)
  const distance = Math.max(delta.length(), 0.001)
  const direction = delta.clone().normalize()
  const perpendicular = new Vector3(-direction.y, direction.x, 0).normalize()
  const alternatingLean = index % 3 === 0 ? 1 : index % 3 === 1 ? -0.72 : 0.42
  const wideDrift = Math.sin(index * 1.37 + 0.85) * 0.28
  const bow = Math.min(0.88, distance * 0.28) * (alternatingLean + wideDrift)
  const depthBow = Math.sin(index * 1.11) * 0.1

  const firstControl = start
    .clone()
    .add(direction.clone().multiplyScalar(distance * 0.32))
    .add(perpendicular.clone().multiplyScalar(bow))
  const secondControl = end
    .clone()
    .add(direction.clone().multiplyScalar(-distance * 0.36))
    .add(perpendicular.clone().multiplyScalar(-bow * 0.62))

  firstControl.z += depthBow
  secondControl.z -= depthBow * 0.7

  return { firstControl, secondControl }
}

export function buildVerticalJourneyCurve(waypointPoints: Vector3[]): VerticalJourneyCurve {
  const segments = waypointPoints.slice(0, -1).map((point, index) => {
    const nextPoint = waypointPoints[index + 1]
    const { firstControl, secondControl } = getCurvedControls(point, nextPoint, index)

    return new CubicBezierCurve3(point, firstControl, secondControl, nextPoint)
  })
  const segmentCount = Math.max(segments.length, 1)

  return {
    getPoint(progress, target) {
      const { localProgress, segmentIndex } = getSegmentPosition(progress, segmentCount)
      const point = segments[segmentIndex]?.getPoint(localProgress) ?? waypointPoints[0]?.clone() ?? new Vector3()

      if (target) {
        target.copy(point)

        return target
      }

      return point
    },
    getPoints(divisions = 260) {
      const points: Vector3[] = []

      for (let index = 0; index <= divisions; index += 1) {
        points.push(this.getPoint(index / Math.max(divisions, 1)))
      }

      return points
    },
    getTangent(progress, target) {
      const { localProgress, segmentIndex } = getSegmentPosition(progress, segmentCount)
      const tangent = segments[segmentIndex]?.getTangent(localProgress) ?? new Vector3(0, -1, 0)

      if (target) {
        target.copy(tangent)

        return target
      }

      return tangent
    },
  }
}
