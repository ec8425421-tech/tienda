import Link from "next/link";

type CategoryCardProps = {
  name: string;
  icon: string;
  href: string;
};

export default function CategoryCard({
  name,
  icon,
  href,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="category-card"
    >
      <div className="category-icon">
        {icon}
      </div>

      <h3>{name}</h3>

      <p>
        Haz clic para conocer nuestros productos.
      </p>
    </Link>
  );
}