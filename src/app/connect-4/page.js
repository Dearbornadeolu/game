'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Play, Users, Copy, Check, Gamepad2, Trophy, Zap, Crown, User, Wifi, WifiOff } from 'lucide-react';

// Connect Four Game Logic
const createEmptyBoard = () => {
    return Array(6).fill(null).map(() => Array(7).fill(null));
};

// Generate a beep sound using Web Audio API
const playBeep = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };
  
  const ConnectFour = ({ ws, roomId, playerId, playerNumber, players, gameState, onBackToLobby }) => {
    const [board, setBoard] = useState(gameState?.board || createEmptyBoard());
    const [currentPlayer, setCurrentPlayer] = useState(gameState?.currentPlayer || 1);
    const [winner, setWinner] = useState(gameState?.winner || null);
    const [gameOver, setGameOver] = useState(gameState?.gameOver || false);
    const [hoveredCol, setHoveredCol] = useState(null);
    const [lastMove, setLastMove] = useState(null);
    const [moveHistory, setMoveHistory] = useState([]);
    const [winningCells, setWinningCells] = useState([]);
    const [timer, setTimer] = useState(10);
    const [error, setError] = useState('');
  
    const myPlayerNumber = playerNumber;
    const myTurn = currentPlayer === myPlayerNumber && !gameOver;
    const opponent = players.find((p) => p.id !== playerId);
  
    useEffect(() => {
      const handleMessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Game received:', data);
  
        switch (data.type) {
          case 'game_move':
            setBoard(data.gameState.board);
            setCurrentPlayer(data.gameState.currentPlayer);
            setWinner(data.gameState.winner);
            setGameOver(data.gameState.gameOver);
            setLastMove(data.move);
            setMoveHistory((prev) => [
              ...prev,
              {
                ...data.move,
                playerName: data.playerName,
                timestamp: new Date(),
              },
            ]);
            setWinningCells(data.winningCells || []);
            playBeep();
            break;
          case 'game_reset':
            setBoard(data.gameState.board);
            setCurrentPlayer(data.gameState.currentPlayer);
            setWinner(data.gameState.winner);
            setGameOver(data.gameState.gameOver);
            setLastMove(null);
            setMoveHistory([]);
            setWinningCells([]);
            setTimer(10);
            break;
          case 'timer_update':
            setTimer(data.timeLeft);
            break;
          case 'game_over_timeout':
            setBoard(data.gameState.board);
            setCurrentPlayer(data.gameState.currentPlayer);
            setWinner(data.gameState.winner);
            setGameOver(data.gameState.gameOver);
            setError(`Player ${data.winner === myPlayerNumber ? 'You' : getPlayerName(data.winner)} won due to timeout!`);
            break;
          case 'game_over_disconnect':
            setBoard(data.gameState.board);
            setCurrentPlayer(data.gameState.currentPlayer);
            setWinner(data.gameState.winner);
            setGameOver(data.gameState.gameOver);
            setError(`Player ${data.winner === myPlayerNumber ? 'You' : getPlayerName(data.winner)} won due to opponent disconnect!`);
            break;
          case 'player_left':
            setError(`${data.playerName} left the game`);
            break;
          case 'error':
            setError(data.message);
            break;
        }
      };
  
      if (ws) {
        ws.addEventListener('message', handleMessage);
      }
  
      return () => {
        if (ws) {
          ws.removeEventListener('message', handleMessage);
        }
      };
    }, [ws, myPlayerNumber]);
  
    useEffect(() => {
      if (gameState) {
        setBoard(gameState.board);
        setCurrentPlayer(gameState.currentPlayer);
        setWinner(gameState.winner);
        setGameOver(gameState.gameOver);
        setWinningCells(gameState.winningCells || []);
      }
    }, [gameState]);
  
    const handleColumnClick = (col) => {
      if (myTurn && !gameOver && ws) {
        if (board[0][col] !== null) {
          setError('Column is full');
          return;
        }
        ws.send(JSON.stringify({
          type: 'game_move',
          column: col,
        }));
      }
    };
  
    const resetGame = () => {
      if (ws) {
        ws.send(JSON.stringify({
          type: 'game_reset',
        }));
        setError('');
      }
    };
  
    const getPlayerColor = (playerNum) => {
      return playerNum === 1 ? 'bg-red-500' : 'bg-yellow-500';
    };
  
    const getPlayerName = (playerNum) => {
      const player = players.find((p) => p.playerNumber === playerNum);
      return player ? player.username : `Player ${playerNum}`;
    };
  
    const isWinningCell = (row, col) => {
      return winningCells.some(([r, c]) => r === row && c === col);
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Error Toast */}
          {error && (
            <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-2">
              {error}
              <button
                onClick={() => setError('')}
                className="ml-2 text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          )}
  
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBackToLobby}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              ← Back to Lobby
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Connect Four</h1>
              <p className="text-blue-200">Room: {roomId}</p>
            </div>
            <div className="text-right">
              <div className="text-white text-sm">
                Players: {players.length}/2
              </div>
            </div>
          </div>
  
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Game Board */}
            <div className="lg:col-span-3">
              {/* Game Status */}
              <div className="text-center mb-6">
                {gameOver ? (
                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    {winner ? (
                      <div className="flex items-center justify-center gap-2 text-2xl font-bold text-yellow-400">
                        <Trophy className="w-8 h-8 animate-pulse" />
                        {winner === myPlayerNumber ? 'You Win!' : `${getPlayerName(winner)} Wins!`}
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-gray-400">It's a Draw!</div>
                    )}
                    <button
                      onClick={resetGame}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Play Again
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-center gap-2 text-xl font-semibold text-white">
                      {myTurn ? (
                        <>
                          <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                          Your Turn
                          <span className="text-yellow-400 ml-2" aria-label={`Time remaining: ${timer} seconds`}>
                            {timer}s
                          </span>
                        </>
                      ) : (
                        <>
                          <Crown className="w-6 h-6 text-purple-400" />
                          {getPlayerName(currentPlayer)}'s Turn
                          <span className="text-yellow-400 ml-2" aria-label={`Time remaining: ${timer} seconds`}>
                            {timer}s
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
  
              {/* Game Board */}
              <div className="bg-blue-600 rounded-2xl p-6 shadow-2xl">
                <div className="grid grid-cols-7 gap-2">
                  {Array(7).fill(null).map((_, col) => (
                    <div key={col} className="flex flex-col gap-2">
                      {Array(6).fill(null).map((_, row) => (
                        <div
                          key={`${row}-${col}`}
                          className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-blue-800 cursor-pointer transition-all duration-200 ${
                            board[row][col] === 1
                              ? 'bg-red-500 shadow-lg'
                              : board[row][col] === 2
                              ? 'bg-yellow-500 shadow-lg'
                              : 'bg-blue-700 hover:bg-blue-600'
                          } ${
                            hoveredCol === col && !gameOver && myTurn
                              ? 'transform scale-105 border-white'
                              : ''
                          } ${
                            lastMove && lastMove.row === row && lastMove.column === col
                              ? 'ring-4 ring-white ring-opacity-50 animate-pulse'
                              : ''
                          } ${
                            isWinningCell(row, col)
                              ? 'ring-4 ring-yellow-400 ring-opacity-75 animate-bounce'
                              : ''
                          }`}
                          onClick={() => handleColumnClick(col)}
                          onMouseEnter={() => setHoveredCol(col)}
                          onMouseLeave={() => setHoveredCol(null)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Player Info */}
              <div className="flex justify-between mt-6">
                <div className={`p-4 rounded-lg ${myPlayerNumber === 1 ? 'bg-red-500' : 'bg-gray-700'}`}>
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="font-semibold">
                      {getPlayerName(1)} {myPlayerNumber === 1 ? '(You)' : ''}
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${myPlayerNumber === 2 ? 'bg-yellow-500' : 'bg-gray-700'}`}>
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="font-semibold">
                      {getPlayerName(2)} {myPlayerNumber === 2 ? '(You)' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Players List */}
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Players
                </h3>
                <div className="space-y-2">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className={`flex items-center gap-2 p-2 rounded ${
                        player.id === playerId ? 'bg-blue-600' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${getPlayerColor(player.playerNumber)}`}></div>
                      <span className="text-white text-sm">
                        {player.username} {player.id === playerId ? '(You)' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Move History */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-4">Move History</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {moveHistory.length === 0 ? (
                    <p className="text-gray-400 text-sm">No moves yet</p>
                  ) : (
                    moveHistory.slice(-10).map((move, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${getPlayerColor(move.player)}`}></div>
                        <span className="text-white">
                          {move.playerName} → Col {move.column + 1}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  


const GameLobby = () => {
    const [currentView, setCurrentView] = useState('username');
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');
    const [joinRoomId, setJoinRoomId] = useState('');
    const [playerId, setPlayerId] = useState('');
    const [playerNumber, setPlayerNumber] = useState(null);
    const [players, setPlayers] = useState([]);
    const [gameState, setGameState] = useState(null);
    const [ws, setWs] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');
    const wsRef = useRef(null);

    const connectWebSocket = () => {
        if (wsRef.current) {
            wsRef.current.close();
        }

        const websocket = new WebSocket('');
        wsRef.current = websocket;

        websocket.onopen = () => {
            setConnectionStatus('connected');
            setWs(websocket);
            setError('');
            console.log('Connected to WebSocket server');
        };

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received:', data);

            switch (data.type) {
                case 'room_created':
                    setRoomId(data.roomId);
                    setPlayerId(data.playerId);
                    setPlayerNumber(data.playerNumber);
                    setCurrentView('waiting');
                    break;
                case 'room_joined':
                    setRoomId(data.roomId);
                    setPlayerId(data.playerId);
                    setPlayerNumber(data.playerNumber);
                    setPlayers(data.players);
                    setGameState(data.gameState);
                    setCurrentView('game');
                    break;
                case 'player_joined':
                    setPlayers(data.players);
                    if (data.players.length === 2) {
                        setCurrentView('game');
                    }
                    break;
                case 'game_start':
                    setCurrentView('game');
                    break;
                case 'player_left':
                    setPlayers(data.players);
                    setError(`${data.playerName} left the game`);
                    setCurrentView('home');
                    break;
                case 'error':
                    setError(data.message);
                    break;
            }
        };

        websocket.onclose = () => {
            setConnectionStatus('disconnected');
            setWs(null);
            console.log('Disconnected from WebSocket server');
        };

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setConnectionStatus('error');
            setError('Connection error. Please try again.');
        };
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        if (username.trim() && connectionStatus === 'connected') {
            setCurrentView('home');
        } else if (!username.trim()) {
            setError('Please enter a valid username');
        } else {
            setError('Not connected to server. Please try again.');
        }
    };

    const createRoom = () => {
        if (ws && username.trim()) {
            ws.send(JSON.stringify({
                type: 'create_room',
                username: username.trim(),
                game: 'connect4'
            }));
        } else {
            setError('Connection not established or invalid username');
        }
    };

    const joinRoom = () => {
        if (ws && joinRoomId.trim() && username.trim()) {
            ws.send(JSON.stringify({
                type: 'join_room',
                roomId: joinRoomId.trim().toUpperCase(),
                username: username.trim()
            }));
        } else {
            setError('Please enter a valid room ID and username');
        }
    };

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const backToLobby = () => {
        if (ws) {
            ws.send(JSON.stringify({
                type: 'leave_room'
            }));
        }
        setCurrentView('home');
        setRoomId('');
        setPlayerId('');
        setPlayerNumber(null);
        setPlayers([]);
        setGameState(null);
        setJoinRoomId('');
        setError('');
    };

    const retryConnection = () => {
        setError('');
        connectWebSocket();
    };

    if (currentView === 'game') {
        return (
            <ConnectFour
                ws={ws}
                roomId={roomId}
                playerId={playerId}
                playerNumber={playerNumber}
                players={players}
                gameState={gameState}
                onBackToLobby={backToLobby}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                        GameHub
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-white">
                        {connectionStatus === 'connected' ? (
                            <Wifi className="w-5 h-5 text-green-500" />
                        ) : (
                            <WifiOff className="w-5 h-5 text-red-500" />
                        )}
                        <span>{connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}</span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-2">
                        {error}
                        {connectionStatus === 'error' && (
                            <button
                                onClick={retryConnection}
                                className="ml-4 px-2 py-1 bg-white text-red-500 rounded hover:bg-gray-200"
                            >
                                Retry
                            </button>
                        )}
                        <button
                            onClick={() => setError('')}
                            className="ml-2 text-white hover:text-gray-200"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Username View */}
                {currentView === 'username' && (
                    <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 shadow-xl">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                            <User className="w-6 h-6" />
                            Enter Username
                        </h2>
                        <form onSubmit={handleUsernameSubmit}>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Your username"
                                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                                maxLength={20}
                            />
                            <button
                                type="submit"
                                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                disabled={connectionStatus !== 'connected'}
                            >
                                <Play className="w-5 h-5" />
                                Continue
                            </button>
                        </form>
                    </div>
                )}

                {/* Home View */}
                {currentView === 'home' && (
                    <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 shadow-xl">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Gamepad2 className="w-6 h-6" />
                            Connect Four Lobby
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <button
                                    onClick={createRoom}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    disabled={connectionStatus !== 'connected'}
                                >
                                    <Play className="w-5 h-5" />
                                    Create Room
                                </button>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={joinRoomId}
                                    onChange={(e) => setJoinRoomId(e.target.value)}
                                    placeholder="Enter Room ID"
                                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                                    maxLength={6}
                                />
                                <button
                                    onClick={joinRoom}
                                    className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    disabled={connectionStatus !== 'connected'}
                                >
                                    <Users className="w-5 h-5" />
                                    Join Room
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Waiting Room View */}
                {currentView === 'waiting' && (
                    <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 shadow-xl">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Users className="w-6 h-6" />
                            Waiting for Opponent
                        </h2>
                        <p className="text-gray-300 mb-4">
                            Share this room ID with a friend to join the game:
                        </p>
                        <div className="flex items-center gap-2 mb-4">
                            <input
                                type="text"
                                value={roomId}
                                readOnly
                                className="flex-1 p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
                            />
                            <button
                                onClick={copyRoomId}
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                        <button
                            onClick={backToLobby}
                            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                        >
                            ← Back to Lobby
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameLobby;