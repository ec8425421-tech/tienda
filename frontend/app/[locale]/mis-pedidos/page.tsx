"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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

export default function MisPedidos() {
  const params = useParams();

  const locale =
    params.locale === "en" ? "en" : "es";

  const textos =
    locale === "en"
      ? {
          titulo: "My orders",
          descripcion:
            "View your purchase history.",

          cargando: "Loading your orders...",

          iniciarSesion:
            "You must sign in to view your orders.",

          iniciarSesionBoton:
            "Sign in",

          sinPedidos:
            "You don't have any orders yet.",

          sinPedidosDescripcion:
            "When you make a purchase, it will appear here.",

          verCatalogo:
            "View catalog",

          pedido: "Order",

          fecha: "Date",

          total: "Total",

          metodoPago:
            "Payment method",

          estado: "Status",

          entrega: "Delivery",

          verPedido:
            "View order",

          cancelarPedido:
            "Cancel order",

          cancelando:
            "Cancelling...",

          confirmarCancelacion:
            "Are you sure you want to cancel this order?\n\nThe order will be marked as cancelled and the product stock will be returned.",

          pedidoCancelado:
            "Order cancelled successfully.",

          errorCancelar:
            "Could not cancel the order.",

          errorCargar:
            "Could not load your orders.",

          pendiente: "Pending",

          confirmado: "Confirmed",

          enviado: "Shipped",

          entregado: "Delivered",

          cancelado: "Cancelled",

          efectivo: "Cash",

          tarjeta: "Card",

          transferencia:
            "Bank transfer",

          noEspecificado:
            "Not specified",
        }
      : {
          titulo: "Mis pedidos",
          descripcion:
            "Consulta el historial de tus compras.",

          cargando:
            "Cargando tus pedidos...",

          iniciarSesion:
            "Debes iniciar sesión para ver tus pedidos.",

          iniciarSesionBoton:
            "Iniciar sesión",

          sinPedidos:
            "Todavía no tienes pedidos.",

          sinPedidosDescripcion:
            "Cuando realices una compra, aparecerá aquí.",

          verCatalogo:
            "Ver catálogo",

          pedido: "Pedido",

          fecha: "Fecha",

          total: "Total",

          metodoPago:
            "Método de pago",

          estado: "Estado",

          entrega: "Entrega",

          verPedido:
            "Ver pedido",

          cancelarPedido:
            "Cancelar pedido",

          cancelando:
            "Cancelando...",

          confirmarCancelacion:
            "¿Estás seguro de que quieres cancelar este pedido?\n\nEl pedido se marcará como cancelado y el stock de los productos será devuelto.",

          pedidoCancelado:
            "Pedido cancelado correctamente.",

          errorCancelar:
            "No se pudo cancelar el pedido.",

          errorCargar:
            "No se pudieron cargar tus pedidos.",

          pendiente: "Pendiente",

          confirmado: "Confirmado",

          enviado: "Enviado",

          entregado: "Entregado",

          cancelado: "Cancelado",

          efectivo: "Efectivo",

          tarjeta: "Tarjeta",

          transferencia:
            "Transferencia",

          noEspecificado:
            "No especificado",
        };

  const [pedidos, setPedidos] =
    useState<Pedido[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const [cancelando, setCancelando] =
    useState<number | null>(null);

  useEffect(() => {
    cargarPedidos();
  }, []);

  // ========================================
  // CARGAR PEDIDOS
  // ========================================

  async function cargarPedidos() {
    try {
      setCargando(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          textos.iniciarSesion
        );
        return;
      }

      const respuesta = await fetch(
        "http://localhost:4000/api/pedidos/mis-pedidos",
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
            textos.errorCargar
        );
      }

      setPedidos(datos);
    } catch (error) {
      console.error(
        "Error cargando pedidos:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : textos.errorCargar
      );
    } finally {
      setCargando(false);
    }
  }

  // ========================================
  // CANCELAR PEDIDO
  // ========================================

  async function cancelarPedido(
    id: number
  ) {
    const confirmar =
      window.confirm(
        textos.confirmarCancelacion
      );

    if (!confirmar) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          textos.iniciarSesion
        );
        return;
      }

      setCancelando(id);

      const respuesta = await fetch(
        `http://localhost:4000/api/pedidos/${id}/cancelar`,
        {
          method: "PUT",
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
            textos.errorCancelar
        );
      }

      setPedidos(
        (pedidosActuales) =>
          pedidosActuales.map(
            (pedido) =>
              pedido.id === id
                ? {
                    ...pedido,
                    estado:
                      "cancelado",
                  }
                : pedido
          )
      );

      alert(
        textos.pedidoCancelado
      );
    } catch (error) {
      console.error(
        "Error cancelando pedido:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : textos.errorCancelar
      );
    } finally {
      setCancelando(null);
    }
  }

  // ========================================
  // TEXTO ESTADO
  // ========================================

  function obtenerTextoEstado(
    estado: string
  ) {
    switch (estado) {
      case "pendiente":
        return textos.pendiente;

      case "confirmado":
        return textos.confirmado;

      case "enviado":
        return textos.enviado;

      case "entregado":
        return textos.entregado;

      case "cancelado":
        return textos.cancelado;

      default:
        return estado;
    }
  }

  // ========================================
  // TEXTO MÉTODO DE PAGO
  // ========================================

  function obtenerTextoMetodoPago(
    metodo: string | null
  ) {
    switch (metodo) {
      case "efectivo":
        return textos.efectivo;

      case "tarjeta":
        return textos.tarjeta;

      case "transferencia":
        return textos.transferencia;

      default:
        return textos.noEspecificado;
    }
  }

  // ========================================
  // CARGANDO
  // ========================================

  if (cargando) {
    return (
      <main className="admin-page">
        <section className="admin-header">
          <h1>
            {textos.titulo}
          </h1>

          <p>
            {textos.cargando}
          </p>
        </section>
      </main>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <main className="admin-page">
        <section className="admin-header">
          <h1>
            {textos.titulo}
          </h1>

          <p>{error}</p>

          <Link
            href={`/${locale}/login`}
          >
            {textos.iniciarSesionBoton}
          </Link>
        </section>
      </main>
    );
  }

  // ========================================
  // PANTALLA
  // ========================================

  return (
    <main className="admin-page">
      <section className="admin-header">
        <h1>
          {textos.titulo}
        </h1>

        <p>
          {textos.descripcion}
        </p>
      </section>

      {pedidos.length === 0 ? (
        <section className="admin-form">
          <h2>
            {textos.sinPedidos}
          </h2>

          <p>
            {textos.sinPedidosDescripcion}
          </p>

          <Link
            href={`/${locale}/catalogo`}
          >
            {textos.verCatalogo}
          </Link>
        </section>
      ) : (
        <section>
          {pedidos.map((pedido) => (
            <article
              key={pedido.id}
              className="admin-form"
            >
              <h2>
                {textos.pedido} #
                {pedido.id}
              </h2>

              <p>
                <strong>
                  {textos.fecha}:
                </strong>{" "}
                {new Date(
                  pedido.created_at
                ).toLocaleString(
                  locale === "en"
                    ? "en-US"
                    : "es-MX"
                )}
              </p>

              <p>
                <strong>
                  {textos.total}:
                </strong>{" "}
                $
                {Number(
                  pedido.total
                ).toFixed(2)}
              </p>

              <p>
                <strong>
                  {textos.metodoPago}:
                </strong>{" "}
                {obtenerTextoMetodoPago(
                  pedido.metodo_pago
                )}
              </p>

              <p>
                <strong>
                  {textos.estado}:
                </strong>{" "}
                {obtenerTextoEstado(
                  pedido.estado
                )}
              </p>

              <p>
                <strong>
                  {textos.entrega}:
                </strong>{" "}
                {pedido.calle},{" "}
                {pedido.colonia},{" "}
                {pedido.ciudad},{" "}
                {pedido.estado_entrega}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "15px",
                }}
              >
                <Link
                  href={`/${locale}/pedido-confirmado?id=${pedido.id}`}
                >
                  {textos.verPedido}
                </Link>

                {(pedido.estado ===
                  "pendiente" ||
                  pedido.estado ===
                    "confirmado") && (
                  <button
                    type="button"
                    onClick={() =>
                      cancelarPedido(
                        pedido.id
                      )
                    }
                    disabled={
                      cancelando ===
                      pedido.id
                    }
                  >
                    {cancelando ===
                    pedido.id
                      ? textos.cancelando
                      : textos.cancelarPedido}
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}