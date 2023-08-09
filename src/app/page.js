import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', 25)
import RoomCreate from "./RoomCreate";


export default function Home() {
    
    const roomId = nanoid()
    console.log(roomId)
    return (
        <RoomCreate roomId={roomId}/>

    )
}