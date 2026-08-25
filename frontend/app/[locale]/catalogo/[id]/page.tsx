"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";
type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string | null;
  categoria: string | null;
  activo: boolean;
};

export default function ProductoDetalle() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const locale =
    params.locale === "en" ? "en" : "es";

  const [producto, setProducto] =
    useState<Producto | null>(null);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function cargarProducto() {
      try {
        const respuesta = await fetch(
          `http://localhost:4000/api/productos/${params.id}`
        );

        if (!respuesta.ok) {
          throw new Error(
            "No se pudo obtener el producto"
          );
        }

        const datos =
          await respuesta.json();

        setProducto(datos);
      } catch (error) {
        console.error(error);

        setError(
          locale === "en"
            ? "The product could not be loaded."
            : "No se pudo cargar el producto."
        );
      } finally {
        setCargando(false);
      }
    }

    if (params.id) {
      cargarProducto();
    }
  }, [params.id, locale]);

  const textos =
    locale === "en"
      ? {
          cargando: "Loading product...",
          noEncontrado:
            "Product not found.",
          volver:
            "← Back to catalog",
          categoria:
            "Category:",
          stock:
            "Available stock:",
          sinStock:
            "Out of stock",
          agregar:
            "Add to cart",
          agregado:
            "Product added to cart.",
        }
      : {
          cargando:
            "Cargando producto...",
          noEncontrado:
            "Producto no encontrado.",
          volver:
            "← Volver al catálogo",
          categoria:
            "Categoría:",
          stock:
            "Stock disponible:",
          sinStock:
            "Sin stock",
          agregar:
            "Agregar al carrito",
          agregado:
            "Producto agregado al carrito.",
        };

  if (cargando) {
    return (
      <main>
        <p>{textos.cargando}</p>
      </main>
    );
  }

  if (error || !producto) {
    return (
      <main>
        <p>
          {error || textos.noEncontrado}
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(
              `/${locale}/catalogo`
            )
          }
        >
          {textos.volver}
        </button>
      </main>
    );
  }

  const sinStock =
    producto.stock <= 0;

  function agregarAlCarrito() {
    addToCart({
      id: producto!.id,
      name: producto!.nombre,
      price: Number(
        producto!.precio
      ),
    });

    alert(textos.agregado);
  }

  return (
    <main className="product-detail">
      <button
        type="button"
        onClick={() =>
          router.push(
            `/${locale}/catalogo`
          )
        }
      >
        {textos.volver}
      </button>

      <section className="product-detail-content">
        <div className="product-detail-image">
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
            />
          ) : (
            <span>🌱</span>
          )}
        </div>

        <div className="product-detail-info">
          {producto.categoria && (
            <p>
              {textos.categoria}{" "}
              {producto.categoria}
            </p>
          )}

          <h1>{producto.nombre}</h1>

          <p>
            {producto.descripcion}
          </p>

          <h2>
            $
            {Number(
              producto.precio
            ).toFixed(2)}
          </h2>

          <p>
            {textos.stock}{" "}
            {producto.stock}
          </p>

          <button
            type="button"
            disabled={sinStock}
            onClick={agregarAlCarrito}
          >
            {sinStock
              ? textos.sinStock
              : textos.agregar}
          </button>
        </div>
      </section>
    </main>
  );
}