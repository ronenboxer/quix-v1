import React from "react"
import { Wap } from "./wap"

export interface Section {
    id: string
    kind: string
    name: string
    styles: {
        small: { [key: string]: string }
        medium: { [key: string]: string }
        large: { [key: string]: string }
    }
    cmps: Cmp[]
}

export interface Kind {
    title: string;
    categories: {
        title: string;
        items: Cmp[];
    }[];
}

export interface Cmp {
    id: string
    txt?: string
    name: string
    parentId?: string
    tag: keyof JSX.IntrinsicElements
    prevTag?: keyof JSX.IntrinsicElements
    kind: 'text' | 'button' | 'collapse-text'
    styles: {
        small: { [key: string]: string },
        medium: { [key: string]: string },
        large: { [key: string]: string },
    }
    attributes?: React.HTMLAttributes<Element>
}