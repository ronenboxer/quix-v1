
import { storageService } from './async.local.storage.service'
// import { httpService } from './http.service.js'
// import { userService } from './user.service.js'
// import { makeId } from './util.service.js'
import { Wap } from '../models/wap'
import { Cmp, Kind, Section } from '../models/dynamic-element'
import { makeId } from './util.service'


const STORAGE_KEY = 'wap'

const DUMMY_WAPS = [{
    id: 'wap1',
    name: 'my wap',
    sections: [] as Section[],
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
}] as Wap[]

export const wapService = {
    query,
    getById,
    save,
    remove,
    getEmptyWap,
    getWapById,
    getSectionById,
    getElById,
    getElementsStock
}

export const dummyWap: Wap = {
    id: makeId(),
    name: 'my wap',
    sections: [
        {
            id: makeId(),
            name: 'site-header',
            kind: 'header',
            styles: { small: {}, medium: {}, large: { height: '60px' } },
            cmps: [],
        },
        {
            id: makeId(),
            name: '',
            cmps: [],
            kind: 'section',
            styles: { small: {}, medium: {}, large: { height: '200px' } },
        },
        {
            id: makeId(),
            name: '',
            cmps: [
                {
                    id: "Phmr9-tzEbS",
                    txt: "Helvetica Light is an easy-to-read font, with tall and narrow letters, that works well on almost every site.",
                    name: "paragraph",
                    tag: "p",
                    kind: 'text',
                    styles: {
                        small: {},
                        medium: {},
                        large: {
                            height: "55.5px",
                            width: "310px",
                            top: "29px",
                            left: "313px"
                        }
                    },
                    attributes: { className: 'dyn-el text' },
                        },
                {
                    id: "Phmr9-4dkse",
                    txt: "and narrow letters, that works well on almost every site.",
                    name: "paragraph",
                    tag: "p",
                    kind: 'text',
                    styles: {
                        small: {},
                        medium: {},
                        large: {
                            height: "55.5px",
                            width: "310px",
                            top: "89px",
                            left: "123px"
                        }
                    },
                    attributes: { className: 'dyn-el text' },
                        }
            ],
            kind: 'section',
            styles: { small: {}, medium: {}, large: { height: '200px' } },
        },
        {
            id: makeId(),
            name: '',
            cmps: [],
            kind: 'section',
            styles: { small: {}, medium: {}, large: { height: '200px' } },
        },
        {
            id: makeId(),
            name: '',
            cmps: [],
            kind: 'section',
            styles: { small: {}, medium: {}, large: { height: '200px' } },
        },
        {
            id: makeId(),
            name: 'site-footer',
            kind: 'footer',
            cmps: [],
            styles: { small: {}, medium: {}, large: { height: '60px' } },
        }
    ],
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
}

async function query(filterBy = { txt: '' }) {
    // return httpService.get(STORAGE_KEY, filterBy)
    // return DUMMY_WAP

    var waps = await storageService.query(STORAGE_KEY) || DUMMY_WAPS
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        waps = waps.filter((wap: Wap) => regex.test(wap.name))
    }
    return waps

}
function getById(wapId: string) {
    return storageService.get(STORAGE_KEY, wapId)
    // return httpService.get(`car/${carId}`)
}

async function remove(wapId: string) {
    await storageService.remove(STORAGE_KEY, wapId)
    // return httpService.delete(`car/${carId}`)
}
async function save(wap: Wap) {
    var savedWap
    if (wap.id) {
        savedWap = await storageService.put(STORAGE_KEY, wap)
        // savedCar = await httpService.put(`car/${car._id}`, car)

    } else {
        // Later, owner is set by the backend
        // car.owner = userService.getLoggedinUser()
        savedWap = await storageService.post(STORAGE_KEY, wap)
        // savedCar = await httpService.post('car', car)
    }
    return savedWap
}

// async function addCarMsg(carId, txt) {
//     const savedMsg = await httpService.post(`car/${carId}/msg`, {txt})
//     return savedMsg
// }


function getEmptyWap() {
    return {
        id: Math.random().toString(),
        name: '',
        sections: [] as Section[],
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
    }
}

function getElById(wap: Wap, elId: string): Cmp | null {
    let el: null | Cmp = null
    wap.sections.some(section => {
        el = section.cmps.find(e => e.id === elId) || null
        return el
    })
    return el
}

function getSectionById(wap: Wap, sectionId: string) { return wap.sections.find(section => section.id === sectionId) || null }

function getWapById(wapId: string) { return dummyWap }

function getElementsStock() {
    return [
        {
            title: 'Text',
            categories: [
                {
                    title: 'Themed Text',
                    items: [
                        {
                            id: 'sdvjf-4fCCk',
                            txt: 'Add Heading 1',
                            name: 'header',
                            kind: 'text',
                            tag: 'h1' as keyof JSX.IntrinsicElements,
                            styles: {
                                small: {} as { [key: string]: string },
                                medium: {} as { [key: string]: string },
                                large: {} as { [key: string]: string },
                            },
                            attributes: { className: 'dyn-el text' }
                        }
                    ] as Cmp[]
                },
                {
                    title: 'Titles',
                    items: [
                        {
                            id: 'fwd8C-Cc9Dv',
                            txt: 'Big Title',
                            name: 'title',
                            kind: 'text',
                            tag: 'h1' as keyof JSX.IntrinsicElements,
                            styles: {
                                small: {} as { [key: string]: string },
                                medium: {} as { [key: string]: string },
                                large: {} as { [key: string]: string },
                            },
                            attributes: { className: 'dyn-el text' }
                        }
                    ] as Cmp[]
                },
                {
                    title: 'Paragraphs',
                    items: [
                        {
                            id: '34fjD-jD6dK',
                            txt: 'Helvetica Light is an easy-to-read font, with tall and narrow letters, that works well on almost every site.',
                            name: 'paragraph',
                            kind: 'text',
                            tag: 'p' as keyof JSX.IntrinsicElements,
                            styles: {
                                small: {} as { [key: string]: string },
                                medium: {} as { [key: string]: string },
                                large: {} as { [key: string]: string },
                            },
                            attributes: { className: 'dyn-el text' }
                        }
                    ] as Cmp[]
                },
            ]
        }
    ] as Kind[]
}





