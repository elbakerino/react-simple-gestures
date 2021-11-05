import React from 'react'
import {
    SimpleGesturesEventHandler,
    SimpleGesturesEventHandlerMouse,
    SimpleGesturesEventHandlerTouch,
    SimpleGesturesInternalState,
    SimpleGesturesOptions,
    addSimpleGesturesListener, SimpleGesturesGetOffsetCoordinates,
} from 'react-simple-gestures/SimpleGestures'
import { setTouchStart } from 'react-simple-gestures/setTouchStart'
import { estimateGesture } from 'react-simple-gestures/estimateGesture'

export interface UseSimpleGestures {
    handler: SimpleGesturesEventHandlerTouch
    handlerMouse: SimpleGesturesEventHandlerMouse
    addListener: addSimpleGesturesListener
    getState: () => SimpleGesturesInternalState
}

export const useSimpleGestures = (
    {
        touchGrid = 20,
        touchAsSameTap = 260,
        minMovementY = 10,
        minMovementX = 10,
        noMultiTouch = false,
        getOffset,
    }: Partial<SimpleGesturesOptions> = {},
): UseSimpleGestures => {
    const gestureRef = React.useRef({
        touches: 0,
        lastEvent: undefined,
        startX: -1,
        lastX: -1,
        startY: -1,
        startOffsetX: 0,
        startOffsetY: 0,
        lastY: -1,
        lastStartGridX: -1,
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
        const {
            lastEndTime, lastStartTime,
            touches,
            lastEvent,
            lastX, lastY,
        } = gestureRef.current
        const now = Date.now()
        gestureRef.current.lastEvent = e.type as SimpleGesturesInternalState['lastEvent']
        // each `touchstart` seems to fire also a `mousedown` event
        // when a touch has happened but no move was registered,
        // prevent mousedown events, to not count the touchstart double
        // when no "touchmove" has happened after an `touchstart`, it will bubble further on to the mouse events:
        // 1) touchstart 2) touchmove 3) touchend 4) mousemove 5) mousedown 6) mouseup 7) click
        // this condition also prevents the respective `end` calls, as those check if something was started previously
        if(
            lastEvent === 'touchend' &&
            e.type === 'mousedown' &&
            // when the touchend was just before max. 600ms
            (now - lastStartTime) < 600 &&
            // when the last touch point is the same as started now
            lastX === x &&
            lastY === y
            // "has not moved in last event" is already promised by the browser, as then no mousedown would be triggered
        ) {
            return
        }
        const started = setTouchStart(gestureRef.current, now, x, y, touchGrid, touchAsSameTap)
        const {countTaps} = started
        gestureRef.current = started
        const o = getOffset ? getOffset(e) : undefined
        gestureRef.current.startOffsetX = o?.x || 0
        gestureRef.current.startOffsetY = o?.y || 0

        if(gestureRef.current.listeners.start.length === 0) {
            return
        }

        const listeners = [...gestureRef.current.listeners.start]
        listeners.forEach(([, listener]) =>
            listener(
                {
                    taps: countTaps,
                    touches: touches,
                    startX: x,
                    startY: y,
                    startTime: now,
                    lastStartTime: lastStartTime,
                    lastEndTime: lastEndTime,
                },
                e,
            ),
        )
    }, [getOffset, gestureRef, touchGrid, touchAsSameTap])

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
        gestureRef.current.lastEvent = e.type as SimpleGesturesInternalState['lastEvent']
        gestureRef.current.lastX = x
        gestureRef.current.lastY = y
        gestureRef.current.lastTime = now
        if(gestureRef.current.listeners.move.length > 0) {
            const listeners = [...gestureRef.current.listeners.move]
            const {lastStartTime, lastX, lastY, startX, startY, touches} = gestureRef.current
            const o: SimpleGesturesGetOffsetCoordinates | undefined = getOffset ? getOffset(e) : undefined
            if(o && typeof o.x !== 'undefined' && typeof o.y !== 'undefined') {
                o.x = o.x - gestureRef.current.startOffsetX
                o.y = o.y - gestureRef.current.startOffsetY
            }
            const moveResult = estimateGesture(
                now, lastStartTime,
                startX, startY,
                lastX, lastY,
                o?.x || 0, o?.y || 0,
                touches,
                minMovementX, minMovementY,
            )
            listeners.forEach(([, listener]) => listener(moveResult, e))
        }
    }, [getOffset, gestureRef, minMovementX, minMovementY])

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

        gestureRef.current.lastEvent = e.type as SimpleGesturesInternalState['lastEvent']
        gestureRef.current.lastEndTime = now

        if(gestureRef.current.listeners.end.length > 0) {
            const {lastStartTime, lastX, lastY, startX, startY, touches} = gestureRef.current
            const o: SimpleGesturesGetOffsetCoordinates | undefined = getOffset ? getOffset(e) : undefined
            if(o && typeof o.x !== 'undefined' && typeof o.y !== 'undefined') {
                o.x = o.x - gestureRef.current.startOffsetX
                o.y = o.y - gestureRef.current.startOffsetY
            }
            const listeners = [...gestureRef.current.listeners.end]
            const result = estimateGesture(
                now, lastStartTime,
                startX, startY,
                lastX, lastY,
                o?.x || 0, o?.y || 0,
                touches,
                minMovementX, minMovementY,
            )
            listeners.forEach(([, listener]) => listener(result, e))
        }
    }, [getOffset, gestureRef, minMovementY, minMovementX])

    const onTouchStart: SimpleGesturesEventHandlerTouch['onTouchStart'] = React.useCallback(e => {
        ++gestureRef.current.touches
        if(noMultiTouch && gestureRef.current.touches > 1) return
        // todo: how to handle "not updating something when changing from single to multi touch"
        //       could lead to blocked UIs because something might have set a marker, thinking the user still drags something

        const touch = e.touches[0]
        const x = touch?.clientX
        const y = touch?.clientY
        onStart(x, y, e)
    }, [gestureRef, onStart, noMultiTouch])

    const onTouchMove: SimpleGesturesEventHandlerTouch['onTouchMove'] = React.useCallback(e => {
        if(noMultiTouch && gestureRef.current.touches > 1) return

        const touch = e.touches[0]
        const x = touch?.clientX
        const y = touch?.clientY
        onMove(x, y, e)
    }, [gestureRef, onMove, noMultiTouch])

    const onTouchEnd: SimpleGesturesEventHandlerTouch['onTouchEnd'] = React.useCallback((e) => {
        const {touches} = gestureRef.current
        --gestureRef.current.touches

        if(noMultiTouch && touches > 1) return

        onEnd(e)
    }, [gestureRef, onEnd, noMultiTouch])

    const onMouseDown: SimpleGesturesEventHandlerMouse['onMouseDown'] = React.useCallback(e => {
        const x = e.clientX
        const y = e.clientY
        onStart(x, y, e)
    }, [onStart])

    const onMouseMove: SimpleGesturesEventHandlerMouse['onMouseMove'] = React.useCallback(e => {
        const x = e?.clientX
        const y = e?.clientY
        onMove(x, y, e)
    }, [onMove])

    const addListener: UseSimpleGestures['addListener'] = React.useCallback((on, listener) => {
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

    const handler = React.useMemo(() => ({
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    }), [
        onTouchStart, onTouchMove, onTouchEnd,
    ])

    const handlerMouse = React.useMemo(() => ({
        onMouseDown,
        onMouseMove,
        onMouseUp: onEnd,
        onMouseLeave: onEnd,
    }), [
        onMouseDown, onMouseMove,
        onEnd,
    ])

    const getState = React.useCallback(() => ({...gestureRef.current}), [gestureRef])

    return {
        handler,
        handlerMouse,
        addListener,
        getState,
    }
}
