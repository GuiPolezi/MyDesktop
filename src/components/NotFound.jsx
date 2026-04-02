import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#fefae0] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-extrabold text-[#283618] tracking-widest">
        404
      </h1>
      <div className="bg-[#606c38] px-2 text-sm rounded rotate-12 absolute text-white shadow-lg">
        Página não encontrada
      </div>
      
      <p className="mt-8 text-2xl font-bold text-gray-800 tracking-tight sm:text-3xl">
        Oops! Você se perdeu.
      </p>
      
      <p className="mt-4 text-gray-500 max-w-md">
        A página que você está procurando não existe, foi removida ou o link está quebrado.
      </p>
      
      <Link 
        to="/" 
        className="mt-8 px-6 py-3 font-semibold text-white rounded-lg shadow-md transition-all hover:-translate-y-1 hover:shadow-lg flex items-center gap-2"
        style={{ backgroundColor: '#283618' }}
      >
        <span>&larr;</span> Voltar para o Início
      </Link>
    </div>
  );
}