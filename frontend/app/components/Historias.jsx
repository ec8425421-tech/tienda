"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Historia = {
  id: number;
  titulo: string;
  descripcion: string;
  imagen?: string;
};

type HistoriasProps = {
  abierto: boolean;
  onCerrar: () => void;
};

export default function Historias({
  abierto,
  onCerrar,
}: HistoriasProps) {
  const t = useTranslations("Historias");

  const [historias, setHistorias] = useState<Historia[]>([]);
  const [cargando, setCargando] = useState(false);

  // ========================================
  // CARGAR HISTORIAS
  // ========================================

  useEffect(() => {
    if (!abierto) {
      return;
    }

    async function cargarHistorias() {
      setCargando(true);

      try {
        const respuesta = await fetch(
          "http://localhost:4000/api/historias"
        );

        if (!respuesta.ok) {
          throw new Error("Error obteniendo historias");
        }

        const datos = await respuesta.json();

        setHistorias(datos);
      } catch (error) {
        console.error(
          "Error cargando historias:",
          error
        );

        setHistorias([]);
      } finally {
        setCargando(false);
      }
    }

    cargarHistorias();
  }, [abierto]);

  // ========================================
  // CERRAR CON ESC
  // ========================================

  useEffect(() => {
    if (!abierto) {
      return;
    }

    function manejarEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCerrar();
      }
    }

    document.addEventListener(
      "keydown",
      manejarEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        manejarEscape
      );
    };
  }, [abierto, onCerrar]);

  // ========================================
  // NO MOSTRAR NADA SI ESTÁ CERRADO
  // ========================================

  if (!abierto) {
    return null;
  }

  return (
    <div
      className="historias-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCerrar();
        }
      }}
    >
      <div
        className="historias-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
      >
        {/* ==================================
            CABECERA
        ================================== */}

        <div className="historias-header">
          <h2>{t("title")}</h2>

          <button
            type="button"
            className="historias-cerrar"
            onClick={onCerrar}
            aria-label={t("close")}
          >
            ✕
          </button>
        </div>

        {/* ==================================
            CONTENIDO
        ================================== */}

        <div className="historias-contenido-modal">
          {cargando && (
            <p className="historias-mensaje">
              {t("loading")}
            </p>
          )}

          {!cargando && historias.length === 0 && (
            <p className="historias-mensaje">
              {t("empty")}
            </p>
          )}

          {!cargando && historias.length > 0 && (
            <div className="historias-grid">
              {historias.map((historia) => (
                <article
                  className="historia-card"
                  key={historia.id}
                >
                  {historia.imagen && (
                    <img
                      src={historia.imagen}
                      alt={historia.titulo}
                    />
                  )}

                  <div className="historia-contenido">
                    <h3>{historia.titulo}</h3>

                    <p>
                      {historia.descripcion}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}