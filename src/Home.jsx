import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { api } from "../api";

function Home() {
  const webcamRef = useRef(null);
  const [img, setimg] = useState();
  const [team, setteam] = useState({});
  const [loading, setLoading] = useState(true);
  const [now, setnow] = useState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${api}/genisis/testing`)
      .then((res) => {
        setteam(res.data);
        setLoading(false);
      });
  }, []);

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setimg(imageSrc);
    const formData = new FormData();
    formData.append("file", imageSrc);
    formData.append("upload_preset", "qbvu3y5j");

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/dfseckyjx/image/upload`,
      formData
    );
    console.log("Uploaded URL:", res.data.secure_url);
    alert("Uploaded: " + res.data.secure_url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {img && (
        <div className="mb-6">
          <img
            src={img}
            alt="Captured"
            className="rounded-xl shadow-lg border border-gray-700 w-64"
          />
        </div>
      )}

      {/* Lead */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 flex justify-between items-center">
        <span className="text-lg font-semibold">{team.lead.name}</span>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
          onClick={() => {
            setnow({ ...team.lead, id: team._id });
            setOpen(true);
          }}
        >
          Open
        </button>
      </div>

      {/* Members */}
      <div className="space-y-3">
        {team.members.map((member, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <span className="text-lg">{member.name}</span>
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
              onClick={() => {
                setnow({ ...member, id: team._id });
                setOpen(true);
              }}
            >
              Open
            </button>
          </div>
        ))}
      </div>

      
      <div className="mt-6">
        
        <button
          onClick={capture}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg text-white font-semibold"
        >
          Capture & Upload
        </button>
      </div>

      
      <Model mem={now} open={open} setOpen={setOpen} />
    </div>
  );
}

export default Home;

function Model({ mem, open, setOpen }) {
  const webcamRef = useRef(null);

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const formData = new FormData();
    formData.append("file", imageSrc);
    formData.append("upload_preset", "qbvu3y5j");

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/dfseckyjx/image/upload`,
      formData
    );
    console.log("Uploaded URL:", res.data.secure_url);

    await axios.post(
      `${api}/genisis/attd/` +
        mem.id +
        "/" +
        mem.name,
      {
        img: res.data.secure_url,
      }
    );

    alert("Uploaded: " + res.data.secure_url);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-[400px] text-center">
        <h1 className="text-xl font-bold mb-4 text-white">
          Name: {mem.name}
        </h1>
        <div className="rounded-xl overflow-hidden mb-4">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-xl"
          />
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={capture}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
          >
            Capture & Upload
          </button>
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
