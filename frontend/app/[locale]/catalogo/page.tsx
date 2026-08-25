"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function Catalogo() {
  const params = useParams();

  const locale =
    params.locale === "en" ? "en" : "es";

  const textos =
    locale === "en"
      ? {
          titulo: "Catalog",
          subtitulo:
            "Explore our products by category.",
          cultivos: {
            nombre: "Growing",
            descripcion:
              "Products for growing and caring for plants.",
          },
          fertilizantes: {
            nombre: "Fertilizers and seeds",
            descripcion:
              "Fertilizers, nutrients and seeds for your crops.",
          },
          temporada: {
            nombre: "Seasonal",
            descripcion:
              "Products available according to the season.",
          },
          verProductos: "View products",
        }
      : {
          titulo: "Catálogo",
          subtitulo:
            "Explora nuestros productos por categoría.",
          cultivos: {
            nombre: "Cultivos",
            descripcion:
              "Productos destinados al cultivo y cuidado de plantas.",
          },
          fertilizantes: {
            nombre: "Fertilizantes y semillas",
            descripcion:
              "Fertilizantes, abonos y semillas para tus cultivos.",
          },
          temporada: {
            nombre: "Temporada",
            descripcion:
              "Productos disponibles según la temporada.",
          },
          verProductos: "Ver productos",
        };

  const opciones = [
    {
      nombre: textos.cultivos.nombre,
      descripcion: textos.cultivos.descripcion,
      ruta: `/${locale}/catalogo/cultivos`,
    },
    {
      nombre: textos.fertilizantes.nombre,
      descripcion: textos.fertilizantes.descripcion,
      ruta: `/${locale}/catalogo/fertilizantes-semillas`,
    },
    {
      nombre: textos.temporada.nombre,
      descripcion: textos.temporada.descripcion,
      ruta: `/${locale}/catalogo/temporada`,
    },
  ];

  return (
    <main>
      <section className="catalogo-header">
        <h1>{textos.titulo}</h1>

        <p>{textos.subtitulo}</p>
      </section>

      <section className="catalogo-categorias">
        {opciones.map((opcion) => (
          <Link
            key={opcion.nombre}
            href={opcion.ruta}
            className="catalogo-categoria-card"
          >
            <div className="catalogo-categoria-imagen">
              {locale === "es" ? "Imagen" : "Image"}
            </div>

            <div className="catalogo-categoria-info">
              <h2>{opcion.nombre}</h2>

              <p>{opcion.descripcion}</p>

              <span>
                {textos.verProductos}
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}