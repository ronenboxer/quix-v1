import { useEffect, useRef, useState } from 'react'
import { PageOverlay } from '../cmps/wap-edit/PageOverlay'
import { WapEditSection } from '../cmps/wap-edit/section/WapEditSection'
import { Cmp, Section } from '../models/dynamic-element'
import { Wap } from '../models/wap'
import { extractValueFromTransform, getRotationAngleDiff, handleTransformChange, resizeElement } from '../services/util.service'
import { ToolSidebar } from '../cmps/wap-edit/ToolSidebar'
import { useAppDispatch, useAppSelector } from '../customHooks/storeHooks'
import { addEl, editEl, ElResize, GrabMode, saveEl, saveSection, } from '../store/wap-edit.store'

export interface ElRef {
    cmp: Cmp
    ref?: null | HTMLElement
    containerRef?: null | HTMLElement
}

export interface SectionRef {
    section: Section
    ref?: null | HTMLElement
    elMap: { [id: string]: ElRef }
}

export interface GlobalRef {
    wap: Wap | null
    ref: HTMLElement | null
    sectionMap: {
        [id: string]: SectionRef
    }
}

const toolBarWidth = 60

const WapEdit = () => {

    const dispatch = useAppDispatch()

    // Elements
    const wap = useAppSelector(state => state.wapEdit.wap)
    const [selectedSection, setSelectedSection] = useState<Section | null>(null)
    const [highlightedEls, setHighlightedEls] = useState([] as Cmp[])
    const [multipleSelectedEls, setMultipleSelectedEls] = useState<Cmp[]>([])
    const [selectedEl, setSelectedEl] = useState<Cmp | null>(null)
    const addedEl = useRef<Cmp | null>(null)
    // const selectedSection = useRef<Section | null>(null)
    // const [hoveredSection, setHoveredSection] = useState<Section | null>(null)
    // const [addSectionPosition, setAddSectionPosition] = useState<'top' | 'bottom'>('bottom')
    // const [selectedEl.current, setSelectedEl] = useState<Cmp | null>(null)
    // const [addedEl, setAddedEl] = useState<Cmp | null>(null)

    // Refs
    const addedElRef = useRef<HTMLDivElement>(null)
    const globalRef = useRef<GlobalRef>({
        wap,
        ref: null as HTMLElement | null,
        sectionMap: (wap?.sections || []).reduce((sectionMap, section) => {
            const els = section.cmps.reduce((elMap, cmp) => {
                elMap[cmp.id] = {
                    cmp
                }
                return elMap
            }, {} as { [id: string]: ElRef })
            sectionMap[section.id] = {
                section,
                elMap: els
            }
            return sectionMap
        }, {} as { [id: string]: SectionRef })
    })

    // Mods
    const media = useAppSelector(state => state.wapEdit.media)
    const grabMode = useRef<GrabMode>('')
    const mouseStartPos = useRef<{ x: number, y: number } | null>(null)
    const mouseRelPos = useRef<{ x: number, y: number } | null>(null)
    const [userSelect, setUserSelect] = useState('auto' as 'auto' | 'none')
    const elSelectors = [] as string[]

    Object.values(globalRef.current.sectionMap).forEach(sectionRef => {
        elSelectors.push(`.wap-${sectionRef.section.kind}[data-id="${sectionRef.section.id}"]`)
        Object.keys(sectionRef.elMap).map(id => elSelectors.push(`.el-preview[data-id="${id}"]`))
    })
    elSelectors.push('.layout-guideline')
    // const [isQuickView, setIsQuickView] = useState(false)

    const garbModeChangeHandler = (mode: GrabMode = '') => {
        grabMode.current = mode
        if (!mode) setUserSelect('auto')
        else setUserSelect('none')
    }
    const selectElHandler = (el: Cmp | null = null) => { setSelectedEl(el) }
    const selectSectionHandler = (section: Section | null = null) => {
        if (section) {
            if (selectedSection?.id !== section.id) setHighlightedEls(section.cmps)
            else setHighlightedEls([])
        }
        setTimeout(() => setSelectedSection(section), 100)
    }
    const setAddedEl = (el: Cmp | null = null) => { addedEl.current = el }
    const mouseRelPosHandler = (pos: { x: number, y: number } | null = null) => { mouseRelPos.current = pos }
    const mouseStartPosHandler = (pos: { x: number, y: number } | null = null) => { mouseStartPos.current = pos }

    const mousemoveHandler = (ev: MouseEvent) => {
        setTimeout(() => {
            if (grabMode.current === 'resize-section') return resizeSectionHandler(ev)
            if (grabMode.current === 'add-el') grabAddedEl(ev)
            if (grabMode.current === 'rotate-el') elRotationHandler(ev)
            if (isElResizeType(grabMode.current)) elResizeHandler(ev)
        }, 50)
    }

    const mouseupHandler = (ev: MouseEvent) => {
        if (grabMode.current === 'add-el') positionAddedEl(ev)
        if (grabMode.current === 'rotate-el') endElRotation(ev)
        if (isElResizeType(grabMode.current)) endElResize(ev)
        garbModeChangeHandler('')
    }

    const clickHandler = (ev: MouseEvent) => {
        if (grabMode.current) return
        selectElHandler()
        const foundSection = getSectionUnderPointer(ev)
        if (!foundSection) {
            selectSectionHandler(null)
            selectElHandler(null)
            setHighlightedEls([])
        } else {
            if (selectedSection && selectedSection.id === foundSection.id) {
                const el = getElUnderPointer(ev, foundSection)
                selectElHandler(el)
            }
        }
    }

    const elSelectedHandler = (el: Cmp) => {
        if (selectedEl?.id !== el.id) selectElHandler(el)
    }

    const addElHandler = (el: Cmp | null) => {
        setAddedEl(el)
        if (el) {
            garbModeChangeHandler('add-el')
            addedElRef.current!.hidden = false
            const { height, width } = el.styles[media]
            addedElRef.current!.style.height = height
            addedElRef.current!.style.width = width
        }
        else {
            addedElRef.current!.hidden = true
            garbModeChangeHandler('')
        }
    }

    const resizeSectionHandler = (ev: MouseEvent) => {
        if (!selectedSection) return
        const ref = globalRef.current.sectionMap[selectedSection.id].ref
        if (!ref) return
        const diff = ev.pageY < ref.getBoundingClientRect().top && ev.movementY > 0
            ? 0
            : window.innerHeight - ev.clientY < 10 && ev.movementY >= 0
                ? 5
                : ev.movementY
        const height = ref.offsetHeight + diff + 'px'
        const styles = { ...selectedSection.styles }
        styles[media] = { ...styles[media], height }
        // ref.style.height = height
        // const sectionOverlayRef = ref.children[0]! as HTMLElement
        // const sectionWrapperRef = ref.parentElement!
        // sectionOverlayRef.style.height = height
        // sectionWrapperRef.style.height = height
        // globalRef.current.sectionMap[selectedSection.id].overlayRef!.style.height = height
        dispatch(saveSection(Object.assign({}, selectedSection, { styles })))
        // wrapperRef.style.height = height
        // selectedSection.styles = styles
        // selectSectionHandler({ ...selectedSection })
        if (ev.movementY >= 0 && window.innerHeight - ev.clientY < 10) (ev.target as HTMLElement).scrollIntoView({ block: 'end' })
        // if (ev.movementY < 0) (ev.target as HTMLElement).scrollIntoView(false)
        // if (window.innerHeight - ev.clientY)(ev.target as HTMLElement).scrollIntoView({block:'end'})
        // if (ev.movementY < 0) page!.style.height = calcTotalHeight([header, ...sections, footer], media) + 'px'
        // ;(ev.target as HTMLElement).scrollIntoView()
    }

    const getSectionUnderPointer = (ev: MouseEvent) => {
        const { clientY, clientX } = ev
        let foundSection: Section | null = null
        for (let section of wap?.sections || []) {
            const ref = globalRef.current.sectionMap[section.id].ref
            if (!ref) continue
            const { y, height } = ref.getBoundingClientRect()
            if (clientX > toolBarWidth && clientY >= y && clientY <= y + height) {
                foundSection = section
                break
            }
        }
        return foundSection
    }

    const getElUnderPointer = (ev: MouseEvent, section: Section) => {
        const { clientX, clientY } = ev
        return (section.cmps.find(el => {
            const { containerRef } = globalRef.current.sectionMap[section.id].elMap[el.id]
            return (containerRef && containerRef.classList.contains('hovered'))
        }) || null)
    }

    const grabAddedEl = (ev: MouseEvent) => {
        if (!addedEl.current || !addedElRef.current || !mouseRelPos.current) return
        const { clientX, clientY } = ev
        addedElRef.current.style.left = clientX - mouseRelPos.current.x + 'px'
        addedElRef.current.style.top = clientY - mouseRelPos.current.y + 'px'
    }

    const positionAddedEl = (ev: MouseEvent) => {
        if (!addedEl.current || !mouseRelPos.current) return
        const { clientX, clientY } = ev
        const targetSection = getSectionUnderPointer(ev)
        if (targetSection) {
            const ref = globalRef.current.sectionMap[targetSection.id].ref
            if (ref) {
                const { x, y } = ref.getBoundingClientRect()
                addedEl.current.styles[media].top = clientY - y - mouseRelPos.current.y + 'px'
                addedEl.current.styles[media].left = clientX - x - mouseRelPos.current.x + 'px'
                globalRef.current.sectionMap[targetSection.id].elMap[addedEl.current.id] = { cmp: addedEl.current }
                addedEl.current.parentId = targetSection.id
                dispatch(addEl({ el: addedEl.current, section: targetSection }))
            }
        }

        garbModeChangeHandler('')
        setAddedEl(null)
        mouseRelPosHandler()
        addedElRef.current!.hidden = true
    }

    const onElEditHandler = (el: Cmp) => {
        if (el.tag === 'textarea') return
        dispatch(editEl(el))
    }

    const onSaveElHandler = (el: Cmp, txt: string) => {
        if (el.tag !== 'textarea') return
        const elToSave = JSON.parse(JSON.stringify({ ...el, txt, tag: el.prevTag }))
        delete elToSave.attributes?.defaultValue
        delete elToSave.attributes?.onBlur
        delete elToSave.prevTag
        dispatch(saveEl(elToSave))
    }

    const elRotationHandler = (ev: MouseEvent) => {
        if (!selectedEl) return
        const ref = globalRef.current.sectionMap[selectedEl.parentId!].elMap[selectedEl.id].ref
        if (!ref || !mouseStartPos.current) return
        const { clientX: x, clientY: y } = ev
        const startAngle = extractValueFromTransform(selectedEl.styles[media], 'rotate') as number
        const newAngle = getRotationAngleDiff(ref, mouseStartPos.current, { x, y })
        const styles = handleTransformChange(selectedEl.styles[media], `rotate(${newAngle + startAngle}deg)`)
        const elToSave = Object.assign({}, selectedEl, { styles: { ...selectedEl.styles, [media]: styles } })
        dispatch(saveEl(elToSave))
        // const containerRef = globalRef.current.sectionMap[selectedEl.parentId!].elMap[selectedEl.id].containerRef
        // if (containerRef) containerRef.style.transform = styles.transform
    }

    const startElRotation = (ev: MouseEvent) => {
        const { clientX: x, clientY: y } = ev
        mouseStartPosHandler({ x, y })
        garbModeChangeHandler('rotate-el')
    }

    const endElRotation = (ev: MouseEvent) => {
        // if (!selectedEl) return
        // const ref = globalRef.current.sectionMap[selectedEl.parentId!].elMap[selectedEl.id].ref
        // if (!ref || !mouseStartPos.current) return
        // const { clientX: x, clientY: y } = ev
        // const startAngle = extractValueFromTransform(selectedEl.styles[media], 'rotate')
        // const angle = getRotationAngleDiff(ref, mouseStartPos.current, { x, y }) + startAngle
        // const styles = handleTransformChange(selectedEl.styles[media], `rotate(${angle}deg)`)
        // const elToSave = Object.assign({}, selectedEl, { styles: { ...selectedEl.styles, [media]: styles } })
        // dispatch(saveEl(elToSave))
        mouseStartPosHandler(null)
    }

    const startElResize = (ev: MouseEvent, resizeMode: ElResize) => {
        const { clientX: x, clientY: y } = ev
        mouseStartPosHandler({ x, y })
        garbModeChangeHandler(resizeMode)
    }

    const elResizeHandler = (ev: MouseEvent) => {
        if (!selectedEl) return
        const ref = globalRef.current.sectionMap[selectedEl.parentId!].elMap[selectedEl.id].ref
        const sectRef = globalRef.current.sectionMap[selectedEl.parentId!].ref
        if (!ref || !sectRef) return
        const styles = resizeElement(selectedEl.styles[media], grabMode.current as ElResize, ev, mouseStartPos.current!)
        dispatch(saveEl(Object.assign({}, selectedEl, { styles: { ...selectedEl.styles, [media]: styles } })))
    }

    const endElResize = (ev: MouseEvent) => {
        garbModeChangeHandler()
    }

    const isElResizeType = (grab: GrabMode): grab is ElResize => grab.startsWith('resize-el')

    useEffect(() => {
        document.addEventListener('mousemove', mousemoveHandler)
        document.addEventListener('click', clickHandler)
        document.addEventListener('mouseup', mouseupHandler)
        return () => {
            document.removeEventListener('mousemove', mousemoveHandler)
            document.removeEventListener('click', clickHandler)
            document.removeEventListener('mouseup', mouseupHandler)
        }
    }, [userSelect, selectedSection])

    return (
        <section className='wap-edit-page' style={{ userSelect }} >
            {wap && <>
                <div className="added-el absolute" ref={addedElRef}></div>
                <div className="page-container flex">
                    <ToolSidebar setSelectedSection={selectSectionHandler} setAddedEl={addElHandler} media={media} setMouseRelPos={mouseRelPosHandler} />
                    <div className="main-container relative grow-1">
                        <main className='wap-edit-page__page relative' ref={ref => globalRef.current.ref = ref}>
                            {wap.sections.map((section) => {
                                return (<WapEditSection
                                    key={`wap-${section.kind}__${section.id}}`}
                                    setGrabMode={garbModeChangeHandler} sections={wap.sections} grabMode={grabMode.current}
                                    setSelectedSection={selectSectionHandler}
                                    section={section} media={media} selectedSection={selectedSection}
                                    globalRef={globalRef.current} onEditElHandler={onElEditHandler}
                                    elSelectors={elSelectors}
                                    onSaveElHandler={onSaveElHandler} selectedEl={selectedEl}
                                    highlightedEls={highlightedEls}
                                />)
                            })}
                            <div style={{ width: '100%', height: '60px' }}></div>
                            <div className='absolute flex center' style={{
                                top: '0',
                                width: '100%',
                                height: '100%',
                                zIndex:'-1',
                                pointerEvents:'none'
                            }}>
                                <div className="layout-guideline absolute" style={{
                                    marginInline: 'auto',
                                    maxWidth: wap.styles[media].maxWidth || 'auto',
                                    width: `calc(100% - 2*${wap.styles[media].margin})`
                                }}></div>
                            </div>
                        </main>
                        <PageOverlay globalRef={globalRef.current} wap={wap} sections={wap.sections} selectedSection={selectedSection} media={media} />
                    </div>
                </div>
            </>}
        </section >
    )
}

export default WapEdit