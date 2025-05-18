import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import EmojiPicker from 'emoji-picker-react';
import { motion } from 'framer-motion';
import './css/global.css';

/* eslint-disable no-unused-vars */
const CartePersonnalisee = () => {
  // États
  const [image, setImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 300, height: 300 });
  const [imagePos, setImagePos] = useState({ x: 200, y: 200 });
  const [placedGifs, setPlacedGifs] = useState([]); 
  const [emojis, setEmojis] = useState([]);
  const [songUrl, setSongUrl] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [gifList, setGifList] = useState([]);
  const [theme, setTheme] = useState("default");
  const [texte, setTexte] = useState("");
  const [textPos, setTextPos] = useState({ x: 50, y: 400 });
  const [textSize, setTextSize] = useState({ width: 200, height: 100 });
  const [showGifPicker, setShowGifPicker] = useState(false);

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const [penColor, setPenColor] = useState("black");

  // Thèmes
  const themes = {
    default: "bg-white",
    joie: "bg-gradient-to-br from-yellow-200 to-pink-300",
    colere: "bg-gradient-to-br from-red-600 to-black text-white",
    tristesse: "bg-gradient-to-br from-blue-400 to-indigo-900 text-white",
    amour: "bg-gradient-to-br from-pink-300 to-red-500",
    frustration: "bg-gray-900 bg-opacity-90 text-white"
  };

  // Charger les GIFs
  useEffect(() => {
    fetch("https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=10")
      .then(res => res.json())
      .then(data => setGifList(data.data))
      .catch(err => console.error("Erreur GIF:", err));
  }, []);

  // Gestion de l'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handleGifClick = (gifUrl) => {
  const newGif = {
    id: Date.now(), // Identifiant unique
    url: gifUrl,
    x: 100,
    y: 100,
    width: 128,
    height: 128
  };
  
  setPlacedGifs(prevGifs => [...prevGifs, newGif]);
  setShowGifPicker(false);
};

  // Gestion du dessin
  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.globalCompositeOperation = penColor === "erase" ? "destination-out" : "source-over";
    ctx.strokeStyle = penColor === "erase" ? "rgba(0,0,0,1)" : penColor;

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    setLastPoint({ x, y });
  };

  const handleMouseUp = () => setIsDrawing(false);

  // Téléchargement
  const handleDownload = () => {
    const canvas = canvasRef.current;
    const imageURI = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageURI;
    link.download = "carte_personnalisee.png";
    link.click();
  };
  
  const FireEffect = () => (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [1, 0],
            scale: [1, 1.5],
          }}
          transition={{
            duration: 1 + Math.random(),
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          🔥
        </motion.div>
      ))}
    </div>
  );

  const HeartsEffect = () => (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            color: "red",
            userSelect: "none",
          }}
          animate={{
            y: [0, -120],
            opacity: [1, 0],
            scale: [1, 1.3],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen p-6 ${themes[theme]} transition-all duration-300`}>
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.5s infinite; }
        .resize-handle {
          position: absolute;
          width: 12px;
          height: 12px;
          background: white;
          border: 2px solid black;
          right: 0;
          bottom: 0;
          cursor: se-resize;
          border-radius: 3px;
        }
      `}</style>

      <motion.h1
        className="text-4xl font-bold text-center mb-8 tracking-tight"
        animate={theme === "joie" ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {theme === "colere" ? "🔥 Exprime ta colère !" :
          theme === "joie" ? "✨ Crée ta joie !" :
          theme === "amour" ? "❤️ l'amour!" :
          "🎨 Crée ta carte personnalisée"}
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <div className="bg-white bg-opacity-40 p-4 rounded-xl shadow-lg space-y-6 backdrop-blur-sm">
          <div>
            <label className="block font-semibold mb-2 text-lg">🎨 Thème :</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(themes).map(themeKey => (
                <motion.button
                  key={themeKey}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(themeKey)}
                  className={`px-3 py-1 rounded-full capitalize text-sm font-medium transition
                  ${theme === themeKey ? "ring-2 ring-offset-2 ring-white" : "opacity-70"}
                  ${themeKey === "colere" ? "bg-red-600 text-white" :
                      themeKey === "joie" ? "bg-yellow-400 text-black" :
                      "bg-gray-300 text-black"}
                `}
                >
                  {themeKey}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-lg">🖼️ Image :</label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="block w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-lg">💬 Message :</label>
            <input
              type="text"
              placeholder="Exprime-toi !"
              onChange={(e) => setTexte(e.target.value)}
              style={{ color: "black" }}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-lg">🛠️ Outils de dessin :</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setPenColor("black")}
                className={`px-2 py-1 text-sm rounded ${penColor === "black" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                ✏️ Crayon
              </button>
              <button
                onClick={() => setPenColor("erase")}
                className={`px-2 py-1 text-sm rounded ${penColor === "erase" ? "bg-red-600 text-white" : "bg-gray-200"}`}
              >
                🧽 Gomme
              </button>
              <button
                onClick={() => {
                  const canvas = canvasRef.current;
                  const ctx = canvas.getContext("2d");
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                }}
                className="px-2 py-1 text-sm rounded bg-gray-300"
              >
                🧹 Effacer dessin
              </button>
            </div>
          </div>

          <div className="p-4 bg-black bg-opacity-60 flex justify-between rounded-lg">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="px-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow"
            >
              😊 Emoji
            </button>

            <button
              onClick={handleDownload}
              className="px-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow"
            >
              ⬇️ Télécharger
            </button>
          </div>
        </div>

        {showEmojiPicker && (
          <div className="fixed bottom-4 right-4 z-50">
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                setEmojis([...emojis, { 
                  emoji: emojiData.emoji, 
                  x: 100, 
                  y: 100 
                }]);
              }}
            />
          </div>
        )}

        <div
          className="relative w-[800px] h-[600px] bg-white bg-opacity-20 rounded-xl shadow-2xl overflow-hidden border-2 border-white"
          onMouseDown={(e) => {
            if (penColor !== "erase" && penColor !== "black") return;
            if (e.target === canvasRef.current) {
              setIsDrawing(true);
              const rect = canvasRef.current.getBoundingClientRect();
              setLastPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="absolute inset-0 w-full h-full"
          />

          {image && (
            <motion.div
              style={{
                position: "absolute",
                left: imagePos.x,
                top: imagePos.y,
                width: imageSize.width,
                height: imageSize.height,
                cursor: "move",
              }}
              drag
              dragConstraints={{
                left: 0,
                right: 800 - imageSize.width,
                top: 0,
                bottom: 600 - imageSize.height,
              }}
              onDragEnd={(e, info) => setImagePos({ x: info.point.x, y: info.point.y })}
            >
              <img
                src={image}
                alt="uploaded"
                style={{ width: "100%", height: "100%", objectFit: "contain", userSelect: "none" }}
                draggable={false}
              />
              <div className="flex justify-center gap-2 mt-1">
                <button
                  onClick={() => setImageSize({
                    width: imageSize.width + 20,
                    height: imageSize.height + 20,
                  })}
                  className="bg-blue-600 text-white rounded px-2"
                >
                  ➕
                </button>
                <button
                  onClick={() => setImageSize({
                    width: Math.max(50, imageSize.width - 20),
                    height: Math.max(50, imageSize.height - 20),
                  })}
                  className="bg-red-600 text-white rounded px-2"
                >
                  ➖
                </button>
              </div>
            </motion.div>
          )}

       {placedGifs?.map((gif) => (
  <motion.div
    key={gif.id} // Utilisez l'id comme clé
    className="absolute cursor-move z-10"
    style={{
      left: `${gif.x}px`,
      top: `${gif.y}px`,
      width: `${gif.width}px`,
      height: `${gif.height}px`
    }}
    drag
    dragConstraints={{
      left: 0,
      right: 800 - gif.width,
      top: 0,
      bottom: 600 - gif.height
    }}
    onDragEnd={(e, info) => {
      setPlacedGifs(prev => prev.map(item => 
        item.id === gif.id ? { ...item, x: info.point.x, y: info.point.y } : item
      ));
    }}
  >
    <img
      src={gif.url}
      alt="gif ajouté"
      className="w-full h-full object-contain pointer-events-none"
      onError={(e) => {
        console.error("Erreur de chargement du GIF:", gif.url);
        e.target.style.display = 'none';
      }}
    />
  </motion.div>
))}

          <motion.div
            className="absolute bg-black bg-opacity-50 rounded-md text-white p-2 cursor-move select-none"
            style={{
              left: textPos.x,
              top: textPos.y,
              width: textSize.width,
              height: textSize.height,
              overflow: "auto",
              userSelect: "text",
            }}
            drag
            dragConstraints={{ left: 0, right: 800 - textSize.width, top: 0, bottom: 600 - textSize.height }}
            onDragEnd={(e, info) => setTextPos({ x: info.point.x, y: info.point.y })}
          >
            <textarea
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              className="w-full h-full bg-transparent border-none resize-none text-white outline-none"
            />
            {emojis.map((emoji, index) => (
              <motion.div
                key={index}
                className="absolute text-3xl cursor-move select-none"
                style={{ left: emoji.x, top: emoji.y }}
                drag
                dragConstraints={{ left: 0, right: 800, top: 0, bottom: 600 }}
                onDragEnd={(e, info) => {
                  const updatedEmojis = [...emojis];
                  updatedEmojis[index] = {
                    ...updatedEmojis[index],
                    x: info.point.x,
                    y: info.point.y,
                  };
                  setEmojis(updatedEmojis);
                }}
              >
                {emoji.emoji}
              </motion.div>
            ))}
            <div
              className="resize-handle"
              onMouseDown={(e) => {
                e.stopPropagation();
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = textSize.width;
                const startHeight = textSize.height;

                function onMouseMove(moveEvent) {
                  const newWidth = Math.max(50, startWidth + (moveEvent.clientX - startX));
                  const newHeight = Math.max(30, startHeight + (moveEvent.clientY - startY));
                  setTextSize({ width: newWidth, height: newHeight });
                }

                function onMouseUp() {
                  window.removeEventListener("mousemove", onMouseMove);
                  window.removeEventListener("mouseup", onMouseUp);
                }

                window.addEventListener("mousemove", onMouseMove);
                window.addEventListener("mouseup", onMouseUp);
              }}
            />
          </motion.div>

          {theme === "colere" && <FireEffect />}
        </div>
      </div>

      {songUrl && (
        <div className="mt-4 text-center">
          <ReactPlayer url={songUrl} controls width="400px" height="50px" />
        </div>
      )}
    </div>
  );
};

export default CartePersonnalisee;
