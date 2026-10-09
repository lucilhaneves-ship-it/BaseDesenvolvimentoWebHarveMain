// components/ClienteForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Cliente {
  id: number;
  nome: string | null;
  telefone: string | null;
  email: string | null;
  cidade: string | null;
  status: string | null;
  observacoes: string | null;
  criado_em?: string;
}

interface ClienteFormProps {
  clienteEditando?: Cliente | null;
  onSuccess?: () => void;
  onCancelEdit?: () => void;
}

export default function ClienteForm({
  clienteEditando,
  onSuccess,
  onCancelEdit,
}: ClienteFormProps) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cidade, setCidade] = useState('');
  const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo');
  const [observacoes, setObservacoes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (clienteEditando) {
      setNome(clienteEditando.nome || '');
      setTelefone(clienteEditando.telefone || '');
      setEmail(clienteEditando.email || '');
      setCidade(clienteEditando.cidade || '');
      setStatus((clienteEditando.status as 'ativo' | 'inativo') || 'ativo');
      setObservacoes(clienteEditando.observacoes || '');
      setErrorMessage(null);
      setSuccessMessage(null);
    } else {
      resetForm();
    }
  }, [clienteEditando]);

  const resetForm = () => {
    setNome('');
    setTelefone('');
    setEmail('');
    setCidade('');
    setStatus('ativo');
    setObservacoes('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!nome.trim()) {
      setErrorMessage('O campo nome é obrigatório.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        nome: nome.trim(),
        telefone: telefone.trim() || null,
        email: email.trim() || null,
        cidade: cidade.trim() || null,
        status,
        observacoes: observacoes.trim() || null,
      };

      if (clienteEditando) {
        const { error } = await supabase
          .from('clientes')
          .update(payload)
          .eq('id', clienteEditando.id);

        if (error) throw error;
        setSuccessMessage('Cliente atualizado com sucesso!');
      } else {
        const { error } = await supabase.from('clientes').insert([payload]);

        if (error) throw error;
        setSuccessMessage('Cliente cadastrado com sucesso!');
      }

      resetForm();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao salvar o cliente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-xl font-bold text-gray-800">
          {clienteEditando ? 'Editar Cliente' : 'Cadastrar Cliente'}
        </h2>
        {clienteEditando && (
          <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2.5 py-0.5 rounded-full">
            Editando ID #{clienteEditando.id}
          </span>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm font-medium">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded text-sm font-medium">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
            Nome *
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Nome do cliente"
          />
        </div>

        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefone
          </label>
          <input
            id="telefone"
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="email@exemplo.com"
          />
        </div>

        <div>
          <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
            Cidade
          </label>
          <input
            id="cidade"
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Cidade"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'ativo' | 'inativo')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">
            Observações
          </label>
          <textarea
            id="observacoes"
            rows={3}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Observações adicionais..."
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end gap-3">
        {clienteEditando && (
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Cancelar Edição
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Salvando...' : clienteEditando ? 'Atualizar' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}