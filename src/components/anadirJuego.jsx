import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function AnadirJuego() {
  const navigate = useNavigate();
  const cedEncargado = localStorage.getItem("cedEncargado");

  const [formData, setFormData] = useState({
    codJuego: "",
    nomJuego: "",
    tematica: "",
    duracion: "",
    cntJugadores: "",
    competencias: "",
    idioma: "",
    descripcion: "",
    rangoEdad: "",
    dificultad: "",
    numCopias: 3
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #555",
    background: "#111827",
    color: "white",
    outline: "none",
    fontSize: "15px",
    transition: "0.2s",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#E5E7EB",
  };

  const containerStyle = {
    marginBottom: "18px",
  };

  const inputFocused = (e) => {
    e.target.style.border = "1px solid #3B82F6";
    e.target.style.boxShadow = "0 0 6px #3B82F644";
  };

  const inputBlur = (e) => {
    e.target.style.border = "1px solid #555";
    e.target.style.boxShadow = "none";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "codJuego" && !/^[A-Za-z0-9]*$/.test(value)) return;
    if (name === "rangoEdad" && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.numCopias < 3) {
      setMessage({ text: "El número de copias debe ser mínimo 3", type: "error" });
      return;
    }

    if (!/^\d+$/.test(formData.rangoEdad)) {
      setMessage({ text: "El rango de edad debe ser un número entero (ej: 8)", type: "error" });
      return;
    }

    if (!/^\w+$/.test(formData.codJuego)) {
      setMessage({
        text: "El código de juego solo debe contener letras y números.",
        type: "error"
      });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const dataToSend = {
        ...formData,
        cedEncargado: cedEncargado,
        codJuego: parseInt(formData.codJuego.replace(/\D/g, "")),
        duracion: parseInt(formData.duracion),
        cntJugadores: parseInt(formData.cntJugadores),
        numCopias: parseInt(formData.numCopias),
        rangoEdad: parseInt(formData.rangoEdad),
        dificultad:
          formData.dificultad === "Fácil"
            ? 1
            : formData.dificultad === "Medio"
            ? 2
            : 3,
      };

      const response = await fetch("http://localhost:4000/api/juegos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        setMessage({ text: "Juego añadido exitosamente", type: "success" });
        setTimeout(() => navigate("/DashboardEncargado"), 2000);
      } else {
        const error = await response.json();
        setMessage({
          text: error.message || "Error al añadir el juego",
          type: "error"
        });
      }
    } catch (error) {
      setMessage({ text: "Error de conexión. Intente nuevamente.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background">

      <button
        onClick={() => navigate("/dashboard-encargado")}
        style={{
          position: "absolute",
          top: "25px",
          left: "25px",
          background: "none",
          border: "none",
          cursor: "pointer",
          zIndex: 9999
        }}
      >
        <IoArrowBack size={28} color="white" />
      </button>

      <div className="login-card" style={{
        maxWidth: "600px",
        maxHeight: "90vh",
        overflowY: "auto",
        padding: "25px",
        borderRadius: "12px",
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(4px)"
      }}>
        
        <h2 className="title" style={{ color: "white", textAlign: "center" }}>
          Añadir Nuevo Juego
        </h2>

        {message.text && (
          <div
            className={`message ${message.type}`}
            style={{
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "6px",
              backgroundColor: message.type === "success" ? "#064E3B" : "#7F1D1D",
              color: "white",
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div style={containerStyle}>
            <label style={labelStyle}>Código del Juego *</label>
            <input
              type="text"
              name="codJuego"
              placeholder="Ej: 123"
              value={formData.codJuego}
              onChange={handleChange}
              onFocus={inputFocused}
              onBlur={inputBlur}
              style={inputStyle}
            />
          </div>

          <div style={containerStyle}>
            <label style={labelStyle}>Nombre del Juego *</label>
            <input
              type="text"
              name="nomJuego"
              placeholder="Ej: Catan"
              value={formData.nomJuego}
              onChange={handleChange}
              onFocus={inputFocused}
              onBlur={inputBlur}
              style={inputStyle}
            />
          </div>

          <div style={containerStyle}>
            <label style={labelStyle}>Temática *</label>
            <input
              type="text"
              name="tematica"
              placeholder="Ej: Estrategia"
              value={formData.tematica}
              onChange={handleChange}
              onFocus={inputFocused}
              onBlur={inputBlur}
              style={inputStyle}
            />
          </div>

          <div style={containerStyle}>
            <label style={labelStyle}>Duración (minutos) *</label>
            <input
              type="number"
              name="duracion"
              placeholder="Ej: 45"
              value={formData.duracion}
              onChange={handleChange}
              onFocus={inputFocused}
              onBlur={inputBlur}
              style={inputStyle}
            />
          </div>

          <div style={containerStyle}>
            <label style={labelStyle}>Cantidad Máxima de Jugadores *</label>
            <input
              type="number"
              name="cntJugadores"
              placeholder="Ej: 4"
              value={formData.cntJugadores}
              onChange={handleChange}
              onFocus={inputFocused}
              onBlur={inputBlur}
              style={inputStyle}
            />
          </div>

          <div style={containerStyle}>
            <label style={labelStyle}>Competencias/Habilidades *</label>
            <input
              type="text"
              name="competencias"
              placeholder="Ej: Lógica, Memoria"
              value={formData.competencias}
              onChange={handleChange}
              onFocus={inputFocused}
              onBlur={inputBlur}
              style={inputStyle}
            />
          </div>

          <div style={containerStyle}>
            <label style={labelStyle}>Idioma *</label>
            <input
              type="text"
              name="idioma"
              placeholder="Ej: Español"
              value={formData.idioma}
              onChange={handleChange}
              onFocus={inputFocused}
              onBlur={inputBlur}
              style={inputStyle}
            />
          </div>

          <div style={containerStyle}>
            <label style={labelStyle}>Descripción *</label>
            <textarea
              name="descripcion"
              placeholder="Describe el juego..."
              value={formData.descripcion}
              onChange={handleChange}
              onFocus={inputFocused}
              onBlur={inputBlur}
              rows="3"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div style={containerStyle}>
            <label style={labelStyle}>Rango de Edad *</label>
            <input
              type="text"
              name="rangoEdad"
              placeholder="Ej: 8"
              value={formData.rangoEdad}
              onChange={handleChange}
              onFocus={inputFocused}
              onBlur={inputBlur}
              style={inputStyle}
            />
          </div>

          <div style={containerStyle}>
            <label style={labelStyle}>Dificultad *</label>
            <select
              name="dificultad"
              value={formData.dificultad}
              onChange={handleChange}
              onFocus={inputFocused}
              onBlur={inputBlur}
              style={{ ...inputStyle, background: "#111827" }}
            >
              <option value="">Seleccione...</option>
              <option value="Fácil">Fácil</option>
              <option value="Medio">Medio</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>

          <div style={containerStyle}>
            <label style={labelStyle}>Número de Copias (mínimo 3) *</label>
            <input
              type="number"
              name="numCopias"
              placeholder="Ej: 3"
              value={formData.numCopias}
              onChange={handleChange}
              onFocus={inputFocused}
              onBlur={inputBlur}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            className="btn primary"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#2563EB",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
              transition: "0.2s",
              marginTop:"20px"
            }}
          >
            {loading ? "Añadiendo..." : "Publicar Juego"}
          </button>
        </form>
      </div>
    </div>
  );
}
