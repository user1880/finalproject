import './App.css'
import React, { useEffect, useState } from 'react'
import header from './header.png'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRoom } from './redux/RoomsSlice'
import { Badge, Button, Modal } from 'react-bootstrap'
import { createBooking } from './redux/BookingSlice'
import moment from 'moment/moment'

function App() {
  const dispatch = useDispatch()
  const rooms = useSelector(state => state.Room.data)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isToggled, setIsToggled] = useState(false)
  const [name, setName] = useState(null)
  const [email, setEmail] = useState(null)
  const [selectedDate, setSelectedDate] = useState('') // Initial state

  const [username, setUserName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const [isModalRoomOpen, setIsModalRoomOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const handleMenuToggle = () => {
    setIsToggled(!isToggled)
  }

  const buildingClick = data => {
    if (data === 'a') {
      setName('Building A')
    } else if (data === 'b') {
      setName('Building B')
    } else if (data === 'c') {
      setName('Building C')
    } else {
      setName('Building D')
    }
  }
  useEffect(() => {
    dispatch(fetchRoom())
  }, [dispatch])

  const filterRoomsByBuilding = (roomsData, buildingName) => {
    return roomsData.filter(room => room.floor.building.name === buildingName)
  }

  const groupRoomsByFloor = roomsData => {
    const roomsByFloor = {}
    roomsData.forEach(room => {
      const floorName = room.floor.floor_name
      if (!roomsByFloor[floorName]) {
        roomsByFloor[floorName] = []
      }
      roomsByFloor[floorName].push(room)
    })
    return roomsByFloor
  }

  const handleImageClick = imageUrl => {
    setSelectedImage(imageUrl)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleRoomClick = room => {
    setSelectedRoom(room)
    setIsModalRoomOpen(true)
  }

  const handleSubmit = event => {
    event.preventDefault()
    const bookingData = {
      name: username,
      phone_number: phoneNumber,
      room: selectedRoom.id,
      start_time: startTime,
      end_time: endTime,
      Email: email,
    }
    dispatch(createBooking(bookingData))
  }

  const handleStartTimeChange = event => {
    setStartTime(event.target.value)

    const newStartTime = new Date(event.target.value)
    const maxEndTime = new Date(newStartTime.getTime() + 3 * 60 * 60 * 1000)

    if (endTime && new Date(endTime) > maxEndTime) {
      setEndTime('')
    }
  }
  // calculating the maximum time limit
  const calculateMaxTime = start => {
    if (!start) return null

    const startTime = new Date(start)
    const startTimeUTC = new Date(
      Date.UTC(
        startTime.getFullYear(),
        startTime.getMonth(),
        startTime.getDate(),
        startTime.getHours(),
        startTime.getMinutes(),
      ),
    )

    const maxEndTimeUTC = new Date(startTimeUTC.getTime() + 3 * 60 * 60 * 1000)
    maxEndTimeUTC.setUTCDate(startTimeUTC.getUTCDate())

    return maxEndTimeUTC.toISOString().slice(0, -5)
  }

  const handleDateChange = event => {
    setSelectedDate(event.target.value)
  }
  // yellow or green icon to see if the rooms are available or not
  function isRoomFullyAvailable(room, selectedDate) {
    const selectedDateOnly = selectedDate.slice(0, 10)
    const bookingsOnSelectedDate = room.booked_slots.filter(
      slot => slot.date.slice(0, 10) === selectedDateOnly,
    )

    if (bookingsOnSelectedDate.length === 0) {
      return 'fully'
    } else {
      // Calculate total booked hours
      const totalBookedHours = bookingsOnSelectedDate.reduce((total, slot) => {
        const startTime = new Date(slot.start_time)
        const endTime = new Date(slot.end_time)
        const durationInHours = (endTime - startTime) / (1000 * 60 * 60)
        return total + durationInHours
      }, 0)

      return totalBookedHours >= 24 ? 'not available' : 'partial'
    }
  }

  return (
    <div id='wrapper' className={isToggled ? 'toggled' : ''}>
      {/* Sidebar */}
      <div id='sidebar-wrapper'>
        <div className='sidebar-header'>
          <h4>{name}</h4>
          <input
            type='date'
            className='form-control'
            id='date-picker'
            onChange={handleDateChange}
          />
        </div>

        {name && selectedDate && (
          <div className='floors-list'>
            {Object.entries(
              groupRoomsByFloor(filterRoomsByBuilding(rooms, name)),
            )
              .sort(([floorIdA, _], [floorIdB, __]) => floorIdA - floorIdB)
              .map(([floorName, roomsOnFloor]) => (
                <div className='floor-item' key={floorName}>
                  <h6 className='m-lg-2'>Floor {floorName}</h6>
                  <div className='m-lg-2 rooms-list'>
                    {roomsOnFloor.map(
                      room =>
                        room.is_bookable && (
                          <button
                            className='btn btn-icon'
                            key={room.id}
                            title={room.room_name}
                            onClick={() => handleRoomClick(room)}
                          >
                            <i
                              className={`fa  
                                 ${
                                   isRoomFullyAvailable(room, selectedDate) ===
                                   'fully'
                                     ? 'fa-calendar-check-o text-success'
                                     : isRoomFullyAvailable(
                                           room,
                                           selectedDate,
                                         ) === 'partial'
                                       ? 'fa-calendar-minus-o text-warning'
                                       : 'fa-calendar-times-o text-danger'
                                 }`}
                              aria-hidden='true'
                            ></i>
                          </button>
                        ),
                    )}
                  </div>
                  {roomsOnFloor[0].floor.floor_planning && (
                    <img
                      src={roomsOnFloor[0].floor.floor_planning}
                      alt={`${floorName} Floor Plan`}
                      className='floor-plan-image'
                      onClick={() =>
                        handleImageClick(roomsOnFloor[0].floor.floor_planning)
                      }
                    />
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
      {/* /#sidebar-wrapper */}
      {/* Page Content */}
      <div id='page-content-wrapper'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-lg-12'>
              <div id='header'>
                {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                <img src={header} alt='Room  Booking Header Image' />
              </div>
              <div
                id='map'
                style={{
                  overflowY: 'hidden',
                  whiteSpace: 'nowrap',
                  height: '90%',
                }}
              >
                <img
                  id='building'
                  src={require('./building.svg').default}
                  alt='mySvgImage'
                  useMap='#campusMap'
                />
                <map name='campusMap'>
                  <area
                    className='building'
                    shape='poly'
                    coords='83,676,119,752,134,786,146,807,213,822,263,798,414,722,323,549'
                    onClick={() => buildingClick('d')}
                    alt='building d'
                  />
                  <area
                    alt='building b'
                    className='building'
                    shape='poly'
                    coords='582,667,534,846,724, 1046,881,949,817,775,611,645'
                    onClick={() => buildingClick('b')}
                  />

                  <area
                    alt='building a'
                    className='building'
                    shape='poly'
                    coords='829,609,1059,784,1303,625,1286,328,1126,217,933,331,886,367'
                    onClick={() => buildingClick('a')}
                  />

                  <area
                    alt='building c'
                    className='building'
                    shape='poly'
                    coords='1243,290,1471,447, 1507,413,1275,271'
                    onClick={() => buildingClick('c')}
                  />
                </map>
              </div>

              <button
                onClick={handleMenuToggle}
                className='btn btn-default'
                id='menu-toggle'
              >
                Toggle Menu
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* /#page-content-wrapper */}

      {isModalOpen && (
        <Modal
          centered
          enforceFocus
          size='xl'
          show={isModalOpen}
          onHide={closeModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Floor Planning</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={selectedImage}
              alt='Floor Plan'
              className='modal-content'
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {isModalRoomOpen && (
        <Modal
          centered
          enforceFocus
          size='xl'
          show={isModalRoomOpen}
          onHide={() => setIsModalRoomOpen(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedRoom.room_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label htmlFor='name' className='form-label'>
                  Name
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='name'
                  value={username}
                  onChange={e => setUserName(e.target.value)}
                  required
                />
              </div>

              <div className='mb-3'>
                <label htmlFor='name' className='form-label'>
                  Email
                </label>
                <input
                  type='email'
                  className='form-control'
                  id='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className='mb-3'>
                <label htmlFor='phoneNumber' className='form-label'>
                  Phone Number
                </label>
                <input
                  type='tel'
                  className='form-control'
                  id='phoneNumber'
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='startTime' className='form-label'>
                  Start Time
                </label>
                <input
                  type='datetime-local'
                  className='form-control'
                  id='startTime'
                  value={startTime}
                  onChange={handleStartTimeChange}
                  required
                />
              </div>

              <div className='mb-3'>
                <label htmlFor='endTime' className='form-label'>
                  End Time
                </label>
                <input
                  type='datetime-local'
                  className='form-control'
                  id='endTime'
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  required
                  min={startTime} // Restrict minimum selectable time
                  max={calculateMaxTime(startTime)} // Dynamically calculate max time
                />
              </div>
              {selectedRoom.booked_slots.length === 0 ? (
                ''
              ) : (
                <p>
                  {' '}
                  Booked Slots on <b>{selectedDate}</b>
                </p>
              )}

              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginBottom: '12px',
                }}
              >
                {selectedRoom.booked_slots.map(item => (
                  <div key={item.id}>
                    <Badge pill bg='success' className='me-2'>
                      {moment(item.start_time).format('h:mm a')} -{' '}
                      {moment(item.end_time).format('h:mm a')}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={() => setIsModalRoomOpen(false)}
                >
                  Close
                </button>
                <button type='submit' className='btn btn-primary'>
                  Book
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  )
}

export default App
