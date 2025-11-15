"use client";
import { ChatMessage } from "@/app/generated/prisma";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import cn from "classnames";
import styles from "./ChatList.module.css";

export interface ChatListRef {
  refresh: () => void;
}

type Props = {
  loading: boolean;
};

const ChatList = forwardRef<ChatListRef, Props>(({ loading }, ref) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const fetchMessages = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/chat`,
    );
    const data = await response.json();
    setMessages(data);
  };

  useEffect(() => {
    // Define and call async function inside effect
    const loadMessages = async () => {
      await fetchMessages();
    };
    loadMessages();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    const scrollContainer = document.querySelector(".chatScrollContainer");
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  useImperativeHandle(ref, () => ({
    refresh: fetchMessages,
  }));

  return (
    <ul
      className={`chatScrollContainer overflow-y-scroll flex flex-col gap-2 ${styles.chatScrollContainer}`}
    >
      {messages.map((message) => (
        <li
          className={cn("text-sm p-3 rounded-lg", {
            "self-end bg-blue-600 text-white": message.role === "user",
            "bg-gray-100 self-start text-black dark:bg-gray-800 dark:text-white": message.role === "assistant",
          })}
          key={message.id}
        >
          {message.content}
        </li>
      ))}
      {loading ? "..." : ""}
    </ul>
  );
});

ChatList.displayName = "ChatList";

export default ChatList;
