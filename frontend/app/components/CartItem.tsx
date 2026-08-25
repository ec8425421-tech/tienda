type CartItemProps = {
  name: string;
  price: number;
  quantity: number;
};

export default function CartItem({
  name,
  price,
  quantity,
}: CartItemProps) {
  return (
    <article className="cart-item">
      <div>
        <h3>{name}</h3>
        <p>Precio: ${price.toFixed(2)}</p>
        <p>Cantidad: {quantity}</p>
      </div>

      <strong>
        ${(price * quantity).toFixed(2)}
      </strong>
    </article>
  );
}