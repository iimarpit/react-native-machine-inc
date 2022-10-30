import { createSlice } from '@reduxjs/toolkit'
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'

const slice = createSlice({
  name: 'machines',
  initialState: [] as MachineState[],
  reducers: {
    addCategory: (
      state,
      { payload: { categoryName, fields, titleField } }: MachinePayload,
    ) => {
      state.push({ categoryName, fields, titleField, uuid: nanoid() })
    },
    deleteCategory: (state, { payload: { uuid } }) => {
      return state.filter(machine => machine.uuid !== uuid)
    },
  },
})

export const { addCategory, deleteCategory } = slice.actions

export default slice.reducer

export type MachineState = {
  categoryName?: string
  fields?: MachineField[]
  titleField?: string
  uuid?: string
}
export type MachineField = {
  name: string
  type: string | boolean | Date | number
}

type MachinePayload = {
  payload: Partial<MachineState>
}
