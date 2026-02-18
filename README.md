
# 🍅 [Slop Pomodoro](https://slop-pomodoro.vercel.app/)

A high-fidelity Pomodoro timer built with React, Tailwind CSS, and Vite. This project features interactive radial configuration, smooth mode transitions, and focus statistics.
Access [Slop Pomodoro here](https://slop-pomodoro.vercel.app/)!

## Features

- **Interactive Radial Configuration**: Dial in your focus and break times with a satisfying circular slider.
- **Dynamic Themes**: Seamless transitions between Focus (Warm/Red) and Break (Cool/Teal) environments.
- **Microcopy Feedback**: Contextual messages that adapt to your timer's progress.
- **Productivity Statistics**: Track your sessions, total focus time, and cumulative rest.
- **Native Notifications**: Desktop notifications to keep you on track even when the tab is in the background.
- **Audio Alerts**: Subtle chime sounds for session completion.
- **Persistence**: Remembers your preferred durations using `localStorage`.

## Hidden Features

- **Unrestricted Mode**: Click the title in the manual time entry modal 6 times to unlock any duration, including a "1-second speedrun" by setting it to 0.

## Technical Details

- **Framework**: React 19
- **Styling**: Tailwind CSS
- **Interactions**: Custom radial math for smooth dial dragging and pointer events.
- **Architecture**: Modular component-based structure with clear type definitions.

## Built with Google AI Studio

This application was developed and refined using **Google AI Studio**. The UI/UX implementation, radial interaction logic, and state management systems were co-authored with the assistance of advanced generative AI models, showcasing a modern AI-first development workflow.

## Design Reference

The visual identity and user interface of Slop Pomodoro are based on designs exported from **Google Stitch**, which served as the fixed visual reference for this implementation. Every detail, from the typography to the specific color ramps for Focus and Break modes, was meticulously translated from the Stitch UI to a functional React application.

## How to Use

1. **Start**: Hit the large Play button to begin a Focus session.
2. **Adjust**: Tap the Settings icon inside the timer to change durations via the radial dial.
3. **Manual Entry**: Click the numbers inside the timer to enter precise minutes.
4. **Skip**: Use the Skip button to instantly toggle between Focus and Break modes.
5. **Reset**: Return to your starting duration or defaults.
