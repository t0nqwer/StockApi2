import { io } from "socket.io-client";
const Url = "http://localhost:7070";

export const socket = io(Url, {});

socket.on("connect", () => {
  console.log("connected to server");
});
socket.on("newproduct", (data) => {
  console.log(data);
});
