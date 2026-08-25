"use client";

import { useEffect, useState } from "react";

type Categoria = {
  id: number;
  nombre: string;
  descripcion?: string;
  activa?: boolean;
};

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarCategorias();
  }, []);

  async function cargarCategorias() {
    try {
      setError("");

      const respuesta = await fetch(
        "http://localhost:4000/api/categorias"
      );

      if (!respuesta.ok) {
        throw new Error(
          "No se pudieron cargar las categorías"
        );
      }

      const datos = await respuesta.json();

      setCategorias(datos);
    } catch (error) {
      console.error(error);

      setError(
        "No se pudieron cargar las categorías."
      );
    } finally {
      setCargando(false);
    }
  }

  async function agregarCategoria(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!nombre.trim()) {
      alert(
        "El nombre de la categoría es obligatorio."
      );
      return;
    }

    try {
      setGuardando(true);

      const respuesta = await fetch(
        "http://localhost:4000/api/categorias",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
            "No se pudo crear la categoría"
        );
      }

      setNombre("");
      setDescripcion("");

      await cargarCategorias();

      alert(
        "Categoría agregada correctamente."
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo crear la categoría."
      );
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarCategoria(id: number) {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar esta categoría?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await fetch(
        `http://localhost:4000/api/categorias/${id}`,
        {
          method: "DELETE",
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
            "No se pudo eliminar la categoría"
        );
      }

      setCategorias((actuales) =>
        actuales.filter(
          (categoria) =>
            categoria.id !== id
        )
      );

      alert(
        "Categoría eliminada correctamente."
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la categoría."
      );
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-header">
        <h1>Administrar categorías</h1>

        <p>
          Desde aquí puedes administrar las
          categorías de la tienda.
        </p>
      </section>

      <section className="admin-form">
        <h2>Agregar categoría</h2>

        <form onSubmit={agregarCategoria}>
          <div>
            <label htmlFor="nombre">
              Nombre
            </label>

            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(event) =>
                setNombre(event.target.value)
              }
              placeholder="Ej. Plantas de interior"
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
              placeholder="Descripción de la categoría"
            />
          </div>

          <button
            type="submit"
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : "Agregar categoría"}
          </button>
        </form>
      </section>

      {cargando && (
        <p>Cargando categorías...</p>
      )}

      {error && <p>{error}</p>}

      {!cargando && !error && (
        <section>
          <p>
            Categorías registradas:{" "}
            <strong>
              {categorias.length}
            </strong>
          </p>

          {categorias.length === 0 ? (
            <p>
              No hay categorías registradas.
            </p>
          ) : (
            <div className="admin-products">
              {categorias.map((categoria) => (
                <article
                  className="admin-product-card"
                  key={categoria.id}
                >
                  <h2>
                    {categoria.nombre}
                  </h2>

                  {categoria.descripcion && (
                    <p>
                      {categoria.descripcion}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      eliminarCategoria(
                        categoria.id
                      )
                    }
                  >
                    Eliminar
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}