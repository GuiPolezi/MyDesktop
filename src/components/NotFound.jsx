import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-extrabold text-leaf tracking-widest">
        404
      </h1>
      <div className="bg-leaf-deep px-2 text-sm rounded rotate-12 absolute text-white shadow-lg">
        Página não encontrada
      </div>

      <p className="mt-8 text-2xl font-bold text-mist tracking-tight sm:text-3xl">
        Oops! Você se perdeu.
      </p>

      <p className="mt-4 text-fog max-w-md">
        A página que você está procurando não existe, foi removida ou o link está quebrado.
      </p>

      <Link
        to="/"
        className="btn-primary mt-8 px-6 py-3 transition-all hover:-translate-y-1 flex items-center gap-2"
      >
        <span>&larr;</span> Voltar para o Início
      </Link>
    </div>
  );
}