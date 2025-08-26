import React, { useEffect, useState } from "react";

function Score() {
  const [teams, setTeams] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://cb-kare-server-kk42.onrender.com/event/teams")
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);
        // Initialize empty scores for each team
        const initialScores = {};
        data.forEach((team) => {
          initialScores[team._id] = {
            round1: Array(5).fill(""),
           
          };
        });
        setScores(initialScores);
      })
      .catch((err) => console.error("Error fetching teams:", err));
  }, []);

  const handleScoreChange = (round, index, value) => {
    const teamId = teams[currentTeamIndex]._id;
    setScores((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [round]: prev[teamId][round].map((s, i) =>
          i === index ? value : s
        ),
      },
    }));
  };

  const handleSubmit = () => {
    const teamId = teams[currentTeamIndex]._id;
    const teamScores = scores[teamId];
    console.log("Submitted scores for team:", teamId, teamScores);

    // Later you can POST to backend here
    // fetch(`/api/scores/${teamId}`, { method: "POST", body: JSON.stringify(teamScores) })
  };

  const handleNext = () => {
    if (currentTeamIndex < teams.length - 1) {
      setCurrentTeamIndex(currentTeamIndex + 1);
    } else {
      alert("All teams completed!");
    }
  };

  const handleSearch = () => {
    const foundIndex = teams.findIndex((t) =>
      t.teamName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (foundIndex !== -1) {
      setCurrentTeamIndex(foundIndex);
    } else {
      alert("Team not found!");
    }
  };

  if (teams.length === 0) return <p className="text-center text-lg">Loading teams...</p>;

  const team = teams[currentTeamIndex];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-xl p-8">
        
        {/* 🔍 Search bar */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Search team by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Go
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center mb-6">{team.teamName}</h1>

        {/* Team Lead */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Team Lead</h2>
          <p className="ml-4 font-medium">
            {team.lead?.name} <span className="text-gray-400">({team.lead?.email})</span>
          </p>
        </div>

        {/* Members */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Members</h2>
          <ul className="list-disc list-inside ml-6">
            {team.members?.map((m, idx) => (
              <li key={idx} className="mb-1">
                <span className="font-medium">{m.name}</span>{" "}
                <span className="text-gray-400">({m.email})</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Round 1 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Round 1</h2>
          <div className="grid grid-cols-1 gap-3">
            {scores[team._id]?.round1.map((val, idx) => (
              <div key={idx}>
                <label className="block text-gray-300 mb-1">Category {idx + 1}</label>
                <input
                  type="number"
                  placeholder={`Category ${idx + 1}`}
                  value={val}
                  onChange={(e) =>
                    handleScoreChange("round1", idx, e.target.value)
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>


        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleSubmit}
            className="bg-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
          >
            Submit
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Next Team →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Score;
