import React, { useEffect, useState } from "react";
import axios from "axios";
import Att from "./comp/Attd"; 
import { api } from "./api";
import { io } from "socket.io-client";

const socket=io(api)
function Attd() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currAttd, setCurrAttd] = useState(0);

  useEffect(() => {
    axios
      .get(`${api}/event/teams`)
      .then((res) => {
        console.log(res.data);
        setTeams(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching teams:", err);
        setLoading(false);
      });
      socket.emit("getCurrAttd")
      socket.on("currAttd", (num) => {
        setCurrAttd(num);
      });
  }, []);
  
  const handlecurrAttd=(num)=>{
    socket.emit("currAttd",num);
  }
  const handleTeamSubmit = (teamId) => {
    console.log("Submitting all attendance for team ID:", teamId);
    alert(`Submitting team with ID: ${teamId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-cyan-900 text-gray-200 py-10 px-2 font-sans flex flex-col items-center">
      <h1>{currAttd}</h1>
      <h1 className="text-5xl font-extrabold text-center mb-12 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 animate-pulse drop-shadow-2xl">
        <span className="inline-block animate-bounce">📋</span> Attendance Dashboard
      </h1>
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {[{label: "close", value: 0}, {label: "1", value: 1}, {label: "2", value: 2}, {label: "3", value: 3}, {label: "4", value: 4}].map(btn => (
          <button
            key={btn.value}
            onClick={() => handlecurrAttd(btn.value)}
            className="px-7 py-3 rounded-2xl border-2 border-blue-400 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 text-white font-bold shadow-lg hover:scale-110 hover:shadow-cyan-400/40 focus:outline-none focus:ring-4 focus:ring-cyan-400 transition-all duration-300 backdrop-blur-md"
            style={{boxShadow: '0 0 16px 2px #22d3ee88'}}
          >
            {btn.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="text-center text-lg font-semibold text-cyan-300 animate-pulse">Loading teams...</div>
      ) : teams.length === 0 ? (
        <div className="text-center text-lg font-semibold text-red-400">No teams available.</div>
      ) : (
        <div className="flex flex-col gap-10 max-w-4xl w-full mx-auto">
          {teams.map((team, index) => (
            <div key={index} className="bg-slate-900/60 rounded-3xl shadow-2xl p-6 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-400/30 transition-all duration-300 backdrop-blur-lg">
              <Att team={team} onSubmitTeam={handleTeamSubmit} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Attd;