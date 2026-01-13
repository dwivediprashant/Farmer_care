import { useState, useEffect } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m NeoKrishi AI. Ask me anything about farming, crops, or agriculture!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      
      if (response.ok) {
        const botMessage = { type: 'bot', text: data.reply };
        setMessages(prev => [...prev, botMessage]);
        speakText(data.reply);
      } else {
        setMessages(prev => [...prev, { type: 'bot', text: 'Sorry, I\'m having trouble right now. Please try again.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: 'Connection error. Please check your internet.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div 
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          backgroundColor: '#2E7D32',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(46, 125, 50, 0.4)',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-robot'} text-white`} style={{fontSize: '24px'}}></i>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="chatbot-window"
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: 'min(450px, calc(100vw - 40px))',
            height: 'min(500px, calc(100vh - 200px))',
            backgroundColor: 'var(--bs-body-bg)',
            border: '1px solid var(--bs-border-color)',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div 
            style={{
              backgroundColor: '#2E7D32',
              color: 'white',
              padding: '15px',
              borderRadius: '15px 15px 0 0'
            }}
          >
            <h6 className="mb-0">
              <i className="fas fa-robot me-2"></i>
              NeoKrishi AI Assistant
            </h6>
          </div>

          {/* Messages */}
          <div 
            className="messages-container"
            style={{
              flex: 1,
              padding: '15px',
              overflowY: 'auto',
              backgroundColor: 'var(--bs-body-bg)'
            }}
          >
            {messages.map((msg, index) => (
              <div 
                key={index}
                style={{
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', maxWidth: '80%' }}>
                  <div
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '15px',
                      backgroundColor: msg.type === 'user' ? '#2E7D32' : '#f8f9fa',
                      color: msg.type === 'user' ? 'white' : '#2c3e50',
                      fontSize: '15px',
                      lineHeight: '1.6',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}
                  >
                    {msg.text}
                  </div>
                  {msg.type === 'bot' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      disabled={isSpeaking}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2E7D32',
                        fontSize: '16px',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i className={`fas ${isSpeaking ? 'fa-volume-up' : 'fa-volume-down'}`}></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '15px',
                    backgroundColor: '#f1f1f1',
                    color: '#333'
                  }}
                >
                  <i className="fas fa-spinner fa-spin"></i> Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div 
            style={{
              padding: '15px',
              borderTop: '1px solid var(--bs-border-color)',
              backgroundColor: 'var(--bs-body-bg)'
            }}
          >
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Ask about farming..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}
              />
              {recognition && (
                <button
                  className={`btn ${isListening ? 'btn-danger' : 'btn-warning'}`}
                  onClick={startListening}
                  disabled={loading || isListening}
                  style={{
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    padding: '0'
                  }}
                >
                  <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
                </button>
              )}
              {isSpeaking && (
                <button
                  className="btn btn-secondary"
                  onClick={stopSpeaking}
                  style={{
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    padding: '0'
                  }}
                >
                  <i className="fas fa-stop"></i>
                </button>
              )}
              <button
                className="btn btn-success"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  padding: '0'
                }}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;