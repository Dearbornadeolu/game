# 🎮 Connect Four Multiplayer Game

A real-time, two-player Connect Four game built with **React**, **TailwindCSS**, and **WebSocket**. Players can create or join rooms, play against each other in a turn-based game, and see live game state updates with animated UI feedback.

---

## 🚀 Features

* 🧠 **Connect Four Logic** – Fully interactive board with win/draw detection and turn-based logic.
* 🕹️ **Multiplayer Rooms** – Create and join game rooms via WebSocket.
* ⚡ **Live Updates** – Real-time move syncing, game state updates, and connection handling.
* ⏱️ **Turn Timer** – 10-second countdown timer for each turn to prevent stalling.
* 📜 **Move History** – Track recent moves with player attribution.
* 📢 **Error Handling** – Clear user-facing feedback for errors, disconnects, and timeouts.
* 🎨 **Responsive UI** – Styled with TailwindCSS, works across device sizes.

---

## 🧩 Tech Stack

* **Frontend:** Nextjs, Tailwind CSS
* **Backend:** WebSocket Server (`ws` Node.js library)
* **Icons:** Lucide React Icons

---

## 📦 Installation

1. **Clone this repo:**

   ```bash
   git clone https://github.com/dearbornadeolu/connect-four-websocket.git
   cd game
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the WebSocket Server (in a separate terminal):**

   > Replace `server.js` with your WebSocket server file

   ```bash
   node server.js
   ```

4. **Start the React app:**

   ```bash
   npm run dev
   ```

---

## 🌐 WebSocket Server

The WebSocket server listens for connections and manages:

* Room creation
* Room joining
* Move syncing
* Turn updates and timeout
* Game resets and player disconnects

**Default port:** `3003`
Make sure the frontend connects to the correct IP or localhost:

```js
const websocket = new WebSocket('ws://localhost:3003');
```

---

## 🖥️ Project Structure

```
/components
  - GameLobby.jsx         // Main component: lobby, game UI, room logic
  - ConnectFour.jsx       // Handles the board, gameplay, win logic
/server
  - server.js             // WebSocket server (not included here)
/public
  - assets (if any)
/styles
  - Tailwind styles (via PostCSS or your config)
/index.js or App.js
```

---

## 🎮 How to Play

1. Enter your **username**.
2. Choose to **Create Room** or **Join Room** using a room ID.
3. Wait for an opponent.
4. Drop tokens by clicking a column.
5. First to connect **4 in a row** wins.
6. Game auto-resets after a win or draw.

---

## 🛡️ Error Handling & Edge Cases

* **Timeout:** If a player doesn’t move within 10 seconds, the opponent wins.
* **Disconnects:** If a player leaves mid-game, the remaining player wins.
* **Full Columns:** Users are prevented from dropping in full columns.
* **WebSocket Errors:** Shown via toast UI with retry options.

---

## 📋 TODOs

* [ ] Add persistent leaderboard with Supabase or Firebase
* [ ] Add avatar and user stats
* [ ] Add support for rematches without leaving the room
* [ ] Add sound toggle / animations
* [ ] Mobile UI enhancements

---

## 📸 Preview

> (Add a screenshot or GIF showing gameplay here)

---

## 📄 License

MIT License. Feel free to fork, modify, and use for your own multiplayer game projects.



## 🤝 Contributions

Feel free to open issues or submit PRs for improvements, bugs, or feature requests.

