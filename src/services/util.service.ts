import { Cmp, Section } from "../models/dynamic-element"
import { ElResize } from "../store/wap-edit.store"

export function makeId(blockSize = 5, blockCount = 2) {
    const CHARS = 'abcdefghojklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321'
    let id = ''
    for (let i = 0; i < blockCount; i++) {
        if (i) id += '-'
        for (let j = 0; j < blockSize; j++) {
            const idx = getRandomInt(CHARS.length)
            id += CHARS.charAt(idx)
        }
    }
    return id
}

export function getRandomInt(max: number, min = 0, isInclusive = false) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + (isInclusive ? 1 : 0)) + Math.ceil(min))
}

export function getVerticalHalf(ev: MouseEvent, el: HTMLElement) {
    const { clientY } = ev
    const { top, height } = el.getBoundingClientRect()
    if (clientY < top + height / 2) return 'top'
    else return 'bottom'
}

export function calcTotalHeight(sections: Section[], media: 'large' | 'medium' | 'small') {
    let height = 0
    for (let section of sections) {
        height += extractCSSValue(section.styles[media as keyof typeof section.styles].height || '400')
    }
    return height
}

export function extractCSSValue(value: string) {
    const num = value.match(/\d+(\.\d+)?/)
    return parseInt(num ? num[0] : '0')
}

export function debounce<T extends Function>(cb: T, wait = 200) {
    let h: NodeJS.Timeout | number = 0;
    let callable = (...args: any) => {
        clearTimeout(h);
        h = setTimeout(() => cb(...args), wait);
    };
    return <T>(<any>callable);
}

export function handleTransformChange(styles: { [key: string]: string }, transformFunction: string) {
    if (!transformFunction || !transformFunction.trim()) return styles
    if (!styles.transform) return Object.assign({}, styles, { transform: transformFunction })
    const transformFunc = transformFunction.split('(')[0].trim()
    if (!styles.transform.includes(transformFunc)) return Object.assign({}, styles, { transform: styles.transform + ' ' + transformFunction })

    const regex = new RegExp(`${transformFunc}\\s*\\(.*\\)`, 'ig')
    const newTransform = styles.transform.replace(regex, ' ' + transformFunction + ' ')
    return Object.assign({}, styles, { transform: newTransform })
}

export function handleGlobalTransformChange(styles: { [key: string]: string }, transform: string) {
    if (!styles.transform) return Object.assign({}, styles, { transform })
    const transformFunctions = transform.split(') ').map(func => func.split('(')[0])
    let newStyles = {} as { [key: string]: string }
    transformFunctions.forEach(func => {
        const currTransformValue = extractValueFromTransform(styles, func, true)
        newStyles = handleTransformChange(styles, currTransformValue as string)
    })
    return newStyles
}
export function calculatePosition(translateString: string, left: string, top: string) {
    const [, translateX = '0', translateY = '0'] = translateString.match(/translate\((-?\d+\.?\d*)px,\s*(-?\d+\.?\d*)px\)/) || [];

    const leftValue = parseFloat(left.replace('px', ''))
    const topValue = parseFloat(top.replace('px', ''))

    const newLeft = leftValue + parseFloat(translateX)
    const newTop = topValue + parseFloat(translateY)

    return { left: `${newLeft}px`, top: `${newTop}px` }
}

export function getRotationAngleDiff(el: HTMLElement, mouseStart: { x: number, y: number }, mouseEnd: { x: number, y: number }) {
    const center = getElAbsoluteCenter(el)
    const startDiffX = mouseStart.x - center.x
    const startDiffY = mouseStart.y - center.y
    const endDiffX = mouseEnd.x - center.x
    const endDiffY = mouseEnd.y - center.y
    const startAngle = Math.atan2(startDiffY, startDiffX)
    const endAngle = Math.atan2(endDiffY, endDiffX)
    let deg = (endAngle - startAngle) * 180 / Math.PI
    return Math.round(deg / 2.5) * 2.5
}

export function getElAbsoluteCenter(el: HTMLElement) {
    const { left, top, width, height } = el.getBoundingClientRect()
    return {
        x: left + width / 2,
        y: top + height / 2
    }
}

export function extractValueFromTransform(styles: { [key: string]: string }, transformFunc: string, withUnit = false) {
    if (!styles.transform || !transformFunc) return 0
    const regex = new RegExp(`${transformFunc}\s*\(\.*\)`, 'ig')
    const func = (styles.transform.match(regex) || [''])[0]
    if (withUnit) return func as string
    const value = (func.match(/\-?\d+(\.\d+)?/) || [''])[0]
    return +value as number
}

export function resizeElement(
    styles: { [key: string]: string },
    grabMode: ElResize,
    ev: MouseEvent,
    mouseStartPos: { x: number, y: number }
) {

    const { isAspectRatioPreserved, direction } = extractDirection(grabMode)
    const rotation = ((extractValueFromTransform(styles, 'rotate') as number) + 360) % 360
    const theta = rotation * Math.PI / 180
    const currWidth = parseFloat(styles.width)
    const currHeight = parseFloat(styles.height)
    const currTop = parseFloat(styles.top)
    const currLeft = parseFloat(styles.left)

    if (rotation === 0) {
        if (direction.includes('s') || direction.includes('n')) {
            const diff = getDiffFromCenterRelativeToAxis(ev, theta, 'y', currHeight, mouseStartPos)
            return direction === 's'
                ? {
                    ...styles,
                    height: currHeight + diff + 'px'
                }
                : {
                    ...styles,
                    top: currTop + diff + 'px',
                    height: currHeight - diff + 'px'
                }
        } else {
            const diff = getDiffFromCenterRelativeToAxis(ev, theta, 'x', currHeight, mouseStartPos)
            return direction === 'e'
                ? {
                    ...styles,
                    width: currWidth + diff + 'px'
                }
                : {
                    ...styles,
                    width: currWidth - diff + 'px',
                    left: currLeft + diff + 'px'
                }
        }
    }

    if (rotation === 90) {
        if (direction.includes('s') || direction.includes('n')) {
            const diff = getDiffFromCenterRelativeToAxis(ev, 0, 'x', currHeight, mouseStartPos)
            return direction === 's'
                ? {
                    ...styles,
                    height: currHeight - diff + 'px',
                    top: currTop + diff / 2 + 'px',
                    left: currLeft + diff / 2 + 'px'
                }
                : {
                    ...styles,
                    top: currTop - diff / 2 + 'px',
                    height: currHeight + diff + 'px',
                    left: currLeft + diff / 2 + 'px'
                }
        } else {
            const diff = getDiffFromCenterRelativeToAxis(ev, 0, 'y', currHeight, mouseStartPos)
            return direction === 'e'
                ? {
                    ...styles,
                    width: currWidth + diff + 'px',
                    top: currTop + diff / 2 + 'px',
                    left: currLeft - diff / 2 + 'px'
                }
                : {
                    ...styles,
                    width: currWidth - diff + 'px',
                    top: currTop + diff / 2 + 'px',
                    left: currLeft + diff / 2 + 'px',
                }
        }
    }

    if (rotation === 180) {
        if (direction.includes('s') || direction.includes('n')) {
            const diff = getDiffFromCenterRelativeToAxis(ev, 0, 'y', currHeight, mouseStartPos)
            return direction === 's'
                ? {
                    ...styles,
                    height: currHeight - diff + 'px',
                    top: currTop + diff + 'px',
                }
                : {
                    ...styles,
                    height: currHeight + diff + 'px'
                }
        } else {
            const diff = getDiffFromCenterRelativeToAxis(ev, 0, 'x', currHeight, mouseStartPos)
            return direction === 'e'
                ? {
                    ...styles,
                    width: currWidth - diff + 'px',
                    left: currLeft + diff + 'px'
                }
                : {
                    ...styles,
                    width: currWidth + diff + 'px',
                }
        }
    }

    if (rotation === 270) {
        if (direction.includes('s') || direction.includes('n')) {
            const diff = getDiffFromCenterRelativeToAxis(ev, 0, 'x', currHeight, mouseStartPos)
            return direction === 's'
                ? {
                    ...styles,
                    height: currHeight + diff + 'px',
                    top: currTop - diff / 2 + 'px',
                    left: currLeft + diff / 2 + 'px'
                }
                : {
                    ...styles,
                    top: currTop + diff / 2 + 'px',
                    height: currHeight - diff + 'px',
                    left: currLeft + diff / 2 + 'px'
                }
        } else {
            const diff = getDiffFromCenterRelativeToAxis(ev, 0, 'y', currHeight, mouseStartPos)
            return direction === 'e'
                ? {
                    ...styles,
                    width: currWidth + diff + 'px',
                    top: currTop + diff / 2 + 'px',
                    left: currLeft - diff / 2 + 'px'
                }
                : {
                    ...styles,
                    width: currWidth - diff + 'px',
                    top: currTop + diff / 2 + 'px',
                    left: currLeft + diff / 2 + 'px',
                }
        }
    }

    if (rotation > 0 && rotation < 90) {
        if (direction.includes('s') || direction.includes('n')) {
            const diff = getDiffFromCenterRelativeToAxis(ev, theta, 'y', currHeight, mouseStartPos)
            return direction === 's'
                ? {
                    ...styles,
                    height: currHeight + diff + 'px',
                    left: currLeft - diff * Math.sin(theta) / 2 + 'px',
                    top: currTop - diff * Math.sin(theta) * Math.tan(theta) / 4 + 'px'
                }
                : {
                    ...styles,
                    top: currTop + diff * (1 - Math.sin(theta) * Math.tan(theta) / 4) + 'px',
                    height: currHeight - diff + 'px',
                    left: currLeft - (diff / 2) * Math.sin(theta)
                }
        } else {
            const diff = getDiffFromCenterRelativeToAxis(ev, theta, 'x', currHeight, mouseStartPos)
            return direction === 'e'
                ? {
                    ...styles,
                    top: currTop + diff * Math.sin(theta) / 2 + 'px',
                    left: currLeft - diff * Math.sin(theta) * Math.tan(theta) / 4 + 'px',
                    width: currWidth + diff + 'px'
                }
                : {
                    ...styles,
                    width: currWidth - diff + 'px',
                    top: currTop + diff * Math.sin(theta) / 2 + 'px',
                    left: currLeft + diff * Math.cos(theta)
                }
        }
    }

    if (rotation > 180 && rotation < 270) {
        if (direction.includes('s') || direction.includes('n')) {
            const diff = -getDiffFromCenterRelativeToAxis(ev, theta, 'y', currHeight, mouseStartPos)
            console.log(direction === 's')
            return direction === 's'
                ? {
                    ...styles,
                    height: currHeight + diff + 'px',
                    left: currLeft - diff * Math.sin(theta) / 2 + 'px',
                    top: currTop - diff * (Math.cos(Math.PI - theta) - Math.sin(theta) * Math.tan(theta) / 4) + 'px'
                }
                : {
                    ...styles,
                    top: currTop + diff * (1 - Math.sin(theta) * Math.tan(theta) / 4) + 'px',
                    height: currHeight - diff + 'px',
                    left: currLeft - (diff / 2) * Math.sin(theta)
                }
        } else {
            const diff = getDiffFromCenterRelativeToAxis(ev, theta, 'x', currHeight, mouseStartPos)
            return direction === 'e'
                ? {
                    ...styles,
                    top: currTop + diff * Math.sin(theta) / 2 + 'px',
                    left: currLeft - diff * Math.sin(theta) * Math.tan(theta) / 4 + 'px',
                    width: currWidth + diff + 'px'
                }
                : {
                    ...styles,
                    width: currWidth - diff + 'px',
                    top: currTop + diff * Math.sin(theta) / 2 + 'px',
                    left: currLeft + diff * Math.cos(theta)
                }
        }
    }


    return {
        ...styles
    }

    function extractDirection(grab: ElResize) {
        const direction = grab.replace('resize-el-', '').replace('-preserve', '') as 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se'
        const isAspectRatioPreserved = grab.indexOf('preserve') !== -1
        return { direction, isAspectRatioPreserved }
    }
    function getDiffFromCenterRelativeToAxis(
        ev: MouseEvent,
        theta: number,
        axis: 'x' | 'y',
        size: number,
        { x: msx, y: msy }: { x: number, y: number }
    ) {
        let { clientX: ex, clientY: ey } = ev
        const d = size / 2
        let rx, ry: number

        if (axis === 'y') {
            ry = d * Math.cos(theta)
            rx = -d * Math.sin(theta)
        } else {
            rx = d * Math.cos(theta)
            ry = d * Math.sin(theta)
        }

        // Y = M*X + N
        const M = ry / rx
        const msN = rx
            ? msy - M * msx
            : 0
        const eN = rx
            ? ey + (M ? ex / M : 0)
            : 0

        let x = rx
            ? M ? (eN - msN) / (M + 1 / M) : ex
            : ex
        let y = rx
            ? x * M + msN
            : ey

        x -= msx
        y -= msy

        return axis === 'y'
            ? y
            : x
    }
}