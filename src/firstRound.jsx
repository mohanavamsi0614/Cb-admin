import React, { useEffect, useState } from "react";

function FirstRound() {
  const [teams, setTeams] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const round1Categories = [
    "Problem Understanding & Clarity",
    "Feasibility & Relevance of Solution",
    "Technical Approach & Feasibility",
    "Prototype/Early Development Process",
  ];

  const round1Ranges = {
    "Problem Understanding & Clarity": [0, 10],
    "Feasibility & Relevance of Solution": [0, 10],
    "Technical Approach & Feasibility": [0, 15],
    "Prototype/Early Development Process": [0, 15],
  };

  useEffect(() => {
    fetch("http://localhost:3001/event/teams")
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);

        const initialScores = {};
        const initialErrors = {};
        data.forEach((team) => {
          initialScores[team._id] = {
            round1: Array(round1Categories.length).fill(""),
          };
          initialErrors[team._id] = {};
        });
        setScores(initialScores);
        setErrors(initialErrors);
      })
      .catch((err) => console.error("Error fetching teams:", err));
  }, []);

  const handleScoreChange = (round, index, value, category, ranges) => {
    const [min, max] = ranges[category];
    let numericValue = Number(value);
    const teamId = teams[currentTeamIndex]._id;

    let errorMessage = "";
    if (value === "") {
      numericValue = "";
    } else if (isNaN(numericValue)) {
      errorMessage = "Invalid number";
    } else if (numericValue < min || numericValue > max) {
      errorMessage = `Value must be between ${min} and ${max}`;
    }

    setScores((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [round]: prev[teamId][round].map((s, i) =>
          i === index ? value : s
        ),
      },
    }));

    setErrors((prev) => ({
      ...prev,
      [teamId]: {
        ...(prev[teamId] || {}),
        [`${round}-${index}`]: errorMessage,
      },
    }));
  };

  const calculateTotal = (teamId) => {
    const roundScores = scores[teamId]?.round1 || [];
    return roundScores.reduce((sum, val) => sum + (Number(val) || 0), 0);
  };

  const handleSubmit = async () => {
    const teamId = teams[currentTeamIndex]._id;

    const hasErrors = Object.values(errors[teamId] || {}).some((msg) => msg);
    if (hasErrors) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    const teamScores = scores[teamId]?.round1 || [];
    const total = calculateTotal(teamId);

    try {
      const res = await fetch(
        `http://localhost:3001/event/team/score/${teamId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            FirstReview: teamScores,
            FirstScore: total,
          }),
        }
      );

      if (res.ok) {
        alert(`Marks submitted for ${teams[currentTeamIndex].teamName}!`);
      } else {
        const errText = await res.text();
        alert(`Error while submitting scores: ${errText}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit scores. Check console.");
    }
  };

  const handleNext = () => {
    if (currentTeamIndex < teams.length - 1) {
      setCurrentTeamIndex(currentTeamIndex + 1);
    } else {
      alert("All teams completed!");
    }
  };

  if (teams.length === 0)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p className="text-lg animate-pulse">Loading teams...</p>
      </div>
    );

  const team = teams[currentTeamIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-6 rounded-4xl shadow-6xl">
      <div className="w-full max-w-4xl bg-gray-800/90 rounded-2xl shadow-2xl p-8 backdrop-blur">
        {/* Search bar */}
        <div className="relative w-full mb-6">
          <input
            type="text"
            placeholder="Search team by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          {searchTerm && (
            <ul className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-lg mt-2 max-h-40 overflow-y-auto">
              {teams
                .filter((t) =>
                  t.teamName.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((t) => (
                  <li
                    key={t._id}
                    onClick={() => {
                      const actualIndex = teams.findIndex(
                        (team) => team._id === t._id
                      );
                      setCurrentTeamIndex(actualIndex);
                      setSearchTerm("");
                    }}
                    className="p-2 cursor-pointer hover:bg-gray-700 transition"
                  >
                    {t.teamName}
                  </li>
                  
                ))}

              {teams.filter((t) =>
                t.teamName.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <li className="p-2 text-gray-400">No team found</li>
              )}
            </ul>
          )}
        </div>

        {/* Team Name */}
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          {team.teamName}
        </h1>
        <p className="text-center text-lg text-gray-300 mb-6">
          Team Lead: <span className="font-semibold text-white">{team.lead?.name}</span>
        </p>

        {/* Round 1 scoring */}
        <div className="space-y-5">
          {scores[team._id]?.round1.map((val, idx) => {
            const category = round1Categories[idx];
            const [min, max] = round1Ranges[category];
            const errorMsg = errors[team._id]?.[`round1-${idx}`];

            return (
              <div key={idx}>
                <label className="block text-gray-300 mb-1 font-medium">
                  {category} <span className="text-gray-400">(Range: {min}-{max})</span>
                </label>
                <input
                  type="number"
                  value={val}
                  onChange={(e) =>
                    handleScoreChange(
                      "round1",
                      idx,
                      e.target.value,
                      category,
                      round1Ranges
                    )
                  }
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-2 ${
                    errorMsg ? "ring-red-500" : "focus:ring-blue-500"
                  }`}
                />
                {errorMsg && (
                  <p className="text-red-400 text-sm mt-1">{errorMsg}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="mt-6 p-4 bg-gray-700 rounded-xl text-lg font-semibold text-center shadow-md">
          Total Score: {calculateTotal(team._id)}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl shadow-lg font-semibold transition transform hover:scale-105"
          >
            Submit
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg font-semibold transition transform hover:scale-105"
          >
            Next Team →
          </button>
        </div>
      </div>
    </div>
  );
}

export default FirstRound;
