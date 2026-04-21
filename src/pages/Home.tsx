import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Home.css";

export default function Home() {
  const navigate = useNavigate();

  const images = [
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1920&auto=format&fit=crop",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-container">

      {/* Background Image */}
      <img
        src={images[currentIndex]}
        alt=""
        className="hero-image"
      />

      {/* Overlay */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="hero-content">
        <h1>Step Into Style</h1>

        <p>
          Discover the latest collection of premium shoes designed for comfort,
          performance, and everyday style.
        </p>

        <button onClick={() => navigate("/products")}>
          Shop Now
        </button>
      </div>

    </div>
  );
}