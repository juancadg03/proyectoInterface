import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function InscribirseExperiencia() {
  const navigate = useNavigate();

  const cedula = localStorage.getItem("cedula");
  const rol = localStorage.getItem("rol");

  const [experiencias, setExperiencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchExperiencias = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/experiencias/disponibles");
        const data = await res.json();
        setExperiencias(data);
      } catch (err) {
        setMessage("Error cargando experiencias.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiencias();
  }, []);

  const inscribirse = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/estudiante/inscribirse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cod_Expe: selected.cod_Expe,
          cedula: cedula,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Inscripción exitosa.");
        setExperiencias(experiencias.filter(e => e.cod_Expe !== selected.cod_Expe));
        setSelected(null);
        setTimeout(() => setMessage(""), 2000);
      } else {
        setMessage(data.error);
      }
    } catch (e) {
      setMessage("Error al inscribirse.");
    }
  };

  return (
    <div className="background">
      <div
        className="login-card"
        style={{
          maxWidth: "700px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.15)",
          padding: "25px",
          borderRadius: "12px",
          backdropFilter: "blur(8px)",
        }}
      >
        <button
          className="back-button"
          onClick={() => navigate("/dashboard-estudiante")}
          style={{ color: "white" }}
        >
          <IoArrowBack size={22} />
        </button>

        <h2
          className="title"
          style={{ color: "white", textAlign: "center" }}
        >
          Inscribirse a una Experiencia
        </h2>

        {message && (
          <div
            style={{
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "6px",
              backgroundColor: "#d4edda",
              color: "#155724",
            }}
          >
            {message}
          </div>
        )}

        {loading ? (
          <p style={{ color: "white" }}>Cargando...</p>
        ) : experiencias.length === 0 ? (
          <p style={{ color: "#bbb", textAlign: "center" }}>
            No hay experiencias disponibles.
          </p>
        ) : (
          experiencias.map((exp) => (
            <button
              key={exp.cod_Expe}
              onClick={() => setSelected(exp)}
              style={{
                display: "block",
                width: "100%",
                padding: "15px",
                marginBottom: "10px",
                backgroundColor:
                  selected?.cod_Expe === exp.cod_Expe
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(255,255,255,0.12)",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.3)",
                textAlign: "left",
                color: "white",
              }}
            >
              <strong>{exp.nomJuego}</strong>
              <br />
              <small>{new Date(exp.fechaHora).toLocaleString()}</small>
            </button>
          ))
        )}

        {selected && (
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "white",
            }}
          >
            <h3>{selected.nomJuego}</h3>
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(selected.fechaHora).toLocaleString()}
            </p>

            <button
              onClick={inscribirse}
              className="btn primary"
              style={{ width: "100%", padding: "12px", marginTop: "10px" }}
            >
              Inscribirme
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
