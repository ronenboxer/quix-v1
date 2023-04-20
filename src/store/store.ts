import { configureStore } from '@reduxjs/toolkit'
import wapEditReducer from './wap-edit.store'

export const store = configureStore({
  reducer: {
    wapEdit: wapEditReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch