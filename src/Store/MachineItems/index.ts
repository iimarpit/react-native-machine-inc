import { createSlice } from '@reduxjs/toolkit'
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'

const slice = createSlice({
  name: 'machinesItems',
  initialState: [] as MachineItemState[],
  reducers: {
    addItem: (
      state,
      { payload: { categoryUUID, attributes } }: MachineItemPayload,
    ) => {
      console.log(categoryUUID)
      state.push({ categoryUUID, attributes, uuid: nanoid() })
    },
    deleteItem: (state, { payload: { uuid } }) => {
      return state.filter(item => item.uuid !== uuid)
    },
    patchItem: (state, { payload: { itemData, uuid } }) => {
      return state.map(item => {
        if (uuid === item.uuid) {
          return { ...item, ...itemData }
        }
        return item
      })
    },
  },
})

export const { addItem, deleteItem, patchItem } = slice.actions

export default slice.reducer

export type MachineItemState = {
  categoryUUID?: string
  attributes?: MachineItemField[]
  uuid?: string
}
export type MachineItemField = {
  name: string
  type: 'string' | 'boolean' | 'date' | 'number'
  value: string | boolean | Date | number
}

type MachineItemPayload = {
  payload: Partial<MachineItemState>
}
