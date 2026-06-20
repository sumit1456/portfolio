import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const Chatbot = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // Use TanStack Query to manage messages state persistently
  const { data: messages = [
    { role: 'bot', text: "Hi! I'm Sumit's AI assistant. How can I help you today?" }
  ] } = useQuery({
    queryKey: ['portfolio-chat'],
    queryFn: () => [], // Provide a simple dummy queryFn to satisfy TanStack Query v5
    enabled: false,
    initialData: [
      { role: 'bot', text: "Hi! I'm Sumit's AI assistant. How can I help you today?" }
    ]
  });

  const setMessages = (updater) => {
    queryClient.setQueryData(['portfolio-chat'], updater);
  };

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const formatText = (text) => {
    if (!text) return '';

    // Simple markdown-to-React formatter
    return text.split('\n').map((line, i) => {
      // Bold
      let parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      // Bullets
      if (line.trim().startsWith('* ')) {
        return <li key={i} className="bot-li">{renderedLine.slice(1)}</li>;
      }

      return <p key={i}>{renderedLine}</p>;
    });
  };

  const handleSend = async (customInput = null) => {
    const messageText = customInput || input;
    if (!messageText.trim()) return;

    const userMessage = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    if (!customInput) setInput('');
    setIsLoading(true);

    // Initial bot message placeholder for streaming
    setMessages(prev => [...prev, {
      role: 'bot',
      text: '',
      highlights: [],
      citations: [],
      suggested_questions: []
    }]);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/chat-portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          session_id: 'sumit-portfolio',
          history: messages.slice(-5).map(m => ({
            role: m.role === 'bot' ? 'assistant' : 'user',
            content: m.text
          })),
          llm_provider: 'google',
          llm_model: 'gemini-1.5-flash'
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botAnswer = '';
      let botHighlights = [];
      let botCitations = [];
      let botSuggestions = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;

            try {
              const parsed = JSON.parse(data);

              // Handle structured response
              if (parsed.answer !== undefined) botAnswer = parsed.answer;
              else if (typeof parsed === 'string') botAnswer += parsed;

              if (parsed.highlights) botHighlights = parsed.highlights;
              if (parsed.citations) botCitations = parsed.citations;
              if (parsed.suggested_questions) botSuggestions = parsed.suggested_questions;

              // Update the last message
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: 'bot',
                  text: botAnswer,
                  highlights: botHighlights,
                  citations: botCitations,
                  suggested_questions: botSuggestions
                };
                return newMessages;
              });
            } catch (e) {
              // If it's not JSON, it might be a raw string chunk
              botAnswer += data;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], text: botAnswer };
                return newMessages;
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { role: 'bot', text: 'Error connecting to the AI service.' };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <span className="icon">💬</span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="bot-info">
              <span className="bot-name">Sumit.AI</span>
              <div className="bot-status">Online</div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message-group ${msg.role}`}>
                <div className={`message ${msg.role}`}>
                  <div className="message-content">
                    {msg.role === 'bot' ? formatText(msg.text) : msg.text}
                  </div>

                  {msg.role === 'bot' && msg.highlights?.length > 0 && (
                    <div className="message-highlights">
                      <div className="section-label">Highlights</div>
                      <ul>
                        {msg.highlights.map((h, idx) => <li key={idx}>{h}</li>)}
                      </ul>
                    </div>
                  )}

                  {msg.role === 'bot' && msg.citations?.length > 0 && (
                    <div className="message-citations">
                      {msg.citations.map((c, idx) => (
                        <span key={idx} className="citation-tag">Source {c.page}</span>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'bot' && msg.suggested_questions?.length > 0 && (
                  <div className="suggested-questions">
                    {msg.suggested_questions.map((q, idx) => (
                      <button
                        key={idx}
                        className="suggestion-pill"
                        onClick={() => handleSend(q)}
                        disabled={isLoading}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={() => handleSend()} disabled={isLoading}>
              <span className="icon">➔</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
