import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function EvaluarExperiencia() {
  const navigate = useNavigate();

  const cedula = localStorage.getItem("cedula");
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
        rol,
        ranking,
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

    } catch {
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
          backgroundColor: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          padding: "35px",
          borderRadius: "16px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          position: "relative",
        }}
      >

        {/* Back Button Mejorado */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            top: "18px",
            left: "18px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.25)",
            padding: "6px 10px",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
        >
          <IoArrowBack size={20} />
        </button>

        <h2
          className="title"
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "26px",
            fontWeight: "700",
            letterSpacing: "1px",
          }}
        >
          Evaluar Experiencias
        </h2>

        {message && (
          <div
            style={{
              padding: "12px",
              marginBottom: "18px",
              borderRadius: "8px",
              backgroundColor: "#d4edda",
              color: "#155724",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {message}
          </div>
        )}

        {loading ? (
          <p style={{ color: "white", textAlign: "center" }}>Cargando...</p>
        ) : experiencias.length === 0 ? (
          <p style={{ color: "#ccc", textAlign: "center", marginTop: "35px", fontSize: "16px" }}>
            No tienes experiencias pendientes por evaluar.
          </p>
        ) : (
          <div style={{ display: "grid", gap: "18px", marginBottom: "30px" }}>
            {experiencias.map((exp) => (
              <button
                key={exp.cod_Expe}
                onClick={() => setSelected(exp)}
                style={{
                  padding: "18px",
                  borderRadius: "12px",
                  backgroundColor:
                    selected?.cod_Expe === exp.cod_Expe
                      ? "rgba(255,255,255,0.28)"
                      : "rgba(255,255,255,0.12)",
                  border:
                    selected?.cod_Expe === exp.cod_Expe
                      ? "2px solid rgba(255,255,255,0.4)"
                      : "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "0.3s",
                  backdropFilter: "blur(6px)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    selected?.cod_Expe === exp.cod_Expe
                      ? "rgba(255,255,255,0.28)"
                      : "rgba(255,255,255,0.12)")
                }
              >
                <strong style={{ fontSize: "20px", fontWeight: "600" }}>
                  {exp.nomJuego}
                </strong>
                <br />
                <small style={{ opacity: 0.85, fontSize: "13px" }}>
                  {new Date(exp.fechaHora).toLocaleString()}
                </small>
              </button>
            ))}
          </div>
        )}

        {selected && (
          <div
            style={{
              padding: "22px",
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "white",
              animation: "fadeIn 0.3s ease-in-out",
            }}
          >
            <h3 style={{ marginBottom: "15px", fontSize: "20px", fontWeight: "600" }}>
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
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.35)",
                backgroundColor: "rgba(0,0,0,0.25)",
                color: "white",
                fontSize: "15px",
                marginBottom: "22px",
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
                padding: "14px",
                fontSize: "16px",
                fontWeight: "700",
                borderRadius: "8px",
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
