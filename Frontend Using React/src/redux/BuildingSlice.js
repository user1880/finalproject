import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const initialState = {
  data: [],
  status: 'idle',
  error: null,
}

export const fetchBuilding = createAsyncThunk(
  'data/fetchBuilding',
  async () => {
    const response = await axios.get('apis/buildings/')
    return response.data
  },
)

export const createBuilding = createAsyncThunk(
  'data/createBuilding',
  async data => {
    const response = await axios.post('/apis/buildings/', data)
    return response.data
  },
)

export const updateBuilding = createAsyncThunk(
  'data/updateBuilding',
  async data => {
    const response = await axios.patch(`apis/buildings/${data.id}/`, data)
    return response.data
  },
)

export const deleteBuilding = createAsyncThunk(
  'data/deleteBuilding',
  async id => {
    await axios.delete(`apis/buildings/${id}/`)
    return id
  },
)

export const BuildingSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: builder => {
    let TID = null

    builder
      .addCase(fetchBuilding.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchBuilding.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchBuilding.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(createBuilding.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(createBuilding.fulfilled, (state, action) => {
        toast.success('Enrolled in course', { id: TID })
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(createBuilding.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Already Enrolled', { id: TID })
        state.error = action.error.message
      })

      .addCase(updateBuilding.pending, state => {
        state.status = 'loading'
        TID = toast.loading('Updating...')
      })
      .addCase(updateBuilding.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const BuildingIndex = state.data.findIndex(
          item => item.id === action.payload.id,
        )
        if (BuildingIndex !== -1) {
          state.data[BuildingIndex].is_blocked = action.payload.is_blocked

          toast.success('Updated...', { id: TID })
        } else {
        }
        toast.success('Updated...', { id: TID })
      })
      .addCase(updateBuilding.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        toast.error('Oops! something went wron', { id: TID })
      })

      .addCase(deleteBuilding.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(deleteBuilding.fulfilled, (state, action) => {
        state.status = 'succeeded'
        toast.success('Building Removed!', { id: TID })
        state.data = state.data.filter(item => item.id !== action.payload)
      })
      .addCase(deleteBuilding.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Oop! something went wrong', { id: TID })
        state.error = action.error.message
      })
  },
})

export default BuildingSlice.reducer
