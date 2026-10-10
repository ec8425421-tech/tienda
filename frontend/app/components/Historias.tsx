"use client";

import { useEffect, useState } from "react";

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
const [historias, setHistorias] = useState<Historia[]>([]);
const [indice, setIndice] = useState(0);
const [cargando, setCargando] = useState(false);
const [error, setError] = useState(false);

// CARGAR HISTORIAS DESDE EL BACKEND
useEffect(() => {
if (!abierto) return;

let cancelado = false;

async function cargarHistorias() {
  setCargando(true);
  setError(false);

  try {
    const respuesta = await fetch(
      "https://tienda-backend-rwm6.onrender.com/api/historias"
    );

    if (!respuesta.ok) {
      throw new Error("No se pudieron cargar las historias");
    }

    const datos: Historia[] = await respuesta.json();

    if (!cancelado) {
      setHistorias(datos);
      setIndice(0);
    }
  } catch (error) {
    console.error("Error cargando historias:", error);

    if (!cancelado) {
      setHistorias([]);
      setError(true);
    }
  } finally {
    if (!cancelado) {
      setCargando(false);
    }
  }
}

cargarHistorias();

return () => {
  cancelado = true;
};

}, [abierto]);

// CERRAR CON ESC Y NAVEGAR CON LAS FLECHAS
useEffect(() => {
if (!abierto) return;

function manejarTeclado(event: KeyboardEvent) {
  if (event.key === "Escape") {
    onCerrar();
  }

  if (event.key === "ArrowRight") {
    setIndice((actual) =>
      Math.min(actual + 1, historias.length - 1)
    );
  }

  if (event.key === "ArrowLeft") {
    setIndice((actual) =>
      Math.max(0, actual - 1)
    );
  }
}

document.addEventListener("keydown", manejarTeclado);

return () => {
  document.removeEventListener("keydown", manejarTeclado);
};

}, [abierto, historias.length, onCerrar]);

// BLOQUEAR EL SCROLL MIENTRAS SE MUESTRA EL VISOR
useEffect(() => {
if (!abierto) return;

const scrollOriginal = document.body.style.overflow;
document.body.style.overflow = "hidden";

return () => {
  document.body.style.overflow = scrollOriginal;
};

}, [abierto]);

// HISTORIA SIGUIENTE
function siguienteHistoria() {
if (indice < historias.length - 1) {
setIndice((actual) => actual + 1);
} else {
onCerrar();
}
}

// HISTORIA ANTERIOR
function historiaAnterior() {
setIndice((actual) => Math.max(0, actual - 1));
}

// NO MOSTRAR EL VISOR SI ESTÁ CERRADO
if (!abierto) {
return null;
}

const historiaActual = historias[indice];

return (
<div
className="historias-overlay"
onMouseDown={(event) => {
if (event.target === event.currentTarget) {
onCerrar();
}
}}
> <div
     className="historias-modal"
     role="dialog"
     aria-modal="true"
     aria-label="Historias de Riqueza Local"
   >
{/* BARRA DE PROGRESO */}
{historias.length > 0 && ( <div className="historias-progreso">
{historias.map((historia, posicion) => (
<span
key={historia.id}
className={
posicion <= indice
? "historia-progreso historia-progreso-activa"
: "historia-progreso"
}
/>
))} </div>
)}

    {/* CABECERA */}
    <div className="historias-header">
      <h2>Historias</h2>

      <button
        type="button"
        className="historias-cerrar"
        onClick={onCerrar}
        aria-label="Cerrar historias"
      >
        ✕
      </button>
    </div>

    {/* CONTENIDO */}
    <div className="historias-contenido-modal">
      {cargando && (
        <p className="historias-mensaje">
          Cargando historias...
        </p>
      )}

      {!cargando && error && (
        <p className="historias-mensaje">
          No se pudieron cargar las historias. Intenta nuevamente.
        </p>
      )}

      {!cargando && !error && historias.length === 0 && (
        <p className="historias-mensaje">
          No hay historias disponibles por el momento.
        </p>
      )}

      {!cargando && !error && historiaActual && (
        <div className="historia-individual">
          {/* BOTÓN ANTERIOR */}
          <button
            type="button"
            className="historia-navegacion historia-anterior"
            onClick={historiaAnterior}
            disabled={indice === 0}
            aria-label="Historia anterior"
          >
            ‹
          </button>

          {/* HISTORIA ACTUAL */}
          <article className="historia-card historia-card-individual">
            {historiaActual.imagen && (
              <img
                src={historiaActual.imagen}
                alt={historiaActual.titulo}
              />
            )}

            <div className="historia-contenido">
              <h3>{historiaActual.titulo}</h3>
              <p>{historiaActual.descripcion}</p>
            </div>
          </article>

          {/* BOTÓN SIGUIENTE */}
          <button
            type="button"
            className="historia-navegacion historia-siguiente"
            onClick={siguienteHistoria}
            aria-label="Siguiente historia"
          >
            ›
          </button>
        </div>
      )}
    </div>
  </div>
</div>

);
}
