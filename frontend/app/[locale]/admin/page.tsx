"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const params = useParams();

  const locale =
    params.locale === "en" ? "en" : "es";

  const textos =
    locale === "en"
      ? {
          titulo: "Administration Panel",
          descripcion:
            "From here you can manage the store.",
          productos: "Products",
          productosDesc:
            "Add, edit and manage products.",
          administrarProductos:
            "Manage products",
          categorias: "Categories",
          categoriasDesc:
            "Manage the store categories.",
          administrarCategorias:
            "Manage categories",
          inventario: "Inventory",
          inventarioDesc:
            "Check and control product stock.",
          verInventario: "View inventory",
          pedidos: "Orders",
          pedidosDesc:
            "View and manage orders.",
          administrarPedidos:
            "Manage orders",
          login: "Login",
          inicio: "Home",
        }
      : {
          titulo: "Panel de Administración",
          descripcion:
            "Desde aquí podremos administrar la tienda.",
          productos: "Productos",
          productosDesc:
            "Agregar, editar y administrar productos.",
          administrarProductos:
            "Administrar productos",
          categorias: "Categorías",
          categoriasDesc:
            "Administrar las categorías de la tienda.",
          administrarCategorias:
            "Administrar categorías",
          inventario: "Inventario",
          inventarioDesc:
            "Consultar y controlar las existencias.",
          verInventario: "Ver inventario",
          pedidos: "Pedidos",
          pedidosDesc:
            "Consultar y administrar los pedidos.",
          administrarPedidos:
            "Administrar pedidos",
          login: "Iniciar sesión",
          inicio: "Inicio",
        };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioGuardado =
      localStorage.getItem("usuario");

    if (!token || !usuarioGuardado) {
      router.replace(`/${locale}/login`);
      return;
    }

    try {
      const usuario =
        JSON.parse(usuarioGuardado);

      if (usuario.rol !== "admin") {
        router.replace(`/${locale}`);
      }
    } catch (error) {
      console.error(
        "Error leyendo usuario:",
        error
      );

      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      router.replace(`/${locale}/login`);
    }
  }, [router, locale]);

  return (
    <main className="admin-page">
      <section className="admin-header">
        <h1>{textos.titulo}</h1>

        <p>{textos.descripcion}</p>
      </section>

      <section className="admin-grid">

        {/* PRODUCTOS */}
        <article className="admin-card">
          <h2>{textos.productos}</h2>

          <p>{textos.productosDesc}</p>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/${locale}/admin/productos`
              )
            }
          >
            {textos.administrarProductos}
          </button>
        </article>

        {/* CATEGORÍAS */}
        <article className="admin-card">
          <h2>{textos.categorias}</h2>

          <p>{textos.categoriasDesc}</p>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/${locale}/admin/categorias`
              )
            }
          >
            {textos.administrarCategorias}
          </button>
        </article>

        {/* INVENTARIO */}
        <article className="admin-card">
          <h2>{textos.inventario}</h2>

          <p>{textos.inventarioDesc}</p>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/${locale}/admin/inventario`
              )
            }
          >
            {textos.verInventario}
          </button>
        </article>

        {/* PEDIDOS */}
        <article className="admin-card">
          <h2>{textos.pedidos}</h2>

          <p>{textos.pedidosDesc}</p>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/${locale}/admin/pedidos`
              )
            }
          >
            {textos.administrarPedidos}
          </button>
        </article>

      </section>
    </main>
  );
}