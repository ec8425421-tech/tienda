"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  activo?: boolean;
  created_at?: string;
};

type Pedido = {
  id: number;
  nombre_cliente: string;
  email_cliente: string | null;
  telefono_cliente: string | null;
  calle: string;
  colonia: string;
  ciudad: string;
  estado_entrega: string;
  codigo_postal: string;
  referencias: string | null;
  total: number;
  metodo_pago: string | null;
  estado: string;
  created_at: string;
};

export default function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const [cargando, setCargando] = useState(true);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);

  const [guardando, setGuardando] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [errorPassword, setErrorPassword] = useState("");
  const [mensajePassword, setMensajePassword] = useState("");

  // ========================================
  // CARGAR PERFIL Y PEDIDOS
  // ========================================

  useEffect(() => {
    cargarPerfil();
    cargarPedidos();
  }, []);

  // ========================================
  // CARGAR PERFIL
  // ========================================

  async function cargarPerfil() {
    try {
      setCargando(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Debes iniciar sesión para consultar tu perfil."
        );
        setCargando(false);
        return;
      }

      const respuesta = await fetch(
        "http://localhost:4000/api/auth/perfil",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
            "No se pudo obtener el perfil."
        );
      }

      const usuarioActual = datos.usuario;

      setUsuario(usuarioActual);
      setNombre(usuarioActual.nombre);
      setEmail(usuarioActual.email);

      localStorage.setItem(
        "usuario",
        JSON.stringify({
          id: usuarioActual.id,
          nombre: usuarioActual.nombre,
          email: usuarioActual.email,
          rol: usuarioActual.rol,
        })
      );
    } catch (error) {
      console.error(
        "Error cargando perfil:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo cargar el perfil."
      );
    } finally {
      setCargando(false);
    }
  }

  // ========================================
  // CARGAR PEDIDOS
  // ========================================

  async function cargarPedidos() {
    try {
      setCargandoPedidos(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setCargandoPedidos(false);
        return;
      }

      const respuesta = await fetch(
        "http://localhost:4000/api/pedidos/mis-pedidos",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
            "No se pudieron obtener tus pedidos."
        );
      }

      setPedidos(datos);
    } catch (error) {
      console.error(
        "Error cargando pedidos:",
        error
      );
    } finally {
      setCargandoPedidos(false);
    }
  }

  // ========================================
  // GUARDAR CAMBIOS DEL PERFIL
  // ========================================

  async function guardarCambios() {
    setError("");
    setMensaje("");

    const nombreLimpio = nombre.trim();
    const emailLimpio = email.trim().toLowerCase();

    if (!nombreLimpio) {
      setError("El nombre es obligatorio.");
      return;
    }

    if (nombreLimpio.length < 2) {
      setError(
        "El nombre debe tener al menos 2 caracteres."
      );
      return;
    }

    if (!emailLimpio) {
      setError(
        "El correo electrónico es obligatorio."
      );
      return;
    }

    const formatoEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(emailLimpio)) {
      setError(
        "Escribe un correo electrónico válido."
      );
      return;
    }

    try {
      setGuardando(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Tu sesión ha expirado. Inicia sesión nuevamente."
        );
        return;
      }

      const respuesta = await fetch(
        "http://localhost:4000/api/auth/perfil",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: nombreLimpio,
            email: emailLimpio,
          }),
        }
      );

      const datos = await respuesta.json();

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
        JSON.stringify({
          id: datos.usuario.id,
          nombre: datos.usuario.nombre,
          email: datos.usuario.email,
          rol: datos.usuario.rol,
        })
      );

      setMensaje(
        "Perfil actualizado correctamente."
      );

      window.dispatchEvent(
        new Event("storage")
      );
    } catch (error) {
      console.error(
        "Error actualizando perfil:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el perfil."
      );
    } finally {
      setGuardando(false);
    }
  }

  // ========================================
  // CAMBIAR CONTRASEÑA
  // ========================================

  async function cambiarPassword() {
    setErrorPassword("");
    setMensajePassword("");

    if (!passwordActual) {
      setErrorPassword(
        "Escribe tu contraseña actual."
      );
      return;
    }

    if (!passwordNueva) {
      setErrorPassword(
        "Escribe una nueva contraseña."
      );
      return;
    }

    if (passwordNueva.length < 6) {
      setErrorPassword(
        "La nueva contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    if (!confirmarPassword) {
      setErrorPassword(
        "Confirma tu nueva contraseña."
      );
      return;
    }

    if (passwordNueva !== confirmarPassword) {
      setErrorPassword(
        "Las nuevas contraseñas no coinciden."
      );
      return;
    }

    try {
      setCambiandoPassword(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setErrorPassword(
          "Tu sesión ha expirado. Inicia sesión nuevamente."
        );
        return;
      }

      const respuesta = await fetch(
        "http://localhost:4000/api/auth/cambiar-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            passwordActual,
            passwordNueva,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
            "No se pudo cambiar la contraseña."
        );
      }

      setPasswordActual("");
      setPasswordNueva("");
      setConfirmarPassword("");

      setMensajePassword(
        "Contraseña actualizada correctamente."
      );
    } catch (error) {
      console.error(
        "Error cambiando contraseña:",
        error
      );

      setErrorPassword(
        error instanceof Error
          ? error.message
          : "No se pudo cambiar la contraseña."
      );
    } finally {
      setCambiandoPassword(false);
    }
  }

  // ========================================
  // TEXTO ESTADO PEDIDO
  // ========================================

  function obtenerTextoEstado(
    estado: string
  ) {
    switch (estado) {
      case "pendiente":
        return "Pendiente";

      case "confirmado":
        return "Confirmado";

      case "enviado":
        return "Enviado";

      case "entregado":
        return "Entregado";

      case "cancelado":
        return "Cancelado";

      default:
        return estado;
    }
  }

  // ========================================
  // CLASE ESTADO PEDIDO
  // ========================================

  function obtenerClaseEstado(
    estado: string
  ) {
    switch (estado) {
      case "pendiente":
        return "perfil-estado pendiente";

      case "confirmado":
        return "perfil-estado confirmado";

      case "enviado":
        return "perfil-estado enviado";

      case "entregado":
        return "perfil-estado entregado";

      case "cancelado":
        return "perfil-estado cancelado";

      default:
        return "perfil-estado";
    }
  }

  // ========================================
  // MÉTODO DE PAGO
  // ========================================

  function obtenerTextoMetodoPago(
    metodo: string | null
  ) {
    switch (metodo) {
      case "efectivo":
        return "Efectivo";

      case "tarjeta":
        return "Tarjeta";

      case "transferencia":
        return "Transferencia";

      default:
        return "No especificado";
    }
  }

  // ========================================
  // INICIALES DEL USUARIO
  // ========================================

  function obtenerIniciales(
    nombreUsuario: string
  ) {
    const palabras = nombreUsuario
      .trim()
      .split(/\s+/);

    if (palabras.length === 1) {
      return palabras[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      palabras[0].charAt(0) +
      palabras[1].charAt(0)
    ).toUpperCase();
  }

  // ========================================
  // CERRAR SESIÓN
  // ========================================

  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href = "/login";
  }

  // ========================================
  // CARGANDO
  // ========================================

  if (cargando) {
    return (
      <main className="perfil-page">
        <section className="perfil-container">
          <div className="perfil-loading">
            <div className="perfil-loading-icon">
              ◌
            </div>

            <h1>Cargando perfil</h1>

            <p>
              Estamos preparando tu información...
            </p>
          </div>
        </section>
      </main>
    );
  }

  // ========================================
  // SIN SESIÓN
  // ========================================

  if (!usuario) {
    return (
      <main className="perfil-page">
        <section className="perfil-container">
          <div className="perfil-empty">
            <div className="perfil-empty-icon">
              👤
            </div>

            <h1>Mi perfil</h1>

            <p>
              {error ||
                "Debes iniciar sesión para consultar tu perfil."}
            </p>

            <Link
              href="/login"
              className="perfil-primary-button"
            >
              Iniciar sesión
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // ========================================
  // PÁGINA
  // ========================================

  return (
    <main className="perfil-page">
      <section className="perfil-container">

        {/* ==================================
            ENCABEZADO
        ================================== */}

        <div className="perfil-header">
          <span className="perfil-header-label">
            CUENTA
          </span>

          <h1>Mi perfil</h1>

          <p>
            Administra tu información y consulta
            tus pedidos en Tienda Teya.
          </p>
        </div>


        {/* ==================================
            TARJETA PRINCIPAL DEL PERFIL
        ================================== */}

        <section className="perfil-card perfil-card-principal">

          <div className="perfil-identidad">

            <div className="perfil-avatar">
              {obtenerIniciales(
                usuario.nombre
              )}
            </div>

            <div className="perfil-identidad-info">

              <h2>
                {usuario.nombre}
              </h2>

              <p>
                {usuario.email}
              </p>

              <span className="perfil-tipo-cuenta">
                {usuario.rol === "admin"
                  ? "Administrador"
                  : "Cliente"}
              </span>

            </div>

          </div>

          <div className="perfil-avatar-info">

            <div>
              <strong>
                Foto de perfil
              </strong>

              <p>
                Puedes agregar una foto
                próximamente.
              </p>
            </div>

            <button
              type="button"
              className="perfil-secondary-button"
              disabled
            >
              Cambiar foto
            </button>

          </div>

        </section>


        {/* ==================================
            INFORMACIÓN DE CUENTA
        ================================== */}

        <section className="perfil-card">

          <div className="perfil-section-title">
            <div className="perfil-section-icon">
              👤
            </div>

            <div>
              <h2>
                Información de la cuenta
              </h2>

              <p>
                Información general de tu cuenta.
              </p>
            </div>
          </div>

          <div className="perfil-info-grid">

            <div className="perfil-info-item">
              <span>
                Tipo de cuenta
              </span>

              <strong>
                {usuario.rol === "admin"
                  ? "Administrador"
                  : "Cliente"}
              </strong>
            </div>

            <div className="perfil-info-item">
              <span>
                ID de usuario
              </span>

              <strong>
                #{usuario.id}
              </strong>
            </div>

            {usuario.created_at && (
              <div className="perfil-info-item">
                <span>
                  Cuenta creada
                </span>

                <strong>
                  {new Date(
                    usuario.created_at
                  ).toLocaleDateString()}
                </strong>
              </div>
            )}

            <div className="perfil-info-item">
              <span>
                Estado
              </span>

              <strong className="perfil-activo">
                ● Activa
              </strong>
            </div>

          </div>

        </section>


        {/* ==================================
            EDITAR PERFIL
        ================================== */}

        <section className="perfil-card">

          <div className="perfil-section-title">
            <div className="perfil-section-icon">
              ✎
            </div>

            <div>
              <h2>
                Información personal
              </h2>

              <p>
                Actualiza tu nombre y correo
                electrónico.
              </p>
            </div>
          </div>

          {error && (
            <div className="perfil-alert perfil-alert-error">
              {error}
            </div>
          )}

          {mensaje && (
            <div className="perfil-alert perfil-alert-success">
              {mensaje}
            </div>
          )}

          <div className="perfil-form-grid">

            <div className="perfil-field">
              <label htmlFor="nombre">
                Nombre completo
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
                disabled={guardando}
                placeholder="Tu nombre"
              />
            </div>

            <div className="perfil-field">
              <label htmlFor="email">
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                disabled={guardando}
                placeholder="correo@ejemplo.com"
              />
            </div>

          </div>

          <div className="perfil-form-actions">

            <button
              type="button"
              className="perfil-primary-button"
              onClick={guardarCambios}
              disabled={guardando}
            >
              {guardando
                ? "Guardando..."
                : "Guardar cambios"}
            </button>

          </div>

        </section>


        {/* ==================================
            SEGURIDAD
        ================================== */}

        <section className="perfil-card">

          <div className="perfil-section-title">
            <div className="perfil-section-icon">
              🔒
            </div>

            <div>
              <h2>
                Seguridad
              </h2>

              <p>
                Mantén protegida tu cuenta.
              </p>
            </div>
          </div>

          {errorPassword && (
            <div className="perfil-alert perfil-alert-error">
              {errorPassword}
            </div>
          )}

          {mensajePassword && (
            <div className="perfil-alert perfil-alert-success">
              {mensajePassword}
            </div>
          )}

          <div className="perfil-password-grid">

            <div className="perfil-field">
              <label htmlFor="passwordActual">
                Contraseña actual
              </label>

              <input
                id="passwordActual"
                type="password"
                value={passwordActual}
                onChange={(event) =>
                  setPasswordActual(
                    event.target.value
                  )
                }
                disabled={
                  cambiandoPassword
                }
                placeholder="Contraseña actual"
              />
            </div>

            <div className="perfil-field">
              <label htmlFor="passwordNueva">
                Nueva contraseña
              </label>

              <input
                id="passwordNueva"
                type="password"
                value={passwordNueva}
                onChange={(event) =>
                  setPasswordNueva(
                    event.target.value
                  )
                }
                disabled={
                  cambiandoPassword
                }
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="perfil-field">
              <label htmlFor="confirmarPassword">
                Confirmar nueva contraseña
              </label>

              <input
                id="confirmarPassword"
                type="password"
                value={confirmarPassword}
                onChange={(event) =>
                  setConfirmarPassword(
                    event.target.value
                  )
                }
                disabled={
                  cambiandoPassword
                }
                placeholder="Repite la nueva contraseña"
              />
            </div>

          </div>

          <div className="perfil-form-actions">

            <button
              type="button"
              className="perfil-primary-button"
              onClick={cambiarPassword}
              disabled={
                cambiandoPassword
              }
            >
              {cambiandoPassword
                ? "Cambiando contraseña..."
                : "Cambiar contraseña"}
            </button>

          </div>

        </section>


        {/* ==================================
            PEDIDOS
        ================================== */}

        <section className="perfil-card">

          <div className="perfil-section-title">
            <div className="perfil-section-icon">
              📦
            </div>

            <div>
              <h2>
                Mis pedidos
              </h2>

              <p>
                Consulta las compras que has
                realizado.
              </p>
            </div>
          </div>

          {cargandoPedidos ? (

            <div className="perfil-pedidos-loading">
              Cargando pedidos...
            </div>

          ) : pedidos.length === 0 ? (

            <div className="perfil-no-pedidos">

              <div className="perfil-no-pedidos-icon">
                🛍️
              </div>

              <h3>
                Todavía no tienes pedidos
              </h3>

              <p>
                Cuando realices una compra,
                aparecerá aquí.
              </p>

              <Link
                href="/catalogo"
                className="perfil-primary-button"
              >
                Explorar catálogo
              </Link>

            </div>

          ) : (

            <div className="perfil-pedidos">

              {pedidos.map((pedido) => (

                <article
                  key={pedido.id}
                  className="perfil-pedido"
                >

                  <div className="perfil-pedido-header">

                    <div>
                      <span>
                        PEDIDO
                      </span>

                      <h3>
                        #{pedido.id}
                      </h3>
                    </div>

                    <span
                      className={obtenerClaseEstado(
                        pedido.estado
                      )}
                    >
                      {obtenerTextoEstado(
                        pedido.estado
                      )}
                    </span>

                  </div>

                  <div className="perfil-pedido-info">

                    <div>
                      <span>
                        Fecha
                      </span>

                      <strong>
                        {new Date(
                          pedido.created_at
                        ).toLocaleDateString()}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Total
                      </span>

                      <strong className="perfil-pedido-total">
                        $
                        {Number(
                          pedido.total
                        ).toFixed(2)}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Método de pago
                      </span>

                      <strong>
                        {obtenerTextoMetodoPago(
                          pedido.metodo_pago
                        )}
                      </strong>
                    </div>

                  </div>

                  <div className="perfil-pedido-footer">

                    <span>
                      {pedido.ciudad},{" "}
                      {pedido.estado_entrega}
                    </span>

                    <Link
                      href={`/pedido-confirmado?id=${pedido.id}`}
                      className="perfil-pedido-link"
                    >
                      Ver pedido →
                    </Link>

                  </div>

                </article>

              ))}

            </div>

          )}

          {pedidos.length > 0 && (
            <div className="perfil-ver-todos">

              <Link
                href="/mis-pedidos"
                className="perfil-secondary-button"
              >
                Ver todos mis pedidos
              </Link>

            </div>
          )}

        </section>


        {/* ==================================
            ACCIONES
        ================================== */}

        <section className="perfil-actions">

          <Link
            href="/catalogo"
            className="perfil-secondary-button"
          >
            ← Volver al catálogo
          </Link>

          {usuario.rol === "admin" && (
            <Link
              href="/admin"
              className="perfil-secondary-button"
            >
              ⚙ Panel administrativo
            </Link>
          )}

          <button
            type="button"
            className="perfil-logout-button"
            onClick={cerrarSesion}
          >
            ↪ Cerrar sesión
          </button>

        </section>

      </section>
    </main>
  );
}