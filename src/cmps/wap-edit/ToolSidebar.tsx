import React, { FunctionComponent, useState } from "react"
import { Cmp, Section } from "../../models/dynamic-element"
import { ElMenu } from "./element-stock/ElementMenu"

interface ToolSidebarProps {
    setSelectedSection: (section?: Section | null) => void
    setAddedEl: (el: Cmp | null) => void
    media: 'small' | 'medium' | 'large'
    setMouseRelPos: ({ x, y }?: {
        x: number;
        y: number;
    }) => void
}
const menuMap = {
    ElMenu
} as { [key: string]: (props: any) => JSX.Element }

export const ToolSidebar = (props: ToolSidebarProps) => {
    const { setSelectedSection, setAddedEl, media, setMouseRelPos } = props
    const [currMenu, setCurrMenu] = useState<(string)>('ElMenu')
    const [isMenuExpanded, setIsMenuExpanded] = useState(false)

    const clickHandler = () => {
        setSelectedSection(null)
    }

    const menuSetter = (menu: string) => {
        if (currMenu === menu && isMenuExpanded) return setIsMenuExpanded(false)
        if (!isMenuExpanded) setIsMenuExpanded(true)
        if (currMenu !== menu) setCurrMenu(menu)

    }

    const closeMenu = () => setIsMenuExpanded(false)


    return (
        <aside className="wap-edit-page__tool-sidebar relative flex column" onClick={clickHandler}>
            <section className={`el-menu absolute flex column ${isMenuExpanded ? 'expanded' : ''}`}>
                {currMenu && menuMap[currMenu] && React.createElement(menuMap[currMenu] as FunctionComponent, { setAddedEl, media, closeMenu, setMouseRelPos } as (React.InputHTMLAttributes<HTMLInputElement> & React.ClassAttributes<HTMLInputElement>))}
            </section>
            <ul className="tool-list clean-list relative grow-1">
                <li  onClick={ev=>ev.stopPropagation()}>
                    <button className="add-el-btn flex center" onClick={() => menuSetter('ElMenu')}>
                        <svg width="22" height="22" viewBox="0 0 22 22"><g fill="none" fillRule="evenodd"><path fill="currentColor" d="M18.78 3.22A10.965 10.965 0 0011 0C7.96 0 5.21 1.23 3.22 3.22A10.965 10.965 0 000 11c0 6.08 4.92 11 11 11 3.04 0 5.79-1.23 7.78-3.221A10.961 10.961 0 0022 11c0-3.04-1.23-5.79-3.22-7.78z"></path><rect width="2" height="12" x="10" y="5" fill="currentColor" fillRule="nonzero" rx=".5" transform="rotate(-90 11 11)"></rect><rect width="2" height="12" x="10" y="5" fill="currentColor" fillRule="nonzero" rx=".5"></rect></g></svg>
                    </button>
                </li>
            </ul>

        </aside>
    )
}