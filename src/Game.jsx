import axios from "axios";
import { api } from "./api";
import { useEffect, useState } from "react";
import Gamecard from "./comp/GameCard";

function Game() {
    const [teams, setTeams] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios.get(`${api}/event/teams`).then((response) => {
            setTeams(response.data);
        });
    }, []);

    // filter teams based on search
    const filteredTeams = teams.filter((team) =>
        team.teamName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-100 to-indigo-50 py-12 px-4 flex flex-col items-center">
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 text-center">
                Leaderboard Teams
            </h1>

            {/* Search Bar */}
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search teams..."
                className="w-full max-w-md px-4 py-3 mb-8 rounded-xl border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg shadow bg-white"
            />

            <div className="w-full flex gap-2 flex-wrap justify-center">
                {filteredTeams.map((team) => (
                    <Gamecard key={team._id} team={team} />
                ))}
            </div>
        </div>
    );
}

export default Game;
