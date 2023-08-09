import {io} from 'socket.io-client';

const socket = io(process.env.S_URL);


export default socket 