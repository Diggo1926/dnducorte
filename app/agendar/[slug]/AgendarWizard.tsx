"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { buscarSlots, criarAgendamentoPublico, type AgendamentoState } from "./actions";

type Servico = {
  id: string;
  nome: string;
  precoCentavos: number;
  duracaoMinutos: number;
  fotoUrl: string | null;
};

type Slot = { inicio: string; fim: string };

const initialState: AgendamentoState = {};

function formatPreco(centavos: number) {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-[12px] bg-ouro py-3 font-bold uppercase tracking-wide text-tinta disabled:opacity-60"
    >
      {pending ? "Confirmando..." : "Confirmar agendamento"}
    </button>
  );
}

export default function AgendarWizard({
  slug,
  barbeariaNome,
  telefoneBarbearia,
  servicos,
}: {
  slug: string;
  barbeariaNome: string;
  telefoneBarbearia: string;
  servicos: Servico[];
}) {
  const [passo, setPasso] = useState<1 | 2 | 3>(1);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
  const [data, setData] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotSelecionado, setSlotSelecionado] = useState<Slot | null>(null);
  const [carregandoSlots, setCarregandoSlots] = useState(false);
  const [erroSlots, setErroSlots] = useState("");

  const [state, formAction] = useFormState(criarAgendamentoPublico, initialState);

  function selecionarServico(servico: Servico) {
    setServicoSelecionado(servico);
    setPasso(2);
  }

  async function buscarHorarios(novaData: string) {
    setData(novaData);
    setSlotSelecionado(null);
    setSlots([]);
    if (!novaData || !servicoSelecionado) return;
    setCarregandoSlots(true);
    setErroSlots("");
    try {
      const resultado = await buscarSlots({
        slug,
        servicoId: servicoSelecionado.id,
        data: novaData,
      });
      setSlots(resultado);
    } catch {
      setErroSlots("Não foi possível carregar os horários.");
    } finally {
      setCarregandoSlots(false);
    }
  }

  if (state.sucesso) {
    const mensagem = encodeURIComponent(
      `Olá! Confirmando meu agendamento em ${barbeariaNome}${
        servicoSelecionado ? ` para ${servicoSelecionado.nome}` : ""
      }.`
    );
    return (
      <div className="flex flex-col items-center gap-4 rounded-[12px] border border-cromo bg-fundo p-6 text-center">
        <h2 className="text-xl font-bold uppercase tracking-tight text-tinta">
          Agendamento confirmado!
        </h2>
        <p className="text-sm text-tinta/70">Aguarde a confirmação da barbearia.</p>
        <a
          href={`https://wa.me/${telefoneBarbearia}?text=${mensagem}`}
          target="_blank"
          rel="noreferrer"
          className="w-full rounded-[12px] bg-ouro py-3 text-center font-bold uppercase tracking-wide text-tinta"
        >
          Falar no WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ol className="flex justify-between text-xs font-semibold uppercase text-tinta/60">
        <li className={passo === 1 ? "text-ouro" : ""}>1. Serviço</li>
        <li className={passo === 2 ? "text-ouro" : ""}>2. Data</li>
        <li className={passo === 3 ? "text-ouro" : ""}>3. Confirmação</li>
      </ol>

      {passo === 1 && (
        <div className="flex flex-col gap-3">
          {servicos.length === 0 ? (
            <p className="text-sm text-tinta/60">Nenhum serviço disponível no momento.</p>
          ) : (
            servicos.map((servico) => (
              <button
                key={servico.id}
                onClick={() => selecionarServico(servico)}
                className="flex items-center justify-between rounded-[12px] border border-cromo bg-fundo p-4 text-left"
              >
                <div>
                  <p className="font-semibold text-tinta">{servico.nome}</p>
                  <p className="text-sm text-tinta/60">{servico.duracaoMinutos} min</p>
                </div>
                <span className="font-bold text-ouro">
                  {formatPreco(servico.precoCentavos)}
                </span>
              </button>
            ))
          )}
        </div>
      )}

      {passo === 2 && servicoSelecionado && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setPasso(1)}
            className="self-start text-sm text-tinta/60 underline"
          >
            Voltar
          </button>
          <input
            type="date"
            value={data}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => buscarHorarios(e.target.value)}
            className="rounded-[12px] border border-cromo px-3 py-2"
          />
          {carregandoSlots && (
            <p className="text-sm text-tinta/60">Carregando horários...</p>
          )}
          {erroSlots && <p className="text-sm text-vermelho">{erroSlots}</p>}
          {!carregandoSlots && data && slots.length === 0 && !erroSlots && (
            <p className="text-sm text-tinta/60">Nenhum horário disponível nesse dia.</p>
          )}
          {slots.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.inicio}
                  onClick={() => {
                    setSlotSelecionado(slot);
                    setPasso(3);
                  }}
                  className="rounded-[12px] border border-cromo px-2 py-2 text-sm hover:border-ouro"
                >
                  {new Date(slot.inicio).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {passo === 3 && servicoSelecionado && slotSelecionado && (
        <form action={formAction} className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setPasso(2)}
            className="self-start text-sm text-tinta/60 underline"
          >
            Voltar
          </button>
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="servicoId" value={servicoSelecionado.id} />
          <input type="hidden" name="inicio" value={slotSelecionado.inicio} />

          <div className="rounded-[12px] border border-cromo bg-superficie p-3 text-sm text-tinta">
            <p className="font-semibold">{servicoSelecionado.nome}</p>
            <p>
              {formatPreco(servicoSelecionado.precoCentavos)} ·{" "}
              {servicoSelecionado.duracaoMinutos} min
            </p>
            <p>
              {new Date(slotSelecionado.inicio).toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-tinta">Nome</label>
            <input
              name="clienteNome"
              required
              className="w-full rounded-[12px] border border-cromo px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-tinta">Telefone</label>
            <input
              name="clienteTelefone"
              required
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
      )}
    </div>
  );
}
