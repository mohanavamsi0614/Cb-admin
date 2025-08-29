import React, { useEffect, useState } from "react";
import { api } from "./api";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SecondRound() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const round2Categories = [
    "Implementation & Functionality",
    "Innovation & Creative",
    "User Experience & Design",
    "Impact & Practicality",
    "Presentation & Communication",
    "Completion & Effort",
  ];

  const round2Ranges = {
    "Implementation & Functionality": [0, 20],
    "Innovation & Creative": [0, 15],
    "User Experience & Design": [0, 15],
    "Impact & Practicality": [0, 15],
    "Presentation & Communication": [0, 10],
    "Completion & Effort": [0, 10],
  };

  // Fetch Teams
  useEffect(() => {
    fetch(`${api}/event/teams`)
      .then((res) => res.json())
      .then((data) => {
      setTeams(data);

      const initialScores = {};
      const initialErrors = {};


      data.forEach((team) => {
      const existingRound2 =
      team.SecondReview && Array.isArray(team.SecondReview)
      ? team.SecondReview
      : Array(round2Categories.length).fill(0);


      initialScores[team._id] = { round2: existingRound2 };
      initialErrors[team._id] = {};
      });


      setScores(initialScores);
      setErrors(initialErrors);
      })
      .catch((err) => console.error("Error fetching teams:", err));
    }, []);

  // Handle score input
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
        [round]: prev[teamId][round].map((s, i) => (i === index ? value : s)),
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

  // Calculate total for a team
  const calculateTotal = (teamId) => {
    const roundScores = scores[teamId]?.round2 || [];
    return roundScores.reduce((sum, val) => sum + (Number(val) || 0), 0);
  };

  // Submit scores
  const handleSubmit = async () => {
    const teamId = teams[currentTeamIndex]._id;

    const hasErrors = Object.values(errors[teamId] || {}).some((msg) => msg);
    if (hasErrors) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    const teamScores = scores[teamId]?.round2 || [];
    const total = calculateTotal(teamId);

    try {
      const res = await fetch(`${api}/event/team/score/${teamId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          SecondReview: teamScores,
          SecondScore: total,
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

  // Navigation
  const handleBack = () => {
    if (currentTeamIndex > 0) {
      setCurrentTeamIndex(currentTeamIndex - 1);
    } else {
      alert("You're at the first team!");
    }
  };

  const handleNext = () => {
    if (currentTeamIndex < teams.length - 1) {
      setCurrentTeamIndex(currentTeamIndex + 1);
    } else {
      alert("All teams completed!");
    }
  };

  // Loading UI
  if (teams.length === 0)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p className="text-lg animate-pulse">Loading teams...</p>
      </div>
    );

  const team = teams[currentTeamIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-gray-800/90 rounded-2xl shadow-2xl p-8 backdrop-blur">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-300 hover:text-white mb-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Home
        </button>

        {/* Search bar */}
        <div className="relative w-full mb-6">
          <input
            type="text"
            placeholder="Search team by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
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

        {/* Team Info */}
        <h1 className="text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          {team.teamName}
        </h1>
        <p className="text-center text-lg text-gray-300 mb-6">
          Lead:{" "}
          <span className="font-semibold text-white">{team.lead?.name}</span>
        </p>

        {/* Round 2 scoring */}
        <div className="space-y-5">
          {scores[team._id]?.round2.map((val, idx) => {
            const category = round2Categories[idx];
            const [min, max] = round2Ranges[category];
            const errorMsg = errors[team._id]?.[`round2-${idx}`];

            return (
              <div key={idx}>
                <label className="block text-gray-300 mb-1 font-medium">
                  {category}{" "}
                  <span className="text-gray-400">
                    (Range: {min}-{max})
                  </span>
                </label>
                <input
                  type="number"
                  value={val}
                  onChange={(e) =>
                    handleScoreChange(
                      "round2",
                      idx,
                      e.target.value,
                      category,
                      round2Ranges
                    )
                  }
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-2 ${
                    errorMsg ? "ring-red-500" : "focus:ring-purple-500"
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
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg font-semibold transition transform hover:scale-105"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default SecondRound;
