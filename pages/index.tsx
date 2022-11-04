import Head from "next/head";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface IChatMessage {
  senderId: number;
  message: string;
  timestamp?: Date;
}

const socket = io("https://playground.ahmed-gamal.com");

export default function Index() {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState<string | null>(null);
  const senderId = Math.random();

  console.log(process.env.socket_link);
  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("recieveMessage", (data) => {
      const newMessage: IChatMessage = {
        message: data.message,
        senderId,
      };
      setMessages([...messages, newMessage]);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("pong", () => {
      setLastPong(new Date().toISOString());
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, [messages]);

  function handleSendMessage(e: MouseEvent) {
    e.preventDefault();
    const chatInput = document.getElementById(
      "chat-textbox"
    ) as HTMLInputElement;

    if (/\S/.test(chatInput.value)) {
      const newMessage: IChatMessage = {
        senderId,
        message: chatInput.value,
      };
      socket.emit("createMessage", { message: newMessage.message, senderId });
      chatInput.value = "";
    }
  }

  useEffect(() => {
    const chatBox = document.getElementById("chat-messages");
    if (chatBox) chatBox.scrollTop += 5000;
  }, [messages]);

  if (!isConnected)
    return (
      <h1 className="text-cyan-600 text-3xl m-2 font-bold">Conecting...</h1>
    );

  return (
    <div className="chat-box flex flex-col h-screen w-screen justify-between">
      <ul
        id="chat-messages"
        className="chat-messages flex flex-col m-2 h-full overflow-auto"
      >
        {messages.map((message, index) => {
          return (
            <div
              key={index}
              className={`message flex w-full ${
                message.senderId === senderId ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <li
                className={`chat-message ${
                  message.senderId === senderId ? "bg-gray-400" : "bg-cyan-500"
                }`}
              >
                {message.message}
              </li>
            </div>
          );
        })}
      </ul>
      {messages.length === 0 ? (
        <h1 className="text-cyan-500 text-sm text-center">
          No Messages Yet... 😢
        </h1>
      ) : null}

      <form className="chat-input flex flex-row gap-1 bg-cyan-500 py-6 px-3">
        <input
          className="w-full mx-5 rounded outline-none px-4 py-2 text-cyan-700 text-sm "
          type="text"
          name="chat-textbox"
          id="chat-textbox"
          placeholder="Type a message"
          autoComplete="off"
        />
        <button
          className="bg-cyan-500 px-3 text-gray-50"
          onClick={(e) => handleSendMessage(e as unknown as MouseEvent)}
        >
          Send
        </button>
      </form>
    </div>
  );
}
