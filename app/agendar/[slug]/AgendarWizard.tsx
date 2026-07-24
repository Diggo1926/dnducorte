"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, Clock } from "lucide-react";
import { buscarSlots, criarAgendamentoPublico, type AgendamentoState } from "./actions";

type Servico = {
  id: string;
  nome: string;
  descricao: string | null;
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

function dateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function proximosDias(quantidade: number) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Array.from({ length: quantidade }, (_, i) => {
    const dia = new Date(hoje);
    dia.setDate(hoje.getDate() + i);
    return dia;
  });
}

const stepVariants = {
  enter: (direcao: number) => ({ x: direcao > 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direcao: number) => ({ x: direcao > 0 ? -32 : 32, opacity: 0 }),
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full">
      {pending ? "Confirmando..." : "Confirmar agendamento"}
    </button>
  );
}

function VoltarButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 self-start rounded text-body-sm font-semibold text-tinta-70 transition-colors hover:text-tinta focus-visible:outline focus-visible:outline-2 focus-visible:outline-azul focus-visible:outline-offset-2"
    >
      <ChevronLeft size={16} strokeWidth={2} aria-hidden />
      Voltar
    </button>
  );
}

function ProgressoEtapas({ passo }: { passo: 1 | 2 | 3 }) {
  return (
    <div className="flex gap-2" role="progressbar" aria-valuenow={passo} aria-valuemin={1} aria-valuemax={3}>
      {[1, 2, 3].map((segmento) => (
        <div
          key={segmento}
          className={`h-1 flex-1 rounded-full transition-colors duration-150 ${
            segmento <= passo ? "bg-ouro" : "bg-cromo"
          }`}
        />
      ))}
    </div>
  );
}

function AnimatedCheck() {
  const reduzirMovimento = useReducedMotion();
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="30" stroke="var(--ouro)" strokeWidth="2" />
      <motion.path
        d="M19 33L27 41L45 22"
        stroke="var(--ouro)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduzirMovimento ? 0 : 0.4, ease: "easeOut" }}
      />
    </svg>
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
  const reduzirMovimento = useReducedMotion();
  const [passo, setPasso] = useState<1 | 2 | 3>(1);
  const [direcao, setDirecao] = useState(1);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotSelecionado, setSlotSelecionado] = useState<Slot | null>(null);
  const [carregandoSlots, setCarregandoSlots] = useState(false);
  const [erroSlots, setErroSlots] = useState("");

  const [state, formAction] = useFormState(criarAgendamentoPublico, initialState);

  function irPara(novoPasso: 1 | 2 | 3) {
    setDirecao(novoPasso > passo ? 1 : -1);
    setPasso(novoPasso);
  }

  function selecionarServico(servico: Servico) {
    setServicoSelecionado(servico);
    irPara(2);
  }

  async function selecionarDia(dia: Date) {
    setDiaSelecionado(dia);
    setSlotSelecionado(null);
    setSlots([]);
    if (!servicoSelecionado) return;
    setCarregandoSlots(true);
    setErroSlots("");
    try {
      const resultado = await buscarSlots({
        slug,
        servicoId: servicoSelecionado.id,
        data: dateKey(dia),
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
      <div className="flex flex-col items-center gap-4 rounded border border-cromo bg-branco p-8 text-center">
        <AnimatedCheck />
        <div>
          <p className="font-display text-h2 uppercase text-tinta">Agendamento confirmado</p>
          <p className="mt-1 text-body-sm text-tinta-70">
            Aguarde a confirmação da barbearia pelo WhatsApp.
          </p>
        </div>
        {servicoSelecionado && slotSelecionado && (
          <div className="w-full rounded border border-cromo bg-creme p-4 text-left">
            <p className="font-display text-h3 text-tinta">{servicoSelecionado.nome}</p>
            <p className="mt-1 text-body-sm text-tinta-70">
              {new Date(slotSelecionado.inicio).toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
            <p className="mt-1 font-display text-h3 text-ouro-texto">
              {formatPreco(servicoSelecionado.precoCentavos)}
            </p>
          </div>
        )}
        <a
          href={`https://wa.me/${telefoneBarbearia}?text=${mensagem}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary w-full"
        >
          Falar no WhatsApp
        </a>
      </div>
    );
  }

  if (servicos.length === 0) {
    return (
      <p className="rounded border border-cromo bg-branco p-6 text-center text-body-sm text-tinta-70">
        Nenhum serviço disponível para agendamento no momento.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ProgressoEtapas passo={passo} />

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direcao} initial={false}>
          {passo === 1 && (
            <motion.div
              key="passo-1"
              custom={direcao}
              variants={stepVariants}
              initial={reduzirMovimento ? false : "enter"}
              animate="center"
              exit={reduzirMovimento ? undefined : "exit"}
              transition={{ duration: reduzirMovimento ? 0 : 0.25, ease: "easeOut" }}
              className="flex flex-col gap-3"
            >
              {servicos.map((servico) => (
                <button
                  key={servico.id}
                  type="button"
                  onClick={() => selecionarServico(servico)}
                  className="flex items-center justify-between gap-4 rounded border border-cromo bg-branco p-4 text-left transition-colors duration-150 hover:border-ouro focus-visible:outline focus-visible:outline-2 focus-visible:outline-azul"
                >
                  <div>
                    <p className="font-display text-h3 uppercase text-tinta">{servico.nome}</p>
                    <p className="mt-1 flex items-center gap-1 text-body-sm text-tinta-70">
                      <Clock size={14} strokeWidth={2} aria-hidden />
                      {servico.duracaoMinutos} min
                    </p>
                  </div>
                  <span className="shrink-0 font-display text-h3 text-ouro-texto">
                    {formatPreco(servico.precoCentavos)}
                  </span>
                </button>
              ))}
            </motion.div>
          )}

          {passo === 2 && servicoSelecionado && (
            <motion.div
              key="passo-2"
              custom={direcao}
              variants={stepVariants}
              initial={reduzirMovimento ? false : "enter"}
              animate="center"
              exit={reduzirMovimento ? undefined : "exit"}
              transition={{ duration: reduzirMovimento ? 0 : 0.25, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >
              <VoltarButton onClick={() => irPara(1)} />

              <div className="flex gap-2 overflow-x-auto pb-1">
                {proximosDias(7).map((dia) => {
                  const selecionado =
                    diaSelecionado && dateKey(diaSelecionado) === dateKey(dia);
                  return (
                    <button
                      key={dateKey(dia)}
                      type="button"
                      onClick={() => selecionarDia(dia)}
                      className={`flex shrink-0 flex-col items-center gap-1 rounded border px-3 py-2 transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-azul ${
                        selecionado
                          ? "border-ouro bg-ouro text-tinta"
                          : "border-cromo bg-branco text-tinta hover:border-ouro"
                      }`}
                    >
                      <span className="text-nav-label uppercase">
                        {dia.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "")}
                      </span>
                      <span className="font-display text-h3">{dia.getDate()}</span>
                    </button>
                  );
                })}
              </div>

              {carregandoSlots && (
                <p className="text-body-sm text-tinta-70">Carregando horários...</p>
              )}
              {erroSlots && (
                <p className="text-body-sm text-vermelho" role="alert">
                  {erroSlots}
                </p>
              )}
              {!carregandoSlots && diaSelecionado && slots.length === 0 && !erroSlots && (
                <p className="text-body-sm text-tinta-70">
                  Nenhum horário disponível nesse dia.
                </p>
              )}

              {slots.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => {
                    const selecionado = slotSelecionado?.inicio === slot.inicio;
                    return (
                      <button
                        key={slot.inicio}
                        type="button"
                        onClick={() => {
                          setSlotSelecionado(slot);
                          irPara(3);
                        }}
                        className={`flex h-11 items-center justify-center rounded border text-body-sm font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-azul ${
                          selecionado
                            ? "border-ouro bg-ouro text-tinta"
                            : "border-cromo bg-branco text-tinta hover:border-ouro"
                        }`}
                      >
                        {new Date(slot.inicio).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {passo === 3 && servicoSelecionado && slotSelecionado && (
            <motion.form
              key="passo-3"
              action={formAction}
              custom={direcao}
              variants={stepVariants}
              initial={reduzirMovimento ? false : "enter"}
              animate="center"
              exit={reduzirMovimento ? undefined : "exit"}
              transition={{ duration: reduzirMovimento ? 0 : 0.25, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >
              <VoltarButton onClick={() => irPara(2)} />

              <input type="hidden" name="slug" value={slug} />
              <input type="hidden" name="servicoId" value={servicoSelecionado.id} />
              <input type="hidden" name="inicio" value={slotSelecionado.inicio} />

              <div className="rounded border border-cromo bg-creme p-4">
                <p className="font-display text-h3 uppercase text-tinta">
                  {servicoSelecionado.nome}
                </p>
                <p className="mt-1 text-body-sm text-tinta-70">
                  {new Date(slotSelecionado.inicio).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
                <p className="mt-1 font-display text-h3 text-ouro-texto">
                  {formatPreco(servicoSelecionado.precoCentavos)}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-body-sm font-semibold text-tinta" htmlFor="clienteNome">
                  Nome
                </label>
                <input id="clienteNome" name="clienteNome" required className="w-full" />
              </div>
              <div>
                <label className="mb-1 block text-body-sm font-semibold text-tinta" htmlFor="clienteTelefone">
                  WhatsApp
                </label>
                <input id="clienteTelefone" name="clienteTelefone" required className="w-full" />
              </div>

              {state.error && (
                <p className="text-body-sm text-vermelho" role="alert">
                  {state.error}
                </p>
              )}
              <SubmitButton />
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
