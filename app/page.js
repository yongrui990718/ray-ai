"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function PrismApp() {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loadingText, setLoadingText] = useState(0);
  
  const bgmRef = useRef(null);

  // --- 1. 數據中心：確保路徑與你的 v1-v4.mp3 對應 ---
  const getTheme = () => {
    const m = mood.toLowerCase();
    
    // 1. 壓力/疲勞 (對應 v1.mp3: 辛苦了，承擔了很多)
    if (m.includes("累") || m.includes("壓") || m.includes("煩") || m.includes("撐") || m.includes("重") || m.includes("辛苦")) {
      return {
        color: "from-blue-950 via-slate-900 to-black",
        slogan: "『承載了太多的重量嗎？讓這份深海的藍，包裹你的疲憊。』",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        audioFile: "/v1.mp3", 
        label: "深海藍 (Deep Sea)"
      };
    }
    // 2. 焦慮 (對應 v2.mp3: 呼吸好像變急促了)
    if (m.includes("焦") || m.includes("急") || m.includes("慌") || m.includes("亂") || m.includes("怕") || m.includes("緊")) {
      return {
        color: "from-purple-900 via-indigo-900 to-black",
        slogan: "『在混亂的思緒中，讓我們一起找回呼吸的節奏。』",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        audioFile: "/v2.mp3",
        label: "迷霧紫 (Mist)"
      };
    }
    // 3. 療癒/開心 (對應 v4.mp3: 繁花盛開的色彩)
    if (m.includes("開") || m.includes("棒") || m.includes("喜") || m.includes("好") || m.includes("爽") || m.includes("樂")) {
      return {
        color: "from-orange-500 via-yellow-400 to-amber-100",
        slogan: "『你的喜悅正閃耀著金色的光芒，讓世界也因你而亮起。』",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        audioFile: "/v4.mp3",
        label: "活力橘 (Vitality)"
      };
    }
    // 4. 預設/平靜 (對應 v3.mp3: 現在的氛圍很美)
    return {
      color: "from-cyan-600 via-fuchsia-600 to-purple-900",
      slogan: "『情緒如稜鏡，折射出你最純粹的樣貌。』",
      musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      audioFile: "/v3.mp3",
      label: "極光紫 (Aurora)"
    };
  };

  const theme = getTheme();

  const startListening = () => {
    alert("語音辨識功能目前請先用文字輸入喔！");
  };

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => setStep(3), 6000);
      const textTimer = setInterval(() => setLoadingText(p => p < 3 ? p + 1 : p), 1500);
      return () => { clearTimeout(timer); clearInterval(textTimer); };
    }
  }, [step]);

  // --- 2. 核心播放函式：修正檔名讀取問題 ---
  const playFinalExperience = () => {
    // 播放背景音樂
    if (bgmRef.current) {
      bgmRef.current.volume = 0.2;
      bgmRef.current.play().catch(e => console.log("BGM 播放受阻"));
    }

    // 播放錄音檔 (加上時間戳防止快取錯誤)
    if (theme.audioFile) {
      const voiceAudio = new Audio(`${theme.audioFile}?t=${Date.now()}`);
      voiceAudio.volume = 1.0; 
      voiceAudio.load(); 
      voiceAudio.play().catch(e => {
        console.error("【讀取失敗】請確認檔案確實放在 public 資料夾下。");
        console.error("嘗試路徑:", theme.audioFile);
        alert(`找不到檔案: ${theme.audioFile}，請確認檔名已改成 v1-v4.mp3`);
      });
    }
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
              {loadingText >= 2 && <p className="text-amber-400">{" >> "} 載入專業人聲療癒包...</p>}
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
            }} className="text-white/30 text-xs tracking-widest hover:text-white transition-all uppercase">
              — 重新啟動系統 —
            </button>
          </div>
        )}
      </div>
    </main>
  );
}