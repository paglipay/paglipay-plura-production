"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ChatWidget } from "@paglipay/chat-widget";
import { Storytime } from "@papercups-io/storytime";
const st = Storytime.init({
  accountId: "b5200b14-be9d-4915-aa64-f514fb2c6ad5",

  // Optionally pass in metadata to identify the customer
  // customer: {
  //  name: 'Test User',
  //  email: 'test@test.com',
  //  external_id: '123',
  // },

  // Optionally specify the base URL
  baseUrl: "https://papercups.paglipay.info",
});
interface Message {
  id: number;
  text: string;
}

const ChatComponent: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState("room1");

  useEffect(() => {
    const socketIo = io("https://services.paglipay.info/", {
      reconnection: true, // Enable reconnection
      reconnectionAttempts: 5, // Number of reconnection attempts
      reconnectionDelay: 1000, // Delay between reconnection attempts (in milliseconds)
      reconnectionDelayMax: 5000, // Maximum delay between reconnection attempts
      randomizationFactor: 0.5, // Randomization factor to add randomness to reconnection attempts
    }); // Replace with your server URL

    setSocket(socketIo);

    socketIo.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      if (socketIo) socketIo.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for incoming layouts
      socket.on("layout", (layout) => {
        console.log("layout.layout.room: ", layout.layout.room);
        console.log("layout: ", layout);
      });

      socket.on("yourID", (id) => {
        console.log("socket_id:", id);
      });

      socket.on("connect_error", async (error) => {
        console.error("Connection error:", error);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
      });

      socket.on("reconnect_attempt", async (attemptNumber) => {
        console.log(`Attempting to reconnect (${attemptNumber})`);
      });
    }
  }, [socket]);

  const joinRoom = () => {
    console.log("joinRoom: ", room);

    if (socket && room.trim() !== "") {
      socket.emit("join", {
        name: "nextjs-react",
        room,
      });
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <Button onClick={joinRoom}>Join Room</Button>
      <br />
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>{msg.text}</li>
        ))}
      </ul>
    </div>
  );
};

type Props = {
  subaccountId: string;
};

const CreateButton = ({ subaccountId }: Props) => {
  const [disable, setDisable] = useState(false);
  const handleCreate = async () => {
    console.log("Create Contact");
    setDisable(true);
    const res = await fetch("/api/automations", {
      method: "POST",
      body: JSON.stringify({
        jobs: [{ import: "Key" }, { True: "start.json" }],
      }),
    });
    console.log(res);
    console.log(res.body);

    const data = await res.json();
    console.log(data);
    setDisable(false);
  };

  return (
    <>
      <ChatComponent />
      <br />
      <Button onClick={handleCreate} disabled={disable}>
        Create Contact
      </Button>
      <ChatWidget
        // `accountId` is used instead of `token` in older versions
        // of the @paglipay/chat-widget package (before v1.2.x).
        // You can delete this line if you are on the latest version.
        // accountId="b5200b14-be9d-4915-aa64-f514fb2c6ad5"
        token="b5200b14-be9d-4915-aa64-f514fb2c6ad5"
        inbox="66180fcb-f6bf-49a6-934f-098ddc0a94c4"
        title="Welcome to Paglipay"
        subtitle="Ask us anything in the chat window below 😊"
        primaryColor="#1890ff"
        newMessagePlaceholder="Start typing..."
        showAgentAvailability={false}
        agentAvailableText="We're online right now!"
        agentUnavailableText="We're away at the moment."
        requireEmailUpfront={false}
        iconVariant="outlined"
        baseUrl="https://papercups.paglipay.info"
        // Optionally include data about your customer here to identify them
        // customer={{
        //   name: __CUSTOMER__.name,
        //   email: __CUSTOMER__.email,
        //   external_id: __CUSTOMER__.id,
        //   metadata: {
        //     plan: "premium"
        //   }
        // }}
      />
    </>
  );
};

export default CreateButton;
