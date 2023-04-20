import { Section } from "../../../models/dynamic-element"
import { GrabMode } from "../../../store/wap-edit.store"
import { SectionRef } from "../../../views/WapEdit"

interface SectionOverlayProps {
    section: Section
    sections: Section[]
    media: 'large' | 'medium' | 'small'
    buttonPosition: 'top' | 'bottom' | false
    selectedSection: Section | null
    setGrabMode: (mode: GrabMode) => void
    setSelectedSection: (section?: Section | null) => void
    sectionRef: SectionRef

}
export const SectionOverlay = (props: SectionOverlayProps) => {
    const { section, media, buttonPosition, selectedSection, setGrabMode, setSelectedSection, sectionRef } = props

    const resizeHandler = (ev: MouseEvent) => {
        setSelectedSection(section)
        setGrabMode('resize-section')
    }

    const endResize = () => {
        setGrabMode('')
    }

    return (
        <div className={`${selectedSection?.id === section.id ? 'overlay-selected' : 'overlay-hovered'} ${section.kind} absolute`}
            data-id={section.id}
            style={{
                top: 0 + 'px',
                height: section.styles[media].height,
                width: 100 + '%'
            }}>
            <div className="dashed-background absolute"></div>
            <div className="options">
                <span className={`section-title ${section.kind} flex center absolute`}>
                    <span className="capitalize">{section.kind + ': '}</span>
                    {section.kind === 'section' && <span className="section-name">{section.name || 'Untitled'}</span>}
                </span>
                {(section.kind === 'section' && buttonPosition) && <button
                    data-id={section.id}
                    className="btn add-section-btn uppercase absolute"
                    style={{ top: buttonPosition === 'top' ? '3px' : 'calc(100% + 3px)' }}
                >+ Add section </button>}
                <button
                    data-id={section.id}
                    className="btn absolute resize-btn flex center" onMouseDown={ev => resizeHandler(ev.nativeEvent)} onMouseUp={endResize}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12.29 20.69a.78.78 0 0 0 .24-.16l4-4a.75.75 0 0 0-1.06-1.06l-2.72 2.72V5.81l2.72 2.72a.75.75 0 0 0 1.06-1.06l-4-4a.78.78 0 0 0-.24-.16a.73.73 0 0 0-.58 0a.78.78 0 0 0-.24.16l-4 4a.75.75 0 0 0 0 1.06a.75.75 0 0 0 1.06 0l2.72-2.72v12.38l-2.72-2.72a.75.75 0 0 0-1.06 0a.75.75 0 0 0 0 1.06l4 4a.78.78 0 0 0 .24.16a.73.73 0 0 0 .58 0Z" /></svg>
                </button>
            </div>
        </div>
    )
}