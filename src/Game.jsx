import axios from "axios";
import { api } from "./api";
import { useEffect, useState } from "react";
import Gamec from "./comp/Game";

function Game(){
    const [teams, setTeams] = useState([]);
    useEffect(()=>{
        axios.get(`${api}/event/teams`).then((response)=>{
            setTeams(response.data);
        });
    },[])

    return(
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-100 to-indigo-50 py-12 px-4 flex flex-col items-center">
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-10 text-center drop-shadow">Leaderboard Teams</h1>
            <div className="w-full  flex  gap-2 flex-wrap">
                {teams.map((team) => (
                    <Gamec key={team._id} team={team} />
                ))}
            </div>
        </div>
    );
}
export default Game;