"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Image from "next/image";
import type { Barbearia } from "@prisma/client";
import { atualizarConfiguracoes, type ConfiguracoesState } from "./actions";
import { uploadToCloudinary } from "@/lib/cloudinary";

const initialState: ConfiguracoesState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-[12px] bg-ouro px-4 py-2 font-bold uppercase tracking-wide text-tinta disabled:opacity-60"
    >
      {pending ? "Salvando..." : "Salvar configurações"}
    </button>
  );
}

export default function ConfiguracoesForm({ barbearia }: { barbearia: Barbearia }) {
  const [state, formAction] = useFormState(atualizarConfiguracoes, initialState);
  const [logoUrl, setLogoUrl] = useState(barbearia.logoUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      setLogoUrl(await uploadToCloudinary(file));
    } catch {
      setUploadError("Falha ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-[12px] border border-cromo bg-fundo p-4"
    >
      <input type="hidden" name="logoUrl" value={logoUrl} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">Nome</label>
          <input
            name="nome"
            defaultValue={barbearia.nome}
            required
            className="w-full rounded-[12px] border border-cromo px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">Telefone</label>
          <input
            name="telefone"
            defaultValue={barbearia.telefone}
            required
            className="w-full rounded-[12px] border border-cromo px-3 py-2"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-semibold text-tinta">Endereço</label>
          <input
            name="endereco"
            defaultValue={barbearia.endereco}
            required
            className="w-full rounded-[12px] border border-cromo px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">Logo</label>
          <input type="file" accept="image/*" onChange={handleFile} />
          {uploading && <p className="text-xs text-tinta/60">Enviando...</p>}
          {uploadError && <p className="text-xs text-vermelho">{uploadError}</p>}
          {logoUrl && (
            <Image
              src={logoUrl}
              alt="Logo"
              width={48}
              height={48}
              className="mt-2 h-12 w-12 rounded-[12px] object-cover"
            />
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">
            Intervalo entre horários (min)
          </label>
          <input
            name="intervaloMinutos"
            type="number"
            min="1"
            defaultValue={barbearia.intervaloMinutos}
            required
            className="w-full rounded-[12px] border border-cromo px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">
            Antecedência mínima (horas)
          </label>
          <input
            name="antecedenciaMinimaHoras"
            type="number"
            min="0"
            defaultValue={barbearia.antecedenciaMinimaHoras}
            required
            className="w-full rounded-[12px] border border-cromo px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">Cor primária</label>
          <input
            name="corPrimaria"
            type="color"
            defaultValue={barbearia.corPrimaria}
            className="h-10 w-full rounded-[12px] border border-cromo"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">
            Cor secundária
          </label>
          <input
            name="corSecundaria"
            type="color"
            defaultValue={barbearia.corSecundaria}
            className="h-10 w-full rounded-[12px] border border-cromo"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-tinta">
            Cor de destaque
          </label>
          <input
            name="corDestaque"
            type="color"
            defaultValue={barbearia.corDestaque}
            className="h-10 w-full rounded-[12px] border border-cromo"
          />
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-vermelho" role="alert">
          {state.error}
        </p>
      )}
      {state.sucesso && <p className="text-sm text-ouro">Configurações salvas.</p>}
      <SubmitButton />
    </form>
  );
}
