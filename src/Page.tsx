import { useEffect, type ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  children: ReactNode;
};

// Met à jour le title et la meta description à chaque changement de route
export default function Page({ title, description, children }: Props) {
  useEffect(() => {
    document.title = title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
  }, [title, description]);

  return <>{children}</>;
}
