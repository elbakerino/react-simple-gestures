import React from 'react'
import { SimpleGesturesActions, SimpleGesturesEventHandler, SimpleGesturesEventHandlerMouse, SimpleGesturesEventHandlerTouch, SimpleGesturesInternalState, SimpleGesturesOptions } from 'react-simple-gestures/SimpleGestures'
import { setTouchStart } from 'react-simple-gestures/setTouchStart'
import { estimateGesture } from 'react-simple-gestures/estimateGesture'

export const useSimpleGestures = (
    options: Partial<SimpleGesturesOptions> = {},
): SimpleGesturesActions => {
    const {
        touchGrid = 20,
        touchAsSameTap = 260,
        minMovementY = 10,
        minMovementX = 10,
    } = options
    const gestureRef = React.useRef({
        startX: -1,
        lastX: -1,
        lastStartGridX: -1,
        startY: -1,
        lastY: -1,
        lastStartGridY: -1,
        lastStartTime: -1,
        lastTime: -1,
        lastEndTime: -1,
        countTaps: 0,
        listeners: {
            start: [],
            move: [],
            end: [],
        },
        listenerId: 0,
    } as SimpleGesturesInternalState)

    const onStart: SimpleGesturesEventHandler['onStart'] = React.useCallback((x, y, e) => {
        const {lastEndTime, lastStartTime} = gestureRef.current
        const started = setTouchStart(gestureRef.current, x, y, touchGrid, touchAsSameTap)
        gestureRef.current = started

        if(gestureRef.current.listeners.start.length === 0) {
            return
        }

        const listeners = [...gestureRef.current.listeners.start]
        listeners.forEach(([, listener]) =>
            listener(
                {
                    taps: started.countTaps,
                    startX: x,
                    startY: y,
                    startTime: started.lastStartTime,
                    lastStartTime: lastStartTime,
                    lastEndTime: lastEndTime,
                },
                e,
            ),
        )
    }, [gestureRef, touchGrid, touchAsSameTap])

    const onMove: SimpleGesturesEventHandler['onMove'] = React.useCallback((x, y, e) => {
        if(
            gestureRef.current.lastStartTime < 1 ||
            gestureRef.current.lastStartTime < gestureRef.current.lastEndTime
        ) {
            // do not handle the move event when:
            // - not started previously
            // - not ended after the last start
            return
        }
        const now = Date.now()
        gestureRef.current.lastX = x
        gestureRef.current.lastY = y
        gestureRef.current.lastTime = now
        if(gestureRef.current.listeners.move.length > 0) {
            const listeners = [...gestureRef.current.listeners.move]
            const {lastStartTime, lastX, lastY, startX, startY} = gestureRef.current
            const moveResult = estimateGesture(now, lastStartTime, startX, startY, lastX, lastY, minMovementX, minMovementY)
            listeners.forEach(([, listener]) => listener(moveResult, e))
        }
    }, [gestureRef, minMovementX, minMovementY])

    const onEnd: SimpleGesturesEventHandler['onEnd'] = React.useCallback((e) => {
        if(
            gestureRef.current.lastStartTime < 1 ||
            gestureRef.current.lastStartTime < gestureRef.current.lastEndTime
        ) {
            // do not handle the end event when:
            // - not started previously
            // - not ended after the last start
            return
        }
        const now = Date.now()

        gestureRef.current.lastEndTime = now

        if(gestureRef.current.listeners.end.length > 0) {
            const {lastStartTime, lastX, lastY, startX, startY} = gestureRef.current
            const listeners = [...gestureRef.current.listeners.end]
            const result = estimateGesture(now, lastStartTime, startX, startY, lastX, lastY, minMovementX, minMovementY)
            listeners.forEach(([, listener]) => listener(result, e))
        }
    }, [gestureRef, minMovementY, minMovementX])

    const onTouchStart: SimpleGesturesEventHandlerTouch['onTouchStart'] = React.useCallback(e => {
        const touch = e.touches[0]
        const x = touch?.clientX
        const y = touch?.clientY
        return onStart(x, y, e)
    }, [onStart])

    const onTouchMove: SimpleGesturesEventHandlerTouch['onTouchMove'] = React.useCallback(e => {
        const touch = e.touches[0]
        const x = touch?.clientX
        const y = touch?.clientY
        return onMove(x, y, e)
    }, [onMove])

    const onMouseDown: SimpleGesturesEventHandlerMouse['onMouseDown'] = React.useCallback(e => {
        const x = e.clientX
        const y = e.clientY
        return onStart(x, y, e)
    }, [onStart])

    const onMouseMove: SimpleGesturesEventHandlerMouse['onMouseMove'] = React.useCallback(e => {
        const x = e?.clientX
        const y = e?.clientY
        return onMove(x, y, e)
    }, [onMove])

    const addListener: SimpleGesturesActions['addListener'] = React.useCallback((on, listener) => {
        const nextId = gestureRef.current.listenerId = gestureRef.current.listenerId + 1
        // @ts-ignore
        gestureRef.current.listeners[on].push([nextId, listener])
        return () => {
            const i = gestureRef.current.listeners[on].findIndex(i => i[0] === nextId)
            if(i !== -1) {
                gestureRef.current.listeners[on].splice(i, 1)
            }
        }
    }, [gestureRef])

    return React.useMemo(() => ({
        handler: {
            onTouchStart, onTouchMove,
            onTouchEnd: onEnd,
        },
        handlerMouse: {
            onMouseDown, onMouseMove,
            onMouseUp: onEnd,
            onMouseLeave: onEnd,
        },
        addListener,
    }), [
        onTouchStart, onTouchMove, onEnd,
        onMouseDown, onMouseMove,
        addListener,
    ])
}
