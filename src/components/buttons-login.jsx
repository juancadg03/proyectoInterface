import React from "react";
import { useNavigate } from "react-router-dom";

export default function ActionButtons() {
  const navigate = useNavigate();

  const handleRegister = () => {
    const select = document.querySelector(".input-select");
    const userType = select ? select.value : "profesor";
    navigate(`/register?type=${userType}`);
  };

  return (
    <div>
      <button className="btn primary">Ingresar</button><br /><br />
      <button className="btn secondary" onClick={handleRegister}>
        Registrarse
      </button>
    </div>
  );
}
