import React, { useState } from "react";

export default function UserSelect() {
  const [userType, setUserType] = useState("profesor");

  const handleChange = (e) => {
    const selectedType = e.target.value;
    setUserType(selectedType);
    localStorage.setItem("userType", selectedType);
  };

  return (
    <select className="input-select" value={userType} onChange={handleChange}>
      <option value="profesor">Profesor</option>
      <option value="estudiante">Estudiante</option>
      <option value="encargado">Encargado</option>
    </select>
  );
}
