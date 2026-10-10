
"use client";

import { useMemo, useState } from "react";
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

export default function BuscadorCatalogo({ productos }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");

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

  return (
    <div className="tabla-catalogo">
      <div className="catalogo-filtros">
        <input
          type="search"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar productos"
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
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
              esProductoWilma(producto) ? (
                <tr key={producto.id}>
                  <td>
                    <strong>{producto.producto}</strong>
                  </td>
                  <td>{producto.categoria}</td>
                  <td>{producto.presentacion || "—"}</td>
                  <td className="precio-producto">
                    {producto.precio.toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })}
                  </td>
                  <td>{producto.variedades || "—"}</td>
                </tr>
              ) : (
                <tr key={producto.id}>
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
                    {producto.precio.toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })}
                  </td>
                  <td>{producto.caracteristicas || "—"}</td>
                  <td>{producto.colores || "—"}</td>
                </tr>
              )
            ))}

            {filtrados.length === 0 && (
              <tr>
                <td colSpan={esWilma ? 5 : 8} className="catalogo-vacio">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}