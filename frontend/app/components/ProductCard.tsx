"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "../context/CartContext";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string | null;
  category?: string | null;
  stock?: number;
};

export default function ProductCard({
  id,
  name,
  price,
  description,
  image,
  category,
  stock,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const params = useParams();

  const locale =
    params.locale === "en" ? "en" : "es";

  const sinStock =
    stock !== undefined && stock <= 0;

  function agregarProducto(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (sinStock) {
      return;
    }

    addToCart({
      id,
      name,
      price,
    });
  }

  const textoStock =
    locale === "en"
      ? "Stock"
      : "Stock";

  const textoAgotado =
    locale === "en"
      ? "Out of stock"
      : "Agotado";

  const textoAgregar =
    locale === "en"
      ? "Add to cart"
      : "Agregar al carrito";

  return (
    <article className="product-card">
      <Link
        href={`/${locale}/catalogo/${id}`}
        className="product-card-link"
      >
        <div className="product-image">
          {image ? (
            <img
              src={image}
              alt={name}
            />
          ) : (
            <span>🌱</span>
          )}
        </div>

        <div className="product-info">
          {category && (
            <p>{category}</p>
          )}

          <h3>{name}</h3>

          {description && (
            <p>{description}</p>
          )}

          <p>
            ${Number(price).toFixed(2)}
          </p>

          {stock !== undefined && (
            <p>
              {stock > 0
                ? `${textoStock}: ${stock}`
                : textoAgotado}
            </p>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={agregarProducto}
        disabled={sinStock}
      >
        {sinStock
          ? textoAgotado
          : textoAgregar}
      </button>
    </article>
  );
}