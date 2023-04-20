import React, { useState } from 'react'
import DynEl from '../cmps/general/DynEl'


const WapList = () => {
    const [names, setNames] = useState(['one', 'two', 'three'])
    return (
        <>
            <DynEl
                tag='h1'
                attributes={{ id: 'h1Test' }}
                children='Hello, world!' />
            <DynEl
                tag='p'
                children='This is a paragraph.' />
            <DynEl
                tag='div'
                attributes={{ className: 'container' }}>
                <DynEl
                    tag='h2'
                    children='Nested heading' />
                <DynEl
                    tag='ul'
                    children={names.map(n =>
                        <li key={n}><DynEl tag='a' children={n} /></li>)} />

            </DynEl>
        </>
    )
}

export default WapList
