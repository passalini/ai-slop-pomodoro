import React from 'react';
import { TimerState } from '../types';

interface StatsBarProps {
  /** The state object containing historical session data */
  state: TimerState;
}

/**
 * StatsBar
 * 
 * Displays a persistent bar containing key productivity metrics.
 * The styling logic has been updated to treat 'running' and 'alarm' states 
 * identically (as 'active'), ensuring the bar remains readable on saturated 
 * mobile notification backgrounds.
 */
const StatsBar: React.FC<StatsBarProps> = ({ state }) => {
  const isFocus = state.mode === 'focus';
  /** 
   * isActive covers both countdown and completion/alarm phases 
   * to ensure color consistency on saturated backgrounds.
   */
  const isActive = state.status === 'running' || state.status === 'alarm';
  
  /** Dynamic styling based on mode and active status */
  const bgColor = isActive 
    ? 'bg-white/10' 
    : (isFocus ? 'bg-focus-metric' : 'bg-break-metric');
  
  const textColor = isActive 
    ? 'text-white' 
    : (isFocus ? 'text-focus-primary' : 'text-break-primary');
  
  const labelColor = isActive 
    ? 'text-white/50' 
    : (isFocus ? 'text-focus-primary/40' : 'text-break-primary/60');
  
  const borderColor = isActive 
    ? 'border-white/10' 
    : (isFocus ? 'border-focus-primary/10' : 'border-break-primary/20');

  return (
    <div className={`grid grid-cols-3 w-full max-w-[340px] rounded-[2rem] p-6 backdrop-blur-md transition-all duration-300 ${bgColor}`}>
      {/* Sessions Counter */}
      <div className="text-center px-1">
        <div className={`text-xl font-extrabold transition-colors tabular-nums ${textColor}`}>{state.sessionsCount}</div>
        <div className={`text-[9px] font-bold tracking-[0.15em] uppercase mt-2 ${labelColor}`}>SESSIONS</div>
      </div>
      
      {/* Current Mode Cumulative Metric */}
      <div className={`text-center px-1 border-x transition-colors ${borderColor}`}>
        <div className={`text-xl font-extrabold transition-colors tabular-nums ${textColor}`}>
          {isFocus ? state.totalFocusTime : state.totalBreakTime}m
        </div>
        <div className={`text-[9px] font-bold tracking-[0.15em] uppercase mt-2 ${labelColor}`}>
          {isFocus ? 'FOCUSING' : 'RESTING'}
        </div>
      </div>
      
      {/* Total Aggregate Time Metric */}
      <div className="text-center px-1">
        <div className={`text-xl font-extrabold transition-colors tabular-nums ${textColor}`}>{state.totalFocusTime + state.totalBreakTime}m</div>
        <div className={`text-[9px] font-bold tracking-[0.15em] uppercase mt-2 ${labelColor}`}>TOTAL</div>
      </div>
    </div>
  );
};

export default StatsBar;