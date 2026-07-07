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
          return <strong key={idx} style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={idx}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8em',
                background: 'var(--bg-raised)',
                padding: '2px 5px',
                borderRadius: '4px',
                border: '1px solid var(--divider)',
                color: 'var(--accent)'
              }}
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
        elements.push(<hr key={i} style={{ border: '0', borderTop: '1px solid var(--divider)', margin: '12px 0' }} />);
        continue;
      }

      const headerMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (headerMatch) {
        flushList(i);
        const level = headerMatch[1].length;
        const content = formatInline(headerMatch[2]);
        const style = {
          fontFamily: 'var(--font-display)',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginTop: '12px',
          marginBottom: '6px',
          lineHeight: '1.2'
        };

        if (level === 1) elements.push(<h1 key={i} style={{ ...style, fontSize: '1.2rem' }}>{content}</h1>);
        else if (level === 2) elements.push(<h2 key={i} style={{ ...style, fontSize: '1.1rem' }}>{content}</h2>);
        else elements.push(<h3 key={i} style={{ ...style, fontSize: '1.0rem' }}>{content}</h3>);
        continue;
      }

      if (trimmed.startsWith('>')) {
        flushList(i);
        const content = formatInline(trimmed.substring(1).trim());
        elements.push(
          <blockquote
            key={i}
            style={{
              borderLeft: '3px solid var(--accent)',
              paddingLeft: '10px',
              margin: '8px 0',
              color: 'var(--text-secondary)',
              fontStyle: 'italic'
            }}
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
          <li key={`li-${i}-${currentList.length}`} className="bot-li" style={{ marginBottom: '4px', fontSize: '0.86rem', position: 'relative', paddingLeft: '18px' }}>
            {content}
          </li>
        );
        continue;
      }

      if (trimmed !== '') {
        flushList(i);
        elements.push(<p key={i} style={{ marginBottom: '8px', lineHeight: '1.6' }}>{formatInline(line)}</p>);
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
      const baseUrl = 'https://resumemaker-service.corstack.in/';
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
      let lineBuffer = '';

      const processLine = (line) => {
        const trimmedLine = line.trim();
        if (!trimmedLine || !trimmedLine.startsWith('data: ')) return;

        const data = trimmedLine.slice(6).trim();
        if (data === '[DONE]') return;

        try {
          const parsed = JSON.parse(data);

          // Handle structured response or partial string chunks
          if (parsed.answer !== undefined) botAnswer = parsed.answer;
          else if (typeof parsed === 'string') botAnswer += parsed;

          if (parsed.highlights) botHighlights = parsed.highlights;
          if (parsed.citations) botCitations = parsed.citations;
          if (parsed.suggested_questions) botSuggestions = parsed.suggested_questions;

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
          // Fallback if data is not valid JSON
          botAnswer += data;
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
        lineBuffer = lines.pop(); // Keep the partial line

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
                        {msg.highlights.map((h, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.9rem', lineHeight: '1.2' }}>✓</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {msg.role === 'bot' && msg.citations?.length > 0 && (
                    <div className="message-citations">
                      <div className="section-label" style={{ width: '100%', marginBottom: '4px' }}>Sources & Citations</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', width: '100%' }}>
                        {msg.citations.map((c, idx) => {
                          if (typeof c === 'string') {
                            return (
                              <span key={idx} className="citation-tag">
                                🔗 {c}
                              </span>
                            );
                          }
                          const pageText = c.page ? ` (Page ${c.page})` : '';
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
                                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
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
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              📄 {text}
                            </span>
                          );
                        })}
                      </div>
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
