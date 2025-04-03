// MainPicPopup.js
import { useEffect, useState } from "react";
import "./MainPicPopup.css";

export default function MainPicPopup({ onClose }) {
  const [show, setShow] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setShow(false);
        onClose();
      }, 500); // Wait for exit animation to complete
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`popup-container ${show ? "show" : "hide"}`}>
      <div className={`popup ${isAnimating ? "animate" : ""}`}>
        <img src="/mainpic.jpg" alt="Main App Picture" className="main-pic" />
        <button className="close-btn" onClick={() => {
          setIsAnimating(false);
          setShow(false);
          onClose();
        }}>
          ✕
        </button>
        <div className="hearts">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="heart" style={{
              left: `${Math.random() * 80 + 10}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              fontSize: `${Math.random() * 20 + 10}px`
            }}>❤</div>
          ))}
        </div>
      </div>
    </div>
  );
}