import { Cmp, Section } from "./dynamic-element"

export interface Wap {
    id: string
    name: string
    imgUrl: string
    sections: Section[]
    styles: {
        small: { [key: string]: string },
        medium: { [key: string]: string },
        large: { [key: string]: string },
    }
    margin: {
        small: number
        medium: number
        large: number
    }
    ref?: HTMLElement
}

export interface EditSidebar {
    title: string;
    cmpName: string;
    options: {};
}
