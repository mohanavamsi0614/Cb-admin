function Attd({team}) {
    const imgClass = "aspect-square w-[160px] h-[160px] object-cover rounded-2xl shadow-lg border-2 border-gray-300 transition-transform duration-300 hover:scale-105 hover:border-indigo-400 bg-gray-100";
    const cardClass = "border rounded-2xl p-4 bg-white shadow-md";
    const buttonClass = "p-3 px-6 font-semibold rounded-xl shadow transition-all duration-300 text-white hover:scale-105 hover:shadow-xl focus:outline-none";
    const attdLabels = ["First", "Second", "Third", "Fourth"];
    return (
        <div className="bg-gray-50 p-6 border-b-4 border-r-4 border-indigo-200 rounded-3xl shadow-xl">
            <details>
                <summary className="font-bold text-2xl text-indigo-700 cursor-pointer hover:text-purple-600 transition-colors duration-300">{team.teamName}</summary>
                <div className="p-4 flex flex-col gap-6">
                    <div className={cardClass}>
                        <b className="text-lg text-indigo-900 drop-shadow mb-2 block">{team.lead.name}</b>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center m-4">
                            {[team.lead.firstAttdImg, team.lead.secondAttdImg, team.lead.thirdAttdImg, team.lead.fourthAttdImg].map((img, idx) => (
                                <div key={attdLabels[idx]} className="flex flex-col items-center">
                                    <span className="text-xs text-gray-500 mb-1 font-medium">{attdLabels[idx]} Attendance</span>
                                    {img ? <img src={img} className={imgClass} alt={attdLabels[idx]} /> : <span className="text-gray-400">No Image</span>}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-2">
                            <button className={buttonClass + " bg-gradient-to-r from-green-500 to-green-700 hover:ring-2 hover:ring-green-300"}>Present</button>
                            <button className={buttonClass + " bg-gradient-to-r from-red-500 to-red-700 hover:ring-2 hover:ring-red-300"}>Absent</button>
                        </div>
                    </div>
                    {team.members.map((member, index) => (
                        <div key={index} className={cardClass + " mt-2"}>
                            <b className="text-lg text-purple-900 drop-shadow mb-2 block">{member.name}</b>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center m-4">
                                {[member.firstAttdImg, member.secondAttdImg, member.thirdAttdImg, member.fourthAttdImg].map((img, idx) => (
                                    <div key={attdLabels[idx]} className="flex flex-col items-center">
                                        <span className="text-xs text-gray-500 mb-1 font-medium">{attdLabels[idx]} Attendance</span>
                                        {img ? <img src={img} className={imgClass} alt={attdLabels[idx]} /> : <span className="text-gray-400">No Image</span>}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-4 mt-2">
                                <button className={buttonClass + " bg-gradient-to-r from-green-500 to-green-700 hover:ring-2 hover:ring-green-300"}>Present</button>
                                <button className={buttonClass + " bg-gradient-to-r from-red-500 to-red-700 hover:ring-2 hover:ring-red-300"}>Absent</button>
                            </div>
                        </div>
                    ))}
                </div>
            </details>
        </div>
    )
}
export default Attd;