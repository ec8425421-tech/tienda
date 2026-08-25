"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function Cultivos() {
  const params = useParams();
  const locale =
    params.locale === "en" ? "en" : "es";

  const textos =
    locale === "en"
      ? {
          titulo: "Crops",
          altImagen: "Crops",
          subtitulo: "Products for crops",
          texto1:
            "Find products intended for growing and caring for different plants and vegetables.",
          texto2:
            "Here you can find options to start, maintain, and improve your crops.",
          catalogo: "View catalog",
          inicio: "Back to home",
        }
      : {
          titulo: "Cultivos",
          altImagen: "Cultivos",
          subtitulo: "Productos para cultivos",
          texto1:
            "Encuentra productos destinados al cultivo y cuidado de diferentes plantas y hortalizas.",
          texto2:
            "Aquí podrás encontrar opciones para iniciar, mantener y mejorar tus cultivos.",
          catalogo: "Ver catálogo",
          inicio: "Volver al inicio",
        };

  return (
    <main>
      <section className="apartado-page">
        <h1>{textos.titulo}</h1>

        <div className="apartado-imagen">
          <img
            src="/images/cultivos.jpg"
            alt={textos.altImagen}
          />
        </div>

        <div className="apartado-contenido">
          <h2>{textos.subtitulo}</h2>

          <p>{textos.texto1}</p>

          <p>{textos.texto2}</p>
        </div>

        <div className="apartado-botones">
          <Link href={`/${locale}/catalogo`}>
            {textos.catalogo}
          </Link>

          <Link href={`/${locale}`}>
            {textos.inicio}
          </Link>
        </div>
      </section>
    </main>
  );
}