import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface IChatMessage {
  sender: string;
  message: string;
  timestamp?: Date;
}

const socket = io("http://localhost:3000");

export default function Index() {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState<string | null>(null);
  const myName = "Mohammed";

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("recieveMessage", (data) => {
      console.log(data);
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
  }, []);

  function handleSendMessage(e: MouseEvent) {
    e.preventDefault();
    const chatInput = document.getElementById(
      "chat-textbox"
    ) as HTMLInputElement;

    if (/\S/.test(chatInput.value)) {
      const newMessage: IChatMessage = {
        sender: myName,
        message: chatInput.value,
      };
      socket.emit("createMessage", { message: newMessage.message });
      setMessages([...messages, newMessage]);
      chatInput.value = "";
    }
  }

  useEffect(() => {
    const chatBox = document.getElementById("chat-messages");
    if (chatBox) chatBox.scrollTop += 1000;
  }, [messages]);

  return (
    <div className="chat-box flex flex-col w-auto m-1 p-5 max-w-[750px]">
      <ul
        id="chat-messages"
        className="chat-messages flex flex-col m-2 max-h-[400px] overflow-auto"
      >
        {messages.map((message, index) => {
          return (
            <li key={index} className="chat-message">
              {message.message}
            </li>
          );
        })}
      </ul>
      {messages.length === 0 ? (
        <h1 className="text-cyan-500 text-sm text-center">
          No Messages Yet... 😢
        </h1>
      ) : null}

      <form className="chat-input flex flex-row gap-1 my-3 bg-cyan-500 px-3 py-6 rounded-xl">
        <input
          className="w-full mx-5 rounded outline-none px-4 py-2 text-cyan-700 text-sm "
          type="text"
          name="chat-textbox"
          id="chat-textbox"
          placeholder="Type a message"
        />
        <button
          className="bg-cyan-500 px-3 py-1 rounded-sm text-gray-50 hover:bg-cyan-700"
          onClick={(e) => handleSendMessage(e as unknown as MouseEvent)}
        >
          Send
        </button>
      </form>
    </div>
  );
}
