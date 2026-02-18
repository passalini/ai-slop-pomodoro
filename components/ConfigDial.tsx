import React, { useState, useRef, useEffect } from 'react';
import { TimerMode } from '../types';

interface ConfigDialProps {
  /** Mode being configured */
  mode: TimerMode;
  /** Current duration setting in seconds */
  duration: number;
  /** Callback to update the duration in the parent component */
  onUpdate: (minutes: number) => void;
  /** Callback to close configuration mode */
  onClose: () => void;
}

/**
 * ConfigDial
 * 
 * An interactive radial controller that allows users to 'drag' 
 * the session duration between pre-defined minimum and maximum values.
 */
const ConfigDial: React.FC<ConfigDialProps> = ({ mode, duration, onUpdate, onClose }) => {
  const isFocus = mode === 'focus';
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  /** Hardcoded limits for session lengths */
  const minVal = isFocus ? 5 : 1;
  const maxVal = isFocus ? 60 : 30;
  
  const currentMinutes = Math.floor(duration / 60);

  /**
   * Converts a minute value into a degree angle for the dial handle.
   */
  const getAngleForMinutes = (mins: number) => {
    return (mins % 60) * 6;
  };

  /**
   * Converts a degree angle from 0-360 into a minute value.
   * Clamped by mode-specific min/max values.
   */
  const getMinutesForAngle = (angle: number) => {
    let mins = Math.round(angle / 6);
    if (mins === 0) mins = 60;
    return Math.min(Math.max(mins, minVal), maxVal);
  };

  /**
   * Translates screen-space pointer coordinates to a radial angle relative 
   * to the center of the component, then updates the duration.
   */
  const handlePointer = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    /**
     * Use atan2 to find the angle from the center.
     * Adjusting +90 degrees to align 0 degrees (12 o'clock) correctly.
     */
    const radians = Math.atan2(clientY - centerY, clientX - centerX);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    
    const newMinutes = getMinutesForAngle(degrees);
    onUpdate(newMinutes);
  };

  /** Start dragging on mouse down */
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handlePointer(e.clientX, e.clientY);
  };

  /** Handle movement while dragging */
  const onMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handlePointer(e.clientX, e.clientY);
    }
  };

  /** Stop dragging on mouse/touch up */
  const onMouseUp = () => setIsDragging(false);

  /**
   * Global event listeners for drag management to ensure 
   * capture even if pointer leaves the container area.
   */
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove as any);
      window.addEventListener('touchend', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove as any);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [isDragging]);

  const onTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handlePointer(e.touches[0].clientX, e.touches[0].clientY);
  };

  const primaryColor = isFocus ? '#EF4444' : '#4FD1C5';
  const labelColorClass = isFocus ? 'text-focus-primary' : 'text-break-primary';
  const rotation = getAngleForMinutes(currentMinutes);

  /**
   * Generates the 60 radial tick marks for the dial.
   */
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const isMajor = i % 5 === 0;
    const angle = i * 6;
    ticks.push(
      <div 
        key={i} 
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 origin-center transition-colors duration-300`}
        style={{ 
          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-155px)`,
          height: isMajor ? '10px' : '5px',
          width: isMajor ? '1.5px' : '1px',
          backgroundColor: isMajor ? (isFocus ? 'rgba(239, 68, 68, 0.3)' : 'rgba(79, 209, 197, 0.4)') : (isFocus ? 'rgba(239, 68, 68, 0.1)' : 'rgba(79, 209, 197, 0.15)')
        }}
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className="relative w-full h-full flex items-center justify-center cursor-pointer select-none"
    >
      {/* Radial track indicators */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 340">
        <circle cx="170" cy="170" fill="none" r="155" stroke={isFocus ? 'rgba(239, 68, 68, 0.05)' : 'rgba(79, 209, 197, 0.08)'} strokeWidth="12"></circle>
        <circle 
          cx="170" 
          cy="170" 
          fill="none" 
          r="155" 
          stroke={isFocus ? '#FEE2E2' : '#D1EEEE'} 
          strokeDasharray={`${(currentMinutes / 60) * 974} 974`} 
          strokeLinecap="round" 
          strokeWidth="12" 
          transform="rotate(-90 170 170)"
          className="transition-[stroke-dasharray] duration-200 ease-out"
        ></circle>
      </svg>

      {/* Radial numeric labels and ticks */}
      <div className="absolute inset-0 pointer-events-none">
        {ticks}
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 text-[9px] font-bold opacity-40 ${labelColorClass}`} style={{ transform: 'translate(-50%, -50%) rotate(0deg) translateY(-178px)' }}>60</div>
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 text-[9px] font-bold opacity-40 ${labelColorClass}`} style={{ transform: 'translate(-50%, -50%) rotate(90deg) translateY(-178px) rotate(-90deg)' }}>15</div>
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 text-[9px] font-bold opacity-40 ${labelColorClass}`} style={{ transform: 'translate(-50%, -50%) rotate(180deg) translateY(-178px) rotate(-180deg)' }}>30</div>
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 text-[9px] font-bold opacity-40 ${labelColorClass}`} style={{ transform: 'translate(-50%, -50%) rotate(270deg) translateY(-178px) rotate(-270deg)' }}>45</div>
      </div>

      {/* Floating interactive handle */}
      <div 
        className={`absolute left-1/2 top-1/2 w-8 h-8 bg-white rounded-full border-[3px] shadow-xl pointer-events-none transition-all duration-200 ease-out ${isDragging ? 'scale-110' : 'scale-100'}`}
        style={{ 
          borderColor: primaryColor,
          transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-155px)`
        }}
      />
    </div>
  );
};

export default ConfigDial;