import { createContext } from "react";
import io, { Socket } from "socket.io-client";

export default interface ISocket extends Socket {
  [k: string]: any;
}

export const socket: ISocket = io("localhost:5000", { autoConnect: false });
export const SocketContext = createContext(socket);
