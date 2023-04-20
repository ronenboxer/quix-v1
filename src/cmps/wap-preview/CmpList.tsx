import React from 'react'
import { Cmp } from '../../models/dynamic-element'
import DynEl from '../general/DynEl'

const CmpList = (props:any) => {
  
  return (
    <div>
        {props.cmps.map((cmp:Cmp) => 
            <DynEl 
            key={cmp.id}
            attributes={cmp.attributes} 
            tag={cmp.tag} 
            styles={cmp.styles.large}
            >
              {cmp.txt ? cmp.txt : null}
            </DynEl>
        )}
    </div>
  )
}

export default CmpList