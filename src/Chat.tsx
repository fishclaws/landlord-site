import { useEffect, useState } from 'react'
import './Chat.scss'
import useWebSocket, { ReadyState } from "react-use-websocket"

const WS_URL = "ws://localhost:82/events"

function Chat() {

    const [message, setMessage] = useState('')
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
        WS_URL,
        {
          share: false,
          shouldReconnect: () => true,
        },
      )
    
      // Run when the connection state (readyState) changes
      useEffect(() => {
        console.log("Connection state changed")
        if (readyState === ReadyState.OPEN) {
          sendJsonMessage({
            event: "subscribe",
            data: {
              channel: "general-chatroom",
            },
          })
        }
      }, [readyState])
    
      // Run when a new WebSocket message is received (lastJsonMessage)
      useEffect(() => {
        console.log(`Got a new message: ${lastJsonMessage}`)
      }, [lastJsonMessage])
    
    return (
        <div className="chat">
            <h1>chat with your neighbors</h1>
            <input
            value={message}
            onChange={e => {
                setMessage(e.target.value)
            }}/>
            <button onClick={() => {
                if (message && message.length > 0) {
                    sendJsonMessage({
                        event: 'ping',
                        data: message
                    })
                    setMessage('')
                }
            }}>send</button>
        </div>
    )
}

export default Chat;