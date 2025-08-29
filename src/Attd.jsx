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
  const [selectedBlock, setSelectedBlock] = useState(null);

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
  
    // 👉 Filter teams based on selected block
  let filteredTeams = teams;
  if (selectedBlock === 8) {
    filteredTeams = teams.slice(0, 41); // 1st 41 teams
  } else if (selectedBlock === 9) {
    filteredTeams = teams.slice(41, 81); // last 40 teams
  }
  
  const handlecurrAttd=(num)=>{
    socket.emit("currAttd",num);
  }
  const handleTeamSubmit = (teamId) => {
    console.log("Submitting all attendance for team ID:", teamId);
    alert(`Submitting team with ID: ${teamId}`);
  };

  return (
    <div className="min-h-screen bg-[url('./assets/try.svg')] bg-white py-10 px-2 font-sans flex flex-col items-center">
      <h1 className="text-black">{currAttd}</h1>
      <h1 className="text-5xl font-extrabold text-center mb-12 text-black">
        Attendance Dashboard
      </h1>
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {[{label: "close", value: 0}, {label: "1", value: 1}, {label: "2", value: 2}, {label: "3", value: 3}, {label: "4", value: 4}].map(btn => (
          <button
            key={btn.value}
            onClick={() => handlecurrAttd(btn.value)}
            className={`px-6 py-2 rounded-2xl border-2 text-white bg-black ${
              currAttd === btn.value ? "border-blue-500" : "border-gray-600"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-12">
        <button
          onClick={() => setSelectedBlock(8)}
           className={`px-6 py-2 rounded-2xl border-2 text-white bg-black ${
            selectedBlock === 8 ? "border-blue-500" : "border-gray-600"
          }`}
        >
          8th Block
        </button>
        <button
          onClick={() => setSelectedBlock(9)}
           className={`px-6 py-2 rounded-2xl border-2 text-white bg-black ${
            selectedBlock === 9 ? "border-blue-500" : "border-gray-600"
          }`}
        >
          9th Block
        </button>
      </div>

      {loading ? (
        <div className="text-center text-lg font-semibold text-cyan-300 animate-pulse">Loading teams...</div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center text-lg font-semibold text-red-400">No teams available.</div>
      ) : (
        <div className="flex flex-col gap-10 max-w-4xl w-full mx-auto">
          {filteredTeams.map((team, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-2xl p-6 border border-black">
              <Att team={team} onSubmitTeam={handleTeamSubmit} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Attd;