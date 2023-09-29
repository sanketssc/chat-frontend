import { io } from "socket.io-client";

const socket = io(
  "http://ec2-52-66-251-149.ap-south-1.compute.amazonaws.com:8000/"
);

export default socket;
