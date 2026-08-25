"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function InventarioPage() {
  const params = useParams();
  const locale = params.locale === "en" ? "en" : "es";
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [guardandoId, setGuardandoId] = useState<number | null>(
    null
  );

  useEffect(() => {
    cargarInventario();
  }, []);

  async function cargarInventario() {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch(
        "http://localhost:4000/api/productos"
      );

      if (!respuesta.ok) {
        throw new Error(
          "No se pudo obtener el inventario"
        );
      }

      const datos = await respuesta.json();

      setProductos(datos);
    } catch (error) {
      console.error(
        "Error cargando inventario:",
        error
      );

      setError(
        "No se pudo cargar el inventario."
      );
    } finally {
      setCargando(false);
    }
  }

  async function cambiarStock(
    producto: Producto,
    cambio: number
  ) {
    const nuevoStock =
      Number(producto.stock) + cambio;

    if (nuevoStock < 0) {
      alert(
        "El stock no puede ser menor que 0."
      );
      return;
    }

    try {
      setGuardandoId(producto.id);

      const respuesta = await fetch(
        `http://localhost:4000/api/productos/${producto.id}/stock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stock: nuevoStock,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
            "No se pudo actualizar el stock"
        );
      }

      setProductos((productosActuales) =>
        productosActuales.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                stock: datos.stock,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Error actualizando stock:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el stock."
      );
    } finally {
      setGuardandoId(null);
    }
  }

  function obtenerEstadoStock(stock: number) {
    if (stock <= 0) {
      return "Agotado";
    }

    if (stock <= 5) {
      return "Stock bajo";
    }

    return "Disponible";
  }

  const totalProductos = productos.length;

  const productosAgotados = productos.filter(
    (producto) => producto.stock <= 0
  ).length;

  const productosStockBajo = productos.filter(
    (producto) =>
      producto.stock > 0 &&
      producto.stock <= 5
  ).length;

  const unidadesTotales = productos.reduce(
    (total, producto) =>
      total + Number(producto.stock),
    0
  );

  return (
    <main className="admin-page">
      <section className="admin-header">
        <h1>Inventario</h1>

        <p>
          Consulta y controla las existencias
          de los productos.
        </p>
      </section>

      {cargando && (
        <p>Cargando inventario...</p>
      )}

      {error && <p>{error}</p>}

      {!cargando && !error && (
        <>
          <section className="admin-grid">
            <article className="admin-card">
              <h2>Productos</h2>
              <p>{totalProductos}</p>
            </article>

            <article className="admin-card">
              <h2>Unidades disponibles</h2>
              <p>{unidadesTotales}</p>
            </article>

            <article className="admin-card">
              <h2>Stock bajo</h2>
              <p>{productosStockBajo}</p>
            </article>

            <article className="admin-card">
              <h2>Agotados</h2>
              <p>{productosAgotados}</p>
            </article>
          </section>

          <section>
            <h2>Existencias</h2>

            {productos.length === 0 ? (
              <p>
                No hay productos registrados.
              </p>
            ) : (
              <div className="admin-products">
                {productos.map((producto) => {
                  const guardando =
                    guardandoId === producto.id;

                  return (
                    <article
                      className="admin-product-card"
                      key={producto.id}
                    >
                      <h2>
                        {producto.nombre}
                      </h2>

                      <p>
                        Categoría:{" "}
                        {producto.categoria ||
                          "Sin categoría"}
                      </p>

                      <p>
                        Precio: $
                        {Number(
                          producto.precio
                        ).toFixed(2)}
                      </p>

                      <p>
                        Stock actual:{" "}
                        <strong>
                          {producto.stock}
                        </strong>
                      </p>

                      <p>
                        Estado de stock:{" "}
                        <strong>
                          {obtenerEstadoStock(
                            producto.stock
                          )}
                        </strong>
                      </p>

                      <div>
                        <button
                          type="button"
                          disabled={
                            guardando ||
                            producto.stock <= 0
                          }
                          onClick={() =>
                            cambiarStock(
                              producto,
                              -1
                            )
                          }
                        >
                          −
                        </button>

                        <strong
                          style={{
                            margin:
                              "0 15px",
                          }}
                        >
                          {producto.stock}
                        </strong>

                        <button
                          type="button"
                          disabled={guardando}
                          onClick={() =>
                            cambiarStock(
                              producto,
                              1
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      {guardando && (
                        <p>
                          Actualizando stock...
                        </p>
                      )}

                      <p>
                        Estado del producto:{" "}
                        {producto.activo
                          ? "Activo"
                          : "Inactivo"}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <button
            type="button"
            onClick={cargarInventario}
          >
            Actualizar inventario
          </button>
        </>
      )}
    </main>
  );
}