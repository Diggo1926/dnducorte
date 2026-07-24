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
    <button type="submit" disabled={pending} className="btn btn-primary">
      {pending ? "Salvando..." : "Salvar configurações"}
    </button>
  );
}

function Field({
  label,
  children,
  span,
}: {
  label: string;
  children: React.ReactNode;
  span?: boolean;
}) {
  return (
    <div className={span ? "sm:col-span-2" : undefined}>
      <label className="mb-1 block text-body-sm font-semibold text-tinta">
        {label}
      </label>
      {children}
    </div>
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
      className="flex flex-col gap-4 rounded border border-cromo bg-branco p-6"
    >
      <input type="hidden" name="logoUrl" value={logoUrl} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome">
          <input name="nome" defaultValue={barbearia.nome} required className="w-full" />
        </Field>
        <Field label="Link (slug)">
          <input
            name="slug"
            defaultValue={barbearia.slug}
            required
            minLength={3}
            className="w-full"
          />
          <p className="mt-1 text-body-sm text-tinta-70">
            Só letras, números e hífens. Mínimo de 3 caracteres.
          </p>
        </Field>
        <Field label="Telefone">
          <input name="telefone" defaultValue={barbearia.telefone} required className="w-full" />
        </Field>
        <Field label="Endereço" span>
          <input name="endereco" defaultValue={barbearia.endereco} required className="w-full" />
        </Field>
        <Field label="Logo">
          <input type="file" accept="image/*" onChange={handleFile} />
          {uploading && <p className="mt-1 text-body-sm text-tinta-70">Enviando...</p>}
          {uploadError && <p className="mt-1 text-body-sm text-vermelho">{uploadError}</p>}
          {logoUrl && (
            <Image
              src={logoUrl}
              alt="Logo"
              width={48}
              height={48}
              className="logo-medallion mt-2"
            />
          )}
        </Field>
        <Field label="Intervalo entre horários (min)">
          <input
            name="intervaloMinutos"
            type="number"
            min="1"
            defaultValue={barbearia.intervaloMinutos}
            required
            className="w-full"
          />
        </Field>
        <Field label="Antecedência mínima (horas)">
          <input
            name="antecedenciaMinimaHoras"
            type="number"
            min="0"
            defaultValue={barbearia.antecedenciaMinimaHoras}
            required
            className="w-full"
          />
        </Field>
        <Field label="Cor primária">
          <input
            name="corPrimaria"
            type="color"
            defaultValue={barbearia.corPrimaria}
            className="h-12 w-full p-1"
          />
        </Field>
        <Field label="Cor secundária">
          <input
            name="corSecundaria"
            type="color"
            defaultValue={barbearia.corSecundaria}
            className="h-12 w-full p-1"
          />
        </Field>
        <Field label="Cor de destaque">
          <input
            name="corDestaque"
            type="color"
            defaultValue={barbearia.corDestaque}
            className="h-12 w-full p-1"
          />
        </Field>
      </div>

      {state.error && (
        <p className="text-body-sm text-vermelho" role="alert">
          {state.error}
        </p>
      )}
      {state.sucesso && (
        <p className="text-body-sm text-ouro-texto">Configurações salvas.</p>
      )}
      <SubmitButton />
    </form>
  );
}
