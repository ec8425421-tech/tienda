
"use client";

import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";

import type { ProductoFidelina } from "../../../../context/data/productosFidelina";
import type { ProductoWilma } from "../../../../context/data/productosWilma";

type ProductoCatalogo = ProductoFidelina | ProductoWilma;

type Props = {
  productos: ProductoCatalogo[];
};

function esProductoWilma(
  producto: ProductoCatalogo
): producto is ProductoWilma {
  return "variedades" in producto;
}

function formatoPrecio(precio: number) {
  return precio.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });
}

export default function BuscadorCatalogo({ productos }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [seleccionado, setSeleccionado] =
    useState<ProductoCatalogo | null>(null);

  const categorias = useMemo(
    () => [
      "Todas",
      ...Array.from(new Set(productos.map((p) => p.categoria))),
    ],
    [productos]
  );

  const filtrados = productos.filter((producto) => {
    const texto = esProductoWilma(producto)
      ? [
          producto.producto,
          producto.categoria,
          producto.presentacion,
          producto.variedades,
        ]
            .join(" ")
            .toLowerCase()
      : [
          producto.producto,
          producto.modelo,
          producto.categoria,
          producto.caracteristicas,
          producto.colores,
          producto.presentacion,
        ]
            .join(" ")
            .toLowerCase();

    return (
      texto.includes(busqueda.trim().toLowerCase()) &&
      (categoria === "Todas" || producto.categoria === categoria)
    );
  });

  const esWilma =
    productos.length > 0 && productos.every(esProductoWilma);

  useEffect(() => {
    if (!seleccionado) return;

    function manejarEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setSeleccionado(null);
      }
    }

    document.addEventListener("keydown", manejarEscape);

    return () => {
      document.removeEventListener("keydown", manejarEscape);
    };
  }, [seleccionado]);

  function manejarTeclado(
    event: KeyboardEvent<HTMLTableRowElement>,
    producto: ProductoCatalogo
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSeleccionado(producto);
    }
  }

  return (
    <div className="tabla-catalogo">
      <div className="catalogo-filtros">
        <input
          type="search"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          aria-label="Buscar productos"
        />

        <select
          value={categoria}
          onChange={(event) => setCategoria(event.target.value)}
          aria-label="Filtrar por categoría"
        >
          {categorias.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <p className="catalogo-contador">
        {filtrados.length} productos encontrados
      </p>

      <p className="catalogo-ayuda">
        Selecciona cualquier producto para consultar sus detalles.
      </p>

      <div className="tabla-catalogo-scroll">
        <table className="tabla-productos">
          <thead>
            {esWilma ? (
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Presentación</th>
                <th>Precio</th>
                <th>Variedades o detalles</th>
              </tr>
            ) : (
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Modelo</th>
                <th>Presentación</th>
                <th>Medidas (cm)</th>
                <th>Precio</th>
                <th>Características</th>
                <th>Colores y diseños</th>
              </tr>
            )}
          </thead>

          <tbody>
            {filtrados.map((producto) => (
              <tr
                key={`${producto.categoria}-${producto.id}`}
                className="fila-producto-clicable"
                onClick={() => setSeleccionado(producto)}
                onKeyDown={(event) => manejarTeclado(event, producto)}
                tabIndex={0}
                role="button"
                aria-label={`Ver detalles de ${producto.producto}`}
                title="Haz clic para ver los detalles"
              >
                {esProductoWilma(producto) ? (
                  <>
                    <td>
                      <strong>{producto.producto}</strong>
                    </td>
                    <td>{producto.categoria}</td>
                    <td>{producto.presentacion || "—"}</td>
                    <td className="precio-producto">
                      {formatoPrecio(producto.precio)}
                    </td>
                    <td>{producto.variedades || "—"}</td>
                  </>
                ) : (
                  <>
                    <td>
                      <strong>{producto.producto}</strong>
                    </td>
                    <td>{producto.categoria}</td>
                    <td>{producto.modelo || "—"}</td>
                    <td>{producto.presentacion || "—"}</td>
                    <td>
                      {producto.ancho ?? "—"} × {producto.alto ?? "—"}
                      {producto.fuelle != null
                        ? ` × ${producto.fuelle}`
                        : ""}
                    </td>
                    <td className="precio-producto">
                      {formatoPrecio(producto.precio)}
                    </td>
                    <td>{producto.caracteristicas || "—"}</td>
                    <td>{producto.colores || "—"}</td>
                  </>
                )}
              </tr>
            ))}

            {filtrados.length === 0 && (
              <tr>
                <td
                  colSpan={esWilma ? 5 : 8}
                  className="catalogo-vacio"
                >
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {seleccionado && (
        <div
          className="producto-modal-overlay"
          onClick={() => setSeleccionado(null)}
        >
          <section
            className="producto-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="producto-modal-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="producto-modal-cerrar"
              onClick={() => setSeleccionado(null)}
              aria-label="Cerrar detalles del producto"
            >
              ×
            </button>

            <div className="producto-modal-cabecera">
              <span className="producto-modal-etiqueta">
                {seleccionado.categoria}
              </span>

              <h2 id="producto-modal-titulo">
                {seleccionado.producto}
              </h2>

              <p className="producto-modal-precio">
                {formatoPrecio(seleccionado.precio)}
              </p>
            </div>

            <div className="producto-modal-cuerpo">
              <div className="producto-modal-imagen">
                {"imagen" in seleccionado && seleccionado.imagen ? (
                  <img
                    src={seleccionado.imagen}
                    alt={seleccionado.producto}
                  />
                ) : (
                  <div className="producto-modal-sin-imagen">
                    <span aria-hidden="true">✦</span>
                    <p>Imagen próximamente</p>
                  </div>
                )}
              </div>

              <div className="producto-modal-detalles">
                <h3>Características del producto</h3>

                <div className="producto-modal-dato">
                  <span>Presentación</span>
                  <strong>{seleccionado.presentacion || "No especificada"}</strong>
                </div>

                {esProductoWilma(seleccionado) ? (
                  <div className="producto-modal-dato">
                    <span>Variedades</span>
                    <strong>
                      {seleccionado.variedades
                        ? seleccionado.variedades
                            .split(";")
                            .map((item) => item.trim())
                            .join(", ")
                        : "No especificadas"}
                    </strong>
                  </div>
                ) : (
                  <>
                    {seleccionado.modelo && (
                      <div className="producto-modal-dato">
                        <span>Modelo</span>
                        <strong>{seleccionado.modelo}</strong>
                      </div>
                    )}

                    {(seleccionado.ancho != null ||
                      seleccionado.alto != null ||
                      seleccionado.fuelle != null) && (
                      <div className="producto-modal-dato">
                        <span>Medidas</span>
                        <strong>
                          {seleccionado.ancho ?? "—"} ×{" "}
                          {seleccionado.alto ?? "—"}
                          {seleccionado.fuelle != null
                            ? ` × ${seleccionado.fuelle}`
                            : ""}{" "}
                          cm
                        </strong>
                      </div>
                    )}

                    <div className="producto-modal-dato">
                      <span>Características</span>
                      <strong>
                        {seleccionado.caracteristicas || "No especificadas"}
                      </strong>
                    </div>

                    <div className="producto-modal-dato">
                      <span>Colores y diseños</span>
                      <strong>
                        {seleccionado.colores || "No especificados"}
                      </strong>
                    </div>
                  </>
                )}
              </div>
            </div>

            <footer className="producto-modal-footer">
              <button
                type="button"
                className="perfil-primary-button"
                onClick={() => setSeleccionado(null)}
              >
                Cerrar detalles
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}