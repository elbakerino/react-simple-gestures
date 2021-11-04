import React from 'react'
import { SimpleGesturesResult, useSimpleGestures } from 'react-simple-gestures'

export const GestureArea: React.ComponentType<{}> = () => {
    const [startPoint, setStartPoint] = React.useState({
        ol: 0,
        ot: 0,
        oh: 0,
        ow: 0,
        startTime: 0,
        startX: -1,
        startY: -1,
    })
    const [lastMove, setLastMove] = React.useState<undefined | SimpleGesturesResult>(undefined)
    const [lastEnd, setLastEnd] = React.useState<undefined | SimpleGesturesResult>(undefined)
    const minMovementY = 25
    const minMovementX = 25
    const {handler, handlerMouse, addListener} = useSimpleGestures({
        minMovementX: minMovementX,
        minMovementY: minMovementY,
    })

    React.useEffect(() => {
        const unsubStart = addListener('start', (evt, e) => {
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
                ol: ol,
                ot: ot,
                oh: oh,
                ow: ow,
                startTime: evt.startTime,
                startX: evt.startX,
                startY: evt.startY,
            })
        })
        const unsubMove = addListener('move', (evt/*, e*/) => {
            setLastMove(evt)
        })
        const unsubEnv = addListener('end', (evt/*, e*/) => {
            setLastEnd(evt)
        })
        return () => {
            unsubStart()
            unsubMove()
            unsubEnv()
        }
    }, [addListener, setLastEnd, setLastMove])

    return <>
        <div
            style={{
                margin: 'auto',
                width: '50%',
                height: '50%',
                minWidth: 300,
                minHeight: 300,
                background: '#000000',
                userSelect: 'none',
                boxShadow: 'inset 0 0 12px 2px #121313',
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
                {lastMove && startPoint.startX > 0 && startPoint.startY > 0 ?
                    <path
                        d={`M ${startPoint.startX - startPoint.ol} ${startPoint.startY - startPoint.ot} L ${lastMove.lastX - startPoint.ol} ${lastMove.lastY - startPoint.ot}`}
                        fill="none" stroke="white" strokeWidth="2"
                    /> : null}
                {lastEnd && startPoint ?
                    <circle
                        className="spot"
                        cx={lastEnd.lastX - startPoint.ol}
                        cy={lastEnd.lastY - startPoint.ot} r="10"
                        fill={'#676767'}/>
                    : null}
            </svg>
            <i
                style={{
                    userSelect: 'none',
                    pointerEvents: 'none',
                    margin: 'auto',
                    opacity: 0.5,
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
            <p style={{fontSize: '0.85rem', margin: '12px 0'}}>
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
    </>
}
