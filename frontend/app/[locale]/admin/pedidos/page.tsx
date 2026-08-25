"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Pedido = {
  id: number;
  nombre_cliente: string;
  email_cliente: string | null;
  telefono_cliente: string | null;
  total: number;
  metodo_pago: string | null;
  estado: string;
  created_at: string;
};

export default function AdminPedidos() {
  const params = useParams();
  const router = useRouter();

  const locale =
    params.locale === "en" ? "en" : "es";

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarPedidos();
  }, []);

  async function cargarPedidos() {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch(
        "http://localhost:4000/api/pedidos"
      );

      if (!respuesta.ok) {
        throw new Error(
          locale === "en"
            ? "Could not retrieve orders"
            : "No se pudieron obtener los pedidos"
        );
      }

      const datos = await respuesta.json();

      setPedidos(datos);
    } catch (error) {
      console.error(error);

      setError(
        locale === "en"
          ? "Could not load orders."
          : "No se pudieron cargar los pedidos."
      );
    } finally {
      setCargando(false);
    }
  }

  function obtenerTextoEstado(estado: string) {
    if (locale === "en") {
      switch (estado) {
        case "pendiente":
          return "Pending";

        case "confirmado":
          return "Confirmed";

        case "enviado":
          return "Shipped";

        case "entregado":
          return "Delivered";

        case "cancelado":
          return "Cancelled";

        default:
          return estado;
      }
    }

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

  function obtenerTextoMetodoPago(
    metodoPago: string | null
  ) {
    if (locale === "en") {
      switch (metodoPago) {
        case "efectivo":
          return "Cash";

        case "tarjeta":
          return "Card";

        case "transferencia":
          return "Bank transfer";

        default:
          return "Not specified";
      }
    }

    switch (metodoPago) {
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

  return (
    <main className="admin-page">
      <section className="admin-header">
        <h1>
          {locale === "en"
            ? "Manage orders"
            : "Administrar pedidos"}
        </h1>

        <p>
          {locale === "en"
            ? "View and manage orders placed in the store."
            : "Consulta y administra los pedidos realizados en la tienda."}
        </p>

        <button
          type="button"
          onClick={cargarPedidos}
          disabled={cargando}
        >
          {cargando
            ? locale === "en"
              ? "Updating..."
              : "Actualizando..."
            : locale === "en"
            ? "Refresh orders"
            : "Actualizar pedidos"}
        </button>
      </section>

      {cargando && (
        <p>
          {locale === "en"
            ? "Loading orders..."
            : "Cargando pedidos..."}
        </p>
      )}

      {error && <p>{error}</p>}

      {!cargando && !error && (
        <section className="admin-products">
          {pedidos.length === 0 ? (
            <p>
              {locale === "en"
                ? "There are no registered orders yet."
                : "Todavía no hay pedidos registrados."}
            </p>
          ) : (
            pedidos.map((pedido) => (
              <article
                className="admin-product-card"
                key={pedido.id}
              >
                <h2>
                  {locale === "en"
                    ? `Order #${pedido.id}`
                    : `Pedido #${pedido.id}`}
                </h2>

                <p>
                  <strong>
                    {locale === "en"
                      ? "Customer:"
                      : "Cliente:"}
                  </strong>{" "}
                  {pedido.nombre_cliente}
                </p>

                <p>
                  <strong>
                    {locale === "en"
                      ? "Email:"
                      : "Email:"}
                  </strong>{" "}
                  {pedido.email_cliente ||
                    (locale === "en"
                      ? "Not provided"
                      : "No proporcionado")}
                </p>

                <p>
                  <strong>
                    {locale === "en"
                      ? "Phone:"
                      : "Teléfono:"}
                  </strong>{" "}
                  {pedido.telefono_cliente ||
                    (locale === "en"
                      ? "Not provided"
                      : "No proporcionado")}
                </p>

                <p>
                  <strong>
                    {locale === "en"
                      ? "Total:"
                      : "Total:"}
                  </strong>{" "}
                  $
                  {Number(
                    pedido.total
                  ).toFixed(2)}
                </p>

                <p>
                  <strong>
                    {locale === "en"
                      ? "Payment method:"
                      : "Método de pago:"}
                  </strong>{" "}
                  {obtenerTextoMetodoPago(
                    pedido.metodo_pago
                  )}
                </p>

                <p>
                  <strong>
                    {locale === "en"
                      ? "Status:"
                      : "Estado:"}
                  </strong>{" "}
                  <span>
                    {obtenerTextoEstado(
                      pedido.estado
                    )}
                  </span>
                </p>

                <p>
                  <strong>
                    {locale === "en"
                      ? "Date:"
                      : "Fecha:"}
                  </strong>{" "}
                  {new Date(
                    pedido.created_at
                  ).toLocaleString(
                    locale === "en"
                      ? "en-US"
                      : "es-MX"
                  )}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/${locale}/admin/pedidos/${pedido.id}`
                    )
                  }
                >
                  {locale === "en"
                    ? "View order"
                    : "Ver pedido"}
                </button>
              </article>
            ))
          )}
        </section>
      )}
    </main>
  );
}