import React from 'react'

type Props = {
    tag: keyof JSX.IntrinsicElements
    children: React.ReactNode
    attributes?: React.HTMLAttributes<Element>
    styles?: { [key: string]: string }
    setRefHandler?: (ref: HTMLElement) => void

}

const DynEl = (props: Props) => {
    const { tag, children, attributes, styles = {}, setRefHandler = null } = props
    
    const onSetRef=(ref:HTMLElement)=> {
        if (setRefHandler) setRefHandler(ref)
    }

    return (
        <div>
            {React.createElement(tag, {...attributes, autoFocus:tag === 'textarea' ? true : false, ref:(ref:HTMLElement)=>onSetRef(ref), children, style:styles})}
        </div>
        // <Element {...attributes} style={styles} autoFocus={tag === 'textarea' ? true : false}>
        //     {children}
        // </Element>
    )
}

export default DynEl
