import { useState } from "react"
import { Cmp, Kind } from "../../../models/dynamic-element"
import { debounce, makeId } from "../../../services/util.service"
import { wapService } from "../../../services/wap.service"
import DynEl from "../../general/DynEl"

interface ElMenuProps {
    setAddedEl: (el: Cmp | null) => void
    media: 'small' | 'medium' | 'large'
    closeMenu: () => void
    setMouseRelPos: ({ x, y }?: {
        x: number;
        y: number;
    }) => void
}

export const ElMenu = (props: ElMenuProps) => {
    const { setAddedEl, media, closeMenu, setMouseRelPos } = props
    const elStock = wapService.getElementsStock()
    const [selectedKind, setSelectedKind] = useState(elStock[0])
    const [selectedCategory, setSelectedCategory] = useState(elStock[0].categories[0])
    const [selectedEl, setSelectedEl] = useState<null | Cmp>(null)

    const setKindHandler = (kind: Kind) => {
        if (selectedKind === kind) return
        setSelectedKind(kind)
        setSelectedCategory(kind.categories[0])
    }
    const setCategoryHandler = (category: { title: string, items: Cmp[] }) => {
        if (category === selectedCategory) return
        debounce(() => setSelectedCategory(category), 200)()
    }

    const elMousedownHandler = (el: Cmp, ev: MouseEvent) => {
        const elCopy = JSON.parse(JSON.stringify(el)) as Cmp
        elCopy.id = makeId()
        const container = (ev.target as HTMLElement)
        const { offsetX:x, offsetY:y } = ev
        const { height, width } = container.getBoundingClientRect()
        elCopy.styles[media] = { ...elCopy.styles[media], height: height + 'px', width: width + 'px' }
        setAddedEl(elCopy)
        setSelectedEl(elCopy)
        setMouseRelPos({x,y})
        closeMenu()
    }

    return (
        <section className="menu-instance elements flex column grow-1">
            <div className="header flex between items-center">
                <h2 className="menu-title">Add elements</h2>
                <div className="menu-options flex items-center between">
                    <label htmlFor="search-menu" className="flex items-center between">
                        <svg width="29" height="29" viewBox="0 0 29 29"><path fill="currentColor" d="M12.5 6a6.5 6.5 0 014.936 10.729l3.918 3.917-.708.708-3.917-3.918A6.5 6.5 0 1112.5 6zm0 1a5.5 5.5 0 100 11 5.5 5.5 0 000-11z"></path></svg>
                        <span>Search</span>
                    </label>
                    <button className="round-btn close-btn" onClick={closeMenu}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M10.793 11.5 7.146 7.854 6.793 7.5l.707-.707.354.353 3.646 3.647 3.646-3.647.354-.353.707.707-.353.354-3.647 3.646 3.647 3.646.353.354-.707.707-.354-.353-3.646-3.647-3.646 3.647-.354.353-.707-.707.353-.354 3.647-3.646Z"></path></svg>
                    </button>
                </div>
            </div>
            <div className="menu-content flex grow-1">
                <ul className="el-kinds-list clean-list shrink-0">
                    {elStock.map((el, idx) => (
                        <li key={el.title} className="el-kind" data-idx={idx}>
                            <span className={`el-kind-title flex center ${selectedKind.title === el.title ? 'selected' : ''}`} data-idx={idx}
                                onMouseEnter={() => setKindHandler(el)}>
                                {el.title}
                            </span>
                        </li>))}
                </ul>
                <ul className="el-categories-list clean-list shrink-0">
                    {selectedKind.categories.map((category, idx) => (
                        <li className="el-categories-item" data-idx={idx} key={category.title}>
                            <span className={`el-categories-item-title flex center ${selectedCategory.title === category.title ? 'selected' : ''}`} data-idx={idx}
                                onMouseEnter={() => setCategoryHandler(category)}>
                                {category.title}
                            </span>
                        </li>))}
                </ul>
                <div className="items-lists shrink-0">
                    {selectedKind.categories.map((category, outerIdx) => (
                        <div className="category-items" key={`${category.title}-preview`} data-idx={outerIdx}>
                            <h3 className="category-title">{category.title}</h3>
                            <ul className="el-items-list clean-list">
                                {category.items.map((item, innerIdx) => (
                                    <li className="item-preview" key={item.id} data-inner-idx={innerIdx} data-outer-idx={outerIdx}>
                                        <div className="el-container" onMouseDown={(ev) => elMousedownHandler(item, ev.nativeEvent)}>
                                            <DynEl tag={item.tag} attributes={item.attributes || {}}>
                                                {item.txt}
                                            </DynEl>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}