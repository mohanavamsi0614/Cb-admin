import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../api";

const socket = io(api);

function Attd({ team }) {
  const imgClass =
    "aspect-square w-full h-auto object-cover rounded-2xl shadow-lg border-2 border-slate-600 bg-slate-700";
  const cardClass =
    "border rounded-xl p-4 bg-slate-900/60 border-slate-700 shadow-md";
  const buttonClass =
    "p-3 px-6 font-semibold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
  const attdLabels = ["First", "Second", "Third", "Fourth"];
    const [attendances, setAttendances] = useState(["firstAttd", "secondAttd", "thirdAttd", "fourthAttd"]);

  const [attendance, setAttendance] = useState({
    id: team._id,
    name: team.teamName,
    lead: null,
    members: team.members.map(() => null), 
  });
  const [currAttd, setCurrAttd] = useState(0);

  const handleAttendance = (isLead, index, status) => {
    // status should be boolean: true for present, false for absent
    setAttendance((prev) => {
      let updated;
      if (isLead) {
        updated = { ...prev, lead: status };
        console.log(
          `Lead: ${team.lead.name} -> ${status ? "Present ✅" : "Absent ❌"}`
        );
      } else {
        const membersCopy = [...prev.members];
        membersCopy[index] = status;
        updated = { ...prev, members: membersCopy };
        console.log(
          `${team.members[index].name} -> ${status ? "Present ✅" : "Absent ❌"}`
        );
      }
      return updated;
    });
  };

  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = () => {
    socket.emit("admin", attendance);
    console.log(attendance);
    setSubmitted(true);
  };

  useEffect(() => {
    socket.emit("getCurrAttd")
    socket.on("currAttd", (num) => {
      setCurrAttd(num);
    });

  },[])


 
  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl shadow-lg transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-800">
      <details>
        <summary className="font-bold text-2xl text-cyan-300 cursor-pointer hover:text-cyan-200 transition-colors duration-300">
          {team.teamName}
        </summary>
        <div className="p-4 flex flex-col gap-6">
          {/* Lead Card */}
          <div className={cardClass}>
            <b className="text-lg text-white drop-shadow mb-2 block">
              {team.lead.name}
            </b>

            <div className="grid grid-cols-4 gap-4 items-start m-4">
              {[team.lead.firstAttdImg, team.lead.secondAttdImg, team.lead.thirdAttdImg, team.lead.fourthAttdImg].map(
                (img, idx) => (
                  <div
                    key={attdLabels[idx]}
                    className="flex flex-col items-center"
                  >
                    <span className="text-xs text-gray-400 mb-1 font-medium">
                      {attdLabels[idx]} Attendance
                    </span>
                    {img ? (
                      <img
                        src={img}
                        className={imgClass}
                        alt={attdLabels[idx]}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full aspect-square bg-slate-700 rounded-2xl">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Lead Buttons */}
            {team.lead[attendances[currAttd-1]+"Status"] ? <div>{team.lead[attendances[currAttd-1]+"Status"] =="present" ? "Present ✅" : "Absent ❌"}</div> :
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => handleAttendance(true, null, true)}
                className={
                  buttonClass +
                  ` ${
                    attendance.lead === true
                      ? "bg-green-700"
                      : "bg-green-600 hover:bg-green-500"
                  } text-white focus:ring-green-500`
                }
              >
                Present
              </button>
              <button
                onClick={() => handleAttendance(true, null, false)}
                className={
                  buttonClass +
                  ` ${
                    attendance.lead === false
                      ? "bg-red-700"
                      : "bg-red-600 hover:bg-red-500"
                  } text-white focus:ring-red-500`
                }
              >
                Absent
              </button>
            </div>
            }
            {/* ✅ Lead Status */}
            {attendance.lead !== null && (
              <p className="mt-2 text-sm font-medium text-gray-300">
                Marked:{" "}
                <span
                  className={
                    attendance.lead ? "text-green-400" : "text-red-400"
                  }
                >
                  {attendance.lead ? "Present" : "Absent"}
                </span>
              </p>
            )}
          </div>

          {/* Members */}
          {team.members.map((member, index) => (
            <div key={index} className={cardClass + " mt-2"}>
              <b className="text-lg text-gray-300 drop-shadow mb-2 block">
                {member.name}
              </b>

              <div className="grid grid-cols-4 gap-4 items-start m-4">
                {[member.firstAttdImg, member.secondAttdImg, member.thirdAttdImg, member.fourthAttdImg].map(
                  (img, idx) => (
                    <div
                      key={attdLabels[idx]}
                      className="flex flex-col items-center"
                    >
                      <span className="text-xs text-gray-400 mb-1 font-medium">
                        {attdLabels[idx]} Attendance
                      </span>
                      {img ? (
                        <img
                          src={img}
                          className={imgClass}
                          alt={attdLabels[idx]}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full aspect-square bg-slate-700 rounded-2xl">
                          <span className="text-gray-500 text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Member Buttons */}
              {team.members[index][attendances[currAttd-1]+"Status"] ? <div>{team.members[index][attendances[currAttd-1]+"Status"] == "present" ? "Present ✅" : "Absent ❌"}</div> :
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => handleAttendance(false, index, true)}
                  className={
                    buttonClass +
                    ` ${
                      attendance.members[index] === true
                        ? "bg-green-700"
                        : "bg-green-600 hover:bg-green-500"
                    } text-white focus:ring-green-500`
                  }
                >
                  Present
                </button>
                <button
                  onClick={() => handleAttendance(false, index, false)}
                  className={
                    buttonClass +
                    ` ${
                      attendance.members[index] === false
                        ? "bg-red-700"
                        : "bg-red-600 hover:bg-red-500"
                    } text-white focus:ring-red-500`
                  }
                >
                  Absent
                </button>
              </div>
              }

              {/* ✅ Member Status */}
              {attendance.members[index] !== null && (
                <p className="mt-2 text-sm font-medium text-gray-300">
                  Marked:{" "}
                  <span
                    className={
                      attendance.members[index]
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {attendance.members[index] ? "Present" : "Absent"}
                  </span>
                </p>
              )}
            </div>
          ))}

          {/* Submit Full Team */}
          <div className="mt-6 flex flex-col items-center">
            {((attendance.lead === null) || attendance.members.some(a => a === null)) && !submitted && (
              <p className="mb-2 text-red-400 text-sm font-semibold text-center">Please mark attendance for all before submitting.</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={((attendance.lead === null) || attendance.members.some(a => a === null) || submitted)}
              className={
                buttonClass +
                " w-full max-w-xs bg-cyan-700 hover:bg-cyan-600 text-white focus:ring-cyan-500 mt-2" +
                (submitted ? " opacity-60 cursor-not-allowed" : "")
              }
            >
              {submitted ? "Submitted ✅" : "Submit Full Team"}
            </button>
          </div>
        </div>
      </details>
    </div>
  );
}

export default Attd;
