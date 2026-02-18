import React from 'react';
import { TimerState } from '../types';
import ProgressDial from './ProgressDial';
import ConfigDial from './ConfigDial';

interface CircularTimerProps {
  state: TimerState;
  onOpenConfig: () => void;
  onCloseConfig: () => void;
  onUpdateDuration: (minutes: number) => void;
  onTimeClick: () => void;
}

const CircularTimer: React.FC<CircularTimerProps> = ({ 
  state, 
  onOpenConfig, 
  onCloseConfig,
  onUpdateDuration,
  onTimeClick
}) => {
  const isFocus = state.mode === 'focus';
  const isRunning = state.status === 'running';
  const isAlarm = state.status === 'alarm';
  
  const displaySeconds = state.configOpen ? state.duration : state.remainingTime;
  const minutes = Math.floor(displaySeconds / 60);
  const seconds = displaySeconds % 60;
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

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

  const primaryColor = isRunning || isAlarm ? 'text-white' : (isFocus ? 'text-focus-primary' : 'text-break-primary');
  const labelColor = isRunning || isAlarm ? 'text-white/60' : (isFocus ? 'text-focus-primary/60' : 'text-break-primary/60');

  return (
    <div className="relative flex items-center justify-center w-[340px] h-[340px] shrink-0">
      <style>{`
        @keyframes finish-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-finish {
          animation: finish-blink 0.8s ease-in-out infinite;
        }
      `}</style>

      {state.configOpen ? (
        <>
          <ConfigDial 
            mode={state.mode} 
            duration={state.duration} 
            onUpdate={onUpdateDuration} 
            onClose={onCloseConfig}
          />
          <div className="text-center z-10 flex flex-col items-center justify-center h-full pointer-events-none absolute inset-0">
            <button 
              onClick={onTimeClick}
              className={`text-[80px] font-extrabold tabular-nums leading-none tracking-tight mb-2 -mt-4 transition-all duration-300 pointer-events-auto hover:opacity-80 active:scale-95 ${primaryColor}`}
            >
              {timeStr}
            </button>
            <p className={`text-[12px] font-bold tracking-[0.1em] uppercase transition-colors duration-300 h-4 ${labelColor}`}>
              {statusText}
            </p>
          </div>
          <button 
            onClick={onCloseConfig}
            className={`absolute bottom-[16%] left-1/2 -translate-x-1/2 transition-all focus:outline-none z-20 hover:scale-110 active:scale-90 duration-200 ${primaryColor}`}
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>
        </>
      ) : (
        <>
          <ProgressDial 
            mode={state.mode} 
            duration={state.duration} 
            remainingTime={state.remainingTime} 
            isRunning={isRunning || isAlarm}
          />
          
          <div className="text-center z-10 flex flex-col items-center justify-center h-full pointer-events-none absolute inset-0">
            <div 
              className={`text-[80px] font-extrabold tabular-nums leading-none tracking-tight mb-2 -mt-4 transition-all duration-300 ${primaryColor} ${isAlarm ? 'animate-finish' : ''}`}
            >
              {timeStr}
            </div>
            <p className={`text-[12px] font-bold tracking-[0.1em] uppercase transition-all duration-500 h-4 ${labelColor}`}>
              {statusText}
            </p>
          </div>
          {!isAlarm && (
            <button 
              onClick={onOpenConfig}
              className={`absolute bottom-[16%] left-1/2 -translate-x-1/2 transition-all focus:outline-none z-20 hover:scale-110 active:scale-90 duration-200 ${primaryColor}`}
            >
              <span className="material-symbols-outlined text-4xl">settings</span>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CircularTimer;