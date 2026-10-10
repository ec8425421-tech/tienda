
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Historias from "./Historias";

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
};

export default function Header() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [historiaAbierta, setHistoriaAbierta] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const menuRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  // Idioma actual
  const partesRuta = pathname.split("/");

  const locale: "es" | "en" =
    partesRuta[1] === "en" ? "en" : "es";

  // Cargar usuario
  useEffect(() => {
    function cargarUsuario() {
      const usuarioGuardado = localStorage.getItem("usuario");

      if (!usuarioGuardado) {
        setUsuario(null);
        return;
      }

      try {
        setUsuario(JSON.parse(usuarioGuardado) as Usuario);
      } catch {
        setUsuario(null);
      }
    }

    cargarUsuario();

    window.addEventListener("storage", cargarUsuario);

    return () => {
      window.removeEventListener("storage", cargarUsuario);
    };
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    if (!menuAbierto) return;

    function manejarClickFuera(event: MouseEvent) {
      const objetivo = event.target as Node;

      if (
        menuRef.current &&
        !menuRef.current.contains(objetivo) &&
        toggleRef.current &&
        !toggleRef.current.contains(objetivo)
      ) {
        setMenuAbierto(false);
      }
    }

    document.addEventListener("mousedown", manejarClickFuera);

    return () => {
      document.removeEventListener("mousedown", manejarClickFuera);
    };
  }, [menuAbierto]);

  // Cerrar menú e historias con Escape
  useEffect(() => {
    function manejarEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuAbierto(false);
        setHistoriaAbierta(false);
      }
    }

    document.addEventListener("keydown", manejarEscape);

    return () => {
      document.removeEventListener("keydown", manejarEscape);
    };
  }, []);

  // Cerrar sesión
  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    setUsuario(null);
    setMenuAbierto(false);

    router.push(`/${locale}`);
    router.refresh();
  }

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  // Cambiar idioma conservando la ruta
  function cambiarIdioma(nuevoLocale: "es" | "en") {
    if (nuevoLocale === locale) return;

    const segmentos = pathname.split("/").filter(Boolean);
    const rutaSinLocale = segmentos.slice(1);

    const nuevaRuta =
      rutaSinLocale.length > 0
        ? `/${nuevoLocale}/${rutaSinLocale.join("/")}`
        : `/${nuevoLocale}`;

    setMenuAbierto(false);
    router.push(nuevaRuta);
  }

  // Abrir el visor de historias
  function abrirHistoria() {
    setMenuAbierto(false);
    setHistoriaAbierta(true);
  }

  function cerrarHistoria() {
    setHistoriaAbierta(false);
  }

  return (
    <>
      <header className="header" ref={menuRef}>
        {/* Marca de la tienda */}
        <div className="brand">
          <button
            type="button"
            className="store-story"
            onClick={abrirHistoria}
            aria-label={
              locale === "es"
                ? "Ver historias de Riqueza Local"
                : "View Riqueza Local stories"
            }
          >
            <span className="store-story-ring">
              <span className="store-story-circle">🌿</span>
            </span>
          </button>

          <Link
            href={`/${locale}`}
            className="store-name"
            onClick={cerrarMenu}
          >
            Riqueza Local
          </Link>
        </div>

        {/* Botón del menú */}
        <button
          ref={toggleRef}
          type="button"
          className={`menu-toggle ${
            menuAbierto ? "menu-toggle-active" : ""
          }`}
          onClick={() => setMenuAbierto((estado) => !estado)}
          aria-label={
            menuAbierto
              ? locale === "es" ? "Cerrar menú" : "Close menu"
              : locale === "es" ? "Abrir menú" : "Open menu"
          }
          aria-expanded={menuAbierto}
        >
          <span className="menu-icon">
            {menuAbierto ? "✕" : "☰"}
          </span>

          <span>{locale === "es" ? "Menú" : "Menu"}</span>
        </button>

        {/* Menú desplegable */}
        {menuAbierto && (
          <nav
            className="menu-dropdown"
            aria-label={
              locale === "es" ? "Menú principal" : "Main menu"
            }
          >
            <Link href={`/${locale}`} onClick={cerrarMenu}>
              <span className="menu-item-icon">⌂</span>
              <span>{locale === "es" ? "Inicio" : "Home"}</span>
            </Link>

            <Link href={`/${locale}/carrito`} onClick={cerrarMenu}>
              <span className="menu-item-icon">🛒</span>
              <span>{locale === "es" ? "Carrito" : "Cart"}</span>
            </Link>

            <Link href={`/${locale}/contacto`} onClick={cerrarMenu}>
              <span className="menu-item-icon">✦</span>
              <span>{locale === "es" ? "Contacto" : "Contact"}</span>
            </Link>

            {/* Selector de idioma */}
            <div
              className="language-selector"
              role="group"
              aria-label={
                locale === "es"
                  ? "Seleccionar idioma"
                  : "Select language"
              }
            >
              <div className="language-title">
                <span className="menu-item-icon">◎</span>
                <span>{locale === "es" ? "Idioma" : "Language"}</span>
              </div>

              <div className="language-options">
                <button
                  type="button"
                  className={
                    locale === "es"
                      ? "language-option language-active"
                      : "language-option"
                  }
                  onClick={() => cambiarIdioma("es")}
                  aria-pressed={locale === "es"}
                >
                  <span className="language-flag">🇪🇸</span>
                  <span className="language-name">Español</span>
                  {locale === "es" && (
                    <span className="language-check">✓</span>
                  )}
                </button>

                <button
                  type="button"
                  className={
                    locale === "en"
                      ? "language-option language-active"
                      : "language-option"
                  }
                  onClick={() => cambiarIdioma("en")}
                  aria-pressed={locale === "en"}
                >
                  <span className="language-flag">🇺🇸</span>
                  <span className="language-name">English</span>
                  {locale === "en" && (
                    <span className="language-check">✓</span>
                  )}
                </button>
              </div>
            </div>

            {/* Usuario no autenticado */}
            {!usuario && (
              <Link href={`/${locale}/login`} onClick={cerrarMenu}>
                <span className="menu-item-icon">◉</span>
                <span>{locale === "es" ? "Iniciar sesión" : "Sign in"}</span>
              </Link>
            )}

            {/* Usuario autenticado */}
            {usuario && (
              <>
                <Link href={`/${locale}/perfil`} onClick={cerrarMenu}>
                  <span className="menu-item-icon">◉</span>
                  <span>
                    {locale === "es"
                      ? `Hola, ${usuario.nombre}`
                      : `Hello, ${usuario.nombre}`}
                  </span>
                </Link>

                <Link href={`/${locale}/mis-pedidos`} onClick={cerrarMenu}>
                  <span className="menu-item-icon">≡</span>
                  <span>
                    {locale === "es" ? "Mis pedidos" : "My orders"}
                  </span>
                </Link>

                {usuario.rol === "admin" && (
                  <Link href={`/${locale}/admin`} onClick={cerrarMenu}>
                    <span className="menu-item-icon">⚙</span>
                    <span>
                      {locale === "es" ? "Panel admin" : "Admin panel"}
                    </span>
                  </Link>
                )}

                <button
                  type="button"
                  className="menu-logout"
                  onClick={cerrarSesion}
                >
                  <span className="menu-item-icon">↪</span>
                  <span>
                    {locale === "es" ? "Cerrar sesión" : "Sign out"}
                  </span>
                </button>
              </>
            )}
          </nav>
        )}
      </header>

      {/* El visor solo aparece al pulsar el logo */}
      <Historias
        abierto={historiaAbierta}
        onCerrar={cerrarHistoria}
      />
    </>
  );
}