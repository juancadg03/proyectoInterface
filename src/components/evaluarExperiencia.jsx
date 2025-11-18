import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function EvaluarExperiencia() {
  const navigate = useNavigate();

  const cedula = localStorage.getItem("cedula");
  const nombre = localStorage.getItem("nombre"); // AHORA SÍ EXISTE
  const rol = localStorage.getItem("rol");

  const [experiencias, setExperiencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);
  const [ranking, setRanking] = useState(1);

  useEffect(() => {
    const fetchExperiencias = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/experiencias/evaluables/${cedula}/${rol}`
        );

        const data = await res.json();
        setExperiencias(data);

      } catch (error) {
        setMessage("Error al cargar experiencias.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiencias();
  }, [cedula, rol]);

  const enviarEvaluacion = async () => {
    if (!selected) {
      setMessage("Selecciona una experiencia primero.");
      return;
    }

    try {
      const body = {
        cod_Expe: selected.cod_Expe,
        cedEvaluador: cedula,
        rol: rol,          // ⬅⬅ AHORA ENVIAMOS EL ROL
        ranking: ranking,
      };

      const res = await fetch("http://localhost:4000/api/evaluar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setMessage("Evaluación enviada con éxito.");
        setExperiencias(experiencias.filter(e => e.cod_Expe !== selected.cod_Expe));
        setSelected(null);
        setTimeout(() => setMessage(""), 2000);
      } else {
        setMessage(data.error || "Error al enviar evaluación.");
      }

    } catch (err) {
      console.error(err);
      setMessage("Error al enviar evaluación.");
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
          onClick={() => navigate(-1)}
          style={{ color: "white" }}
        >
          <IoArrowBack size={22} />
        </button>

        <h2 className="title" style={{ color: "white", textAlign: "center", marginBottom: "25px" }}>
          Evaluar Experiencias
        </h2>

        {message && (
          <div
            style={{
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "8px",
              backgroundColor: "#d4edda",
              color: "#155724",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        {loading ? (
          <p style={{ color: "white", textAlign: "center" }}>Cargando...</p>
        ) : experiencias.length === 0 ? (
          <p style={{ color: "#bbb", textAlign: "center", marginTop: "30px" }}>
            No tienes experiencias pendientes por evaluar.
          </p>
        ) : (
          <div style={{ display: "grid", gap: "15px", marginBottom: "25px" }}>
            {experiencias.map((exp) => (
              <button
                key={exp.cod_Expe}
                onClick={() => setSelected(exp)}
                style={{
                  padding: "15px",
                  borderRadius: "10px",
                  backgroundColor:
                    selected?.cod_Expe === exp.cod_Expe
                      ? "rgba(255,255,255,0.25)"
                      : "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <strong style={{ fontSize: "18px" }}>{exp.nomJuego}</strong>
                <br />
                <small style={{ opacity: 0.8 }}>
                  {new Date(exp.fechaHora).toLocaleString()}
                </small>
              </button>
            ))}
          </div>
        )}

        {selected && (
          <div
            style={{
              padding: "20px",
              borderRadius: "10px",
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
            }}
          >

            <h3 style={{ marginBottom: "15px" }}>
              Evaluar: {selected.nomJuego}
            </h3>

            <label style={{ marginBottom: "8px", display: "block" }}>
              Selecciona un ranking:
            </label>

            <select
              value={ranking}
              onChange={(e) => setRanking(parseInt(e.target.value))}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.3)",
                backgroundColor: "rgba(0,0,0,0.3)",
                color: "white",
                marginBottom: "20px",
              }}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n} style={{ color: "black" }}>
                  {n}
                </option>
              ))}
            </select>

            <button
              onClick={enviarEvaluacion}
              className="btn primary"
              style={{
                width: "100%",
                padding: "12px",
                fontWeight: "600",
                borderRadius: "6px",
              }}
            >
              Enviar Evaluación
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
