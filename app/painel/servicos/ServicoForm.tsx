"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Plus } from "lucide-react";
import { createServico, type ServicoState } from "./actions";
import { uploadToCloudinary } from "@/lib/cloudinary";

const initialState: ServicoState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary">
      <Plus size={18} strokeWidth={2} aria-hidden />
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
      className="flex flex-col gap-4 rounded border border-cromo bg-branco p-6"
    >
      <input type="hidden" name="fotoUrl" value={fotoUrl} />
      <input type="hidden" name="precoCentavos" value={precoCentavos} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-tinta">
            Nome
          </label>
          <input name="nome" required className="w-full" />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-tinta">
            Preço (R$)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={precoReais}
            onChange={(e) => setPrecoReais(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-tinta">
            Duração (minutos)
          </label>
          <input
            name="duracaoMinutos"
            type="number"
            min="1"
            required
            className="w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-tinta">
            Foto
          </label>
          <input type="file" accept="image/*" onChange={handleFile} />
          {uploading && (
            <p className="mt-1 text-body-sm text-tinta-70">Enviando...</p>
          )}
          {uploadError && (
            <p className="mt-1 text-body-sm text-vermelho">{uploadError}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-body-sm font-semibold text-tinta">
          Descrição
        </label>
        <textarea name="descricao" rows={2} className="w-full" />
      </div>

      {state.error && (
        <p className="text-body-sm text-vermelho" role="alert">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
