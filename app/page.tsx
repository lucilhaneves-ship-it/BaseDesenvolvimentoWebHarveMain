// app/page.tsx
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import ClienteForm, { Cliente } from '@/components/ClienteForm';

export default function Page() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) {
        throw error;
      }

      setClientes(data || []);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar os clientes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const filteredClientes = useMemo(() => {
    if (!searchTerm.trim()) return clientes;
    const term = searchTerm.toLowerCase();
    return clientes.filter((cliente) =>
      cliente.nome ? cliente.nome.toLowerCase().includes(term) : false
    );
  }, [clientes, searchTerm]);

  const handleSelectCliente = (cliente: Cliente) => {
    setClienteEditando(cliente);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccess = () => {
    setClienteEditando(null);
    fetchClientes();
  };

  const handleCancelEdit = () => {
    setClienteEditando(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Clientes</h1>
          <p className="text-gray-600 mt-1">
            Cadastre, edite e visualize seus clientes cadastrados.
          </p>
        </div>

        <ClienteForm
          clienteEditando={clienteEditando}
          onSuccess={handleSuccess}
          onCancelEdit={handleCancelEdit}
        />

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Lista de Clientes</h2>
              <p className="text-xs text-gray-500">Clique em uma linha para editar os dados.</p>
            </div>
            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
              />
            </div>
          </div>

          {loading ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500 font-medium">Carregando clientes...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
              <p className="text-red-500 font-medium">Erro: {error}</p>
            </div>
          ) : clientes.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500">Nenhum cliente cadastrado ainda.</p>
            </div>
          ) : filteredClientes.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500">Nenhum cliente encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Nome</th>
                    <th className="py-3 px-4">Telefone</th>
                    <th className="py-3 px-4">Cidade</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                  {filteredClientes.map((cliente) => {
                    const isSelected = clienteEditando?.id === cliente.id;
                    return (
                      <tr
                        key={cliente.id}
                        onClick={() => handleSelectCliente(cliente)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {cliente.nome || '-'}
                        </td>
                        <td className="py-3 px-4">{cliente.telefone || '-'}</td>
                        <td className="py-3 px-4">{cliente.cidade || '-'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              cliente.status === 'ativo'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {cliente.status || 'Pendente'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}