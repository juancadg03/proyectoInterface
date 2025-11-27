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
    <div className="background" style={{ minHeight: "100vh", paddingTop: "40px" }}>

      {/* 🔙 Back Button FIXED + ESTÉTICO */}
      <button
        onClick={() => navigate("/dashboard-estudiante")}
        style={{
          position: "fixed",
          top: "25px",
          left: "25px",
          zIndex: 1000,
          background: "rgba(255,255,255,0.18)",
          border: "1px solid rgba(255,255,255,0.28)",
          padding: "10px 14px",
          borderRadius: "12px",
          color: "white",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          transition: ".3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.28)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
      >
        <IoArrowBack size={22} />
      </button>

      {/* 📌 CONTENEDOR PRINCIPAL ALARGADO */}
      <div
        className="login-card"
        style={{
          width: "85%",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "40px",
          borderRadius: "18px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >

        <h2
          className="title"
          style={{
            color: "white",
            textAlign: "center",
            fontSize: "30px",
            marginBottom: "25px",
          }}
        >
          Inscribirse a una Experiencia
        </h2>

        {/* Mensajes */}
        {message && (
          <div
            style={{
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "10px",
              backgroundColor: "#d4edda",
              color: "#155724",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        {/* LAYOUT DOS COLUMNAS: lista + detalles */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "35px" }}>

          {/* LISTA DE EXPERIENCIAS ESTÉTICA */}
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: "14px",
              padding: "20px",
              border: "1px solid rgba(255,255,255,0.25)",
              maxHeight: "65vh",
              overflowY: "auto",
            }}
          >
            <h3 style={{ color: "white", marginBottom: "20px" }}>Experiencias Disponibles</h3>

            {loading ? (
              <p style={{ color: "white" }}>Cargando...</p>
            ) : experiencias.length === 0 ? (
              <p style={{ color: "#ccc" }}>No hay experiencias disponibles.</p>
            ) : (
              experiencias.map((exp) => (
                <button
                  key={exp.cod_Expe}
                  onClick={() => setSelected(exp)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "18px",
                    marginBottom: "12px",
                    backgroundColor:
                      selected?.cod_Expe === exp.cod_Expe
                        ? "rgba(255,255,255,0.26)"
                        : "rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    border:
                      selected?.cod_Expe === exp.cod_Expe
                        ? "2px solid rgba(255,255,255,0.45)"
                        : "1px solid rgba(255,255,255,0.3)",
                    textAlign: "left",
                    color: "white",
                    transition: "0.25s",
                    cursor: "pointer",
                  }}
                >
                  <strong style={{ fontSize: "18px" }}>{exp.nomJuego}</strong>
                  <br />
                  <small style={{ opacity: 0.8 }}>
                    {new Date(exp.fechaHora).toLocaleString()}
                  </small>
                </button>
              ))
            )}
          </div>

          {/* PANEL DE DETALLES BONITO */}
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: "14px",
              padding: "24px",
              border: "1px solid rgba(255,255,255,0.25)",
              minHeight: "65vh",
            }}
          >
            {!selected ? (
              <p style={{ color: "#ddd", marginTop: "60px", textAlign: "center" }}>
                Selecciona una experiencia para ver los detalles.
              </p>
            ) : (
              <>
                <h3
                  style={{
                    color: "white",
                    marginBottom: "15px",
                    fontSize: "22px",
                    fontWeight: "600",
                  }}
                >
                  {selected.nomJuego}
                </h3>

                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "25px",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                  }}
                >
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(selected.fechaHora).toLocaleString()}
                  </p>
                  <p>
                    <strong>Código experiencia:</strong> {selected.cod_Expe}
                  </p>
                </div>

                <button
                  onClick={inscribirse}
                  style={{
                    width: "100%",
                    padding: "15px",
                    borderRadius: "12px",
                    background: "white",
                    color: "#111",
                    fontSize: "18px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: ".25s",
                    border: "none",
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = 0.85)}
                  onMouseLeave={(e) => (e.target.style.opacity = 1)}
                >
                  Inscribirme
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
