"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Pedido = {
  id: number;
  nombre_cliente: string;
  email_cliente: string | null;
  telefono_cliente: string | null;

  calle: string | null;
  colonia: string | null;
  ciudad: string | null;
  estado_entrega: string | null;
  codigo_postal: string | null;
  referencias: string | null;

  total: number;
  metodo_pago: string | null;
  estado: string;
  created_at: string;
};

type Detalle = {
  id: number;
  producto_id: number;
  nombre_producto: string;
  precio: number;
  cantidad: number;
  subtotal: number;
};

export default function DetallePedido() {
  const params = useParams();
  const router = useRouter();

  const locale =
    params.locale === "en" ? "en" : "es";

  const [pedido, setPedido] =
    useState<Pedido | null>(null);

  const [detalles, setDetalles] =
    useState<Detalle[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const [guardandoEstado, setGuardandoEstado] =
    useState(false);

  useEffect(() => {
    if (params.id) {
      cargarPedido();
    }
  }, [params.id]);

  async function cargarPedido() {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch(
        `http://localhost:4000/api/pedidos/${params.id}`
      );

      if (!respuesta.ok) {
        throw new Error(
          locale === "en"
            ? "Could not retrieve the order"
            : "No se pudo obtener el pedido"
        );
      }

      const datos = await respuesta.json();

      setPedido(datos.pedido);
      setDetalles(datos.detalles);
    } catch (error) {
      console.error(error);

      setError(
        locale === "en"
          ? "Could not load the order."
          : "No se pudo cargar el pedido."
      );
    } finally {
      setCargando(false);
    }
  }

  async function cambiarEstado(
    nuevoEstado: string
  ) {
    if (!pedido) return;

    try {
      setGuardandoEstado(true);

      const respuesta = await fetch(
        `http://localhost:4000/api/pedidos/${pedido.id}/estado`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado: nuevoEstado,
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error ||
            (locale === "en"
              ? "Could not update the status"
              : "No se pudo actualizar el estado")
        );
      }

      setPedido(datos.pedido);

      alert(
        locale === "en"
          ? "Status updated successfully."
          : "Estado actualizado correctamente."
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : locale === "en"
          ? "Could not update the status."
          : "No se pudo actualizar el estado."
      );
    } finally {
      setGuardandoEstado(false);
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

  function obtenerTextoEstado(
    estado: string
  ) {
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

  if (cargando) {
    return (
      <main className="admin-page">
        <p>
          {locale === "en"
            ? "Loading order..."
            : "Cargando pedido..."}
        </p>
      </main>
    );
  }

  if (error || !pedido) {
    return (
      <main className="admin-page">
        <p>
          {error ||
            (locale === "en"
              ? "Order not found."
              : "Pedido no encontrado.")}
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(
              `/${locale}/admin/pedidos`
            )
          }
        >
          {locale === "en"
            ? "Back to orders"
            : "Volver a pedidos"}
        </button>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-header">
        <h1>
          {locale === "en"
            ? `Order #${pedido.id}`
            : `Pedido #${pedido.id}`}
        </h1>

        <p>
          {locale === "en"
            ? "Complete order details."
            : "Detalle completo del pedido."}
        </p>
      </section>

      <section className="admin-form">
        <h2>
          {locale === "en"
            ? "Customer information"
            : "Información del cliente"}
        </h2>

        <p>
          <strong>
            {locale === "en"
              ? "Name:"
              : "Nombre:"}
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
              ? "Payment method:"
              : "Método de pago:"}
          </strong>{" "}
          {obtenerTextoMetodoPago(
            pedido.metodo_pago
          )}
        </p>
      </section>

      <section className="admin-form">
        <h2>
          {locale === "en"
            ? "Delivery address"
            : "Dirección de entrega"}
        </h2>

        <p>
          <strong>
            {locale === "en"
              ? "Street:"
              : "Calle:"}
          </strong>{" "}
          {pedido.calle ||
            (locale === "en"
              ? "Not provided"
              : "No proporcionada")}
        </p>

        <p>
          <strong>
            {locale === "en"
              ? "Neighborhood:"
              : "Colonia:"}
          </strong>{" "}
          {pedido.colonia ||
            (locale === "en"
              ? "Not provided"
              : "No proporcionada")}
        </p>

        <p>
          <strong>
            {locale === "en"
              ? "City:"
              : "Ciudad:"}
          </strong>{" "}
          {pedido.ciudad ||
            (locale === "en"
              ? "Not provided"
              : "No proporcionada")}
        </p>

        <p>
          <strong>
            {locale === "en"
              ? "State:"
              : "Estado:"}
          </strong>{" "}
          {pedido.estado_entrega ||
            (locale === "en"
              ? "Not provided"
              : "No proporcionado")}
        </p>

        <p>
          <strong>
            {locale === "en"
              ? "Postal code:"
              : "Código postal:"}
          </strong>{" "}
          {pedido.codigo_postal ||
            (locale === "en"
              ? "Not provided"
              : "No proporcionado")}
        </p>

        <p>
          <strong>
            {locale === "en"
              ? "References:"
              : "Referencias:"}
          </strong>{" "}
          {pedido.referencias ||
            (locale === "en"
              ? "No references"
              : "Sin referencias")}
        </p>
      </section>

      <section className="admin-form">
        <h2>
          {locale === "en"
            ? "Order status"
            : "Estado del pedido"}
        </h2>

        <p>
          <strong>
            {locale === "en"
              ? "Current status:"
              : "Estado actual:"}
          </strong>{" "}
          {obtenerTextoEstado(
            pedido.estado
          )}
        </p>

        <div>
          <label htmlFor="estado">
            {locale === "en"
              ? "Change status:"
              : "Cambiar estado:"}
          </label>

          <br />

          <select
            id="estado"
            value={pedido.estado}
            disabled={guardandoEstado}
            onChange={(event) =>
              cambiarEstado(
                event.target.value
              )
            }
          >
            <option value="pendiente">
              {locale === "en"
                ? "Pending"
                : "Pendiente"}
            </option>

            <option value="confirmado">
              {locale === "en"
                ? "Confirmed"
                : "Confirmado"}
            </option>

            <option value="enviado">
              {locale === "en"
                ? "Shipped"
                : "Enviado"}
            </option>

            <option value="entregado">
              {locale === "en"
                ? "Delivered"
                : "Entregado"}
            </option>

            <option value="cancelado">
              {locale === "en"
                ? "Cancelled"
                : "Cancelado"}
            </option>
          </select>

          {guardandoEstado && (
            <p>
              {locale === "en"
                ? "Saving status..."
                : "Guardando estado..."}
            </p>
          )}
        </div>

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
      </section>

      <section className="admin-form">
        <h2>
          {locale === "en"
            ? "Order products"
            : "Productos del pedido"}
        </h2>

        {detalles.length === 0 ? (
          <p>
            {locale === "en"
              ? "This order has no products."
              : "Este pedido no tiene productos."}
          </p>
        ) : (
          detalles.map((detalle) => (
            <article
              key={detalle.id}
              className="admin-product-card"
            >
              <h3>
                {detalle.nombre_producto}
              </h3>

              <p>
                <strong>
                  {locale === "en"
                    ? "Price:"
                    : "Precio:"}
                </strong>{" "}
                $
                {Number(
                  detalle.precio
                ).toFixed(2)}
              </p>

              <p>
                <strong>
                  {locale === "en"
                    ? "Quantity:"
                    : "Cantidad:"}
                </strong>{" "}
                {detalle.cantidad}
              </p>

              <p>
                <strong>
                  {locale === "en"
                    ? "Subtotal:"
                    : "Subtotal:"}
                </strong>{" "}
                $
                {Number(
                  detalle.subtotal
                ).toFixed(2)}
              </p>
            </article>
          ))
        )}
      </section>

      <section className="cart-total">
        <h2>
          {locale === "en"
            ? "Order total"
            : "Total del pedido"}
        </h2>

        <p>
          $
          {Number(
            pedido.total
          ).toFixed(2)}
        </p>
      </section>

      <button
        type="button"
        onClick={() =>
          router.push(
            `/${locale}/admin/pedidos`
          )
        }
      >
        {locale === "en"
          ? "Back to orders"
          : "Volver a pedidos"}
      </button>
    </main>
  );
}