"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createServico, type ServicoState } from "./actions";
import { uploadToCloudinary } from "@/lib/cloudinary";

const initialState: ServicoState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-[12px] bg-ouro px-4 py-2 font-bold uppercase tracking-wide text-tinta disabled:opacity-60"
    >
      {pending ? "Salvando..." : "Adicionar serviço"}
    </button>
  );
}

export default function ServicoForm() {
  const [state, formAction] = useFormState(createServico, initialState);
  const [precoReais, setPrecoReais] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      setFotoUrl(await uploadToCloudinary(file));
    } catch {
      setUploadError("Falha ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  }

  const precoCentavos = precoReais
    ? Math.round(parseFloat(precoReais) * 100)
    : "";

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-[12px] border border-cromo bg-fundo p-4"
    >
      <input type="hidden" name="fotoUrl" value={fotoUrl} />
      <input type="hidden" name="precoCentavos" value={precoCentavos} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">
            Nome
          </label>
          <input
            name="nome"
            required
            className="w-full rounded-[12px] border border-cromo px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">
            Preço (R$)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={precoReais}
            onChange={(e) => setPrecoReais(e.target.value)}
            className="w-full rounded-[12px] border border-cromo px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">
            Duração (minutos)
          </label>
          <input
            name="duracaoMinutos"
            type="number"
            min="1"
            required
            className="w-full rounded-[12px] border border-cromo px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">
            Foto
          </label>
          <input type="file" accept="image/*" onChange={handleFile} />
          {uploading && <p className="text-xs text-tinta/60">Enviando...</p>}
          {uploadError && <p className="text-xs text-vermelho">{uploadError}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-tinta">
          Descrição
        </label>
        <textarea
          name="descricao"
          rows={2}
          className="w-full rounded-[12px] border border-cromo px-3 py-2"
        />
      </div>

      {state.error && (
        <p className="text-sm text-vermelho" role="alert">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
