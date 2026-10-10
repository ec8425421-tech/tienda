import Link from "next/link";

type CategoryCardProps = {
  name: string;
  href: string;
  icon?: string;
  image?: string;
};

export default function CategoryCard({
  name,
  href,
  icon,
  image,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="category-card"
    >
      <div className="category-icon">
        {image ? (
          <img
            src={image}
            alt={name}
            className="category-image"
          />
        ) : (
          <span>{icon}</span>
        )}
      </div>

      <h3>{name}</h3>

      <p>
        Haz clic para conocer nuestros productos.
      </p>
    </Link>
  );
}