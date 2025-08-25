import React, { useEffect, useState } from "react";
import axios from "axios";
import Att from "./comp/Attd"; 
import { api } from "./api";

function Attd() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const handleTeamSubmit = (teamId) => {
    console.log("Submitting all attendance for team ID:", teamId);
    alert(`Submitting team with ID: ${teamId}`);
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-gray-200 py-10 px-6 font-sans">
      
      
      <h1 className="text-4xl font-bold text-center mb-8 tracking-tight text-cyan-400 drop-shadow-lg">
        📋 Attendance Dashboard
      </h1>

      {loading ? (
        <div className="text-center">Loading teams...</div>
      ) : teams.length === 0 ? (
        <div className="text-center">No teams available.</div>
      ) : (
        <div className="flex flex-col gap-5">
          {teams.map((team, index) => (
            <Att key={index} team={team} onSubmitTeam={handleTeamSubmit} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Attd;