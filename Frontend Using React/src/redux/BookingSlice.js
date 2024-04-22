import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const initialState = {
  data: [],
  status: 'idle',
  error: null,
}

export const fetchBooking = createAsyncThunk('data/fetchBooking', async () => {
  const response = await axios.get('apis/bookings/')
  return response.data
})

export const createBooking = createAsyncThunk(
  'data/createBooking',
  async data => {
    const response = await axios.post('apis/bookings/', data)
    return response.data
  },
)

export const updateBooking = createAsyncThunk(
  'data/updateBooking',
  async data => {
    const response = await axios.patch(`apis/bookings/${data.id}/`, data)
    return response.data
  },
)

export const deleteBooking = createAsyncThunk(
  'data/deleteBooking',
  async id => {
    await axios.delete(`apis/bookings/${id}/`)
    return id
  },
)

export const BookingSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: builder => {
    let TID = null

    builder
      .addCase(fetchBooking.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchBooking.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchBooking.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      .addCase(createBooking.pending, state => {
        TID = toast.loading('Checking time slots! Please wait...')
        state.status = 'loading'
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        toast.success('Room is booked!', { id: TID })
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Room unavailable', { id: TID })
        state.error = action.error.message
      })

      .addCase(updateBooking.pending, state => {
        state.status = 'loading'
        TID = toast.loading('Updating...')
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const BookingIndex = state.data.findIndex(
          item => item.id === action.payload.id,
        )
        if (BookingIndex !== -1) {
          state.data[BookingIndex].is_blocked = action.payload.is_blocked

          toast.success('Updated...', { id: TID })
        } else {
        }
        toast.success('Updated...', { id: TID })
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
        toast.error('Oops! something went wron', { id: TID })
      })

      .addCase(deleteBooking.pending, state => {
        TID = toast.loading('Loading...')
        state.status = 'loading'
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.status = 'succeeded'
        toast.success('Booking Removed!', { id: TID })
        state.data = state.data.filter(item => item.id !== action.payload)
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.status = 'failed'
        toast.error('Oop! something went wrong', { id: TID })
        state.error = action.error.message
      })
  },
})

export default BookingSlice.reducer
