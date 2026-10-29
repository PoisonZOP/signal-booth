

# SIGNAL — Decode the Future

An interactive kiosk web app for Open House 2026 (DPU · Information Systems). 
It teaches the basics of binary through a fast, 3-step journey and a 45-second challenge.

## Game Flow

1. **Learn** — Interactive 4-bit toggles (8, 4, 2, 1) and a quick intro to ASCII.
2. **Decode** — A 3-question warm-up to practice converting binary to decimal.
3. **Build** — The main game.
   - You have **45 seconds** to solve up to 4 phrases.
   - Each correct phrase adds **+15 seconds** to the clock.
   - Progression is always: Short → Medium → Short → Long.
   - A clean result page shows your total phrases, total time, and hints used.

## Features

- **A–Z Codes Modal:** Click the "A–Z Codes" button in the top right of any page to open a reference table of all 26 letters.
- **Admin Panel:** Hidden staff controls to change game modes, reset the device, and export results to CSV.
- **Offline Ready:** No backend, no databases. All data stays on the device.
- **Two Game Modes:**
  - *Classic:* Drag and drop binary tiles into slots.
  - *Lucky Draw:* Flip face-down cards to find the correct codes.
- **Auto-Idle Reset:** If a visitor walks away, the screen automatically resets to the home page to prevent abandoned sessions.

## File Structure

```text
Signal-Booth/
├── index.html          # Attract screen
├── learn.html          # Step 1
├── decode.html         # Step 2
├── build.html          # Step 3 (Main Game)
├── result.html         # Final Score
├── admin.html          # Staff controls (Hidden)
├── css/
│   ├── tokens.css      # Colors, fonts, spacing
│   ├── base.css        # Global resets and topbar
│   ├── components.css  # Buttons, tiles, modals
│   └── pages.css       # Page-specific layouts
├── js/
│   ├── data.js         # Phrases and 5-bit alphabet
│   ├── state.js        # Session storage
│   ├── rain.js         # Background canvas effect
│   ├── conversion.js   # A-Z Modal logic
│   ├── idle.js         # Auto-reset timer
│   ├── build.js        # Core game logic
│   ├── result.js       # Final score logic
│   └── admin.js        # Admin panel logic
└── assets/             # Optional fonts/icons

How to Run Locally (Staff)

You have two options to run the game on the booth laptop/tablet:

Option 1: Direct File (Simplest)
Just double-click index.html. Because this version uses sessionStorage, the game will properly track your score to the result page even without a local server.

Option 2: Local Server (Recommended)
If you have Python installed, open your terminal/command prompt and run:
bash

python -m http.server 8000

Then open Chrome and go to http://localhost:8000.