import { Wap } from "../models/wap"

const DUMMY_WAPS = [
    {
        id: '1',
        name: 'Website1',
        imgUrl: 'https://theartsdevelopmentcompany.org.uk/wp-content/uploads/2019/02/Website-Building-Landscape-1280x640.jpg',
        cmps: []
    },
    {
        id: '1',
        name: 'Website2',
        imgUrl: 'https://www.incimages.com/uploaded_files/image/1920x1080/getty_503426092_342208.jpg',
        cmps: []
    }
]


function query(entityType: string, delay: number = 500): Promise<any> {
    const storedValue = localStorage.getItem(entityType);
    const entities = typeof storedValue === 'string' ? JSON.parse(storedValue) : DUMMY_WAPS;
    return new Promise(resolve => setTimeout(() => resolve(entities), delay));
  }
  

function get(entityType:string, entityId:string) {
    return query(entityType).then(entities => {
        const entity = entities.find((entity:Wap) => entity.id === entityId)
        if (!entity) throw new Error(`Get failed, cannot find entity with id: ${entityId} in: ${entityType}`)
        return entity
    })
}

function post(entityType:string, newEntity:Wap) {
    newEntity = JSON.parse(JSON.stringify(newEntity))    
    newEntity.id = _makeId()
    return query(entityType).then(entities => {
        entities.push(newEntity)
        _save(entityType, entities)
        return newEntity
    })
}

function put(entityType:string, updatedEntity:Wap) {
    updatedEntity = JSON.parse(JSON.stringify(updatedEntity))    
    return query(entityType).then(entities => {
        const idx = entities.findIndex((entity:Wap) => entity.id === updatedEntity.id)
        if (idx < 0) throw new Error(`Update failed, cannot find entity with id: ${updatedEntity.id} in: ${entityType}`)
        entities.splice(idx, 1, updatedEntity)
        _save(entityType, entities)
        return updatedEntity
    })
}

function remove(entityType:string, entityId:string) {
    return query(entityType).then(entities => {
        const idx = entities.findIndex((entity:Wap) => entity.id === entityId)
        if (idx < 0) throw new Error(`Remove failed, cannot find entity with id: ${entityId} in: ${entityType}`)
        entities.splice(idx, 1)
        _save(entityType, entities)
    })
}

// Private functions

function _save(entityType:string, entities:Wap[]) {
    localStorage.setItem(entityType, JSON.stringify(entities))
}

function _makeId(length = 5) {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

export const storageService = {
    query,
    get,
    post,
    put,
    remove,
}