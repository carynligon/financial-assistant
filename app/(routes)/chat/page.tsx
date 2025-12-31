"use client";
import BackButton from "@/app/components/buttons/BackButton";
import ChatList, { ChatListRef } from "@/app/components/chat/ChatList";
import { useRef, useState } from "react";
import styles from "./Chat.module.css";

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
      <div className={styles.container}>
        <div className={styles.chatWrapper}>
          <ChatList loading={loading} ref={chatListRef} />
          <div className={styles.divider}></div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <textarea
              className={styles.textarea}
              name="message"
              placeholder="Type your message..."
              value={message}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
            <button
              className={styles.submitButton}
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
