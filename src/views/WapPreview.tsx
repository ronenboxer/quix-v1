import React, { useState } from 'react'
import { Section } from '../models/dynamic-element'
import { Wap } from '../models/wap'
import { Cmp } from '../models/dynamic-element'
import CmpList from '../cmps/wap-preview/CmpList'

const DUMMY_WAP = {
    id: '1',
    name: 'my wap',
    sections: [
        {
            id: 'a',
            name: 'header',
            cmps: [
                {
                    id: 'z',
                    txt: 'im h1',
                    name: 'h1',
                    tag: 'h1',
                    kind: 'text',
                    styles: {
                        small: {},
                        medium: {},
                        large: {height: '100px', backgroundColor: '#ddc'},
                    },
                    attributes: 'h1'
                }
            ] as Cmp[],
            kind: 'section',
            styles: { small: {}, medium: {}, large: { height: '200px', backgroundColor: '#bfb' } },
        },
        {
            id: 'b',
            name: 'main',
            cmps: [
                {
                    id: 'x',
                    txt: 'im p',
                    name: 'p',
                    tag: 'p',
                    kind: 'text',
                    styles: {
                        small: {},
                        medium: {},
                        large: {height: '100px', backgroundColor: '#bfb'},
                    },
                    attributes: 'p'
                }
            ] as Cmp[],
            kind: 'section',
            styles: { small: {}, medium: {}, large: { height: '200px', backgroundColor: '#fbb' } },
        },
        {
            id: 'c',
            name: 'banner',
            cmps: [
                {
                    id: 'k',
                    txt: 'im button',
                    name: 'button',
                    tag: 'button',
                    kind: 'text',
                    styles: {
                        small: {},
                        medium: {},
                        large: {height: '100px', backgroundColor: '#fbb'},
                    },
                    attributes: 'button'
                }
            ] as Cmp[],
            kind: 'section',
            styles: { small: {}, medium: {}, large: { height: '200px', backgroundColor: '#bbf' } },
        },
        {
            id: 'd',
            name: 'footer',
            cmps: [
                {
                    id: 'f',
                    txt: '',
                    name: 'input',
                    kind: 'text',
                    tag: 'input',
                    styles: {
                        small: {},
                        medium: {},
                        large: {height: '100px', backgroundColor: '#bbf'},
                    },
                    attributes: 'input'
                }
            ] as Cmp[],
            kind: 'section',
            styles: { small: {}, medium: {}, large: { height: '200px', backgroundColor: '#ddc' } },
        }
    ] as Section[],
    imgUrl: '',
    styles: {
        small: {},
        medium: {},
        large: {
            margin: '40px',
            maxWidth: '800px'
        }
    },
    margin: {
        small: 40,
        medium: 40,
        large: 40
    }
} as Wap

const WapPreview = () => {
    const [wap, setWap] = useState(DUMMY_WAP)
    const sections = wap.sections

    // const styles = { height: '200px', color: 'yellow' }

    return (
        <>
            {sections.map(sect => {
                return <section key={sect.id} style={sect.styles.large}>
                    <p>{sect.name} section</p>
                     <CmpList cmps={sect.cmps}/>
                </section>
            })}
        </>
    )
}

export default WapPreview