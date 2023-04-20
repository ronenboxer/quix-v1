import { Draft } from 'immer'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Wap } from '../models/wap'
import { dummyWap, wapService } from '../services/wap.service'
import { Cmp, Section } from '../models/dynamic-element'

export type ElResize = 'resize-el-n' | 'resize-el-s' | 'resize-el-e' | 'resize-el-w' | 'resize-el-ne' | 'resize-el-ne-preserve' | 'resize-el-nw' | 'resize-el-nw-preserve' | 'resize-el-se' | 'resize-el-se-preserve' | 'resize-el-sw' | 'resize-el-sw-preserve'
export type GrabMode = ElResize | '' | 'resize-section' | 'rotate-el' | 'drag-els' | 'add-el'

interface WapEditState {
    wap: Wap | null
    media: 'large' | 'medium' | 'small'
}

const initialState: WapEditState = {
    wap: {
        ...dummyWap, sections: dummyWap.sections.map(section => {
            section.cmps.forEach(cmp => cmp.parentId = section.id)
            return section
        })
    },
    media: 'large',
}


export const wapEditSlice = createSlice({
    name: 'wap-edit',
    initialState,
    reducers: {
        getWapById: (state, action: PayloadAction<string>) => { state.wap = wapService.getWapById(action.payload) as Draft<Wap | null> },
        setWap: (state, action: PayloadAction<Wap>) => { state.wap = action.payload as Draft<Wap> },
        setMedia: (state, action: PayloadAction<'large' | 'medium' | 'small'>) => { state.media = action.payload },
        addEl: (state, action: PayloadAction<{ el: Cmp, section: Section }>) => {
            state.wap!.sections.find(section => section.id === action.payload.section.id)?.cmps.push(action.payload.el as Draft<Cmp>)
        },
        saveSection: (state, action: PayloadAction<Section>) => {
            state.wap!.sections = state.wap!.sections.map(section => section.id === action.payload.id
                ? action.payload
                : section) as Draft<Section>[]
        },
        editEl: (state, action: PayloadAction<Cmp>) => {
            const el = { ...action.payload }
            if (!el.parentId) return console.log('No selected Section')
            el.prevTag = el.tag
            el.tag = 'textarea'
            el.attributes = {
                ...(el.attributes || {}), defaultValue: el.txt || '',
            }
            delete el.txt
            state.wap?.sections.forEach(section => {
                if (section.id === el.parentId) section.cmps = section.cmps.map(e => e.id === el.id ? el : e) as Draft<Cmp[]>
            })
        },
        saveEl: (state, action: PayloadAction<Cmp>) => {
            const el = action.payload
            // console.log(el.styles.large)
            if (!el.parentId) return console.log('No selected Section')
            state.wap!.sections.forEach(section => {
                if (section.id === el.parentId) section.cmps = section.cmps.map(e => e.id === el.id ? el : e) as Draft<Cmp>[]
            })
            // console.log(`state.wap!.sections:`, state.wap!.sections[2].cmps[0].styles.large.height)
        }
    },
})

export const {
    setWap,
    getWapById,
    setMedia,
    addEl,
    editEl,
    saveEl,
    saveSection,
} = wapEditSlice.actions

export default wapEditSlice.reducer