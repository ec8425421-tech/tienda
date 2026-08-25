"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string | null;
  categoria_id: number | null;
  imagen: string | null;
  activo: boolean;
};

type Categoria = {
  id: number;
  nombre: string;
};

export default function AdminProductos() {
  const params = useParams();
  const locale = params.locale === "en" ? "en" : "es";
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [imagen, setImagen] = useState("");
  const [activo, setActivo] = useState(true);

  const [guardando, setGuardando] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");

      const [respuestaProductos, respuestaCategorias] =
        await Promise.all([
          fetch("http://localhost:4000/api/productos"),
          fetch("http://localhost:4000/api/categorias"),
        ]);

      if (!respuestaProductos.ok) {
        throw new Error(
          "No se pudieron cargar los productos"
        );
      }

      if (!respuestaCategorias.ok) {
        throw new Error(
          "No se pudieron cargar las categorías"
        );
      }

      const datosProductos =
        await respuestaProductos.json();

      const datosCategorias =
        await respuestaCategorias.json();

      setProductos(datosProductos);
      setCategorias(datosCategorias);
    } catch (error) {
      console.error(error);

      setError(
        "No se pudieron cargar los datos."
      );
    } finally {
      setCargando(false);
    }
  }

  function limpiarFormulario() {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setStock("");
    setCategoriaId("");
    setImagen("");
    setActivo(true);
    setEditandoId(null);
  }

  function editarProducto(producto: Producto) {
    setEditandoId(producto.id);

    setNombre(producto.nombre);
    setDescripcion(producto.descripcion || "");
    setPrecio(String(producto.precio));
    setStock(String(producto.stock));

    setCategoriaId(
      producto.categoria_id !== null
        ? String(producto.categoria_id)
        : ""
    );

    setImagen(producto.imagen || "");
    setActivo(producto.activo);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function guardarProducto(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!nombre.trim() || !precio) {
      alert(
        "El nombre y el precio son obligatorios."
      );
      return;
    }

    const precioNumero = Number(precio);
    const stockNumero = Number(stock);

    if (
      Number.isNaN(precioNumero) ||
      precioNumero < 0
    ) {
      alert("El precio no es válido.");
      return;
    }

    if (
      Number.isNaN(stockNumero) ||
      stockNumero < 0
    ) {
      alert("El stock no es válido.");
      return;
    }

    try {
      setGuardando(true);

      const productoData = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: precioNumero,
        stock: stockNumero,
        imagen: imagen.trim(),
        categoria_id: categoriaId
          ? Number(categoriaId)
          : null,
        activo,
      };

      let respuesta;

      if (editandoId !== null) {
        respuesta = await fetch(
          `http://localhost:4000/api/productos/${editandoId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productoData),
          }
        );
      } else {
        respuesta = await fetch(
          "http://localhost:4000/api/productos",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              productoData
            ),
          }
        );
      }

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
            (editandoId !== null
              ? "No se pudo actualizar el producto"
              : "No se pudo crear el producto")
        );
      }

      const estabaEditando =
        editandoId !== null;

      limpiarFormulario();

      await cargarDatos();

      alert(
        estabaEditando
          ? "Producto actualizado correctamente."
          : "Producto agregado correctamente."
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el producto."
      );
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarProducto(
    producto: Producto
  ) {
    const confirmar = window.confirm(
      `¿Seguro que quieres eliminar "${producto.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await fetch(
        `http://localhost:4000/api/productos/${producto.id}`,
        {
          method: "DELETE",
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
            "No se pudo eliminar el producto"
        );
      }

      if (editandoId === producto.id) {
        limpiarFormulario();
      }

      await cargarDatos();

      alert(
        "Producto eliminado correctamente."
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el producto."
      );
    }
  }

  async function cambiarEstado(
    producto: Producto
  ) {
    try {
      const respuesta = await fetch(
        `http://localhost:4000/api/productos/${producto.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: producto.nombre,
            descripcion:
              producto.descripcion || "",
            precio: Number(producto.precio),
            stock: Number(producto.stock),
            imagen: producto.imagen || "",
            categoria_id:
              producto.categoria_id,
            activo: !producto.activo,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
            "No se pudo cambiar el estado"
        );
      }

      await cargarDatos();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo cambiar el estado."
      );
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-header">
        <h1>Administrar productos</h1>

        <p>
          Desde aquí puedes agregar, editar,
          activar, desactivar y eliminar
          productos de la tienda.
        </p>
      </section>

      {/* FORMULARIO */}

      <section className="admin-form">
        <h2>
          {editandoId !== null
            ? "Editar producto"
            : "Agregar producto"}
        </h2>

        <form onSubmit={guardarProducto}>
          <div>
            <label htmlFor="nombre">
              Nombre
            </label>

            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(event) =>
                setNombre(
                  event.target.value
                )
              }
              placeholder="Ej. Planta de Fresa"
            />
          </div>

          <div>
            <label htmlFor="descripcion">
              Descripción
            </label>

            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(event) =>
                setDescripcion(
                  event.target.value
                )
              }
              placeholder="Descripción del producto"
            />
          </div>

          <div>
            <label htmlFor="precio">
              Precio
            </label>

            <input
              id="precio"
              type="number"
              step="0.01"
              min="0"
              value={precio}
              onChange={(event) =>
                setPrecio(
                  event.target.value
                )
              }
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="stock">
              Stock
            </label>

            <input
              id="stock"
              type="number"
              min="0"
              value={stock}
              onChange={(event) =>
                setStock(
                  event.target.value
                )
              }
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="categoria">
              Categoría
            </label>

            <select
              id="categoria"
              value={categoriaId}
              onChange={(event) =>
                setCategoriaId(
                  event.target.value
                )
              }
            >
              <option value="">
                Selecciona una categoría
              </option>

              {categorias.map(
                (categoria) => (
                  <option
                    key={categoria.id}
                    value={categoria.id}
                  >
                    {categoria.nombre}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label htmlFor="imagen">
              Imagen
            </label>

            <input
              id="imagen"
              type="text"
              value={imagen}
              onChange={(event) =>
                setImagen(
                  event.target.value
                )
              }
              placeholder="URL de la imagen"
            />
          </div>

          {editandoId !== null && (
            <div>
              <label htmlFor="activo">
                Estado del producto
              </label>

              <select
                id="activo"
                value={activo ? "activo" : "inactivo"}
                onChange={(event) =>
                  setActivo(
                    event.target.value ===
                      "activo"
                  )
                }
              >
                <option value="activo">
                  Activo
                </option>

                <option value="inactivo">
                  Inactivo
                </option>
              </select>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={guardando}
            >
              {guardando
                ? "Guardando..."
                : editandoId !== null
                ? "Guardar cambios"
                : "Agregar producto"}
            </button>

            {editandoId !== null && (
              <button
                type="button"
                onClick={limpiarFormulario}
                disabled={guardando}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* CARGANDO */}

      {cargando && (
        <p>
          Cargando productos...
        </p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {/* LISTA */}

      {!cargando && !error && (
        <section>
          <p>
            Productos registrados:{" "}
            <strong>
              {productos.length}
            </strong>
          </p>

          {productos.length === 0 ? (
            <p>
              No hay productos registrados.
            </p>
          ) : (
            <div className="admin-products">
              {productos.map(
                (producto) => (
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
                      Stock:{" "}
                      {producto.stock}
                    </p>

                    <p>
                      Estado:{" "}
                      <strong>
                        {producto.activo
                          ? "Activo"
                          : "Inactivo"}
                      </strong>
                    </p>

                    <div>
                      {/* EDITAR */}

                      <button
                        type="button"
                        onClick={() =>
                          editarProducto(
                            producto
                          )
                        }
                      >
                        Editar
                      </button>

                      {/* ACTIVAR / DESACTIVAR */}

                      <button
                        type="button"
                        onClick={() =>
                          cambiarEstado(
                            producto
                          )
                        }
                      >
                        {producto.activo
                          ? "Desactivar"
                          : "Activar"}
                      </button>

                      {/* ELIMINAR */}

                      <button
                        type="button"
                        onClick={() =>
                          eliminarProducto(
                            producto
                          )
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      )}
    </main>
  );
}