"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
};

type Historia = {
  id: number;
  titulo: string;
  descripcion: string;
  imagen?: string | null;
};

const DURACION_HISTORIA = 5000;

export default function Header() {
  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [menuAbierto, setMenuAbierto] =
    useState(false);

  const [historiaAbierta, setHistoriaAbierta] =
    useState(false);

  const [historias, setHistorias] =
    useState<Historia[]>([]);

  const [historiaActual, setHistoriaActual] =
    useState(0);

  const [cargandoHistorias, setCargandoHistorias] =
    useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const menuRef =
    useRef<HTMLElement | null>(null);

  const toggleRef =
    useRef<HTMLButtonElement | null>(null);

  const temporizadorHistoria =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  // ========================================
  // IDIOMA
  // ========================================

  const partesRuta = pathname.split("/");

  const locale: "es" | "en" =
    partesRuta[1] === "en"
      ? "en"
      : "es";

  // ========================================
  // CARGAR USUARIO
  // ========================================

  useEffect(() => {
    function cargarUsuario() {
      const usuarioGuardado =
        localStorage.getItem("usuario");

      if (!usuarioGuardado) {
        setUsuario(null);
        return;
      }

      try {
        const usuarioParseado =
          JSON.parse(usuarioGuardado);

        setUsuario(usuarioParseado);
      } catch {
        setUsuario(null);
      }
    }

    cargarUsuario();

    window.addEventListener(
      "storage",
      cargarUsuario
    );

    return () => {
      window.removeEventListener(
        "storage",
        cargarUsuario
      );
    };
  }, []);

  // ========================================
  // CLICK FUERA DEL MENÚ
  // ========================================

  useEffect(() => {
    if (!menuAbierto) {
      return;
    }

    function manejarClickFuera(
      event: MouseEvent
    ) {
      const objetivo =
        event.target as Node;

      const menu =
        menuRef.current;

      const boton =
        toggleRef.current;

      if (
        menu &&
        !menu.contains(objetivo) &&
        boton &&
        !boton.contains(objetivo)
      ) {
        setMenuAbierto(false);
      }
    }

    document.addEventListener(
      "mousedown",
      manejarClickFuera
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        manejarClickFuera
      );
    };
  }, [menuAbierto]);

  // ========================================
  // ESC
  // ========================================

  useEffect(() => {
    function manejarEscape(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setMenuAbierto(false);
        cerrarHistoria();
      }
    }

    document.addEventListener(
      "keydown",
      manejarEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        manejarEscape
      );
    };
  }, []);

  // ========================================
  // BLOQUEAR SCROLL
  // ========================================

  useEffect(() => {
    if (historiaAbierta) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [historiaAbierta]);

  // ========================================
  // HISTORIA AUTOMÁTICA
  // ========================================

  useEffect(() => {
    if (
      !historiaAbierta ||
      historias.length <= 1
    ) {
      return;
    }

    if (temporizadorHistoria.current) {
      clearTimeout(
        temporizadorHistoria.current
      );
    }

    temporizadorHistoria.current =
      setTimeout(() => {
        historiaSiguiente();
      }, DURACION_HISTORIA);

    return () => {
      if (temporizadorHistoria.current) {
        clearTimeout(
          temporizadorHistoria.current
        );
      }
    };
  }, [
    historiaAbierta,
    historiaActual,
    historias.length,
  ]);

  // ========================================
  // CERRAR SESIÓN
  // ========================================

  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    setUsuario(null);
    setMenuAbierto(false);

    router.push(`/${locale}`);
    router.refresh();
  }

  // ========================================
  // CERRAR MENÚ
  // ========================================

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  // ========================================
  // CAMBIAR IDIOMA
  // ========================================

  function cambiarIdioma(
    nuevoLocale: "es" | "en"
  ) {
    if (nuevoLocale === locale) {
      return;
    }

    const segmentos =
      pathname
        .split("/")
        .filter(Boolean);

    const rutaSinLocale =
      segmentos.slice(1);

    const nuevaRuta =
      rutaSinLocale.length > 0
        ? `/${nuevoLocale}/${rutaSinLocale.join("/")}`
        : `/${nuevoLocale}`;

    setMenuAbierto(false);

    router.push(nuevaRuta);
  }

  // ========================================
  // ABRIR HISTORIA
  // ========================================

  async function abrirHistoria() {
    setMenuAbierto(false);

    setHistoriaAbierta(true);
    setHistoriaActual(0);
    setCargandoHistorias(true);

    try {
      const respuesta =
        await fetch(
          "http://localhost:4000/api/historias"
        );

      if (!respuesta.ok) {
        throw new Error(
          "Error obteniendo historias"
        );
      }

      const datos: Historia[] =
        await respuesta.json();

      setHistorias(datos);
    } catch (error) {
      console.error(
        "Error cargando historias:",
        error
      );

      setHistorias([]);
    } finally {
      setCargandoHistorias(false);
    }
  }

  // ========================================
  // CERRAR HISTORIA
  // ========================================

  function cerrarHistoria() {
    setHistoriaAbierta(false);

    if (temporizadorHistoria.current) {
      clearTimeout(
        temporizadorHistoria.current
      );
    }
  }

  // ========================================
  // HISTORIA ANTERIOR
  // ========================================

  function historiaAnterior() {
    if (historias.length === 0) {
      return;
    }

    if (temporizadorHistoria.current) {
      clearTimeout(
        temporizadorHistoria.current
      );
    }

    setHistoriaActual((actual) => {
      if (actual === 0) {
        return historias.length - 1;
      }

      return actual - 1;
    });
  }

  // ========================================
  // HISTORIA SIGUIENTE
  // ========================================

  function historiaSiguiente() {
    if (historias.length === 0) {
      return;
    }

    if (temporizadorHistoria.current) {
      clearTimeout(
        temporizadorHistoria.current
      );
    }

    setHistoriaActual((actual) => {
      if (actual === historias.length - 1) {
        cerrarHistoria();
        return actual;
      }

      return actual + 1;
    });
  }

  const historia =
    historias[historiaActual];

  return (
    <>
      <header
        className="header"
        ref={menuRef}
      >

        {/* ==================================
            MARCA
        ================================== */}

        <div className="brand">

          {/* ==================================
              LOGO CON HISTORIA
          ================================== */}

          <button
            type="button"
            className="store-story"
            onClick={abrirHistoria}
            aria-label={
              locale === "es"
                ? "Ver historias de Tienda Teya"
                : "View Tienda Teya stories"
            }
          >
            <span className="store-story-ring">
              <span className="store-story-circle">
                🌿
              </span>
            </span>
          </button>

          {/* ==================================
              NOMBRE
          ================================== */}

          <Link
            href={`/${locale}`}
            className="store-name"
            onClick={cerrarMenu}
          >
            Tienda Teya
          </Link>

        </div>


        {/* ==================================
            MENÚ
        ================================== */}

        <button
          ref={toggleRef}
          type="button"
          className={`menu-toggle ${
            menuAbierto
              ? "menu-toggle-active"
              : ""
          }`}
          onClick={() =>
            setMenuAbierto(
              (estado) => !estado
            )
          }
          aria-label={
            menuAbierto
              ? locale === "es"
                ? "Cerrar menú"
                : "Close menu"
              : locale === "es"
                ? "Abrir menú"
                : "Open menu"
          }
          aria-expanded={menuAbierto}
        >
          <span className="menu-icon">
            {menuAbierto
              ? "✕"
              : "☰"}
          </span>

          <span>
            {locale === "es"
              ? "Menú"
              : "Menu"}
          </span>
        </button>


        {/* ==================================
            MENÚ DESPLEGABLE
        ================================== */}

        {menuAbierto && (
          <nav
            className="menu-dropdown"
            aria-label={
              locale === "es"
                ? "Menú principal"
                : "Main menu"
            }
          >

            <Link
              href={`/${locale}`}
              onClick={cerrarMenu}
            >
              <span className="menu-item-icon">
                ⌂
              </span>

              <span>
                {locale === "es"
                  ? "Inicio"
                  : "Home"}
              </span>
            </Link>


            <Link
              href={`/${locale}/catalogo`}
              onClick={cerrarMenu}
            >
              <span className="menu-item-icon">
                ◈
              </span>

              <span>
                {locale === "es"
                  ? "Catálogo"
                  : "Catalog"}
              </span>
            </Link>


            <Link
              href={`/${locale}/carrito`}
              onClick={cerrarMenu}
            >
              <span className="menu-item-icon">
                🛒
              </span>

              <span>
                {locale === "es"
                  ? "Carrito"
                  : "Cart"}
              </span>
            </Link>


            <Link
              href={`/${locale}/contacto`}
              onClick={cerrarMenu}
            >
              <span className="menu-item-icon">
                ✦
              </span>

              <span>
                {locale === "es"
                  ? "Contacto"
                  : "Contact"}
              </span>
            </Link>


            {/* ==================================
                IDIOMA
            ================================== */}

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
                <span className="menu-item-icon">
                  ◎
                </span>

                <span>
                  {locale === "es"
                    ? "Idioma"
                    : "Language"}
                </span>
              </div>


              <div className="language-options">

                <button
                  type="button"
                  className={
                    locale === "es"
                      ? "language-option language-active"
                      : "language-option"
                  }
                  onClick={() =>
                    cambiarIdioma("es")
                  }
                  aria-pressed={
                    locale === "es"
                  }
                >
                  <span className="language-flag">
                    🇪🇸
                  </span>

                  <span className="language-name">
                    Español
                  </span>

                  {locale === "es" && (
                    <span className="language-check">
                      ✓
                    </span>
                  )}
                </button>


                <button
                  type="button"
                  className={
                    locale === "en"
                      ? "language-option language-active"
                      : "language-option"
                  }
                  onClick={() =>
                    cambiarIdioma("en")
                  }
                  aria-pressed={
                    locale === "en"
                  }
                >
                  <span className="language-flag">
                    🇺🇸
                  </span>

                  <span className="language-name">
                    English
                  </span>

                  {locale === "en" && (
                    <span className="language-check">
                      ✓
                    </span>
                  )}
                </button>

              </div>
            </div>


            {/* ==================================
                NO AUTENTICADO
            ================================== */}

            {!usuario && (
              <Link
                href={`/${locale}/login`}
                onClick={cerrarMenu}
              >
                <span className="menu-item-icon">
                  ◉
                </span>

                <span>
                  {locale === "es"
                    ? "Iniciar sesión"
                    : "Sign in"}
                </span>
              </Link>
            )}


            {/* ==================================
                AUTENTICADO
            ================================== */}

            {usuario && (
              <>

                <Link
                  href={`/${locale}/perfil`}
                  onClick={cerrarMenu}
                >
                  <span className="menu-item-icon">
                    ◉
                  </span>

                  <span>
                    {locale === "es"
                      ? `Hola, ${usuario.nombre}`
                      : `Hello, ${usuario.nombre}`}
                  </span>
                </Link>


                <Link
                  href={`/${locale}/mis-pedidos`}
                  onClick={cerrarMenu}
                >
                  <span className="menu-item-icon">
                    ≡
                  </span>

                  <span>
                    {locale === "es"
                      ? "Mis pedidos"
                      : "My orders"}
                  </span>
                </Link>


                {usuario.rol === "admin" && (
                  <Link
                    href={`/${locale}/admin`}
                    onClick={cerrarMenu}
                  >
                    <span className="menu-item-icon">
                      ⚙
                    </span>

                    <span>
                      {locale === "es"
                        ? "Panel admin"
                        : "Admin panel"}
                    </span>
                  </Link>
                )}


                <button
                  type="button"
                  className="menu-logout"
                  onClick={cerrarSesion}
                >
                  <span className="menu-item-icon">
                    ↪
                  </span>

                  <span>
                    {locale === "es"
                      ? "Cerrar sesión"
                      : "Sign out"}
                  </span>
                </button>

              </>
            )}

          </nav>
        )}

      </header>


      {/* ======================================
          STORY VIEWER
      ====================================== */}

      {historiaAbierta && (
        <div
          className="stories-modal"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              cerrarHistoria();
            }
          }}
        >

          <div className="story-container">

            {/* ==================================
                BARRAS
            ================================== */}

            {historias.length > 0 && (
              <div className="story-progress">

                {historias.map(
                  (item, indice) => (
                    <div
                      key={item.id}
                      className="story-progress-track"
                    >
                      <div
                        className={`story-progress-bar ${
                          indice <
                          historiaActual
                            ? "story-progress-complete"
                            : indice ===
                                historiaActual
                              ? "story-progress-current"
                              : ""
                        }`}
                      />
                    </div>
                  )
                )}

              </div>
            )}


            {/* ==================================
                CABECERA
            ================================== */}

            <div className="story-header">

              <div className="story-store-avatar">
                🌿
              </div>

              <div className="story-store-info">
                <strong>
                  Tienda Teya
                </strong>

                <span>
                  {locale === "es"
                    ? "Historia"
                    : "Story"}
                </span>
              </div>

              <button
                type="button"
                className="story-close"
                onClick={cerrarHistoria}
                aria-label={
                  locale === "es"
                    ? "Cerrar"
                    : "Close"
                }
              >
                ✕
              </button>

            </div>


            {/* ==================================
                CONTENIDO
            ================================== */}

            {cargandoHistorias && (
              <div className="story-loading">

                <div className="story-spinner">
                  ⟳
                </div>

                <span>
                  {locale === "es"
                    ? "Cargando..."
                    : "Loading..."}
                </span>

              </div>
            )}


            {!cargandoHistorias &&
              historias.length === 0 && (
                <div className="story-empty">

                  <div className="story-empty-icon">
                    🌿
                  </div>

                  <h3>
                    {locale === "es"
                      ? "No hay historias"
                      : "No stories"}
                  </h3>

                  <p>
                    {locale === "es"
                      ? "La tienda todavía no tiene historias disponibles."
                      : "The store has no stories available yet."}
                  </p>

                </div>
              )}


            {!cargandoHistorias &&
              historia && (
                <>

                  {/* ==================================
                      IMAGEN
                  ================================== */}

                  {historia.imagen ? (
                    <img
                      src={historia.imagen}
                      alt={historia.titulo}
                      className="story-image"
                    />
                  ) : (
                    <div className="story-image-placeholder">
                      🌿
                    </div>
                  )}


                  {/* ==================================
                      DEGRADADO
                  ================================== */}

                  <div className="story-gradient" />


                  {/* ==================================
                      TEXTO
                  ================================== */}

                  <div className="story-content">

                    <h2>
                      {historia.titulo}
                    </h2>

                    <p>
                      {historia.descripcion}
                    </p>

                  </div>


                  {/* ==================================
                      ZONAS DE NAVEGACIÓN
                  ================================== */}

                  {historias.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="story-touch-left"
                        onClick={
                          historiaAnterior
                        }
                        aria-label={
                          locale === "es"
                            ? "Historia anterior"
                            : "Previous story"
                        }
                      />

                      <button
                        type="button"
                        className="story-touch-right"
                        onClick={
                          historiaSiguiente
                        }
                        aria-label={
                          locale === "es"
                            ? "Historia siguiente"
                            : "Next story"
                        }
                      />
                    </>
                  )}

                </>
              )}

          </div>

        </div>
      )}
    </>
  );
}