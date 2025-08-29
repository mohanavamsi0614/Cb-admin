import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <h1 className="text-4xl font-extrabold mb-10 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Round 1 */}
        <button
          onClick={() => navigate("/firstround")}
          className="px-10 py-6 rounded-2xl shadow-lg bg-blue-600 hover:bg-blue-700 transition transform hover:scale-105 text-xl font-semibold"
        >
          Round 1
        </button>

        {/* Round 2 */}
        <button
          onClick={() => navigate("/secondround")}
          className="px-10 py-6 rounded-2xl shadow-lg bg-purple-600 hover:bg-purple-700 transition transform hover:scale-105 text-xl font-semibold"
        >
          Round 2
        </button>
      </div>
    </div>
  );
}

export default Home;
