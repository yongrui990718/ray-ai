"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function PrismApp() {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loadingText, setLoadingText] = useState(0);
  
  // 控制音樂的播放器
  const bgmRef = useRef(null);

  // --- 情緒數據中心：改回最穩定發聲的 SoundHelix 音樂，保留溫柔女聲文案 ---
  const getTheme = () => {
    const m = mood.toLowerCase();
    
    // 1. 傷心/難過
    if (m.includes("傷") || m.includes("難過") || m.includes("哭") || m.includes("痛") || m.includes("低落") || m.includes("悲")) {
      return {
        color: "from-slate-700 via-gray-800 to-slate-950",
        slogan: "『眼淚是洗滌心靈的雨水，在灰色的盡頭，希望始終存在。』",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", // 換回原始版
        tts: "想哭也沒關係喔。我就在這裡陪著你。讓這段旋律帶走難過，微光很快就會出現的。",
        label: "雨後灰 (Glimmer)"
      };
    }
    // 2. 壓力/疲勞
    if (m.includes("累") || m.includes("壓") || m.includes("煩") || m.includes("撐") || m.includes("重") || m.includes("辛苦")) {
      return {
        color: "from-blue-950 via-slate-900 to-black",
        slogan: "『承載了太多的重量嗎？讓這份深海的藍，包裹你的疲憊。』",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", // 換回原始版
        tts: "辛苦了。我聽見了你的疲憊。請閉上眼睛，讓這段聲音溫柔地抱抱你。你真的已經做得很好了。",
        label: "深海藍 (Deep Sea)"
      };
    }
    // 3. 開心/正向
    if (m.includes("開") || m.includes("棒") || m.includes("喜") || m.includes("好") || m.includes("爽")) {
      return {
        color: "from-orange-500 via-yellow-400 to-amber-100",
        slogan: "『你的喜悅正閃耀著金色的光芒，讓世界也因你而亮起。』",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // 換回原始版
        tts: "太棒了！你的聲音裡藏著陽光呢。讓我們一起把這份好心情，像藝術一樣收藏起來吧。",
        label: "活力橘 (Vitality)"
      };
    }
    // 4. 預設/平靜
    return {
      color: "from-cyan-600 via-fuchsia-600 to-purple-900",
      slogan: "『情緒如稜鏡，折射出你最純粹的樣貌。』",
      musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", // 換回原始版
      tts: "歡迎來到心靈稜鏡。你的每一種感受，都會在這裡轉化為最美的藝術。我們開始放鬆吧。",
      label: "極光紫 (Aurora)"
    };
  };

  const theme = getTheme();

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => setStep(3), 6000);
      const textTimer = setInterval(() => setLoadingText(p => p < 3 ? p + 1 : p), 1500);
      return () => { clearTimeout(timer); clearInterval(textTimer); };
    }
  }, [step]);

  // --- 播放邏輯 ---
  const playFinalExperience = () => {
    // 1. 播放背景音樂
    if (bgmRef.current) {
      bgmRef.current.volume = 0.3; 
      bgmRef.current.play().catch(e => {
        alert("請確認設備沒有靜音，或再點擊一次播放按鈕喔！");
      });
    }

    // 2. 瀏覽器極限調校版女聲
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const synth = window.speechSynthesis;
      synth.cancel(); 
      
      const utterance = new SpeechSynthesisUtterance(theme.tts);
      const voices = synth.getVoices();
      
      const bestVoice = voices.find(v => 
        (v.lang.includes('zh-TW') || v.lang.includes('zh-CN') || v.lang.includes('zh-HK')) && 
        (v.name.includes('Xiaoxiao') || v.name.includes('Siri') || v.name.includes('Yating') || v.name.includes('Hanhan') || v.name.includes('Female'))
      );
      
      if (bestVoice) {
        utterance.voice = bestVoice;
      }
      
      utterance.lang = "zh-TW";
      utterance.rate = 0.85; 
      utterance.pitch = 1.15; 
      
      synth.speak(utterance);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("您的瀏覽器不支援語音輸入，請使用 Chrome");
    const recognition = new SpeechRecognition();
    recognition.lang = "zh-TW";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => setMood(e.results[0][0].transcript);
    recognition.start();
  };

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br transition-all duration-[2000ms] ${step >= 3 ? theme.color : 'from-slate-900 to-black'}`}>
      
      <audio ref={bgmRef} key={theme.musicUrl} src={theme.musicUrl} loop preload="auto" />

      <div className="max-w-md w-full text-center space-y-12 z-10">
        
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in">
            <h1 className="text-6xl font-black text-white italic tracking-tighter drop-shadow-lg">PRISM</h1>
            <div className="relative">
              <textarea 
                className="w-full h-48 p-8 bg-white/10 border border-white/20 rounded-[3rem] text-white outline-none backdrop-blur-3xl text-lg focus:bg-white/20 transition-all shadow-xl"
                placeholder="說說你今天的心情..."
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              />
              <button onClick={startListening} className={`absolute bottom-6 right-6 p-5 rounded-full shadow-2xl transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white text-black hover:scale-110 active:scale-95'}`}>
                {isListening ? "🛑" : "🎙️"}
              </button>
            </div>
            <button onClick={() => setStep(2)} className="w-full py-5 bg-white text-black font-black rounded-full text-xl shadow-2xl active:scale-95 transition-all hover:bg-cyan-300">
              開始心靈轉化
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in">
            <div className="w-16 h-16 border-t-4 border-cyan-400 border-solid rounded-full animate-spin mx-auto shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
            <div className="text-left font-mono text-[11px] space-y-4 bg-black/60 p-8 rounded-3xl backdrop-blur-md border border-white/10">
              <p className="text-cyan-400">{" >> "} 分析情緒頻率中...</p>
              {loadingText >= 1 && <p className="text-fuchsia-400">{" >> "} 情緒標籤: {theme.label}</p>}
              {loadingText >= 2 && <p className="text-amber-400">{" >> "} 載入療癒 MP3 音源庫...</p>}
              {loadingText >= 3 && <p className="text-white animate-pulse">{" >> "} 渲染感官空間中...</p>}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-in zoom-in">
            <h1 className="text-3xl font-black text-white tracking-widest">{theme.label}</h1>
            <div className={`aspect-square bg-gradient-to-tr ${theme.color} rounded-[4rem] shadow-2xl border border-white/20 animate-pulse flex items-center justify-center opacity-80`}>
              <span className="text-white font-bold text-lg tracking-[0.5em] opacity-50">ARTWORK</span>
            </div>
            <button onClick={() => setStep(4)} className="w-full py-5 border border-white/30 text-white rounded-full backdrop-blur-md hover:bg-white/10 transition-all">
              進入沉浸解析
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-10 animate-in slide-in-from-bottom">
            <div className="p-10 bg-white/10 backdrop-blur-3xl rounded-[3rem] border border-white/20 shadow-2xl">
              <p className="text-2xl italic text-white font-serif leading-relaxed drop-shadow-md">
                {theme.slogan}
              </p>
            </div>
            
            <button 
              onClick={playFinalExperience} 
              className="w-full py-8 bg-white text-black rounded-full font-black text-2xl shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span>🧘</span> 啟動心靈共鳴
            </button>
            
            <button onClick={() => {
              setStep(1); 
              setMood(""); 
              if(bgmRef.current) { bgmRef.current.pause(); bgmRef.current.currentTime = 0; }
              if(typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
            }} className="text-white/30 text-xs tracking-widest hover:text-white transition-all uppercase">
              — 重新啟動系統 —
            </button>
          </div>
        )}
      </div>
    </main>
  );
}