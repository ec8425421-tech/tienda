"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Pedido = {
  id: number;
  nombre: string;
  total: number;
};

export default function PedidoConfirmado() {
  const router = useRouter();
  const params = useParams();

  const locale =
    params.locale === "en" ? "en" : "es";

  const [pedido, setPedido] =
    useState<Pedido | null>(null);

  useEffect(() => {
    const datos =
      sessionStorage.getItem(
        "pedidoConfirmado"
      );

    if (datos) {
      try {
        setPedido(JSON.parse(datos));
      } catch (error) {
        console.error(
          "Error leyendo el pedido confirmado:",
          error
        );
      }
    }
  }, []);

  const textos =
    locale === "en"
      ? {
          titulo:
            "Order placed successfully! 🎉",

          gracias: "Thank you for your purchase,",

          numeroPedido: "Order number:",

          total: "Total:",

          procesado:
            "Your order was processed successfully.",

          seguirComprando:
            "Continue shopping",
        }
      : {
          titulo:
            "¡Pedido realizado correctamente! 🎉",

          gracias: "Gracias por tu compra,",

          numeroPedido:
            "Número de pedido:",

          total: "Total:",

          procesado:
            "Tu pedido fue procesado correctamente.",

          seguirComprando:
            "Seguir comprando",
        };

  return (
    <main>
      <section className="cart-empty">
        <h1>{textos.titulo}</h1>

        {pedido ? (
          <>
            <p>
              {textos.gracias}{" "}
              <strong>
                {pedido.nombre}
              </strong>
              .
            </p>

            <p>
              {textos.numeroPedido}{" "}
              <strong>
                #{pedido.id}
              </strong>
            </p>

            <p>
              {textos.total}{" "}
              <strong>
                $
                {Number(
                  pedido.total
                ).toFixed(2)}
              </strong>
            </p>
          </>
        ) : (
          <p>
            {textos.procesado}
          </p>
        )}

        <button
          type="button"
          onClick={() =>
            router.push(
              `/${locale}/catalogo`
            )
          }
        >
          {textos.seguirComprando}
        </button>
      </section>
    </main>
  );
}