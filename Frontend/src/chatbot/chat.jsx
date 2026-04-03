import React, { useState, useRef, useEffect } from "react";
import "./chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your AI assistant powered by Gemini. How can I help you today?",
      sender: "bot",
      time: new Date().toLocaleTimeString(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [anxietyLevel, setAnxietyLevel] = useState(3);
  const [textNote, setTextNote] = useState("");

  const bottomRef = useRef(null);

  // ✅ Send Message (FIXED API CALL)
  const API_KEY = "AIzaSyAY8rK4vyqrLqOzLHLWLZBk4v4ftSQOuF4"; // 🔥 Replace this

  const moods = [
    { emoji: "😊", label: "Great", color: "#10b981", value: "great" },
    { emoji: "🙂", label: "Good", color: "#34d399", value: "good" },
    { emoji: "😐", label: "Meh", color: "#f59e0b", value: "meh" },
    { emoji: "😔", label: "Bad", color: "#ef4444", value: "bad" },
    { emoji: "😢", label: "Awful", color: "#dc2626", value: "awful" }
  ];

  const emotions = [
    { emoji: "😔", label: "Disappointed", value: "disappointed" },
    { emoji: "😰", label: "Anxious", value: "anxious" },
    { emoji: "😞", label: "Rejected", value: "rejected" },
    { emoji: "😤", label: "Frustrated", value: "frustrated" },
    { emoji: "😴", label: "Tired", value: "tired" },
    { emoji: "😕", label: "Confused", value: "confused" },
    { emoji: "😢", label: "Sad", value: "sad" },
    { emoji: "🤗", label: "Lonely", value: "lonely" }
  ];

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: input }],
              },
            ],
          }),
        }
      );

      const data = await res.json();

      console.log("Gemini Response:", data);

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.error?.message ||
        "No response 😅";

      const botMsg = {
        text,
        sender: "bot",
        time: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Gemini Error:", err);

      setMessages((prev) => [
        ...prev,
        {
          text: "Error fetching response 😅",
          sender: "bot",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleEmotionToggle = (emotion) => {
    if (selectedEmotions.includes(emotion.value)) {
      setSelectedEmotions(selectedEmotions.filter(e => e !== emotion.value));
    } else {
      setSelectedEmotions([...selectedEmotions, emotion.value]);
    }
  };

  const getPersonalizedQuote = () => {
    if (!selectedMood) return "Take a deep breath. You've got this! 💪";
    
    const moodValue = selectedMood.value;
    const hasAnxiety = anxietyLevel > 5;
    const hasNegativeEmotions = selectedEmotions.some(e =>
      ['disappointed', 'anxious', 'rejected', 'frustrated', 'sad', 'lonely'].includes(e)
    );

    const quotes = {
      great: [
        "🌟 Your positive energy is contagious! Keep shining bright and inspiring others around you.",
        "🎉 What a wonderful day to be alive! Your joy is a gift to the world. Keep spreading happiness!",
        "💪 You're doing amazing! Your positive mindset will attract even more wonderful things into your life.",
        "✨ Your optimism is your superpower! Today is proof that you're on the right path."
      ],
      good: [
        "🌱 Every small step counts. You're making progress, and that's something to celebrate!",
        "🌸 Your good mood today is a reminder that better days are always ahead. Keep going!",
        "💫 You're doing great things. Trust the process and enjoy the journey!",
        "🎯 A good day is a building block for a great life. Keep building your dreams!"
      ],
      meh: [
        "🌈 Even on cloudy days, the sun is still shining above. Your feelings are valid, and brighter moments await.",
        "🌻 It's okay to have a 'meh' day. Tomorrow is a new opportunity to feel better. You've got this!",
        "💪 Sometimes just getting through the day is a victory. Proud of you for showing up!",
        "🌊 Like the ocean, emotions ebb and flow. This moment will pass, and calmer waters are ahead."
      ],
      bad: [
        "🌙 Tough days don't last, but tough people do. You're stronger than you know, and tomorrow brings new hope.",
        "🤗 It's okay to not be okay. Your feelings are valid, and you're doing your best. That's enough.",
        "🌟 Every storm runs out of rain. This difficult moment will pass, and you'll emerge stronger.",
        "💫 Your current situation is not your final destination. Brighter days are on their way to you."
      ],
      awful: [
        "🕯️ Even in the darkest moments, there is light within you. Take it one breath at a time. You are not alone.",
        "🌅 After every night comes a dawn. Hold on - your breakthrough is closer than you think.",
        "💪 The fact that you're here, acknowledging your feelings, shows incredible strength. You're stronger than you realize.",
        "🌈 This feeling won't last forever. Be gentle with yourself today. Tomorrow is a fresh start."
      ]
    };

    if (hasAnxiety && (moodValue === 'bad' || moodValue === 'awful')) {
      return "🌿 Breathe. You're safe. Your anxiety doesn't define you. Take one small step at a time. You've overcome every difficult day before, and you'll get through this one too. 💙";
    }

    if (hasNegativeEmotions && moodValue === 'bad') {
      return "💙 Your feelings are valid, but they don't have to control you. You are worthy of peace and happiness. Take a moment to be kind to yourself today. You deserve it. 🌸";
    }

    if (moodValue === 'meh' && hasAnxiety) {
      return "🍃 It's okay to feel uncertain. Give yourself permission to rest and recharge. Tomorrow is a new day with new possibilities. You're doing great just by being here. ✨";
    }

    const moodQuotes = quotes[selectedMood.value] || quotes.meh;
    return moodQuotes[Math.floor(Math.random() * moodQuotes.length)];
  };

  const saveMoodEntry = () => {
    if (!selectedMood) {
      alert('Please select how you feel');
      return;
    }

    const moodMessage = `📊 **Mood Check-in**\n\n` +
      `**Mood:** ${selectedMood.emoji} ${selectedMood.label}\n` +
      `${selectedEmotions.length > 0 ? `**Emotions:** ${selectedEmotions.map(e => e).join(', ')}\n` : ''}` +
      `${anxietyLevel > 0 ? `**Anxiety Level:** ${anxietyLevel}/10\n` : ''}` +
      `${textNote ? `**Note:** ${textNote}\n` : ''}\n` +
      `💫 **A Thought For You:**\n${getPersonalizedQuote()}`;

    const moodResponseObj = {
      text: moodMessage,
      sender: 'bot',
      time: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, moodResponseObj]);
    setShowMoodTracker(false);
    setSelectedMood(null);
    setSelectedEmotions([]);
    setAnxietyLevel(3);
    setTextNote('');
  };

  const clearChat = () => {
    setMessages([
      {
        text: "Chat history cleared! How can I help you?",
        sender: "bot",
        time: new Date().toLocaleTimeString(),
      }
    ]);
  };

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      
      <div className="chat-box">
        {/* HEADER */}
        <div className="chat-header">
          <div className="left">
            <div className="avatar">🤖</div>
            <div>
              <h3>Gemini AI Assistant</h3>
              <p>Online • Powered by Google Gemini</p>
            </div>
          </div>

          <div className="right">
            <button className="mood-btn" onClick={() => setShowMoodTracker(true)}>
              😊 Mood Tracker
            </button>
            <button className="clear-btn" onClick={clearChat}>🗑</button>
          </div>
        </div>

        {/* MOOD TRACKER MODAL */}
        {showMoodTracker && (
          <div className="mood-modal-overlay" onClick={() => setShowMoodTracker(false)}>
            <div className="mood-modal" onClick={(e) => e.stopPropagation()}>
              <div className="mood-modal-header">
                <h3>How do you feel?</h3>
                <button className="close-modal" onClick={() => setShowMoodTracker(false)}>✕</button>
              </div>

              <div className="mood-options">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    className={`mood-option ${selectedMood?.value === mood.value ? 'selected' : ''}`}
                    onClick={() => handleMoodSelect(mood)}
                    style={{ backgroundColor: selectedMood?.value === mood.value ? mood.color : '#f3f4f6' }}
                  >
                    <span className="mood-emoji">{mood.emoji}</span>
                    <span className="mood-label">{mood.label}</span>
                  </button>
                ))}
              </div>

              <div className="emotions-section">
                <h4>Emotions</h4>
                <div className="emotions-grid">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion.value}
                      className={`emotion-chip ${selectedEmotions.includes(emotion.value) ? 'selected' : ''}`}
                      onClick={() => handleEmotionToggle(emotion)}
                    >
                      <span className="emotion-emoji">{emotion.emoji}</span>
                      <span className="emotion-label">{emotion.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="anxiety-section">
                <h4>Level of anxiety</h4>
                <div className="anxiety-slider">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={anxietyLevel}
                    onChange={(e) => setAnxietyLevel(parseInt(e.target.value))}
                    className="slider"
                  />
                  <div className="slider-labels">
                    <span>not at all</span>
                    <span>{anxietyLevel}</span>
                    <span>very high</span>
                  </div>
                </div>
              </div>

              <div className="text-note-section">
                <h4>Text Note</h4>
                <textarea
                  className="text-note-input"
                  placeholder="How are you feeling? Write your thoughts here..."
                  value={textNote}
                  onChange={(e) => setTextNote(e.target.value)}
                  rows="4"
                />
              </div>

              <div className="modal-actions">
                <button className="save-btn" onClick={saveMoodEntry}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MESSAGES */}
        <div className="messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`msg ${msg.sender === "user" ? "user" : "bot"}`}
            >
              <div className="bubble">
                <div className="message-text" style={{ whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </div>
                <span className="time">{msg.time}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="msg bot">
              <div className="bubble typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="input-area">
          <input
            type="text"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;