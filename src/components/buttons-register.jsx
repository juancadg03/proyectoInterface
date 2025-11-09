import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";


export default function ButtonsRegister() {
  const navigate = useNavigate();
  return (
    <div className="buttons">
      <button className="btn primary reg">Registrar</button><br /><br />
      <button className="back-button" onClick={() => navigate("/")}>
        <IoArrowBack size={22} />
      </button>
    </div>
  );
}
