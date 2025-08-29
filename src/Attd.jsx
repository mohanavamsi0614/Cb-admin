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
            className="px-6 py-2 rounded-2xl border-2 text-white bg-black"
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