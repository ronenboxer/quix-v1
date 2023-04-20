import { Section } from "../../models/dynamic-element"

interface WapEditPanelProps {
    sections: Section[]
    media: 'large' | 'medium' | 'small'
}

export const WapEditPanel = (props: WapEditPanelProps) => {
    const { sections, media } = props
    return (

        <section className='wap-edit-page__panel absolute'>
            {sections.map((section) => {
                return (<div
                    data-id={section.id}
                    data-kind={section.kind}
                    key={`wap-${section.kind}-panel__${section.id}}`}
                    className={`wap-${section.kind}-panel`}
                    style={{ height: section.styles[media].height }}
                >
                </div>)
            })}
        </section>
    )
}