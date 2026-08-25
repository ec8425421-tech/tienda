"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductCard from "../../../components/ProductCard";

type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string | null;
  categoria_id: number | null;
  categoria: string | null;
  activo: boolean;
};

export default function Temporada() {
  const params = useParams();

  const locale =
    params.locale === "en" ? "en" : "es";

  const [productos, setProductos] =
    useState<Product[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function cargarProductos() {
      try {
        const respuesta = await fetch(
          "http://localhost:4000/api/productos"
        );

        if (!respuesta.ok) {
          throw new Error(
            "No se pudieron obtener los productos."
          );
        }

        const datos =
          await respuesta.json();

        const productosTemporada =
          datos.filter(
            (producto: Product) =>
              producto.activo &&
              producto.categoria_id === 8
          );

        setProductos(
          productosTemporada
        );
      } catch (error) {
        console.error(error);

        setError(
          locale === "en"
            ? "The products could not be loaded."
            : "No se pudieron cargar los productos."
        );
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
  }, [locale]);

  const textos =
    locale === "en"
      ? {
          titulo: "Seasonal",
          descripcion:
            "Products available according to the season.",
          volver:
            "← Back to catalog",
          cultivos: "Crops",
          fertilizantes:
            "Fertilizers and seeds",
          cargando:
            "Loading products...",
          encontrados:
            "Products found:",
          vacio:
            "There are currently no products available in this section.",
        }
      : {
          titulo: "Temporada",
          descripcion:
            "Productos disponibles según la temporada.",
          volver:
            "← Volver al catálogo",
          cultivos: "Cultivos",
          fertilizantes:
            "Fertilizantes y semillas",
          cargando:
            "Cargando productos...",
          encontrados:
            "Productos encontrados:",
          vacio:
            "Actualmente no hay productos disponibles en esta sección.",
        };

  return (
    <main>
      <section className="catalogo-header">
        <h1>{textos.titulo}</h1>

        <p>{textos.descripcion}</p>
      </section>

      <nav className="catalogo-navegacion">
        <Link href={`/${locale}/catalogo`}>
          {textos.volver}
        </Link>

        <Link
          href={`/${locale}/catalogo/cultivos`}
        >
          {textos.cultivos}
        </Link>

        <Link
          href={`/${locale}/catalogo/fertilizantes-semillas`}
        >
          {textos.fertilizantes}
        </Link>
      </nav>

      {cargando && (
        <p>{textos.cargando}</p>
      )}

      {error && <p>{error}</p>}

      {!cargando && !error && (
        <>
          <p>
            {textos.encontrados}{" "}
            <strong>
              {productos.length}
            </strong>
          </p>

          {productos.length === 0 ? (
            <section>
              <p>{textos.vacio}</p>
            </section>
          ) : (
            <section className="product-grid">
              {productos.map((producto) => (
                <ProductCard
                  key={producto.id}
                  id={producto.id}
                  name={producto.nombre}
                  description={
                    producto.descripcion
                  }
                  price={Number(
                    producto.precio
                  )}
                  image={producto.imagen}
                  category={
                    producto.categoria
                  }
                  stock={producto.stock}
                />
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
}