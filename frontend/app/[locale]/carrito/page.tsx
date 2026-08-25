"use client";

import CartItem from "../../components/CartItem";
import { useCart } from "../../context/CartContext";
import { useRouter, useParams } from "next/navigation";

export default function Carrito() {
  const {
    cart,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const router = useRouter();
  const params = useParams();

  const locale =
    params.locale === "en" ? "en" : "es";

  const textos =
    locale === "en"
      ? {
          titulo: "Shopping cart",
          descripcion:
            "These are the products you have selected.",
          vacio: "Your cart is empty",
          vacioDescripcion:
            "Add some products from the catalog.",
          total: "Total",
          continuar: "Continue to checkout",
          eliminar: "Remove",
          catalogo: "Go to catalog",
        }
      : {
          titulo: "Carrito de compras",
          descripcion:
            "Estos son los productos que has seleccionado.",
          vacio: "Tu carrito está vacío",
          vacioDescripcion:
            "Agrega algunos productos desde el catálogo.",
          total: "Total",
          continuar: "Continuar con la compra",
          eliminar: "Eliminar",
          catalogo: "Ir al catálogo",
        };

  return (
    <main>
      <section className="cart-header">
        <h1>{textos.titulo}</h1>

        <p>{textos.descripcion}</p>
      </section>

      {cart.length === 0 ? (
        <section className="cart-empty">
          <h2>{textos.vacio}</h2>

          <p>{textos.vacioDescripcion}</p>

          <button
            type="button"
            onClick={() =>
              router.push(`/${locale}/catalogo`)
            }
          >
            {textos.catalogo}
          </button>
        </section>
      ) : (
        <>
          <section className="cart-list">
            {cart.map((item) => (
              <div key={item.id}>
                <CartItem
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                />

                <div className="cart-actions">
                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                    aria-label={
                      locale === "es"
                        ? "Disminuir cantidad"
                        : "Decrease quantity"
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                    aria-label={
                      locale === "es"
                        ? "Aumentar cantidad"
                        : "Increase quantity"
                    }
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    {textos.eliminar}
                  </button>
                </div>
              </div>
            ))}
          </section>

          <section className="cart-total">
            <h2>{textos.total}</h2>

            <p>${total.toFixed(2)}</p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/${locale}/checkout`
                )
              }
            >
              {textos.continuar}
            </button>
          </section>
        </>
      )}
    </main>
  );
}