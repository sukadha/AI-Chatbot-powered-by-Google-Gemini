// logo/pic.jsx
import React, { useState } from 'react';
import './pic.css';
import Sign from '../login/sign'; // Adjust path to your sign component

const Pic = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      {!showAuth ? (
        <div className="pic-container">
          <div className="content-wrapper">
            <div className="image-wrapper">
              <img 
                src="https://getvoip.com/uploads/State-of-Chatbots-700x406.png" 
                alt="Chatbot State Illustration"
                className="chatbot-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/700x406?text=Chatbot+Image';
                }}
              />
            </div>
            
            <div className="text-content">
              <h1 className="welcome-title">Welcome to AI Chatbot</h1>
              <button 
                className="chatbot-btn"
                onClick={() => setShowAuth(true)}
              >
                CHATBOT
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Sign />
      )}
    </>
  );
};

export default Pic;