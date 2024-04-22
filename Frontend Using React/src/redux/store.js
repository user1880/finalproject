import { configureStore } from '@reduxjs/toolkit'
import BookingSlice from './BookingSlice'
import FloorSlice from './FloorSlice'
import RoomSlice from './RoomsSlice'
import BuildingSlice from './BuildingSlice'

export const store = configureStore({
  reducer: {
    Booking: BookingSlice,
    Floor: FloorSlice,
    Room: RoomSlice,
    Building: BuildingSlice,
  },
  devTools: process.env.NODE_ENV !== 'production',
})

export default store
