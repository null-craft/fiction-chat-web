'use client'
// import Image from "next/image";
import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { useEffect, useState } from "react";

const Home = props => {
  const [message, setMessage] = useState("Loading")
  useEffect(() => {
    async function doStuff() {
      const initProgressCallback = (initProgress) => {
        console.log(initProgress)
      }
      const selectedModel = "SmolLM-135M-Instruct-q4f32_1-MLC";
      const role = "Gandalf";

      try {
      const engine = await CreateMLCEngine(
        selectedModel,
        { initProgressCallback: initProgressCallback }, // engineConfig
      );

      const messages = [
        { role: "system", content: "You are LARPing as Gandalf from Lord of the Rings." },
        { role: "user", content: "Hi Gandalf!" },
      ]

      const reply = await engine.chat.completions.create({
        messages,
      });
      const replyMessage = reply.choices[0].message
      setMessage(`${role || replyMessage.role}: ${replyMessage.content}`)
      console.log(reply.choices[0].message)
      console.log(reply.usage);
      } catch (error) {
        console.log(error.message)
        setMessage(error.message)
      }

    }
    doStuff()

  }, [])

  return (
    <main>
      {message}
    </main>
  );
}

export default Home;