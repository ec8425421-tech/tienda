"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const params = useParams();

  const locale =
    params.locale === "en" ? "en" : "es";

  const [modo, setModo] =
    useState<"login" | "registro">("login");

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] =
    useState("");

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function iniciarSesion(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMensaje("");

    if (!email.trim()) {
      setError(
        locale === "es"
          ? "Escribe tu correo electrónico."
          : "Enter your email address."
      );
      return;
    }

    if (!password) {
      setError(
        locale === "es"
          ? "Escribe tu contraseña."
          : "Enter your password."
      );
      return;
    }

    try {
      setCargando(true);

      const respuesta = await fetch(
        "http://localhost:4000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
            (locale === "es"
              ? "No se pudo iniciar sesión."
              : "Could not log in.")
        );
      }

      localStorage.setItem(
        "token",
        datos.token
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(datos.usuario)
      );

      if (datos.usuario.rol === "admin") {
        router.push(`/${locale}/admin`);
      } else {
        router.push(`/${locale}`);
      }
    } catch (error) {
      console.error(
        "Error iniciando sesión:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : locale === "es"
          ? "No se pudo iniciar sesión."
          : "Could not log in."
      );
    } finally {
      setCargando(false);
    }
  }

  async function registrarUsuario(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMensaje("");

    if (!nombre.trim()) {
      setError(
        locale === "es"
          ? "Escribe tu nombre."
          : "Enter your name."
      );
      return;
    }

    if (!email.trim()) {
      setError(
        locale === "es"
          ? "Escribe tu correo electrónico."
          : "Enter your email address."
      );
      return;
    }

    if (!password) {
      setError(
        locale === "es"
          ? "Escribe una contraseña."
          : "Enter a password."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        locale === "es"
          ? "La contraseña debe tener al menos 6 caracteres."
          : "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmarPassword) {
      setError(
        locale === "es"
          ? "Las contraseñas no coinciden."
          : "Passwords do not match."
      );
      return;
    }

    try {
      setCargando(true);

      const respuesta = await fetch(
        "http://localhost:4000/api/auth/registro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            email,
            password,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
            (locale === "es"
              ? "No se pudo crear la cuenta."
              : "Could not create the account.")
        );
      }

      localStorage.setItem(
        "token",
        datos.token
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(datos.usuario)
      );

      setMensaje(
        locale === "es"
          ? "Cuenta creada correctamente."
          : "Account created successfully."
      );

      router.push(`/${locale}`);
    } catch (error) {
      console.error(
        "Error registrando usuario:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : locale === "es"
          ? "No se pudo crear la cuenta."
          : "Could not create the account."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-header">
        <h1>
          {modo === "login"
            ? locale === "es"
              ? "Iniciar sesión"
              : "Log in"
            : locale === "es"
            ? "Crear cuenta"
            : "Create account"}
        </h1>

        <p>
          {modo === "login"
            ? locale === "es"
              ? "Accede a tu cuenta de la tienda."
              : "Access your store account."
            : locale === "es"
            ? "Crea tu cuenta para comprar y consultar tus pedidos."
            : "Create your account to shop and view your orders."}
        </p>
      </section>

      <section className="admin-form">
        {modo === "login" ? (
          <form onSubmit={iniciarSesion}>
            <div>
              <label htmlFor="email">
                {locale === "es"
                  ? "Correo electrónico"
                  : "Email"}
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="correo@ejemplo.com"
                disabled={cargando}
              />
            </div>

            <div>
              <label htmlFor="password">
                {locale === "es"
                  ? "Contraseña"
                  : "Password"}
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder={
                  locale === "es"
                    ? "Tu contraseña"
                    : "Your password"
                }
                disabled={cargando}
              />
            </div>

            {error && <p>{error}</p>}

            {mensaje && <p>{mensaje}</p>}

            <button
              type="submit"
              disabled={cargando}
            >
              {cargando
                ? locale === "es"
                  ? "Iniciando sesión..."
                  : "Logging in..."
                : locale === "es"
                ? "Iniciar sesión"
                : "Log in"}
            </button>

            <p>
              {locale === "es"
                ? "¿No tienes una cuenta?"
                : "Don't have an account?"}
            </p>

            <button
              type="button"
              onClick={() => {
                setModo("registro");
                setError("");
                setMensaje("");
              }}
              disabled={cargando}
            >
              {locale === "es"
                ? "Crear una cuenta"
                : "Create an account"}
            </button>
          </form>
        ) : (
          <form onSubmit={registrarUsuario}>
            <div>
              <label htmlFor="nombre">
                {locale === "es"
                  ? "Nombre"
                  : "Name"}
              </label>

              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(event) =>
                  setNombre(event.target.value)
                }
                placeholder={
                  locale === "es"
                    ? "Tu nombre"
                    : "Your name"
                }
                disabled={cargando}
              />
            </div>

            <div>
              <label htmlFor="email">
                {locale === "es"
                  ? "Correo electrónico"
                  : "Email"}
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="correo@ejemplo.com"
                disabled={cargando}
              />
            </div>

            <div>
              <label htmlFor="password">
                {locale === "es"
                  ? "Contraseña"
                  : "Password"}
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder={
                  locale === "es"
                    ? "Mínimo 6 caracteres"
                    : "Minimum 6 characters"
                }
                disabled={cargando}
              />
            </div>

            <div>
              <label htmlFor="confirmarPassword">
                {locale === "es"
                  ? "Confirmar contraseña"
                  : "Confirm password"}
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
                placeholder={
                  locale === "es"
                    ? "Repite tu contraseña"
                    : "Repeat your password"
                }
                disabled={cargando}
              />
            </div>

            {error && <p>{error}</p>}

            {mensaje && <p>{mensaje}</p>}

            <button
              type="submit"
              disabled={cargando}
            >
              {cargando
                ? locale === "es"
                  ? "Creando cuenta..."
                  : "Creating account..."
                : locale === "es"
                ? "Crear cuenta"
                : "Create account"}
            </button>

            <p>
              {locale === "es"
                ? "¿Ya tienes una cuenta?"
                : "Already have an account?"}
            </p>

            <button
              type="button"
              onClick={() => {
                setModo("login");
                setError("");
                setMensaje("");
              }}
              disabled={cargando}
            >
              {locale === "es"
                ? "Iniciar sesión"
                : "Log in"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}