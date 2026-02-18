import React, { useState } from 'react';
import { TimerMode } from '../types';

interface TimeInputModalProps {
  /** The mode being updated ('focus' or 'break') */
  mode: TimerMode;
  /** Callback to close the modal without saving */
  onClose: () => void;
  /** Callback triggered with valid numeric input to update the timer duration */
  onConfirm: (minutes: number) => void;
}

/**
 * TimeInputModal
 * 
 * Provides a high-focus overlay for manual numeric time entry. 
 * Useful for precisely setting values that might be awkward to reach 
 * with the radial dial.
 * 
 * Includes an easter egg: click the title 6 times to disable range limits.
 */
const TimeInputModal: React.FC<TimeInputModalProps> = ({ mode, onClose, onConfirm }) => {
  const isFocus = mode === 'focus';
  
  /** Hardcoded validation bounds */
  const min = isFocus ? 5 : 1;
  const max = isFocus ? 60 : 30;
  
  const [value, setValue] = useState<string>(isFocus ? '25' : '5');
  const [error, setError] = useState<string | null>(null);
  
  /** Easter egg state: track title clicks */
  const [clickCount, setClickCount] = useState(0);
  const isEasterEggActive = clickCount >= 6;

  /**
   * Validates input as a number within the allowed range 
   * before passing it back to the parent component.
   * If the easter egg is active, range validation is bypassed.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(value, 10);
    
    // Normal validation
    if (!isEasterEggActive && (isNaN(mins) || mins < min || mins > max)) {
      setError(`Value between ${min} and ${max}`);
      return;
    }
    
    // Easter Egg Validation: Allow any non-negative number if clicks >= 6
    if (isEasterEggActive && (isNaN(mins) || mins < 0)) {
      setError("Enter a valid number");
      return;
    }

    onConfirm(mins);
  };

  /**
   * Handles clicking on the modal title to trigger the easter egg.
   */
  const handleTitleClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/15 backdrop-blur-[4px] animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] p-10 w-full max-w-xs shadow-2xl animate-in zoom-in-95 duration-300">
        <h2 
          onClick={handleTitleClick}
          className={`text-xl font-black mb-8 text-center tracking-tight cursor-pointer select-none transition-transform active:scale-95 ${isFocus ? 'text-focus-primary' : 'text-break-primary'}`}
        >
          {isFocus ? 'Focus' : 'Break'} Minutes
          {isEasterEggActive && <span className="block text-[8px] opacity-30 mt-1 uppercase tracking-widest">Unrestricted Mode</span>}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="relative">
            {/* Direct numeric input for speed of entry */}
            <input 
              autoFocus
              type="number" 
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(null);
              }}
              className={`w-full text-center text-7xl font-black border-none bg-zinc-50 rounded-[2rem] py-10 focus:ring-0 transition-all tabular-nums ${isEasterEggActive ? 'ring-2 ring-focus-primary/10' : ''}`}
              placeholder="00"
            />
            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-300 font-bold uppercase text-[10px] tracking-widest pointer-events-none">MIN</span>
            
            {/* Inline validation error display */}
            {error && (
              <p className="text-red-500 text-[10px] font-bold mt-4 text-center uppercase tracking-wider absolute left-0 right-0">
                {error}
              </p>
            )}
          </div>
          
          <div className="flex gap-4 mt-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-100 text-zinc-500 font-bold py-5 rounded-2xl hover:bg-zinc-200 transition-colors active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className={`flex-1 text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-95 ${isFocus ? 'bg-focus-primary shadow-focus-primary/20' : 'bg-break-primary shadow-break-primary/20'}`}
            >
              Set
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeInputModal;