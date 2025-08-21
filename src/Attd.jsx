import React, { useEffect, useState } from "react";
import axios from "axios";
import Att from "./comp/Attd";

function Attd() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://cb-kare-server.onrender.com/event/teams")
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

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        📋 Attendance Dashboard
      </h1>

      {loading ? (
        <div className="text-center text-gray-600">Loading teams...</div>
      ) : teams.length === 0 ? (
        <div className="text-center text-gray-500">No teams available.</div>
      ) : (
        <div className=" flex flex-col gap-5">
          {teams.map((team, index) => (
            <Att key={index} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Attd;
