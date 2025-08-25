import { useState } from "react";
import { io } from "socket.io-client";
import { api } from "../api";
const socket=io(api);
function Ps({team}){
    const [Ps, setPs] = useState("");
    const handlemarks=()=>{
        console.log("doihqoi")
        socket.emit("Ps", { teamname: team.teamName, Ps: Ps });
    }
    return(
        <div className="max-w-md mx-auto mt-12 p-8 bg-gradient-to-br from-blue-100 via-cyan-50 to-indigo-100 rounded-3xl shadow-2xl border border-blue-300">
            <h1 className="text-3xl font-bold text-indigo-700 mb-2 text-center">{team.teamName}</h1>
            <h2 className="text-xl font-semibold text-cyan-700 mb-6 text-center">Current Score: <span className="font-bold text-indigo-900">{team.HuntScore}</span></h2>
            <div className="flex flex-col gap-4 items-center">
                <input 
                    type="number" 
                    value={Ps || ""} 
                    onChange={(e) => setPs(Number(e.target.value))} 
                    placeholder="Enter Ps number" 
                    className="w-2/3 px-4 py-3 rounded-xl border-2 border-cyan-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg bg-white shadow"
                />
                <button 
                    onClick={handlemarks} 
                    className="w-2/3 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                    Submit
                </button>
            </div>
        </div>
    )
}
export default Ps;