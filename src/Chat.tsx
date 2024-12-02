import { useEffect, useState } from 'react'
import './Chat.scss'
import useWebSocket, { ReadyState } from "react-use-websocket"

const WS_URL = "ws://localhost:82?chatroom=qweqwe"

interface ChatMessage {
    from: string
    data: string
    date: string
}

function Chat() {
    const [property_name, setPropertyName] = useState('unknown')
    const [chats, setChats] = useState([] as ChatMessage[])
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

          <h1>chat with your neighbors at {property_name}</h1>
          <ul>
            <li>Your landlord / property-manager might be on this chat</li>
            <li>Don't share any identifying information</li>
            <li><strong>Use this only to organize a physical meetup or something where you can vet everyone</strong></li>
          </ul>
            <div className='chats'>
            {chats.map((chat, i) => (
                <div key={i} className='chat-bubble'>
                    <div className='chat-bubble-header'>
                      <p className='chat-from'>{chat.from}</p>
                      <p className='chat-date'>{chat.date}</p>
                    </div>

                    <p className='chat-message'>{chat.data}</p>
                </div>
            ))}
            </div>
            <div className='chat-input'>
            <textarea
            placeholder="type a message"

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
                    setChats([...chats, {
                      from: 'you', 
                      data: message,
                      date: new Date().toLocaleString()
                    }])
                }
            }}>send</button>
            </div>
        </div>
    )
}

export default Chat;