import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-extrabold mb-10 tracking-wide">
        Dashboard
      </h1>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Round 1 */}
        <button
          onClick={() => navigate("/firstround")}
          className="px-10 py-6 rounded-2xl shadow-md bg-blue-600 hover:bg-blue-700 transition transform hover:scale-105 text-xl font-semibold text-white"
        >
          Round 1
        </button>

        {/* Round 2 */}
        <button
          onClick={() => navigate("/secondround")}
          className="px-10 py-6 rounded-2xl shadow-md bg-purple-600 hover:bg-purple-700 transition transform hover:scale-105 text-xl font-semibold text-white"
        >
          Round 2
        </button>

        {/* Attendance */}
        <button
          onClick={() => navigate("/attendance")}
          className="px-10 py-6 rounded-2xl shadow-md bg-green-600 hover:bg-green-700 transition transform hover:scale-105 text-xl font-semibold text-white"
        >
          Attendance
        </button>
        
        <button
          onClick={() => navigate("/game")}
          className="px-10 py-6 rounded-2xl shadow-md bg-green-600 hover:bg-green-700 transition transform hover:scale-105 text-xl font-semibold text-white"
        >
          Game
        </button>
        
        <button
          onClick={() => navigate("/eventupdates")}
          className="px-10 py-6 rounded-2xl shadow-md bg-green-600 hover:bg-green-700 transition transform hover:scale-105 text-xl font-semibold text-white"
        >
          Event Updates
        </button>
      </div>
    </div>
  );
}

export default Home;
