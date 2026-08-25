"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  created_at: string;
};

export default function MiCuenta() {
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarPerfil();
  }, []);

  async function cargarPerfil() {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const respuesta =
        await fetch(
          "http://localhost:4000/api/auth/perfil",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const datos =
        await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
            "No se pudo obtener el perfil."
        );
      }

      setUsuario(datos.usuario);
      setNombre(datos.usuario.nombre);
      setEmail(datos.usuario.email);

      localStorage.setItem(
        "usuario",
        JSON.stringify(datos.usuario)
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo cargar el perfil."
      );
    } finally {
      setCargando(false);
    }
  }

  async function guardarCambios(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMensaje("");

    if (!nombre.trim()) {
      setError(
        "El nombre es obligatorio."
      );
      return;
    }

    if (!email.trim()) {
      setError(
        "El correo electrónico es obligatorio."
      );
      return;
    }

    try {
      setGuardando(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const respuesta =
        await fetch(
          "http://localhost:4000/api/auth/perfil",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              nombre,
              email,
            }),
          }
        );

      const datos =
        await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
            "No se pudo actualizar el perfil."
        );
      }

      setUsuario(datos.usuario);
      setNombre(datos.usuario.nombre);
      setEmail(datos.usuario.email);

      localStorage.setItem(
        "usuario",
        JSON.stringify(datos.usuario)
      );

      setMensaje(
        "Tus datos se actualizaron correctamente."
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el perfil."
      );
    } finally {
      setGuardando(false);
    }
  }

  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    router.push("/login");
  }

  if (cargando) {
    return (
      <main className="admin-page">
        <section className="admin-header">
          <h1>Mi cuenta</h1>

          <p>
            Cargando información...
          </p>
        </section>
      </main>
    );
  }

  if (error && !usuario) {
    return (
      <main className="admin-page">
        <section className="admin-header">
          <h1>Mi cuenta</h1>

          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              router.push("/login")
            }
          >
            Iniciar sesión
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-header">
        <h1>Mi cuenta</h1>

        <p>
          Administra la información de tu cuenta.
        </p>
      </section>

      <section className="admin-form">
        <h2>Información personal</h2>

        <form onSubmit={guardarCambios}>
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
              disabled={guardando}
            />
          </div>

          <div>
            <label htmlFor="email">
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              disabled={guardando}
            />
          </div>

          {error && (
            <p>{error}</p>
          )}

          {mensaje && (
            <p>{mensaje}</p>
          )}

          <button
            type="submit"
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : "Guardar cambios"}
          </button>
        </form>
      </section>

      {usuario && (
        <section className="admin-form">
          <h2>Información de la cuenta</h2>

          <p>
            <strong>Tipo de cuenta:</strong>{" "}
            {usuario.rol === "admin"
              ? "Administrador"
              : "Cliente"}
          </p>

          <p>
            <strong>Cuenta activa:</strong>{" "}
            {usuario.activo
              ? "Sí"
              : "No"}
          </p>

          <p>
            <strong>Cliente desde:</strong>{" "}
            {new Date(
              usuario.created_at
            ).toLocaleDateString()}
          </p>
        </section>
      )}

      <section className="admin-form">
        <h2>Mis pedidos</h2>

        <p>
          Consulta las compras realizadas
          desde tu cuenta.
        </p>

        <button
          type="button"
          onClick={() =>
            router.push("/mis-pedidos")
          }
        >
          Ver mis pedidos
        </button>
      </section>

      <section className="admin-form">
        <button
          type="button"
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </button>
      </section>
    </main>
  );
}