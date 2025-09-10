import Image from "next/image";
import Link from "next/link";

import { ReactNode } from "react";

type CardProps = {
  title: string;
  description?: string;
  href?: string;
  image?: string;
  children?: ReactNode;
};

export default function Card({ title, description, href, image, children }: CardProps) {
  const body = (
    <div className="w-full max-w-md mx-auto rounded-xl p-6 shadow-2xl bg-white/6 backdrop-blur-sm border border-white/6 hover:shadow-lg transition">
      {image && (
        <div className="mb-3 flex items-center justify-center">
          <Image src={image} alt={title} width={64} height={64} className="object-contain dark:invert" />
        </div>
      )}

      <h3 className="text-lg font-semibold mb-1 text-white">{title}</h3>
  {description && <p className="text-sm text-white/80">{description}</p>}
      {children}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline">
        {body}
      </Link>
    );
  }

  return body;
}
