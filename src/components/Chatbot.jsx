import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const INITIAL_MESSAGE = {
  role: 'bot',
  text: "Hi! I'm Sumit's AI assistant. Ask me about his experience, technical skills, portfolio projects, or background!",
  highlights: [],
  citations: [],
  suggested_questions: [
    "What are Sumit's core skills?",
    "Tell me about his key projects",
    "How can I contact Sumit?"
  ]
};

const Chatbot = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // Use TanStack Query to manage messages state persistently
  const { data: messages = [INITIAL_MESSAGE] } = useQuery({
    queryKey: ['portfolio-chat'],
    queryFn: () => [], // Provide a simple dummy queryFn to satisfy TanStack Query v5
    enabled: false,
    initialData: [INITIAL_MESSAGE]
  });

  const setMessages = (updater) => {
    queryClient.setQueryData(['portfolio-chat'], updater);
  };

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false); // true once reveal delay has passed
  const streamingTimerRef = useRef(null); // delay timer before revealing bubble
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const isNearBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    return container.scrollHeight - container.scrollTop - container.clientHeight < 150;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && isNearBottom()) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  // Helper to ensure raw JSON strings are never rendered directly to the user
  const getRenderableBotMessage = (msg) => {
    if (msg.role !== 'bot' || !msg.text) return msg;

    let text = msg.text;
    let highlights = msg.highlights || [];
    let citations = msg.citations || [];
    let suggested_questions = msg.suggested_questions || [];

    const trimmed = text.trim();
    if (trimmed.startsWith('{') && (trimmed.endsWith('}') || trimmed.includes('"answer"'))) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.answer || parsed.text || parsed.data?.answer) {
          text = parsed.answer || parsed.text || parsed.data?.answer || '';
          if (parsed.highlights || parsed.data?.highlights) {
            highlights = parsed.highlights || parsed.data?.highlights || [];
          }
          if (parsed.citations || parsed.data?.citations) {
            citations = parsed.citations || parsed.data?.citations || [];
          }
          if (parsed.suggested_questions || parsed.data?.suggested_questions) {
            suggested_questions = parsed.suggested_questions || parsed.data?.suggested_questions || [];
          }
        }
      } catch (e) {
        // Extract partial answer string if JSON is streaming
        const match = trimmed.match(/"answer"\s*:\s*"([^"]*)"?/);
        if (match && match[1]) {
          text = match[1];
        }
      }
    }

    return {
      ...msg,
      text,
      highlights,
      citations,
      suggested_questions
    };
  };

  const formatText = (text) => {
    if (!text) return '';

    const lines = text.split('\n');
    const elements = [];
    let currentList = [];

    const flushList = (key) => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`ul-${key}`} className="bot-ul" style={{ margin: '8px 0', paddingLeft: '0', listStyleType: 'none' }}>
            {currentList}
          </ul>
        );
        currentList = [];
      }
    };

    const formatInline = (str) => {
      if (!str) return '';
      const tokenRegex = /(\*\*.*?\*\*|`.*?`)/g;
      const parts = str.split(tokenRegex);
      return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={idx} style={{ fontWeight: '600', color: 'inherit' }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={idx}
              className="chat-code-inline"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      });
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed === '---') {
        flushList(i);
        elements.push(<hr key={i} style={{ border: '0', borderTop: '1px solid #E8E2D9', margin: '12px 0' }} />);
        continue;
      }

      const headerMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (headerMatch) {
        flushList(i);
        const level = headerMatch[1].length;
        const content = formatInline(headerMatch[2]);
        const style = {
          fontWeight: '600',
          color: 'inherit',
          marginTop: '10px',
          marginBottom: '4px',
          lineHeight: '1.3'
        };

        if (level === 1) elements.push(<h1 key={i} style={{ ...style, fontSize: '1.15rem' }}>{content}</h1>);
        else if (level === 2) elements.push(<h2 key={i} style={{ ...style, fontSize: '1.05rem' }}>{content}</h2>);
        else elements.push(<h3 key={i} style={{ ...style, fontSize: '0.95rem' }}>{content}</h3>);
        continue;
      }

      if (trimmed.startsWith('>')) {
        flushList(i);
        const content = formatInline(trimmed.substring(1).trim());
        elements.push(
          <blockquote
            key={i}
            className="chat-blockquote"
          >
            {content}
          </blockquote>
        );
        continue;
      }

      const listMatch = line.match(/^(\s*)[*+-]\s+(.*)$/);
      if (listMatch) {
        const content = formatInline(listMatch[2]);
        currentList.push(
          <li key={`li-${i}-${currentList.length}`} className="bot-li">
            {content}
          </li>
        );
        continue;
      }

      if (trimmed !== '') {
        flushList(i);
        elements.push(<p key={i} style={{ marginBottom: '6px', lineHeight: '1.55' }}>{formatInline(line)}</p>);
      } else {
        flushList(i);
        elements.push(<div key={i} style={{ height: '4px' }} />);
      }
    }

    flushList(lines.length);
    return elements;
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
      const baseUrl = 'https://my-images-python-backend.onrender.com';
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

      // ── HTTP error handling ────────────────────────────────────────────
      if (!response.ok) {
        let friendlyMessage = `The AI service returned an error (${response.status}).`;

        try {
          const errBody = await response.json();
          const serverMsg = errBody?.message || errBody?.detail || errBody?.error?.message || '';

          if (response.status === 429 || serverMsg.toLowerCase().includes('quota') || serverMsg.toLowerCase().includes('rate')) {
            friendlyMessage = "⚠️ The AI is temporarily rate-limited (too many requests). Please wait a moment and try again.";
          } else if (response.status === 503 || response.status === 502) {
            friendlyMessage = "⚠️ The AI service is currently starting up (cold start). Please try again in 30–60 seconds.";
          } else if (response.status >= 500) {
            friendlyMessage = "⚠️ The AI service encountered an internal error. Please try again shortly.";
          } else if (serverMsg) {
            friendlyMessage = `⚠️ ${serverMsg}`;
          }
        } catch (_) {
          // Could not parse error body — use the generic message
        }

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'bot', text: friendlyMessage };
          return newMessages;
        });
        setIsStreaming(true);
        return;
      }
      // ───────────────────────────────────────────────────────────────────


      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // rawTokens accumulates the full JSON string the LLM streams token-by-token
      // We NEVER display this directly — we wait for the 'result' event
      let rawTokenBuffer = '';
      let botAnswer = '';
      let botHighlights = [];
      let botCitations = [];
      let botSuggestions = [];
      let lineBuffer = '';
      let gotResult = false; // flips true only when a clean 'result' event arrives

      const processLine = (line) => {
        const trimmedLine = line.trim();
        if (!trimmedLine || !trimmedLine.startsWith('data: ')) return;

        const data = trimmedLine.slice(6).trim();
        if (!data || data === '[DONE]') return;

        try {
          const parsed = JSON.parse(data);

          if (parsed.type === 'token') {
            // Tokens form a raw JSON string — accumulate silently, never display
            if (typeof parsed.content === 'string') {
              rawTokenBuffer += parsed.content;
            }
            // Keep typing indicator — do NOT flip isStreaming here
            return;

          } else if (parsed.type === 'result') {
            // ✅ Clean structured data from backend — safe to display
            if (parsed.data) {
              botAnswer = parsed.data.answer || '';
              botHighlights = parsed.data.highlights || [];
              botCitations = parsed.data.citations || [];
              botSuggestions = parsed.data.suggested_questions || [];
            }
            gotResult = true;

          } else if (parsed.type === 'error') {
            botAnswer = parsed.message || 'An error occurred.';
            gotResult = true;

          } else {
            // Fallback: direct JSON format (no 'type' field)
            if (parsed.answer !== undefined) botAnswer = parsed.answer;
            if (parsed.highlights) botHighlights = parsed.highlights;
            if (parsed.citations) botCitations = parsed.citations;
            if (parsed.suggested_questions) botSuggestions = parsed.suggested_questions;
            gotResult = true;
          }
        } catch (e) {
          // JSON parse failed — this is a raw text chunk (non-JSON backend)
          // Only append if it looks like plain text, not a JSON fragment
          if (!data.startsWith('{') && !data.startsWith('[') && !data.includes('"answer"')) {
            botAnswer += data;
            gotResult = true;
          }
          // Otherwise silently ignore (it's a partial JSON fragment from token streaming)
        }

        // Only update the visible message & flip to streaming when we have clean data
        if (gotResult) {
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
          setIsStreaming(true);
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          if (lineBuffer) processLine(lineBuffer);
          break;
        }

        lineBuffer += decoder.decode(value, { stream: true });
        const lines = lineBuffer.split('\n');
        lineBuffer = lines.pop(); // Keep partial line

        for (const line of lines) {
          processLine(line);
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { role: 'bot', text: 'Error connecting to the AI service.' };
        return newMessages;
      });
      setIsStreaming(true); // show error message
    } finally {
      if (streamingTimerRef.current) {
        clearTimeout(streamingTimerRef.current);
        streamingTimerRef.current = null;
      }
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <button 
          className="chatbot-toggle" 
          onClick={() => setIsOpen(true)}
          aria-label="Open Chatbot"
        >
          <span className="chatbot-toggle-icon">✨</span>
          <span className="chatbot-toggle-badge">1</span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="bot-profile">
              <div className="bot-avatar">✨</div>
              <div className="bot-info">
                <span className="bot-name">Sumit.AI</span>
                <div className="bot-status">
                  <span className="status-dot"></span> Online
                </div>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button 
                className="clear-btn" 
                onClick={clearChat} 
                title="Clear Chat"
                aria-label="Clear Chat"
              >
                🗑️
              </button>
              <button 
                className="close-btn" 
                onClick={() => setIsOpen(false)}
                aria-label="Close Chatbot"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="chatbot-messages" ref={messagesContainerRef}>
            {messages.map((rawMsg, i) => {
              const msg = getRenderableBotMessage(rawMsg);
              // Skip the last bot placeholder while waiting for first token (typing indicator shows instead)
              const isLastMessage = i === messages.length - 1;
              if (msg.role === 'bot' && isLastMessage && isLoading && !isStreaming) {
                return null;
              }
              return (
                <div key={i} className={`message-group ${msg.role}`}>
                  <div className={`message ${msg.role}`}>
                    {msg.role === 'bot' && (
                      <div className="msg-bot-avatar">✨</div>
                    )}
                    <div className="message-bubble">
                      <div className="message-content">
                        {msg.role === 'bot' ? formatText(msg.text) : msg.text}
                      </div>

                      {msg.role === 'bot' && msg.highlights?.length > 0 && (
                        <div className="message-highlights">
                          <div className="section-label">⚡ Highlights</div>
                          <ul>
                            {msg.highlights.map((h, idx) => (
                              <li key={idx}>
                                <span className="highlight-check">✓</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {msg.role === 'bot' && msg.citations?.length > 0 && (
                        <div className="message-citations">
                          <div className="section-label">🔗 Sources</div>
                          <div className="citations-list">
                            {msg.citations.map((c, idx) => {
                              if (typeof c === 'string') {
                                return (
                                  <span key={idx} className="citation-tag">
                                    🔗 {c}
                                  </span>
                                );
                              }
                              const pageText = c.page ? ` (P. ${c.page})` : '';
                              const text = `${c.source || c.title || 'Source'}${pageText}`;
                              if (c.url) {
                                return (
                                  <a
                                    key={idx}
                                    href={c.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="citation-tag clickable"
                                    title={c.snippet || c.content || text}
                                  >
                                    🔗 {text}
                                  </a>
                                );
                              }
                              return (
                                <span
                                  key={idx}
                                  className="citation-tag"
                                  title={c.snippet || c.content || text}
                                >
                                  📄 {text}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
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
              );
            })}
            {isLoading && !isStreaming && (
              <div className="message bot loading">
                <div className="msg-bot-avatar">✨</div>
                <div className="message-bubble typing-bubble">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask me anything about Sumit..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={() => handleSend()} 
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              <span className="send-icon">➔</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

