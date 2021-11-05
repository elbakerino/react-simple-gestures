import React from 'react'
import { SimpleGesturesResult, useSimpleGestures } from 'react-simple-gestures'

export const GestureArea: React.ComponentType<{
    scrollWrapper: React.MutableRefObject<HTMLDivElement | null>
}> = (
    {
        scrollWrapper,
    },
) => {

    // states only for this demo:
    const [startPoint, setStartPoint] = React.useState({
        taps: 0,
        ol: 0,
        ot: 0,
        oh: 0,
        ow: 0,
        startTime: 0,
        startX: -1,
        startY: -1,
    })
    const lastDir = React.useRef<undefined | string>(undefined)
    const [lastMove, setLastMove] = React.useState<undefined | SimpleGesturesResult>(undefined)
    const [lastEnd, setLastEnd] = React.useState<undefined | SimpleGesturesResult>(undefined)
    const [logEvents, setLogEvents] = React.useState<boolean>(false)
    // <<

    // setup of SimpleGestures with safe-to-use functions, also `getState` has a safe reference,
    // e.g. does not re-render/re-create event handlers when updated
    const minMovementY = 25
    const minMovementX = 25
    const {
        handler, handlerMouse,
        addListener,
        getState,
    } = useSimpleGestures({
        minMovementX: minMovementX,
        minMovementY: minMovementY,
    })

    React.useEffect(() => {
        const unsubStart = addListener('start', (evt, e) => {
            if(logEvents) {
                e.persist()
                console.log('start', evt, e)
            }
            // @ts-ignore
            const oh = e.target.offsetHeight
            // @ts-ignore
            const ow = e.target.offsetWidth
            // @ts-ignore
            const bcr = e.target.getBoundingClientRect()
            // @ts-ignore
            const ot = bcr.y
            // @ts-ignore
            const ol = bcr.x
            setLastMove(undefined)
            setLastEnd(undefined)
            setStartPoint({
                taps: evt.taps,
                ol: ol,
                ot: ot,
                oh: oh,
                ow: ow,
                startTime: evt.startTime,
                startX: evt.startX,
                startY: evt.startY,
            })
        })
        const unsubMove = addListener('move', (evt, e) => {
            if(logEvents) {
                e.persist()
                console.log('move', evt, e)
            }
            lastDir.current = evt.dir
            setLastMove(evt)
        })
        const unsubEnv = addListener('end', (evt, e) => {
            if(logEvents) {
                e.persist()
                console.log('end', evt, e)
            }
            lastDir.current = evt.dir
            setLastEnd(evt)
        })

        // don't forget to unsubscribe it at the end
        return () => {
            unsubStart()
            unsubMove()
            unsubEnv()
        }
    }, [addListener, setLastEnd, setLastMove, logEvents])

    React.useEffect(() => {
        // used for this demo,
        // prevents scrolling when already started something
        const evt = (e: Event) => {
            const {
                lastStartTime, lastEndTime,
            } = getState()

            if(
                lastStartTime !== -1 &&
                lastEndTime < lastStartTime
            ) {
                e.preventDefault()
                e.stopPropagation()
            }
        }
        const evtTouch = (e: Event) => {
            const {
                lastStartTime, lastEndTime,
            } = getState()


            if(
                lastStartTime !== -1 &&
                lastEndTime < lastStartTime &&
                lastDir.current &&
                lastDir.current !== 'point' &&
                lastDir.current !== 'up' &&
                lastDir.current !== 'down'
            ) {
                e.preventDefault()
                e.stopPropagation()
            }
        }
        scrollWrapper.current?.addEventListener('wheel', evt)
        scrollWrapper.current?.addEventListener('keydown', evt)
        scrollWrapper.current?.addEventListener('touchmove', evtTouch)
        return () => {
            scrollWrapper.current?.removeEventListener('wheel', evt)
            scrollWrapper.current?.removeEventListener('touchmove', evtTouch)
            scrollWrapper.current?.removeEventListener('keydown', evt)
        }
    }, [scrollWrapper, getState, lastDir])

    return <>
        <div
            style={{
                margin: 'auto',
                width: '75%',
                height: '50%',
                minWidth: 300,
                minHeight: 420,
                background: '#020a0b',
                userSelect: 'none',
                boxShadow: 'inset 0 0 12px 3px #081717',
                display: 'flex',
                position: 'relative',
            }}
            {...handler}
            {...handlerMouse}
        >
            <svg style={{
                position: 'absolute', top: 0, right: 0, left: 0, bottom: 0,
                width: '100%', height: '100%',
                userSelect: 'none',
                pointerEvents: 'none',
            }}>
                {startPoint.startX > 0 && startPoint.startY > 0 ? <>
                    {/* X-Axis */}
                    <path
                        d={`M ${startPoint.startX - startPoint.ol - minMovementX} 0 L ${startPoint.startX - startPoint.ol - minMovementX} ${startPoint.oh}`}
                        fill="none" stroke={'#2a6b50'} strokeWidth="2"
                    />
                    <path
                        d={`M ${startPoint.startX - startPoint.ol + minMovementX} 0 L ${startPoint.startX - startPoint.ol + minMovementX} ${startPoint.oh}`}
                        fill="none" stroke={'#2a6b50'} strokeWidth="2"
                    />
                    {/* Y-Axis */}
                    <path
                        d={`M 0 ${startPoint.startY - startPoint.ot - minMovementY} L ${startPoint.ow} ${startPoint.startY - startPoint.ot - minMovementY}`}
                        fill="none" stroke={'#25558d'} strokeWidth="2"
                    />
                    <path
                        d={`M 0 ${startPoint.startY - startPoint.ot + minMovementY} L ${startPoint.ow} ${startPoint.startY - startPoint.ot + minMovementY}`}
                        fill="none" stroke={'#25558d'} strokeWidth="2"
                    />
                    {/* Start */}
                    <circle
                        className="spot"
                        cx={startPoint.startX - startPoint.ol}
                        cy={startPoint.startY - startPoint.ot} r="10"
                        fill={'#ffffff'}/>
                </> : null}

                {/* Connection Line */}
                {lastMove && startPoint.startX > 0 && startPoint.startY > 0 ?
                    <path
                        d={`M ${startPoint.startX - startPoint.ol} ${startPoint.startY - startPoint.ot} L ${lastMove.lastX - startPoint.ol} ${lastMove.lastY - startPoint.ot}`}
                        fill="none"
                        style={{transition: '50ms ease-in-out stroke'}}
                        stroke={
                            lastMove.duration < 100 ? '#ff0000' :
                                lastMove.duration < 250 ? '#be0000' :
                                    lastMove.duration < 500 ? '#720000' :
                                        lastMove.duration < 750 ? '#983000' :
                                            lastMove.duration < 1000 ? '#8f4701' :
                                                lastMove.duration < 1200 ? '#be7c00' :
                                                    lastMove.duration < 1500 ? '#7015c5' :
                                                        lastMove.duration < 2000 ? '#fc6fd0' :
                                                            '#ffffff'
                        }
                        strokeWidth="2"
                    /> : null}

                {/* End Dot */}
                {lastEnd && startPoint ?
                    <circle
                        className="spot"
                        cx={lastEnd.lastX - startPoint.ol}
                        cy={lastEnd.lastY - startPoint.ot} r="10"
                        fill={'#676767'}/>
                    : null}
                <text
                    style={{
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        fontFamily: 'Monaco, Consolas, monospace',
                        textAlign: 'center',
                    }}
                    fill={'#3bf6ff'}
                    x={startPoint.startX - startPoint.ol}
                    y={startPoint.startY - startPoint.ot + 25}
                >{lastMove?.dir || lastEnd?.dir}</text>
                <text
                    style={{
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        fontFamily: 'Monaco, Consolas, monospace',
                    }}
                    fill={'#104246'}
                    x={'50%'}
                    y={'90%'}
                    textAnchor={'middle'}
                >
                    Taps: {startPoint.taps}
                    {' | '}
                    Touches: {lastEnd?.touches || lastMove?.touches || 0}
                </text>
            </svg>
            <i
                style={{
                    userSelect: 'none',
                    pointerEvents: 'none',
                    margin: 'auto',
                    transition: '0.35s ease-in opacity',
                    opacity: startPoint?.startTime ? 0 : 0.35,
                }}
            >Swipe, flick or drag here.</i>
        </div>

        <div
            style={{
                margin: '12px auto auto auto',
                display: 'flex',
                flexWrap: 'wrap',
                overflow: 'auto',
                flexShrink: 0,
                maxWidth: 600,
            }}
        >
            <p style={{fontSize: '0.85rem', margin: '12px'}}>
                Configurable minimum movements for direction detection,<br/>
                green = x-axis, blue = y-axis.
            </p>
        </div>
        <div
            style={{
                margin: '12px auto auto auto',
                display: 'flex',
                flexWrap: 'wrap',
                overflow: 'auto',
                flexShrink: 0,
                maxWidth: 600,
            }}
        >
            <div style={{margin: 'auto auto 12px auto', minWidth: 300}}>
                <h2 style={{margin: '3px 0 6px 0', fontSize: '1.25rem'}}>Last Move</h2>
                <table style={{borderCollapse: 'collapse'}}>
                    <tbody>
                        <tr>
                            <td style={{padding: '3px 5px 3px 0'}}>Direction</td>
                            <td><code style={{whiteSpace: 'pre'}}>{lastMove?.dir}</code></td>
                        </tr>
                        <tr>
                            <td style={{padding: '3px 5px 3px 0'}}>movedX</td>
                            <td><code>{lastMove?.movedX}</code></td>
                        </tr>
                        <tr>
                            <td style={{padding: '3px 5px 3px 0'}}>movedY</td>
                            <td><code>{lastMove?.movedY}</code></td>
                        </tr>
                        <tr>
                            <td style={{padding: '3px 5px 3px 0'}}>mPxPerMsX</td>
                            <td><code>{lastMove?.mPxPerMsX}</code></td>
                        </tr>
                        <tr>
                            <td style={{padding: '3px 5px 3px 0'}}>mPxPerMsY</td>
                            <td><code>{lastMove?.mPxPerMsY}</code></td>
                        </tr>
                        <tr>
                            <td style={{padding: '3px 5px 3px 0'}}>Duration</td>
                            <td><code>{lastMove?.duration}ms</code></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={{margin: 'auto auto 12px auto', minWidth: 300}}>
                <h2 style={{margin: '3px 0 6px 0', fontSize: '1.25rem'}}>Last End</h2>
                <table style={{borderCollapse: 'collapse'}}>
                    <tbody>
                        <tr>
                            <td style={{padding: '3px 5px 3px 0'}}>Direction</td>
                            <td><code style={{whiteSpace: 'pre'}}>{lastEnd?.dir}</code></td>
                        </tr>
                        <tr>
                            <td style={{padding: '3px 5px 3px 0'}}>movedX</td>
                            <td><code>{lastEnd?.movedX}</code></td>
                        </tr>
                        <tr>
                            <td style={{padding: '3px 5px 3px 0'}}>movedY</td>
                            <td><code>{lastEnd?.movedY}</code></td>
                        </tr>
                        <tr>
                            <td style={{padding: '3px 5px 3px 0'}}>mPxPerMsX</td>
                            <td><code>{lastEnd?.mPxPerMsX}</code></td>
                        </tr>
                        <tr>
                            <td style={{padding: '3px 5px 3px 0'}}>mPxPerMsY</td>
                            <td><code>{lastEnd?.mPxPerMsY}</code></td>
                        </tr>
                        <tr>
                            <td style={{padding: '3px 5px 3px 0'}}>Duration</td>
                            <td><code>{lastEnd?.duration}ms</code></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <button
            onClick={() => setLogEvents(l => !l)}
            style={{
                background: 'transparent',
                border: '1px solid #fff',
                color: '#ffffff',
                padding: '4px 6px',
                width: 175,
                margin: '6px auto',
            }}
        >{logEvents ? 'Turn off logging events' : 'Log events in dev console'}</button>
    </>
}
