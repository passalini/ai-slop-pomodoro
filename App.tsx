import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TimerMode, TimerStatus, TimerState } from './types';
import CircularTimer from './components/CircularTimer';
import Controls from './components/Controls';
import StatsBar from './components/StatsBar';
import TimeInputModal from './components/TimeInputModal';

const DEFAULTS = {
  focus: 25 * 60,
  break: 5 * 60,
};

const STORAGE_KEYS = {
  focus: 'pomodoro_focus_duration',
  break: 'pomodoro_break_duration',
  sessionsCount: 'pomodoro_sessions_count',
  totalFocusTime: 'pomodoro_total_focus_time',
  totalBreakTime: 'pomodoro_total_break_time',
  focusCompletedInCurrentCycle: 'pomodoro_focus_cycle_flag',
};

const COMPLETION_SOUND = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

const THEME_COLORS = {
  focusBg: "#FFF7F5",
  focusSaturated: "#E03C25",
  breakBg: "#F0FAF9",
  breakSaturated: "#2D8B8B",
};

const getSavedDuration = (mode: TimerMode): number => {
  const saved = localStorage.getItem(STORAGE_KEYS[mode]);
  return saved ? parseInt(saved, 10) : DEFAULTS[mode];
};

const App: React.FC = () => {
  const [state, setState] = useState<TimerState>(() => {
    const focusDuration = getSavedDuration('focus');
    
    // Restore persistent statistics
    const savedSessions = localStorage.getItem(STORAGE_KEYS.sessionsCount);
    const savedFocusTime = localStorage.getItem(STORAGE_KEYS.totalFocusTime);
    const savedBreakTime = localStorage.getItem(STORAGE_KEYS.totalBreakTime);
    const savedCycleFlag = localStorage.getItem(STORAGE_KEYS.focusCompletedInCurrentCycle);

    return {
      mode: 'focus',
      status: 'idle',
      configOpen: false,
      duration: focusDuration,
      remainingTime: focusDuration,
      sessionsCount: savedSessions ? parseInt(savedSessions, 10) : 0,
      totalFocusTime: savedFocusTime ? parseInt(savedFocusTime, 10) : 0,
      totalBreakTime: savedBreakTime ? parseInt(savedBreakTime, 10) : 0,
      focusCompletedInCurrentCycle: savedCycleFlag === 'true',
    };
  });

  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Effect to persist statistics whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sessionsCount, state.sessionsCount.toString());
    localStorage.setItem(STORAGE_KEYS.totalFocusTime, state.totalFocusTime.toString());
    localStorage.setItem(STORAGE_KEYS.totalBreakTime, state.totalBreakTime.toString());
    localStorage.setItem(STORAGE_KEYS.focusCompletedInCurrentCycle, state.focusCompletedInCurrentCycle.toString());
  }, [state.sessionsCount, state.totalFocusTime, state.totalBreakTime, state.focusCompletedInCurrentCycle]);

  useEffect(() => {
    audioRef.current = new Audio(COMPLETION_SOUND);
    // Silent pre-load to satisfy browser autoplay policies on mobile
    audioRef.current.load();
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const isFocus = state.mode === 'focus';
    const isRunning = state.status === 'running';
    const isAlarm = state.status === 'alarm';
    
    if (state.status === 'idle' && !state.configOpen) {
      document.title = 'Slop Pomodoro';
    } else {
      const displaySeconds = state.configOpen ? state.duration : state.remainingTime;
      const mins = Math.floor(displaySeconds / 60);
      const secs = displaySeconds % 60;
      const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      const percentage = state.remainingTime / state.duration;
      const isLast10 = percentage <= 0.1 && isRunning;

      let statusText = '';
      if (state.configOpen) {
        statusText = isFocus ? 'Set Focus' : 'Set Break';
      } else if (isAlarm) {
        statusText = isFocus ? 'Focus Done!' : 'Break Finished!';
      } else if (!isRunning) {
        statusText = isFocus ? 'Ready to focus' : 'Time for a break';
      } else if (isLast10) {
        statusText = isFocus ? 'Almost there' : 'Break ending soon';
      } else {
        statusText = isFocus ? 'Stay focused' : 'Relax and recharge';
      }
      document.title = `${timeStr} - ${statusText}`;
    }

    const activeColor = (isRunning || isAlarm)
      ? (isFocus ? THEME_COLORS.focusSaturated : THEME_COLORS.breakSaturated)
      : (isFocus ? THEME_COLORS.focusBg : THEME_COLORS.breakBg);

    // Update Meta Theme Color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', activeColor);
    }
    // Update body/html background to prevent flashes
    document.documentElement.style.backgroundColor = activeColor;
    document.body.style.backgroundColor = activeColor;

    // Update GitHub Ribbon color variable
    const ribbonColor = isFocus ? THEME_COLORS.focusSaturated : THEME_COLORS.breakSaturated;
    document.documentElement.style.setProperty('--ribbon-color', ribbonColor);

  }, [state.status, state.remainingTime, state.mode, state.configOpen, state.duration]);

  const triggerAlert = useCallback((finishedMode: TimerMode) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.loop = true;
      audioRef.current.play().catch(e => console.warn("Audio play blocked", e));
    }

    // Android/Mobile-friendly alerts
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }

    // Defensive notification handling to prevent mobile freezes
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile && "Notification" in window && Notification.permission === "granted") {
      try {
        const title = finishedMode === 'focus' ? 'Focus Session Complete!' : 'Break Over!';
        const body = finishedMode === 'focus' ? 'Excellent work. Time to take a short break.' : 'Time to get back into the flow!';
        
        new Notification(title, {
          body,
          icon: 'https://cdn-icons-png.flaticon.com/512/2972/2972531.png',
          requireInteraction: true,
          tag: 'pomodoro-alert',
          renotify: true
        } as any);
      } catch (err) {
        console.warn("Notification error:", err);
      }
    }
  }, []);

  const switchMode = useCallback(() => {
    setState(prev => {
      const newMode: TimerMode = prev.mode === 'focus' ? 'break' : 'focus';
      const newDuration = getSavedDuration(newMode);
      
      return {
        ...prev,
        mode: newMode,
        status: 'idle',
        duration: newDuration,
        remainingTime: newDuration,
      };
    });
  }, []);

  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.loop = false;
      audioRef.current.currentTime = 0;
    }
    if (navigator.vibrate) {
      navigator.vibrate(0);
    }
  }, []);

  const tick = useCallback(() => {
    setState(prev => {
      if (prev.remainingTime <= 1) {
        if (timerRef.current) clearInterval(timerRef.current);
        triggerAlert(prev.mode);
        const isFocusFinish = prev.mode === 'focus';
        let newSessionsCount = prev.sessionsCount;
        let newFocusCompletedFlag = prev.focusCompletedInCurrentCycle;

        if (isFocusFinish) {
          newFocusCompletedFlag = true;
        } else {
          if (prev.focusCompletedInCurrentCycle) {
            newSessionsCount += 1;
            newFocusCompletedFlag = false;
          }
        }

        return { 
          ...prev, 
          remainingTime: 0, 
          status: 'alarm',
          sessionsCount: newSessionsCount,
          focusCompletedInCurrentCycle: newFocusCompletedFlag,
          totalFocusTime: isFocusFinish ? prev.totalFocusTime + Math.floor(prev.duration / 60) : prev.totalFocusTime,
          totalBreakTime: !isFocusFinish ? prev.totalBreakTime + Math.floor(prev.duration / 60) : prev.totalBreakTime,
        };
      }
      return { ...prev, remainingTime: prev.remainingTime - 1 };
    });
  }, [triggerAlert]);

  useEffect(() => {
    if (state.status === 'running') {
      timerRef.current = window.setInterval(tick, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.status, tick]);

  const toggleTimer = () => {
    if (state.status === 'alarm') {
      stopSound();
      switchMode();
      return;
    }

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setState(prev => ({
      ...prev,
      configOpen: false,
      status: prev.status === 'running' ? 'paused' : 'running',
    }));
  };

  const resetTimer = () => {
    if (state.status === 'alarm') {
      stopSound();
    }
    setState(prev => {
      if (prev.configOpen) {
        const factoryDefault = DEFAULTS[prev.mode];
        localStorage.setItem(STORAGE_KEYS[prev.mode], factoryDefault.toString());
        return {
          ...prev,
          status: 'idle',
          duration: factoryDefault,
          remainingTime: factoryDefault,
          focusCompletedInCurrentCycle: false,
        };
      } else {
        return {
          ...prev,
          status: 'idle',
          remainingTime: prev.duration,
          focusCompletedInCurrentCycle: false,
        };
      }
    });
  };

  const skipTimer = () => {
    setState(prev => ({...prev, focusCompletedInCurrentCycle: false }));
    switchMode();
  };

  const openConfig = () => {
    setState(prev => ({ 
      ...prev, 
      configOpen: true, 
      status: 'paused',
      remainingTime: prev.duration 
    }));
  };

  const closeConfig = () => {
    setState(prev => ({ ...prev, configOpen: false }));
  };

  const updateDuration = (newMinutes: number) => {
    const newSeconds = newMinutes === 0 ? 1 : newMinutes * 60;
    localStorage.setItem(STORAGE_KEYS[state.mode], (newMinutes * 60).toString());
    setState(prev => ({
      ...prev,
      duration: newSeconds,
      remainingTime: newSeconds,
      status: 'idle',
      focusCompletedInCurrentCycle: false
    }));
  };

  const clearStats = () => {
    // Immediate state reset for visual confirmation
    setState(prev => ({
      ...prev,
      sessionsCount: 0,
      totalFocusTime: 0,
      totalBreakTime: 0,
      focusCompletedInCurrentCycle: false,
    }));
    
    // Explicit Local Storage reset to ensure data is wiped instantly
    localStorage.setItem(STORAGE_KEYS.sessionsCount, '0');
    localStorage.setItem(STORAGE_KEYS.totalFocusTime, '0');
    localStorage.setItem(STORAGE_KEYS.totalBreakTime, '0');
    localStorage.setItem(STORAGE_KEYS.focusCompletedInCurrentCycle, 'false');
  };

  const isFocus = state.mode === 'focus';
  const isRunning = state.status === 'running';
  const isAlarm = state.status === 'alarm';
  const isActive = isRunning || isAlarm;

  const bgColorClass = isActive
    ? (isFocus ? 'bg-focus-saturated' : 'bg-break-saturated')
    : (isFocus ? 'bg-focus-bg' : 'bg-break-bg');

  const statsBtnBg = isActive 
    ? 'bg-transparent hover:bg-white/10 active:bg-white/20' 
    : 'bg-transparent hover:bg-black/5 active:bg-black/10';
  
  const statsBtnText = isActive 
    ? 'text-white/40' 
    : (isFocus ? 'text-focus-primary/40' : 'text-break-primary/40');

  return (
    <div className={`h-full w-full flex flex-col items-center transition-colors duration-700 overflow-hidden ${bgColorClass}`}>
      {/* github-fork-ribbon-css component */}
      <a 
        className="github-fork-ribbon right-top" 
        href="https://github.com/passalini/ai-slop-pomodoro" 
        data-ribbon="Fork me on GitHub" 
        title="Fork me on GitHub"
        target="_blank"
        rel="noopener noreferrer"
      >
        Fork me on GitHub
      </a>

      <header className="w-full text-center pt-[3vh] pb-[2vh] z-10 shrink-0">
        <h1 className={`font-bold tracking-[0.5em] text-[11px] md:text-[12px] uppercase transition-all duration-300 ${isActive ? 'text-white/70' : (isFocus ? 'text-focus-primary/60' : 'text-break-primary/60')}`}>
          Slop Pomodoro
        </h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-sm relative px-6 py-3">
        <CircularTimer 
          state={state} 
          onOpenConfig={openConfig} 
          onCloseConfig={closeConfig}
          onUpdateDuration={updateDuration}
          onTimeClick={() => setIsInputModalOpen(true)}
        />
      </main>

      <footer className="w-full flex flex-col items-center pb-[6vh] px-6 shrink-0 transition-all duration-300 z-10 gap-[6vh]">
        <Controls 
          state={state} 
          onToggle={toggleTimer} 
          onReset={resetTimer} 
          onSkip={skipTimer} 
        />
        
        <div className="flex flex-col items-center gap-3 w-full max-w-[340px]">
          <StatsBar state={state} />
          
          <button 
            onClick={clearStats}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200 text-[9px] font-bold tracking-[0.1em] uppercase ${statsBtnBg} ${statsBtnText}`}
          >
            <span className="material-symbols-outlined text-[14px]">history</span>
            Clear Stats
          </button>
        </div>
      </footer>

      {isInputModalOpen && (
        <TimeInputModal 
          mode={state.mode}
          onClose={() => setIsInputModalOpen(false)}
          onConfirm={(mins) => {
            updateDuration(mins);
            setIsInputModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default App;