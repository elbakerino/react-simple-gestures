import { SimpleGesturesInternalState } from 'react-simple-gestures/SimpleGestures'

export const setTouchStart = (gestureState: SimpleGesturesInternalState, x: number, y: number, touchGrid: number, touchAsSameTap: number): SimpleGesturesInternalState => {
    // todo: the `touch grid` to check the same area of to count taps,
    //       should be normalized by the first touch point, not the page,
    //       resulting in a more correct "same spot" detection
    const gridX = Number((x / touchGrid).toFixed(0))
    const gridY = Number((y / touchGrid).toFixed(0))
    const {lastStartTime, lastStartGridX, lastStartGridY} = gestureState
    const now = Date.now()
    if(
        (now - lastStartTime) < touchAsSameTap &&
        gridX === lastStartGridX && gridY === lastStartGridY
    ) {
        gestureState.countTaps = gestureState.countTaps + 1
    } else {
        gestureState.countTaps = 1
    }
    gestureState.lastStartTime = now
    gestureState.lastStartGridX = gridX
    gestureState.lastStartGridY = gridY
    gestureState.startX = x
    gestureState.startY = y
    gestureState.lastX = x
    gestureState.lastY = y
    return gestureState
}
