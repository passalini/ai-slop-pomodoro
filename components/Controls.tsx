import React from 'react';
import { TimerState } from '../types';

interface ControlsProps {
  /** The full current state of the timer */
  state: TimerState;
  /** Callback to toggle between running and paused states, or stop alarm */
  onToggle: () => void;
  /** Callback to reset the current timer to its starting point */
  onReset: () => void;
  /** Callback to skip the current mode and switch to the next */
  onSkip: () => void;
}

/**
 * Controls
 * 
 * Renders the primary interaction panel for session management.
 * Contains the large play/pause toggle and the secondary reset/skip actions.
 */
const Controls: React.FC<ControlsProps> = ({ state, onToggle, onReset, onSkip }) => {
  const isFocus = state.mode === 'focus';
  const isRunning = state.status === 'running';
  const isAlarm = state.status === 'alarm';

  /** Theme classes for idle vs running states */
  const idleAccent = isFocus ? 'bg-focus-accent' : 'bg-break-accent';
  const idlePrimary = isFocus ? 'bg-focus-primary' : 'bg-break-saturated';
  const idleIcon = isFocus ? 'text-focus-primary' : 'text-break-primary';

  /** Color for the saturated state (running or alarm) */
  const saturatedTextColor = isFocus ? 'text-focus-saturated' : 'text-break-saturated';

  return (
    <div className="flex items-end gap-10">
      {/* Reset Button */}
      <button 
        onClick={onReset}
        title="Reset Timer"
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm hover:opacity-80 mb-4
          ${isRunning || isAlarm ? 'bg-white/20 text-white' : `${idleAccent} ${idleIcon}`}`}
      >
        <span className="material-symbols-outlined text-[28px]">replay</span>
      </button>

      {/* Main Primary Toggle (Play / Pause / Check) */}
      <button 
        onClick={onToggle}
        title={isAlarm ? "Acknowledge" : isRunning ? "Pause" : "Start"}
        className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 hover:scale-[1.03] translate-y-4
          ${(isRunning || isAlarm)
              ? `bg-white ${saturatedTextColor}` 
              : `${idlePrimary} text-white ${isFocus ? 'shadow-focus-primary/40' : 'shadow-break-saturated/30'}`}`}
      >
        <span className={`material-symbols-outlined text-[52px] fill-1 ${(isRunning || isAlarm) ? saturatedTextColor : ''}`}>
          {isAlarm ? 'check' : isRunning ? 'pause' : 'play_arrow'}
        </span>
      </button>

      {/* Skip Button - Hidden during alarm */}
      {!isAlarm ? (
        <button 
          onClick={onSkip}
          title="Skip Session"
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm hover:opacity-80 mb-4
            ${isRunning ? 'bg-white/20 text-white' : `${idleAccent} ${idleIcon}`}`}
        >
          <span className="material-symbols-outlined text-[28px]">skip_next</span>
        </button>
      ) : (
        /* Placeholder to maintain layout spacing when Skip is hidden */
        <div className="w-16 mb-4" />
      )}
    </div>
  );
};

export default Controls;