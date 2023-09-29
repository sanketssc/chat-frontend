"use client";
import socket from "@/lib/socket";
import { useEffect } from "react";

const page = () => {
  useEffect(() => {
    socket.emit("wakeup", "hello");
  }, []);

  return <div>page</div>;
};

export default page;
