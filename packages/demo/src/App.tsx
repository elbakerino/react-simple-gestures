import React from 'react'
import { GestureArea } from './GestureArea'

export const App: React.ComponentType<{}> = () => {
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        //background: '#020a0b',
        background: '#121313',
        color: '#ffffff',
        overflow: 'auto',
    }}>
        <div style={{margin: '12px auto'}}>
            <h1 style={{fontWeight: 300, fontSize: '2rem', marginBottom: 8}}>Simple Gestures</h1>
            <p style={{
                fontWeight: 300, fontSize: '1.125rem',
                marginTop: 0,
                display: 'flex',
            }}>
                as React Hook
                <a
                    href={'https://github.com/elbakerino/react-simple-gestures'}
                    style={{
                        fontWeight: 300, fontSize: '1.125rem',
                        marginTop: 0,
                        marginLeft: 'auto',
                    }}
                >GitHub</a>
            </p>
        </div>

        <GestureArea/>

        <div style={{margin: 'auto auto 8px auto'}}>
            <p>by <a href={'https://mlbr.xyz'}>Michael Becker</a></p>
        </div>
    </div>
}
