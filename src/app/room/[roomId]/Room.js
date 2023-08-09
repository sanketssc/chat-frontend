"use client";
import React, { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";
import { useCreateRoomStore } from "@/stores/createRoomStore";

const Room = ({ roomId }) => {
  const router = useRouter();
  const { user } = useUserStore();
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const { item } = useCreateRoomStore();
  console.log(item);

  useEffect(() => {
    if (!user) {
      console.log("user", user);
      router.replace("/");
    }
    if (messages.length === 0) {
      setMessages((messages) => [
        ...messages,
        { type: item.type, username: user },
      ]);
    }
  }, []);

  useEffect(() => {
    socket.on("user-joined", (username) => {
      console.log(`${username} joined the room`);
      setMessages((messages) => [{ type: "join", username }, ...messages]);
    });
  }, []);

  useEffect(() => {
    socket.on("user-left", (username) => {
      console.log(`${username} left the room`);
      setMessages((messages) => [{ type: "leave", username }, ...messages]);
    });
  }, []);

  const leaveRoom = () => {
    socket.emit("leave-room", { username: user, roomId });
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleMsgSend = (e) => {
    e.preventDefault();
    socket.emit("send-message", { username: user, roomId, msg });
    setMessages((messages) => [
      { type: "sent-message", username: user, msg },
      ...messages,
    ]);
    setMsg("");
  };

  useEffect(() => {
    socket.on("message", (data) => {
      console.log(data);
      setMessages((messages) => [
        { type: "received-message", username: data.username, msg: data.msg },
        ...messages,
      ]);
    });
  }, []);

  console.log(user);

  return (
    <div className="">
      <div className=" w-2/3 flex flex-col mx-auto items-center border-r border-l border-blue-700/40 px-2 h-screen">
        <div className="flex justify-between w-full px-2 py-2 items-center">
          <h1 className="">
            Room{" "}
            <button className=" px-4 bg-gray-400/25 py-2 rounded" onClick={() => navigator.clipboard.writeText(roomId)}>
              {roomId}
            </button>
          </h1>
          <button className="bg-gray-400/25 px-2 py-2 rounded-md" onClick={leaveRoom}>Leave Room</button>
        </div>
        <div className=" h-full overflow-y-auto px-2 w-full gap-1 flex flex-col-reverse">
          {messages.map((message, index) => (
            <div key={index} className="flex flex-col">
              {message.type === "create" && (
                <p className="text-center">
                  {message.username} created the room
                </p>
              )}
              {message.type === "join" && (
                <p className="text-center">
                  {message.username} joined the room
                </p>
              )}
              {message.type === "leave" && (
                <p className="text-center">{message.username} left the room</p>
              )}
              {/* add margin top -1 when previous message was send by same user */}
              {message.type === "sent-message" && (
                <div
                  className={`text-right px-2 py-1 rounded bg-gradient-to-l  from-stone-700 to-black ${
                    messages[index + 1]?.type === "sent-message"
                      ? "-mt-2"
                      : "mt-1"
                  }`}
                >
                  <p>{message.msg}</p>
                </div>
              )}
              {message.type === "received-message" && (
                <div
                  className={`flex flex-col text-left px-2 rounded py-1 bg-gradient-to-r from-slate-700 to-black ${
                    messages[index + 1]?.type === "received-message"
                      ? messages[index + 1]?.username === message.username
                        ? "-mt-2"
                        : "mt-1"
                      : "mt-1"
                  }`}
                >
                  {/* {messages[index + 1]?.username !== message.username ? (
                    <p className="text-xs text-blue-600 font-bold">{message.username}</p>
                  ) : null  } */}
                  {messages[index + 1]?.type === "join" ||
                  messages[index + 1]?.type === "leave" || messages[index + 1]?.type === "create" || messages[index +1]?.type === 'sent-message' ? (
                    <p className="text-xs text-blue-600 font-bold">
                      {message.username}
                    </p>
                  ) : messages[index + 1]?.username !== message.username ? (
                    <p className="text-xs text-blue-600 font-bold">
                      {message.username}
                    </p>
                  ) : null


                  } 

                  <p> {message.msg}</p>
                </div>
              )}

              {/* {message.type === "sent-message" && <p className={`text-right px-2 py-1 `}>You: {message.msg}</p>}
            {message.type === "received-message" && <p className="text-left px-2 py-1">{message.username}: {message.msg}</p>} */}
            </div>
          ))}
        </div>
        <form className="w-full flex py-2">
          <input
            className="w-full py-1 focus:outline-none bg-black border border-gray-500"
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button
            className="w-24 border py-1 border-gray-500 border-l-0"
            type="submit"
            onClick={handleMsgSend}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Room;
