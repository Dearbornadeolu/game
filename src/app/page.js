'use client'
import Link from 'next/link';
import React from 'react';
import { Gamepad2, Users, Zap, Trophy } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 animate-fade-in">
          Welcome to GameHub
        </h1>
        <p className="text-lg md:text-xl text-blue-200 max-w-2xl mb-8 animate-fade-in-delayed">
          Challenge your friends to a thrilling game of Connect Four in real-time. Create a room, share the code, and let the fun begin!
        </p>
        <Link
          href="/connect-4"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
        >
          <Gamepad2 className="w-5 h-5" />
          Play Connect Four
        </Link>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-semibold text-center mb-10">Why Play on GameHub?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <Users className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Multiplayer Fun</h3>
            <p className="text-gray-300">
              Connect with friends or challenge opponents in real-time multiplayer matches.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <Zap className="w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-Time Gameplay</h3>
            <p className="text-gray-300">
              Experience seamless, lag-free gameplay with our WebSocket-powered server.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <Trophy className="w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Compete & Win</h3>
            <p className="text-gray-300">
              Strategize and connect four to claim victory and bragging rights!
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} GameHub. Built with <span className="text-red-400">❤️</span> for fun and games.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Link href="/about" className="text-blue-400 hover:text-blue-300">
              About
            </Link>
            <Link href="/contact" className="text-blue-400 hover:text-blue-300">
              Contact
            </Link>
            <Link href="/connect-4" className="text-blue-400 hover:text-blue-300">
              Play Now
            </Link>
          </div>
        </div>
      </footer>

      {/* Tailwind CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        .animate-fade-in-delayed {
          animation: fadeIn 1s ease-out 0.3s;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};

export default HomePage;