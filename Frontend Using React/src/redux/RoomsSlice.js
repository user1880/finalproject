import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const initialState = {
  data: [],
  status: 'idle',
  error: null,
}

export const fetchRoom = createAsyncThunk('data/fetchRoom', async () => {
  const response = await axios.get('apis/rooms/')
  return response.data
})

export const createRoom = createAsyncThunk('data/createRoom', async data => {
  const response = await axios.post('/apis/rooms/', data)
  return response.data
})

export const updateRoom = createAsyncThunk('data/updateRoom', async data => {
  const response = await axios.patch(`apis/rooms/${data.id}/`, data)
  return response.data
})

export const deleteRoom = createAsyncThunk('data/deleteRoom', async id => {
  await axios.delete(`apis/rooms/${id}/`)
  return id
})

export const RoomSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: builder => {
    let TID = null

    builder
      .addCase(fetchRoom.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchRoom.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchRoom.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(createRoom.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        toast.success('Enrolled in course', { id: TID })
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Already Enrolled', { id: TID })
        state.error = action.error.message
      })

      .addCase(updateRoom.pending, state => {
        state.status = 'loading'
        TID = toast.loading('Updating...')
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const RoomIndex = state.data.findIndex(
          item => item.id === action.payload.id,
        )
        if (RoomIndex !== -1) {
          state.data[RoomIndex].is_blocked = action.payload.is_blocked

          toast.success('Updated...', { id: TID })
        } else {
        }
        toast.success('Updated...', { id: TID })
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        toast.error('Oops! something went wron', { id: TID })
      })

      .addCase(deleteRoom.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.status = 'succeeded'
        toast.success('Room Removed!', { id: TID })
        state.data = state.data.filter(item => item.id !== action.payload)
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Oop! something went wrong', { id: TID })
        state.error = action.error.message
      })
  },
})

export default RoomSlice.reducer
