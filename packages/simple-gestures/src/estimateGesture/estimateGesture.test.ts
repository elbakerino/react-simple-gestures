import { estimateGesture } from './estimateGesture'

describe('estimateGesture', () => {
    it('dir-point', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 500
        const lastY = 500
        const lastStartTime = now - 100
        const minMovementX = 0
        const minMovementY = 0
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('point')
        expect(res.dirY).toBe('same')
        expect(res.dirX).toBe('same')
        expect(res.posMovedX).toBe(0)
        expect(res.posMovedY).toBe(0)
        expect(res.movedX).toBe(0)
        expect(res.movedY).toBe(0)
    })
    it('dir-up', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 500
        const lastY = 495
        const lastStartTime = now - 100
        const minMovementX = 0
        const minMovementY = 0
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('up')
        expect(res.dirY).toBe('up')
        expect(res.dirX).toBe('same')
        expect(res.posMovedX).toBe(0)
        expect(res.posMovedY).toBe(5)
        expect(res.movedX).toBe(0)
        expect(res.movedY).toBe(-5)
    })
    it('dir-down', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 500
        const lastY = 505
        const lastStartTime = now - 100
        const minMovementX = 0
        const minMovementY = 0
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('down')
        expect(res.dirY).toBe('down')
        expect(res.dirX).toBe('same')
        expect(res.posMovedX).toBe(0)
        expect(res.posMovedY).toBe(5)
        expect(res.movedX).toBe(0)
        expect(res.movedY).toBe(5)
    })
    it('dir-right', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 505
        const lastY = 500
        const lastStartTime = now - 100
        const minMovementX = 0
        const minMovementY = 0
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('right')
        expect(res.dirY).toBe('same')
        expect(res.dirX).toBe('right')
        expect(res.posMovedX).toBe(5)
        expect(res.posMovedY).toBe(0)
        expect(res.movedX).toBe(5)
        expect(res.movedY).toBe(0)
    })
    it('dir-left', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 495
        const lastY = 500
        const lastStartTime = now - 100
        const minMovementX = 0
        const minMovementY = 0
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('left')
        expect(res.dirY).toBe('same')
        expect(res.dirX).toBe('left')
        expect(res.posMovedX).toBe(5)
        expect(res.posMovedY).toBe(0)
        expect(res.movedX).toBe(-5)
        expect(res.movedY).toBe(0)
    })
    it('dir-right-top', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 600
        const lastY = 400
        const lastStartTime = now - 100
        const minMovementX = 0
        const minMovementY = 0
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('right-top')
        expect(res.dirY).toBe('up')
        expect(res.dirX).toBe('right')
    })
    it('dir-left-top', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 400
        const lastY = 400
        const lastStartTime = now - 100
        const minMovementX = 0
        const minMovementY = 0
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('left-top')
        expect(res.dirY).toBe('up')
        expect(res.dirX).toBe('left')
    })
    it('dir-right-bottom', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 600
        const lastY = 600
        const lastStartTime = now - 100
        const minMovementX = 0
        const minMovementY = 0
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('right-bottom')
        expect(res.dirY).toBe('down')
        expect(res.dirX).toBe('right')
    })
    it('dir-left-bottom', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 400
        const lastY = 600
        const lastStartTime = now - 100
        const minMovementX = 0
        const minMovementY = 0
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('left-bottom')
        expect(res.dirY).toBe('down')
        expect(res.dirX).toBe('left')
    })
    it('velocity-x.01', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 600
        const lastY = 500
        const lastStartTime = now - 100
        const minMovementX = 0
        const minMovementY = 0
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('right')
        expect(res.dirY).toBe('same')
        expect(res.dirX).toBe('right')
        expect(res.duration).toBe(100)
        expect(res.mPxPerMsX).toBe(1000)
        expect(res.mPxPerMsY).toBe(0)
    })
    it('velocity-x.02', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 800
        const lastY = 500
        const lastStartTime = now - 250
        const minMovementX = 0
        const minMovementY = 0
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('right')
        expect(res.dirY).toBe('same')
        expect(res.dirX).toBe('right')
        expect(res.mPxPerMsX).toBe(1200)
        expect(res.mPxPerMsY).toBe(0)
    })
    it('velocity-x.03', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 200
        const lastY = 500
        const lastStartTime = now - 250
        const minMovementX = 0
        const minMovementY = 0
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('left')
        expect(res.dirY).toBe('same')
        expect(res.dirX).toBe('left')
        expect(res.mPxPerMsX).toBe(1200)
        expect(res.mPxPerMsY).toBe(0)
    })
    it('velocity-y.01', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 500
        const lastY = 600
        const lastStartTime = now - 100
        const minMovementX = 0
        const minMovementY = 0
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('down')
        expect(res.dirY).toBe('down')
        expect(res.dirX).toBe('same')
        expect(res.duration).toBe(100)
        expect(res.mPxPerMsX).toBe(0)
        expect(res.mPxPerMsY).toBe(1000)
    })
    it('velocity-y.02', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 500
        const lastY = 800
        const lastStartTime = now - 250
        const minMovementX = 0
        const minMovementY = 0
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('down')
        expect(res.dirY).toBe('down')
        expect(res.dirX).toBe('same')
        expect(res.mPxPerMsX).toBe(0)
        expect(res.mPxPerMsY).toBe(1200)
    })
    it('velocity-y.03', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 500
        const lastY = 200
        const lastStartTime = now - 250
        const minMovementX = 0
        const minMovementY = 0
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('up')
        expect(res.dirY).toBe('up')
        expect(res.dirX).toBe('same')
        expect(res.mPxPerMsX).toBe(0)
        expect(res.mPxPerMsY).toBe(1200)
    })
    it('velocity-xy.01', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 200
        const lastY = 200
        const lastStartTime = now - 250
        const minMovementX = 0
        const minMovementY = 0
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('left-top')
        expect(res.dirY).toBe('up')
        expect(res.dirX).toBe('left')
        expect(res.duration).toBe(250)
        expect(res.mPxPerMsX).toBe(1200)
        expect(res.mPxPerMsY).toBe(1200)
    })
    it('velocity-xy.02', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 800
        const lastY = 800
        const lastStartTime = now - 250
        const minMovementX = 0
        const minMovementY = 0
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('right-bottom')
        expect(res.dirY).toBe('down')
        expect(res.dirX).toBe('right')
        expect(res.duration).toBe(250)
        expect(res.mPxPerMsX).toBe(1200)
        expect(res.mPxPerMsY).toBe(1200)
    })


    it('dir-up.moveOnGrid', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 500
        const lastY = 495
        const lastStartTime = now - 100
        const minMovementX = 10
        const minMovementY = 10
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('point')
        expect(res.dirY).toBe('same')
        expect(res.dirX).toBe('same')
        expect(res.posMovedX).toBe(0)
        expect(res.posMovedY).toBe(5)
        expect(res.movedX).toBe(0)
        expect(res.movedY).toBe(-5)
    })
    it('dir-down.moveOnGrid', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 500
        const lastY = 505
        const lastStartTime = now - 100
        const minMovementX = 10
        const minMovementY = 10
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('point')
        expect(res.dirY).toBe('same')
        expect(res.dirX).toBe('same')
        expect(res.posMovedX).toBe(0)
        expect(res.posMovedY).toBe(5)
        expect(res.movedX).toBe(0)
        expect(res.movedY).toBe(5)
    })
    it('dir-right.moveOnGrid', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 505
        const lastY = 500
        const lastStartTime = now - 100
        const minMovementX = 10
        const minMovementY = 10
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('point')
        expect(res.dirY).toBe('same')
        expect(res.dirX).toBe('same')
        expect(res.posMovedX).toBe(5)
        expect(res.posMovedY).toBe(0)
        expect(res.movedX).toBe(5)
        expect(res.movedY).toBe(0)
    })
    it('dir-left.moveOnGrid', () => {
        const now = Date.now()
        const startX = 500
        const startY = 500
        const lastX = 495
        const lastY = 500
        const lastStartTime = now - 100
        const minMovementX = 10
        const minMovementY = 10
        const res = estimateGesture(
            now, lastStartTime,
            startX, startY,
            lastX, lastY,
            0,
            0,
            0,
            minMovementX, minMovementY,
        )
        expect(res.dir).toBe('point')
        expect(res.dirY).toBe('same')
        expect(res.dirX).toBe('same')
        expect(res.posMovedX).toBe(5)
        expect(res.posMovedY).toBe(0)
        expect(res.movedX).toBe(-5)
        expect(res.movedY).toBe(0)
    })
})
