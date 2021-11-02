import React from 'react'
import { SimpleGesturesResult, useSimpleGestures } from 'react-simple-gestures'

export const GestureArea: React.ComponentType<{
    disableScrolling: boolean
    setDisableScrolling: React.Dispatch<React.SetStateAction<boolean>>
}> = (
    {
        disableScrolling,
        setDisableScrolling,
    }
) => {
    const [lastMove, setLastMove] = React.useState<undefined | SimpleGesturesResult>(undefined)
    const [lastEnd, setLastEnd] = React.useState<undefined | SimpleGesturesResult>(undefined)
    const {handler, handlerMouse, addListener} = useSimpleGestures({minMovementX: 25, minMovementY: 25})

    React.useEffect(() => {
        const unsubMove = addListener('move', (evt/*, e*/) => {
            setLastMove(evt)
        })
        const unsubEnv = addListener('end', (evt/*, e*/) => {
            setLastEnd(evt)
        })
        return () => {
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
                boxShadow: 'inset 0 0 6px #181818',
                display: 'flex',
            }}
            {...handler}
            {...handlerMouse}
        >
            <i
                style={{
                    userSelect: 'none',
                    pointerEvents: 'none',
                    margin: 'auto',
                    opacity: 0.5,
                }}
            >Swipe, flick or drag here.</i>
        </div>

        <button
            onClick={() => setDisableScrolling(s => !s)}
            style={{
                background: 'transparent',
                color: 'inherit',
                padding: '6px 8px',
                textAlign: 'center',
                border: '1px solid #fff',
                margin: '6px auto',
                maxWidth: 180,
            }}
        >
            {disableScrolling ? 'Enable ' : 'Disable '}
            Page Scrolling
        </button>

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
        </div>
    </>
}
