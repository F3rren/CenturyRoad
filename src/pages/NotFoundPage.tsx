import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="text-lg text-muted-foreground">Pagina non trovata</p>
      <Link to="/" className="text-primary hover:underline text-sm">
        Torna alla Dashboard
      </Link>
    </div>
  );
}
