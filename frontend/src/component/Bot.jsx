import React, { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

function Bot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input;
    setMessages((prev) => [...prev, { text: userText, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:4002/bot/v1/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userText }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { text: data.botMessage, sender: "bot" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: data.error || "Something went wrong.", sender: "bot" },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Could not connect to the server.", sender: "bot" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    /* OUTER CONTAINER: Now truly full screen without padding */
    <div style={{ 
      backgroundColor: '#000', 
      height: '100vh', 
      width: '100vw',
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: 'sans-serif', 
      color: 'white',
      overflow: 'hidden'
    }}>
      
      {/* HEADER: Full width at the top */}
      <div style={{ 
        padding: '20px 30px', 
        borderBottom: '1px solid #1e293b', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: '#0a0a0a',
        flexShrink: 0
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px' }}>HeyBot</h1>
        <FaUserCircle size={28} style={{ color: '#94a3b8', cursor: 'pointer' }} />
      </div>

      {/* CHAT AREA: Expands to fill all available middle space */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '40px 10% 20px 10%', // Added side padding for better readability on wide screens
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px',
        backgroundColor: '#0f172a' 
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', color: '#64748b' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👋</div>
            <h2 style={{ color: 'white' }}>How can I help you today?</h2>
            <p>I'm <span style={{ color: '#22c55e', fontWeight: 'bold' }}>HeyBot</span>, your AI assistant.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ 
            alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", 
            maxWidth: '70%', 
            padding: '15px 20px', 
            borderRadius: '20px', 
            fontSize: '15px', 
            lineHeight: '1.6',
            backgroundColor: msg.sender === "user" ? "#2563eb" : "#1e293b", 
            color: 'white',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            wordBreak: 'break-word'
          }}>
            {msg.text}
          </div>
        ))}

        {isTyping && (
          <div style={{ 
            alignSelf: 'flex-start', 
            padding: '12px 20px', 
            borderRadius: '20px', 
            backgroundColor: '#1e293b', 
            fontSize: '13px', 
            color: '#94a3b8',
            fontStyle: 'italic'
          }}>
            HeyBot is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA: Fixed at the bottom, centered input bar */}
      <div style={{ 
        padding: '30px 10%', 
        background: '#0a0a0a',
        borderTop: '1px solid #1e293b', 
        flexShrink: 0 
      }}>
        <div style={{ 
          display: 'flex', 
          backgroundColor: '#1e293b', 
          borderRadius: '30px', 
          padding: '10px 25px', 
          alignItems: 'center',
          maxWidth: '900px', // Keeps the input bar from getting too wide on monitors
          margin: '0 auto', // Centers the input bar
          border: '1px solid #334155'
        }}>
          <input
            style={{ 
              flex: 1, 
              background: 'transparent', 
              border: 'none', 
              outline: 'none', 
              color: 'white', 
              padding: '10px',
              fontSize: '16px'
            }}
            placeholder={isTyping ? "Please wait..." : "Type your message here..."}
            disabled={isTyping}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={isTyping}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: isTyping ? '#475569' : '#22c55e', 
              fontWeight: 'bold', 
              fontSize: '1rem',
              cursor: isTyping ? 'default' : 'pointer',
              paddingLeft: '15px',
              transition: 'color 0.2s'
            }}
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bot;