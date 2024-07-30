'use client'
// import Image from "next/image";
import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { useState, useRef, useEffect } from "react";
import styles from "./main.module.css"

const Home = () => {
  const roleFormatOverrides = useRef({
    "user": "You",
  })
  const characterConfig = "/characters/config.json"
  const characterURLs = []
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(characterConfig)
      .then(res => res.json())
      .then((data) => {
        data.urls.map(url => characterURLs.push(url))
        fetch(characterURLs[0])
          .then(characterData => characterData.json())
          .then(loadedCharacterData => {
            roleFormatOverrides.current.assistant = loadedCharacterData.name
            setMessages([{ role: "system", content: `${loadedCharacterData.begin}\n Answer the user's questions with patience.` }])
            setLoading(false)
          })

      })
  }, [])
  const [messages, setMessages] = useState([])

  const engine = useRef(null)
  async function chat(newMessage) {
    setMessages(messages.concat({ role: "user", content: newMessage }))
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
      const conversation = messages.concat({ role: "user", content: newMessage })
      const reply = await engine.current.chat.completions.create({
        messages: conversation,
      });
      const replyMessage = reply.choices[0].message
      setMessages(conversation.concat([replyMessage]))
      console.log(reply.choices[0].message)
      console.log(reply.usage);

    } catch (error) {
      setMessages(messages.concat({ role: "browser", content: error.message }))
    }

  }

  const handleNewMessage = () => {
    const chatInput = document.getElementById("chatInput")
    const newMessage = chatInput.value
    chatInput.value = ""
    chat(newMessage)
  }


  return (
    <main className={styles.mainContent}>
      {loading && <p>Loading...</p>}
      <div id="conversationHistory">
        <ul>
          {messages.map((msg, index) => {
            if (!msg) return null
            const msgRole = roleFormatOverrides.current[msg.role] || msg.role
            if (msgRole === "system") {
              return null
            } else {
              return <li key={`msg${index}`}>{msgRole}: {msg.content}</li>
            }
          })}
        </ul>
      </div>
      <input type="text" id="chatInput" className={styles.chatInput} />
      <button id="sendChatMessage" onClick={handleNewMessage} disabled={loading}>Send</button>
    </main>
  );
}

export default Home;