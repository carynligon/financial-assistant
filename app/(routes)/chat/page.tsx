"use client";
import BackButton from "@/app/components/buttons/BackButton";
import ChatList, { ChatListRef } from "@/app/components/chat/ChatList";
import Link from "next/link";
import { useRef, useState } from "react";

export default function Chat() {
  const chatListRef = useRef<ChatListRef>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const value = e?.target?.value;
      if (typeof value === "string") {
        setMessage(value);
      }
    } catch (error) {
      console.error("Error in handleInputChange:", error);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
          role: "user",
          metadata: null,
        }),
      });

      if (response.ok) {
        setMessage(""); // Clear input
        // Refresh the chat list
        chatListRef.current?.refresh();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <BackButton />
      <div className="m-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <ChatList loading={loading} ref={chatListRef} />
          <div className="mt-4 border-t border-gray-200 pt-4"></div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <textarea
              className="w-full p-2 border border-gray-200 rounded-lg"
              name="message"
              placeholder="Type your message..."
              value={message}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
            <button
              className="w-3xs bg-blue-600 text-white px-4 py-2 rounded-lg"
              type="submit"
              disabled={loading || !message.trim()}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
