import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const initialState = {
  data: [],
  status: 'idle',
  error: null,
}

export const fetchFloor = createAsyncThunk('data/fetchFloor', async () => {
  const response = await axios.get('apis/floors/')
  return response.data
})

export const createFloor = createAsyncThunk('data/createFloor', async data => {
  const response = await axios.post('/apis/floors/', data)
  return response.data
})

export const updateFloor = createAsyncThunk('data/updateFloor', async data => {
  const response = await axios.patch(`apis/floors/${data.id}/`, data)
  return response.data
})

export const deleteFloor = createAsyncThunk('data/deleteFloor', async id => {
  await axios.delete(`apis/floors/${id}/`)
  return id
})

export const FloorSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: builder => {
    let TID = null

    builder
      .addCase(fetchFloor.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchFloor.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchFloor.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(createFloor.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(createFloor.fulfilled, (state, action) => {
        toast.success('Enrolled in course', { id: TID })
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(createFloor.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Already Enrolled', { id: TID })
        state.error = action.error.message
      })

      .addCase(updateFloor.pending, state => {
        state.status = 'loading'
        TID = toast.loading('Updating...')
      })
      .addCase(updateFloor.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const FloorIndex = state.data.findIndex(
          item => item.id === action.payload.id,
        )
        if (FloorIndex !== -1) {
          state.data[FloorIndex].is_blocked = action.payload.is_blocked

          toast.success('Updated...', { id: TID })
        } else {
        }
        toast.success('Updated...', { id: TID })
      })
      .addCase(updateFloor.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        toast.error('Oops! something went wron', { id: TID })
      })

      .addCase(deleteFloor.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(deleteFloor.fulfilled, (state, action) => {
        state.status = 'succeeded'
        toast.success('Floor Removed!', { id: TID })
        state.data = state.data.filter(item => item.id !== action.payload)
      })
      .addCase(deleteFloor.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Oop! something went wrong', { id: TID })
        state.error = action.error.message
      })
  },
})

export default FloorSlice.reducer
