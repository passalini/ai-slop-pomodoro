import React from 'react';
import { TimerMode } from '../types';

interface ProgressDialProps {
  /** Current mode: 'focus' or 'break' */
  mode: TimerMode;
  /** Total session time in seconds */
  duration: number;
  /** Time remaining in seconds */
  remainingTime: number;
  /** Whether the timer is currently active */
  isRunning: boolean;
}

/**
 * ProgressDial
 * 
 * Renders an SVG-based circular progress ring.
 * Uses stroke-dasharray and stroke-dashoffset to visually represent 
 * the percentage of time remaining in the current session.
 */
const ProgressDial: React.FC<ProgressDialProps> = ({ mode, duration, remainingTime, isRunning }) => {
  const isFocus = mode === 'focus';
  const radius = 155;
  const circumference = 2 * Math.PI * radius;
  
  /** 
   * Calculated percentage of time remaining.
   * Ensures value stays between 0 and 1.
   */
  const percentage = Math.min(Math.max(remainingTime / duration, 0), 1);
  
  /**
   * Offset value for the SVG stroke. 
   * 0 offset means the circle is full.
   * Full circumference offset means the circle is empty.
   */
  const offset = circumference * (1 - percentage);

  /** Colors chosen based on active vs idle state and current mode */
  const strokeColor = isRunning ? '#FFFFFF' : (isFocus ? '#EF4444' : '#4FD1C5');
  const trackColor = isRunning 
    ? 'rgba(255, 255, 255, 0.2)' 
    : (isFocus ? 'rgba(239, 68, 68, 0.1)' : 'rgba(79, 209, 197, 0.2)');

  return (
    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
      {/* Static Background Track (The 'track' behind the progress) */}
      <circle
        cx="170"
        cy="170"
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth="4"
        className="transition-colors duration-500"
      />
      {/* Dynamic Progress Indicator */}
      <circle
        cx="170"
        cy="170"
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="round"
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: offset,
          transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
        }}
      />
    </svg>
  );
};

export default ProgressDial;