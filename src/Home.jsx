import React, { use, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function Home() {
  const webcamRef = useRef(null);
  const [img,setimg]=useState()
  const [team,setteam]=useState({})
  const [loading,setLoading]=useState(true)
  const [now,setnow]=useState()
  const [open,setOpen]=useState(false)
  useEffect(()=>{
    setLoading(true)
    axios.get("https://cb-kare-server-kk42.onrender.com/event/teams").then((res)=>{
      setteam(res.data)
      setLoading(false)
    })
  },[])
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
  if(loading){
    return (<h1>loading</h1>)
  }

  return (
    <div>
      {img && <img src={img} alt="Captured" />}
      <div>
        {team.lead.name}
        <button onClick={()=>{
            setnow({...team.lead,id:team._id})
            setOpen(true)}}>OPEN</button>
      </div>
      <div>
        {team.members.map((member, index) => (
          <div key={index}>
            {member.name}
        <button onClick={()=>{
            setnow({...member,id:team._id})
            setOpen(true)}}>OPEN</button>
          </div>
        ))}
      </div>
      {/* <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" /> */}
      <button onClick={capture}>Capture & Upload</button>
      <Model mem={now} open={open} />
    </div>
  );
}

export default Home;

function Model({mem,open}){
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
        axios.post("http://localhost:3001/genisis/attd/"+mem.id+"/"+mem.name, {
          img: res.data.secure_url
        });
        alert("Uploaded: " + res.data.secure_url);
      };
      if(!open) return null;
    return(
        <div>
        <h1>Name:{mem.name}</h1>
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        <button onClick={capture}>Capture & Upload</button>
        </div>
    )
}