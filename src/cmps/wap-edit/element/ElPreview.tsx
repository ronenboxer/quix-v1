import { useState } from "react"
import { Cmp } from "../../../models/dynamic-element"
import { ElResize, saveEl } from "../../../store/wap-edit.store"
import { SectionRef } from "../../../views/WapEdit"
import DynEl from "../../general/DynEl"
import { ELOverlay } from "./ElOverlay"
import Moveable from "react-moveable";
import { useAppDispatch } from "../../../customHooks/storeHooks"
import { calculatePosition, handleTransformChange } from "../../../services/util.service"

interface ElPreviewProps {
    el: Cmp
    media: 'large' | 'medium' | 'small',
    onClick: (ev: MouseEvent, el: Cmp) => void
    onBlur: (el: Cmp, txt: string) => void
    selectedEl: Cmp | null
    sectionRef: SectionRef
    highlightedEls: Cmp[]
    elSelectors: string[]
}

export const ElPreview = (props: ElPreviewProps) => {
    const { el, onClick, onBlur, media, selectedEl, sectionRef, highlightedEls, elSelectors } = props
    const elRef = sectionRef.elMap[el.id]
    const styles = JSON.parse(JSON.stringify(el.styles[media]))
    const selectors = elSelectors.filter(selector => !selector.includes(el.id))

    const dispatch = useAppDispatch()
    const [isHovered, setIsHovered] = useState(false)

    const toggleHoverState = (state: boolean) => setIsHovered(state)

    const cmpClickHandler = (ev: MouseEvent, el: Cmp) => {
        onClick(ev, el)
    }

    const cmpBlurHandler = (ev: FocusEvent, el: Cmp) => {
        const txt = (ev.target as HTMLTextAreaElement).value
        onBlur(el, txt)
    }

    const isHighlighted = !!highlightedEls.find(e => e.id === el.id)

    return (
        <>

            <div className={`el-preview absolute ${isHighlighted
                ? 'highlighted'
                : ''} ${selectedEl?.id === el.id
                    ? 'selected'
                    : ''} ${isHovered
                        ? 'hovered'
                        : ''}`}
                style={styles}
                data-id={el.id}
                ref={ref => ref ? elRef.containerRef = ref : null}
                onMouseEnter={() => toggleHoverState(true)}
                onMouseLeave={() => toggleHoverState(false)}
            >
                <DynEl key={el.id} tag={el.tag}
                    attributes={{
                        ...(el.attributes || {}),
                        onClick: (ev) => { cmpClickHandler(ev.nativeEvent, el) },
                        onBlur: (ev) => { cmpBlurHandler(ev.nativeEvent, el) }
                    }
                    }
                    setRefHandler={(ref: HTMLElement) => ref ? elRef.ref = ref : null}
                    styles={Object.assign({}, { ...el.styles[media] }, { transform: '' })}>
                    {el.txt}
                </DynEl>
                <ELOverlay el={el} />
            </div>
            {selectedEl?.id === el.id && <Moveable
                target={elRef.containerRef}
                rotatable={true}
                throttleDrag={1}
                edgeDraggable={false}
                startDragRotate={0}
                throttleDragRotate={0}
                resizable={true}
                keepRatio={false}
                throttleResize={1}
                renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
                draggable={true}
                scalable={true}
                snappable={true}
                throttleRotate={0}
                rotationPosition={"top-left"}
                isDisplaySnapDigit={true}
                isDisplayInnerSnapDigit={false}
                snapDirections={{ "top": true, "left": true, "bottom": true, "right": true, "center": true, "middle": true }}
                elementSnapDirections={{ "top": true, "left": true, "bottom": true, "right": true, "center": true, "middle": true }}
                elementGuidelines={selectors}
                snapThreshold={5}
                onDrag={e => {
                    e.target.style.left = e.left + 'px'
                    e.target.style.top = e.top + 'px'
                    dispatch(saveEl(Object.assign({}, el, { styles: { ...styles, [media]: { ...styles, top: e.top + 'px', left: e.left + 'px' } } })))
                }}
                onResize={e => {
                    e.target.style.width = `${e.width}px`;
                    e.target.style.height = `${e.height}px`;
                    const newStyles = handleTransformChange(styles, e.transform)
                    e.target.style.transform = newStyles.transform;
                    dispatch(saveEl(Object.assign({}, el, { styles: { ...styles, [media]: { ...newStyles, width: `${e.width}px`, height: `${e.height}px` } } })))
                }}
                onRotate={e => {
                    const { left, top } = calculatePosition(styles.transform||'', styles.left, styles.top)
                    const newStyles = handleTransformChange(handleTransformChange(styles, e.transform||''), 'translate(0, 0)')
                    console.log(left, top)
                    e.target.style.transform = newStyles.transform
                    dispatch(saveEl(Object.assign({}, el, { styles: { ...styles, [media]: {...newStyles,top,left} } })))
                }}
            />}
        </>
    )
}


// import { useState } from "react"
// import { Cmp } from "../../../models/dynamic-element"
// import { ElResize, saveEl } from "../../../store/wap-edit.store"
// import { ElRef } from "../../../views/WapEdit"
// import DynEl from "../../general/DynEl"
// import { ELOverlay } from "./ElOverlay"
// import Moveable from "react-moveable";
// import { useAppDispatch } from "../../../customHooks/storeHooks"
// import { handleGlobalTransformChange } from "../../../services/util.service"

// interface ElPreviewProps {
//     el: Cmp
//     media: 'large' | 'medium' | 'small',
//     onClick: (ev: MouseEvent, el: Cmp) => void
//     onBlur: (el: Cmp, txt: string) => void
//     onStartRotateEl: (ev: MouseEvent) => void
//     onStartResizeEl: (ev: MouseEvent, resizeMode: ElResize) => void
//     selectedEl: Cmp | null
//     elRef: ElRef
//     highlightedEls: Cmp[]
//     elSelectors: string[]
// }

// export const ElPreview = (props: ElPreviewProps) => {
//     const { el, onClick, onBlur, media, onStartRotateEl, selectedEl, elRef, highlightedEls, onStartResizeEl,elSelectors } = props
//     const styles = JSON.parse(JSON.stringify(el.styles[media]))

//     const [isHovered, setIsHovered] = useState(false)
//     const dispatch = useAppDispatch()


//     const toggleHoverState = (state: boolean) => setIsHovered(state)

//     const cmpClickHandler = (ev: MouseEvent, el: Cmp) => {
//         onClick(ev, el)
//     }

//     const cmpBlurHandler = (ev: FocusEvent, el: Cmp) => {
//         const txt = (ev.target as HTMLTextAreaElement).value
//         onBlur(el, txt)
//     }


//     const isHighlighted = !!highlightedEls.find(e => e.id === el.id)

//     return (
//         <>

//             <div className={`el-preview absolute ${isHighlighted
//                 ? 'highlighted'
//                 : ''} ${selectedEl?.id === el.id
//                     ? 'selected'
//                     : ''} ${isHovered
//                         ? 'hovered'
//                         : ''}`}
//                 style={styles}
//                 data-id={`el-${el.id}`}
//                 ref={ref => ref ? elRef.containerRef = ref : null}
//                 onMouseEnter={() => toggleHoverState(true)}
//                 onMouseLeave={() => toggleHoverState(false)}
//             >
//                 <DynEl key={el.id} tag={el.tag}
//                     attributes={{
//                         ...(el.attributes || {}),
//                         onClick: (ev) => { cmpClickHandler(ev.nativeEvent, el) },
//                         onBlur: (ev) => { cmpBlurHandler(ev.nativeEvent, el) }
//                     }
//                     }
//                     setRefHandler={(ref: HTMLElement) => ref ? elRef.ref = ref : null}
//                     styles={Object.assign({}, { ...el.styles[media] }, { transform: '' })}>
//                     {el.txt}
//                 </DynEl>
//                 <ELOverlay el={el} onStartRotateEl={onStartRotateEl} onStartResizeEl={onStartResizeEl} />
//             </div>
//             {selectedEl?.id === el.id && <Moveable
//                 target={elRef.ref}
//                 throttleDrag={1}
//                 edgeDraggable={true}
//                 startDragRotate={0}
//                 throttleDragRotate={0}
//                 resizable={true}
//                 keepRatio={false}
//                 throttleResize={1}
//                 renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
//                 draggable={true}
//                 scalable={true}
//                 snappable={true}
//                 throttleRotate={0}
//                 rotationPosition={"top"}
//                 isDisplaySnapDigit={true}
//                 isDisplayInnerSnapDigit={false}
//                 snapDirections={{"top":true,"left":true,"bottom":true,"right":true,"center":true,"middle":true}}
//                 elementSnapDirections={{"top":true,"left":true,"bottom":true,"right":true,"center":true,"middle":true}}
//                 elementGuidelines={elSelectors}
//                 snapThreshold={5}
//                 onDrag={e => {
//                     e.target.style.transform = e.transform;
//                     const style = handleGlobalTransformChange(styles, e.transform)
//                     dispatch(saveEl(Object.assign({},el,{styles:{...el.styles,[media]:style}})))
//                 }}
//                 onResize={e => {
//                     e.target.style.width = `${e.width}px`;
//                     e.target.style.height = `${e.height}px`;
//                     e.target.style.transform = e.drag.transform;
//                 }}
//                 onRotate={e => {
//                     e.target.style.transform = e.drag.transform;
//                 }}
//                 onRender={e => {
//                     e.target.style.cssText += e.cssText;
//                     console.log(`e:`, e)
//                 }}
//             />}
//         </>
//     )
// }