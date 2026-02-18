/**
 * Represents the two primary states of the Pomodoro cycle.
 */
export type TimerMode = 'focus' | 'break';

/**
 * Represents the operational status of the countdown timer.
 */
export type TimerStatus = 'idle' | 'running' | 'paused' | 'alarm';

/**
 * Main application state object used to track progress and settings.
 */
export interface TimerState {
  /** The current active mode (focusing or taking a break) */
  mode: TimerMode;
  /** Whether the timer is currently counting down, paused, or waiting to start */
  status: TimerStatus;
  /** Controls the visibility of the radial configuration overlay */
  configOpen: boolean;
  /** The initial duration set by the user in seconds */
  duration: number;
  /** The time left in the current session in seconds */
  remainingTime: number;
  /** Total number of completed Focus + Break cycles */
  sessionsCount: number;
  /** Cumulative focus time in minutes */
  totalFocusTime: number;
  /** Cumulative break time in minutes */
  totalBreakTime: number;
  /** Internal flag to ensure sessions only increment after a full cycle */
  focusCompletedInCurrentCycle: boolean;
}