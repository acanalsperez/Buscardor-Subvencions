
import React, { useState, useCallback } from 'react';
import { Subvention } from './types';
import { findSubventions } from './services/geminiService';
import SubventionCard from './components/SubventionCard';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [subventions, setSubventions] = useState<Subvention[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Por favor, introduce un término de búsqueda.');
      return;
    }
    setLoading(true);
    setError(null);
    setSubventions(null);

    try {
      const results = await findSubventions(query);
      setSubventions(results);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      setLoading(false);
    }
  }, [query]);
  
  const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      <header className="bg-white shadow-md w-full">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">
            Explorador de Subvenciones BDNS
          </h1>
          <p className="text-center text-slate-600 mt-1">
            Encuentra ayudas y subvenciones con el poder de la IA
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-lg mb-8">
          <form onSubmit={handleSearch}>
            <label htmlFor="search" className="block text-lg font-semibold mb-2 text-slate-700">
              ¿Qué tipo de subvención buscas?
            </label>
            <div className="relative">
              <textarea
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: 'ayudas para digitalización de pymes', 'subvenciones para energías renovables', 'becas para investigación'..."
                className="w-full p-4 pr-28 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none"
                rows={3}
                disabled={loading}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 flex items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <SearchIcon />
                <span>Buscar</span>
              </button>
            </div>
          </form>
        </div>

        <div className="w-full max-w-5xl">
          {loading && <LoadingSpinner />}
          {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>}
          
          {subventions && subventions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subventions.map((sub, index) => (
                <SubventionCard key={index} subvention={sub} />
              ))}
            </div>
          )}

          {subventions && subventions.length === 0 && !loading && (
             <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-slate-700">No se encontraron resultados</h2>
                <p className="text-slate-500 mt-2">Prueba con otros términos de búsqueda más generales o específicos.</p>
             </div>
          )}

          {!subventions && !loading && !error && (
            <div className="text-center p-8 bg-white/70 rounded-lg backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-slate-700">Comienza tu búsqueda</h2>
                <p className="text-slate-500 mt-2">Introduce los conceptos clave en el campo de arriba para encontrar subvenciones relevantes.</p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="w-full bg-slate-800 text-slate-300 py-4 mt-8">
          <div className="container mx-auto text-center text-sm">
              <p>&copy; {new Date().getFullYear()} Buscador de Subvenciones. Impulsado por IA.</p>
              <p className="text-xs text-slate-400 mt-1">
                Esta es una herramienta de exploración. Verifica siempre la información en las fuentes oficiales de la BDNS.
              </p>
          </div>
      </footer>
    </div>
  );
};

export default App;
