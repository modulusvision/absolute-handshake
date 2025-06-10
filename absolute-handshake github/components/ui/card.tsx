import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return <div className="bg-white shadow rounded p-4">{children}</div>;
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
