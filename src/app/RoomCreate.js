"use client";
import socket from "@/lib/socket";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { useCreateRoomStore } from "@/stores/createRoomStore";

const Page = ({ roomId }) => {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [roomToJoin, setRoomToJoin] = useState("");
  const [invalidUserName, setInvalidUserName] = useState(false);
  console.log(roomId);
  const { setItem } = useCreateRoomStore();
  const [createRoom, setCreateRoom] = useState(true);
  const [joinRoom, setJoinRoom] = useState(false);
  const [serverConnected, setServerConnected] = useState(false);

  useEffect(() => {
    socket.on("welcome", (data) => {
      setServerConnected(true);

      console.log(data);
    });
  }, []);

  useEffect(() => {
    socket.on("room-created", (data) => {
      console.log(user);
      setItem({ type: "create", username: user });
      router.push(`/room/${roomId}`);
    });
  }, []);

  useEffect(() => {
    socket.on("room-joined", (roomId) => {
      setItem({ type: "join", username: user });
      router.push(`/room/${roomId}`);
    });
  }, []);

  const handleCreate = () => {
    if (user.trim() === "") {
      setInvalidUserName(true);
      return;
    }
    socket.emit("create-room", { username: user.trim(), roomId });
  };
  const handleRoomJoin = () => {
    if (user.trim() === "") {
      setInvalidUserName(true);
      return;
    }
    if (roomToJoin.trim() === "") return alert("Please enter a room code");
    socket.emit("join-room", { username: user.trim(), roomId: roomToJoin });
  };

  return (
    <div>
      <div className="flex w-screen h-screen ">
        <div className="flex flex-col justify-center w-full items-center">
          {!serverConnected ? (
            <div>
              Not connected to server Please Wait
              <br /> server might take few minutes to load for first try
              <br /> working on updating backend service please consider
            </div>
          ) : (
            <div>Connected to server</div>
          )}
          <div className="flex flex-col items-center justify-center gap-4 border py-4 px-4 bg-gray-950/25 border-white rounded-lg">
            <h2 className="text-3xl">Welcome</h2>
            {createRoom ? (
              <div className="flex flex-col gap-2 pt-4 items-center justify-center">
                <input
                  className={`bg-gray-950/25 border rounded-md px-2 py-1 h-12 focus:outline-non border-gray-500 required:border-red-600 w-96`}
                  type="text"
                  required={invalidUserName}
                  placeholder="Enter username"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />
                <div className="flex justify-center items-center ">
                  <div className="px-3 border border-r-0 py-1 h-12 w-80 text-center items-center flex justify-center border-gray-500 rounded-l-md">
                    {roomId}
                  </div>
                  <button
                    className="border border-l-gray-700 border-gray-500 flex items-center justify-center h-12 py-1 w-16 hover:bg-gray-800 rounded-r-md px-1"
                    onClick={() => navigator.clipboard.writeText(roomId)}
                  >
                    C
                  </button>
                </div>
                <button
                  className="border border-gray-500 px-2 w-96 py-1 h-12 rounded-md"
                  onClick={handleCreate}
                >
                  Create
                </button>
              </div>
            ) : (
              <button
                className="border border-gray-500 px-2 w-96 py-1 h-12 rounded-md"
                onClick={() => {
                  setCreateRoom(true);
                  setJoinRoom(false);
                }}
              >
                Create Room
              </button>
            )}
            <div className="flex items-center">
              <div className="w-44 h-[1px] bg-gray-700"></div>
              <div className="w-8 text-center text-gray-500">OR</div>
              <div className="w-44 h-[1px] bg-gray-700"></div>
            </div>
            {joinRoom ? (
              <div>
                <div className="flex flex-col gap-1 items-center pb-4">
                  <input
                    className={`bg-gray-950/25 border rounded-md px-2 py-1 h-12 focus:outline-non border-gray-500 required:border-red-600 w-96`}
                    type="text"
                    required={invalidUserName}
                    placeholder="Enter username"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                  />
                  <input
                    className="bg-gray-950/25 border w-96 focus:outline-none h-12 border-gray-500 rounded-md px-2 py-1"
                    type="text"
                    placeholder="Enter RoomId"
                    value={roomToJoin}
                    onChange={(e) => setRoomToJoin(e.target.value)}
                  />
                  <button
                    className="border border-gray-500 w-96 px-2 py-1 h-12 rounded-md"
                    onClick={handleRoomJoin}
                  >
                    Join Room with code
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="border border-gray-500 px-2 w-96 py-1 h-12 rounded-md"
                onClick={() => {
                  setJoinRoom(true);
                  setCreateRoom(false);
                }}
              >
                Join Room
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
