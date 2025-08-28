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
    "Prototype/Early Developement Process",
  ];

  const round1Ranges = {
    "Problem Understanding & Clarity": [0, 10],
    "Feasibility & Relevance of Solution": [0, 10],
    "Technical Approach & Feasibility": [0, 15],
    "Prototype/Early Developement Process": [0, 15],
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

    // Update scores
    setScores((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [round]: prev[teamId][round].map((s, i) =>
          i === index ? value : s
        ),
      },
    }));

    // Update errors
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
      const res = await fetch(`http://localhost:3001/event/team/score/${teamId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FirstReview: teamScores,
          FirstScore: total,
        }),
      });

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
    return <p className="text-center text-lg">Loading teams...</p>;

  const team = teams[currentTeamIndex];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-xl p-8">
        {/* 🔍 Search bar with dropdown */}
        <div className="relative w-full mb-6">
          <input
            type="text"
            placeholder="Search team by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
          />

          {searchTerm && (
            <ul className="absolute z-10 w-full bg-gray-800 border border-gray-600 rounded mt-1 max-h-40 overflow-y-auto">
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
                    className="p-2 cursor-pointer hover:bg-gray-700"
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

        <h1 className="text-3xl font-bold text-center mb-6">{team.teamName}</h1>

        {/* Round 1 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Round 1</h2>
          <div className="grid grid-cols-1 gap-3">
            {scores[team._id]?.round1.map((val, idx) => {
              const category = round1Categories[idx];
              const [min, max] = round1Ranges[category];
              const errorMsg = errors[team._id]?.[`round1-${idx}`];

              return (
                <div key={idx} className="mb-3">
                  <label className="block text-gray-300 mb-1">
                    {category} (Range: {min}-{max})
                  </label>
                  <input
                    type="number"
                    placeholder={category}
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
                    className={`w-full p-2 rounded bg-gray-700 text-white focus:ring-2 ${
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

          <div className="mt-4 p-3 bg-gray-700 rounded-lg text-lg font-semibold text-center">
            Total Score: {calculateTotal(team._id)}
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

export default FirstRound;
