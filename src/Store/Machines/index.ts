import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'machines',
  initialState: [] as MachineState[],
  reducers: {
    addCategory: (
      state,
      { payload: { categoryName, fields, titleField } }: MachinePayload,
    ) => {
      state.push({ categoryName, fields, titleField })
    },
  },
})

export const { addCategory } = slice.actions

export default slice.reducer

export type MachineState = {
  categoryName?: string
  fields?: MachineField[]
  titleField?: string
}
export type MachineField = {
  name: string
  type: string | boolean | Date | number
}

type MachinePayload = {
  payload: Partial<MachineState>
}
