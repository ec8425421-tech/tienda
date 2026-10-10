
"use client";

import { useMemo, useState } from "react";
import type { ProductoFidelina } from "../context/data/productosFidelina";
import type { ProductoWilma } from "../context/data/productosWilma";

type Producto = ProductoFidelina | ProductoWilma;

type Props = {
  productos: Producto[];
  empresa?: string;
};

function tieneDetallesTextiles(
  producto: Producto
): producto is ProductoFidelina {
  return "caracteristicas" in producto;
}

function formatoPrecio(precio: number) {
  return precio.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });
}

export default function TablaProductos({
  productos,
  empresa = "Catálogo",
}: Props) {
  const [seleccionado, setSeleccionado] = useState<Producto | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  const categorias = useMemo(
    () => [
      "Todas",
      ...Array.from(new Set(productos.map((p) => p.categoria))).sort(),
    ],
    [productos]
  );

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase("es-MX");

    return productos.filter((producto) => {
      const coincideCategoria =
        categoria === "Todas" || producto.categoria === categoria;

      const detalles = tieneDetallesTextiles(producto)
        ? `${producto.modelo} ${producto.presentacion} ${producto.caracteristicas} ${producto.colores}`
        : `${producto.presentacion} ${producto.variedades}`;

      const coincideTexto =
        `${producto.producto} ${producto.categoria} ${detalles}`
          .toLocaleLowerCase("es-MX")
          .includes(texto);

      return coincideCategoria && coincideTexto;
    });
  }, [productos, busqueda, categoria]);

  return (
    <section className="tabla-productos">
      <div className="tabla-productos-cabecera">
        <span className="tabla-productos-etiqueta">NUESTRO CATÁLOGO</span>
        <h2>{empresa}</h2>
        <p>Explora los productos y selecciona cualquiera para conocer sus detalles.</p>
      </div>

      <div className="tabla-productos-filtros">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          aria-label="Filtrar por categoría"
        >
          {categorias.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>
      </div>

      <p className="tabla-productos-contador">
        {filtrados.length} {filtrados.length === 1 ? "producto" : "productos"}
      </p>

      <div className="tabla-productos-scroll">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Presentación</th>
              <th>Precio</th>
              <th>Detalles</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((producto) => (
              <tr
                key={`${producto.categoria}-${producto.id}`}
                tabIndex={0}
                role="button"
                aria-label={`Ver detalles de ${producto.producto}`}
                onClick={() => setSeleccionado(producto)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSeleccionado(producto);
                  }
                }}
              >
                <td className="tabla-productos-nombre">
                  {producto.producto}
                  {tieneDetallesTextiles(producto) && producto.modelo && (
                    <small>{producto.modelo}</small>
                  )}
                </td>
                <td>{producto.categoria}</td>
                <td>{producto.presentacion || "No especificada"}</td>
                <td className="tabla-productos-precio">
                  {formatoPrecio(producto.precio)}
                </td>
                <td>
                  <button
                    type="button"
                    className="tabla-productos-ver"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSeleccionado(producto);
                    }}
                  >
                    Ver producto
                  </button>
                </td>
              </tr>
            ))}

            {filtrados.length === 0 && (
              <tr>
                <td colSpan={5} className="tabla-productos-vacio">
                  No se encontraron productos con esos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {seleccionado && (
        <div
          className="producto-modal-fondo"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSeleccionado(null);
          }}
        >
          <section
            className="producto-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="producto-modal-titulo"
          >
            <button
              type="button"
              className="producto-modal-cerrar"
              onClick={() => setSeleccionado(null)}
              aria-label="Cerrar ventana"
            >
              ×
            </button>

            <div className="producto-modal-imagen">
              {tieneDetallesTextiles(seleccionado) &&
              seleccionado.imagen?.trim() ? (
                // La imagen se mostrará cuando se agregue su ruta.
                <img
                  src={seleccionado.imagen}
                  alt={seleccionado.producto}
                />
              ) : (
                <div className="producto-modal-sin-imagen">
                  <span aria-hidden="true">✿</span>
                  <p>Imagen próximamente</p>
                </div>
              )}
            </div>

            <div className="producto-modal-contenido">
              <span className="producto-modal-categoria">
                {seleccionado.categoria}
              </span>

              <h2 id="producto-modal-titulo">
                {seleccionado.producto}
              </h2>

              <p className="producto-modal-precio">
                {formatoPrecio(seleccionado.precio)}
              </p>

              <div className="producto-modal-datos">
                <div>
                  <span>Presentación</span>
                  <strong>{seleccionado.presentacion || "No especificada"}</strong>
                </div>

                {tieneDetallesTextiles(seleccionado) ? (
                  <>
                    {seleccionado.modelo && (
                      <div>
                        <span>Modelo</span>
                        <strong>{seleccionado.modelo}</strong>
                      </div>
                    )}

                    {(seleccionado.ancho !== undefined ||
                      seleccionado.alto !== undefined ||
                      seleccionado.fuelle !== undefined) && (
                      <div>
                        <span>Medidas</span>
                        <strong>
                          {seleccionado.ancho !== undefined
                            ? `${seleccionado.ancho} cm ancho`
                            : ""}
                          {seleccionado.ancho !== undefined &&
                          seleccionado.alto !== undefined
                            ? " × "
                            : ""}
                          {seleccionado.alto !== undefined
                            ? `${seleccionado.alto} cm alto`
                            : ""}
                          {seleccionado.fuelle !== undefined
                            ? ` × ${seleccionado.fuelle} cm fuelle`
                            : ""}
                        </strong>
                      </div>
                    )}

                    <div>
                      <span>Características</span>
                      <strong>
                        {seleccionado.caracteristicas || "Sin especificar"}
                      </strong>
                    </div>

                    <div>
                      <span>Colores y diseños</span>
                      <strong>
                        {seleccionado.colores || "Sin especificar"}
                      </strong>
                    </div>
                  </>
                ) : (
                  <div>
                    <span>Variedades</span>
                    <strong>
                      {seleccionado.variedades || "Sin variedades especificadas"}
                    </strong>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="producto-modal-boton"
                onClick={() => setSeleccionado(null)}
              >
                Volver al catálogo
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}