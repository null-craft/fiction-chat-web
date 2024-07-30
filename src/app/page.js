'use client'
// import Image from "next/image";
import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { useState, useRef } from "react";
import styles from "./main.module.css"

const Home = () => {
  const [messages, setMessages] = useState([
        { role: "system", content: "You are LARPing as Gandalf from the Lord of the Rings." },
  ])
  const roleFormatOverrides = {
    "user": "You",
    "assistant": "Gandalf",
  }

  const engine = useRef(null)
  async function chat(newMessage) {
    setMessages(messages.concat({role: "user", content: newMessage}))
    const initProgressCallback = (initProgress) => {
      console.log(initProgress)
    }
    const selectedModel = "SmolLM-135M-Instruct-q4f32_1-MLC"

    try {
      if (engine.current === null) {
        engine.current = await CreateMLCEngine(
        selectedModel,
        { initProgressCallback: initProgressCallback }, // engineConfig
      );
      }
      const conversation = messages.concat({role: "user", content: newMessage})
      const reply = await engine.current.chat.completions.create({
        messages: conversation,
      });
      const replyMessage = reply.choices[0].message
      setMessages(conversation.concat([replyMessage]))
      console.log(reply.choices[0].message)
      console.log(reply.usage);
       
    } catch (error) {
      setMessages(messages.concat({role: "browser", content: error.message}))
    }

  }

  const handleNewMessage = () => {
    const chatInput = document.getElementById("chatInput")
    const newMessage = chatInput.value
    chatInput.value = ""
    chat(newMessage)
  }

    
  return (
    <main className={styles.mainCcontent}>

      <div id="conversationHistory">
        <ul>
          {messages.map((msg, index) => {
            if (!msg) return null
            const msgRole = roleFormatOverrides[msg.role] || msg.role
            if (msgRole === "system") {
              return null
            } else {
              return <li key={`msg${index}`}>{msgRole}: {msg.content}</li>
            }
          })}
        </ul>
      </div>
      <input type="text" id="chatInput" className={styles.chatInput} />
      <button id="sendChatMessage" onClick={handleNewMessage}>Send</button>
    </main>
  );
}

export default Home;