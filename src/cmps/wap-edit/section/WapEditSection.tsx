import { useState } from "react"
import { Cmp, Section } from "../../../models/dynamic-element"
import { getVerticalHalf } from "../../../services/util.service"
import { ElResize, GrabMode } from "../../../store/wap-edit.store"
import { GlobalRef } from "../../../views/WapEdit"
import { ElPreview } from "../element/ElPreview"
import { SectionOverlay } from "./SectionOverlay"

interface WapEditSectionProps {
    section: Section
    media: 'large' | 'medium' | 'small',
    selectedSection: Section | null,
    sections: Section[]
    setSelectedSection: (section?: Section | null) => void
    setGrabMode: (mode: GrabMode) => void
    grabMode: GrabMode,
    globalRef: GlobalRef
    onEditElHandler: (cmp: Cmp) => void
    onSaveElHandler: (cmp: Cmp, txt: string) => void
    selectedEl: Cmp | null
    highlightedEls: Cmp[]
    elSelectors: string[]
}

export const WapEditSection = (props: WapEditSectionProps) => {
    const { section, media, selectedSection, sections,
        setSelectedSection, grabMode, setGrabMode, globalRef,
        onEditElHandler, onSaveElHandler, 
        selectedEl, highlightedEls,elSelectors } = props

    const [addSectionBtnPos, setAddSectionPosition] = useState<'top' | 'bottom' | false>(false)

    const sectionMousemoveHandler = (ev: MouseEvent) => {
        setAddSectionPosition(getVerticalHalf(ev, globalRef.sectionMap[section.id].ref!))
    }

    const sectionClickHandler = () => {
        setSelectedSection(section)
    }

    const elClickHandler = (ev: MouseEvent, el: Cmp) => {
        if (ev.detail >= 2) onEditElHandler(el)
    }

    const elBlurHandler = (el: Cmp, txt: string) => {
        onSaveElHandler(el, txt)
    }


    return (
        <div className="section-wrapper" style={{ height: section.styles[media].height, width: '100vw' }} onClick={sectionClickHandler}>
            <section
                onMouseMove={ev => sectionMousemoveHandler(ev.nativeEvent)}
                data-id={section.id}
                data-kind={section.kind}
                ref={ref => globalRef.sectionMap[section.id].ref = ref}
                className={`wap-${section.kind} relative ${(section.kind === 'section' && selectedSection?.id === section.id || 
                    (section.kind !== 'section' && selectedSection)) ? 'selected' : 'dashed'}
                    ${selectedSection?.id === section.id && selectedEl ? 'highlighted' : ''}`}
                style={{ ...section.styles[media], width: globalRef.ref?.offsetWidth + 'px' }}>
                {(((grabMode !== 'resize-section') || selectedSection?.id === section.id)) &&
                    <SectionOverlay
                        section={section}
                        sections={sections}
                        sectionRef={globalRef.sectionMap[section.id]}
                        media={media}
                        buttonPosition={(section.kind === 'section' && grabMode !== 'resize-section') && addSectionBtnPos}
                        selectedSection={selectedSection}
                        setGrabMode={setGrabMode}
                        setSelectedSection={setSelectedSection} />}
                {section.cmps.map(cmp => (<ElPreview
                    sectionRef={globalRef.sectionMap[section.id]}
                    key={cmp.id}
                    media={media}
                    el={cmp}
                    selectedEl={selectedEl}
                    highlightedEls={highlightedEls}
                    onClick={elClickHandler}
                    elSelectors={elSelectors}
                    onBlur={elBlurHandler} />))}
            </section>
        </div>
    )
}