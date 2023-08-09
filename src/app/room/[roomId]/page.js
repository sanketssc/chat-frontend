import Room from './Room'


const RoomPage = ({params}) => {
  return (
    <Room roomId={params.roomId} />
  )
}

export default RoomPage