"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Plus, Save } from "lucide-react";
import type { Servico } from "@prisma/client";
import { createServico, updateServico, type ServicoState } from "./actions";
import { uploadToCloudinary } from "@/lib/cloudinary";

const initialState: ServicoState = {};

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary">
      {editing ? (
        <Save size={18} strokeWidth={2} aria-hidden />
      ) : (
        <Plus size={18} strokeWidth={2} aria-hidden />
      )}
      {pending ? "Salvando..." : editing ? "Salvar alterações" : "Adicionar serviço"}
    </button>
  );
}

export default function ServicoForm({
  servico,
  onSuccess,
  onCancel,
}: {
  servico?: Servico;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const editing = !!servico;
  const [state, formAction] = useFormState(
    editing ? updateServico : createServico,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [precoReais, setPrecoReais] = useState(
    servico ? (servico.precoCentavos / 100).toFixed(2) : ""
  );
  const [fotoUrl, setFotoUrl] = useState(servico?.fotoUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (!state.ok) return;
    if (editing) {
      onSuccess?.();
    } else {
      formRef.current?.reset();
      setPrecoReais("");
      setFotoUrl("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

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
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-4 rounded border border-cromo bg-branco p-6"
    >
      {editing && <input type="hidden" name="id" value={servico.id} />}
      <input type="hidden" name="fotoUrl" value={fotoUrl} />
      <input type="hidden" name="precoCentavos" value={precoCentavos} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-tinta">
            Nome
          </label>
          <input
            name="nome"
            required
            defaultValue={servico?.nome}
            className="w-full"
          />
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
            defaultValue={servico?.duracaoMinutos}
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
        <textarea
          name="descricao"
          rows={2}
          defaultValue={servico?.descricao ?? ""}
          className="w-full"
        />
      </div>

      {state.error && (
        <p className="text-body-sm text-vermelho" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <SubmitButton editing={editing} />
        {editing && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
