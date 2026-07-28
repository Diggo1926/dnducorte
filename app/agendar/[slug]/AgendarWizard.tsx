"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CloudSun,
  MessageCircle,
  Moon,
  Phone,
  Scissors,
  Sun,
  User,
} from "lucide-react";
import { buscarSlots, criarAgendamentoPublico, type AgendamentoState } from "./actions";
import { getImagemServico } from "@/lib/servico-imagem";

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

const ETAPAS = [
  { id: 1 as const, label: "Serviço", Icone: Scissors },
  { id: 2 as const, label: "Data e horário", Icone: CalendarDays },
  { id: 3 as const, label: "Seus dados", Icone: User },
];

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

function inicioHoje() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return hoje;
}

function proximosDias(hoje: Date, quantidade: number) {
  return Array.from({ length: quantidade }, (_, i) => {
    const dia = new Date(hoje);
    dia.setDate(hoje.getDate() + i);
    return dia;
  });
}

function labelDia(dia: Date, hoje: Date) {
  if (dateKey(dia) === dateKey(hoje)) return "Hoje";
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);
  if (dateKey(dia) === dateKey(amanha)) return "Amanhã";
  return dia.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
}

const PERIODOS = [
  { label: "Manhã", Icone: Sun, max: 12 },
  { label: "Tarde", Icone: CloudSun, max: 18 },
  { label: "Noite", Icone: Moon, max: 24 },
];

function agruparSlotsPorPeriodo(slots: Slot[]) {
  return PERIODOS.map((periodo) => ({
    ...periodo,
    slots: slots.filter((slot) => {
      const hora = new Date(slot.inicio).getHours();
      const minAnterior = PERIODOS[PERIODOS.indexOf(periodo) - 1]?.max ?? 0;
      return hora >= minAnterior && hora < periodo.max;
    }),
  })).filter((grupo) => grupo.slots.length > 0);
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

function Etapas({ passo }: { passo: 1 | 2 | 3 }) {
  return (
    <div
      className="flex items-center"
      role="progressbar"
      aria-valuenow={passo}
      aria-valuemin={1}
      aria-valuemax={3}
      aria-valuetext={ETAPAS[passo - 1].label}
    >
      {ETAPAS.map((etapa, i) => {
        const concluida = etapa.id < passo;
        const ativa = etapa.id === passo;
        return (
          <div key={etapa.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150 ${
                  concluida
                    ? "border-ouro bg-ouro text-tinta"
                    : ativa
                    ? "border-ouro bg-branco text-ouro-texto"
                    : "border-cromo bg-branco text-tinta-70"
                }`}
              >
                {concluida ? (
                  <Check size={16} strokeWidth={2.5} aria-hidden />
                ) : (
                  <etapa.Icone size={16} strokeWidth={2} aria-hidden />
                )}
              </div>
              <span
                className={`whitespace-nowrap text-nav-label uppercase ${
                  ativa ? "text-tinta" : "text-tinta-70"
                }`}
              >
                {etapa.label}
              </span>
            </div>
            {i < ETAPAS.length - 1 && (
              <div
                className={`mx-2 h-[2px] flex-1 rounded-full transition-colors duration-150 ${
                  concluida ? "bg-ouro" : "bg-cromo"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ResumoAgendamento({
  servico,
  dia,
  slot,
}: {
  servico: Servico;
  dia: Date | null;
  slot: Slot | null;
}) {
  return (
    <div className="sticky top-[68px] z-20 flex flex-col gap-2 rounded border border-cromo bg-branco p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded bg-tinta">
          <Image
            src={getImagemServico(servico.nome, servico.fotoUrl)}
            alt=""
            aria-hidden
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-h3 uppercase leading-tight text-tinta">
            {servico.nome}
          </p>
          <p className="flex items-center gap-1 text-body-sm text-tinta-70">
            <Clock size={12} strokeWidth={2} aria-hidden />
            {servico.duracaoMinutos} min
          </p>
        </div>
        <span className="shrink-0 font-display text-h3 text-ouro-texto">
          {formatPreco(servico.precoCentavos)}
        </span>
      </div>
      {(dia || slot) && (
        <div className="flex flex-wrap items-center gap-2 border-t border-cromo pt-2">
          {dia && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-creme px-2.5 py-1 text-body-sm font-semibold text-tinta">
              <Calendar size={13} strokeWidth={2} className="text-ouro-texto" aria-hidden />
              {dia.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "")}
            </span>
          )}
          {slot && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ouro px-2.5 py-1 text-body-sm font-semibold text-tinta">
              <Clock size={13} strokeWidth={2} aria-hidden />
              {new Date(slot.inicio).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      )}
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
  const hoje = useMemo(() => inicioHoje(), []);
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
          <div className="flex w-full flex-col gap-2.5 rounded border border-cromo bg-creme p-4 text-left">
            <div className="flex items-center gap-2">
              <Scissors size={15} strokeWidth={2} className="shrink-0 text-ouro-texto" aria-hidden />
              <p className="font-display text-h3 text-tinta">{servicoSelecionado.nome}</p>
            </div>
            <div className="flex items-center gap-2 text-body-sm text-tinta-70">
              <CalendarDays size={15} strokeWidth={2} className="shrink-0" aria-hidden />
              {new Date(slotSelecionado.inicio).toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-body-sm text-tinta-70">Total</span>
              <span className="font-display text-h3 text-ouro-texto">
                {formatPreco(servicoSelecionado.precoCentavos)}
              </span>
            </div>
          </div>
        )}
        <a
          href={`https://wa.me/${telefoneBarbearia}?text=${mensagem}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary w-full"
        >
          <MessageCircle size={18} strokeWidth={2} aria-hidden />
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
    <div className="flex flex-col gap-5">
      <Etapas passo={passo} />

      {passo > 1 && servicoSelecionado && (
        <ResumoAgendamento
          servico={servicoSelecionado}
          dia={diaSelecionado}
          slot={slotSelecionado}
        />
      )}

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
                  className="flex items-center gap-3 rounded-xl border border-cromo bg-branco p-3 text-left shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-ouro hover:shadow-md active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-azul"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-tinta">
                    <Image
                      src={getImagemServico(servico.nome, servico.fotoUrl)}
                      alt=""
                      aria-hidden
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-h3 uppercase text-tinta">
                      {servico.nome}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-body-sm text-tinta-70">
                        <Clock size={13} strokeWidth={2} aria-hidden />
                        {servico.duracaoMinutos} min
                      </span>
                      <span className="font-display text-h3 text-ouro-texto">
                        {formatPreco(servico.precoCentavos)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    size={20}
                    strokeWidth={2}
                    className="shrink-0 text-tinta-70"
                    aria-hidden
                  />
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

              <div>
                <p className="mb-2 text-body-sm font-semibold text-tinta">Escolha o dia</p>
                <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1">
                  {proximosDias(hoje, 14).map((dia) => {
                    const selecionado =
                      diaSelecionado && dateKey(diaSelecionado) === dateKey(dia);
                    return (
                      <button
                        key={dateKey(dia)}
                        type="button"
                        onClick={() => selecionarDia(dia)}
                        className={`flex shrink-0 snap-start flex-col items-center gap-1 rounded-lg border px-3 py-2 transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-azul ${
                          selecionado
                            ? "border-ouro bg-ouro text-tinta"
                            : "border-cromo bg-branco text-tinta hover:border-ouro"
                        }`}
                      >
                        <span className="whitespace-nowrap text-nav-label uppercase">
                          {labelDia(dia, hoje)}
                        </span>
                        <span className="font-display text-h3">{dia.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {carregandoSlots && (
                <div className="grid grid-cols-3 gap-2" aria-hidden>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton h-11 w-full" />
                  ))}
                </div>
              )}
              {erroSlots && (
                <p className="text-body-sm text-vermelho" role="alert">
                  {erroSlots}
                </p>
              )}
              {!carregandoSlots && diaSelecionado && slots.length === 0 && !erroSlots && (
                <p className="text-body-sm text-tinta-70">
                  Nenhum horário disponível nesse dia. Tente outra data.
                </p>
              )}

              {!carregandoSlots && slots.length > 0 && (
                <div className="flex flex-col gap-4">
                  {agruparSlotsPorPeriodo(slots).map((grupo) => (
                    <div key={grupo.label}>
                      <p className="mb-2 flex items-center gap-1.5 text-body-sm font-semibold text-tinta-70">
                        <grupo.Icone size={14} strokeWidth={2} aria-hidden />
                        {grupo.label}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {grupo.slots.map((slot) => {
                          const selecionado = slotSelecionado?.inicio === slot.inicio;
                          return (
                            <button
                              key={slot.inicio}
                              type="button"
                              onClick={() => {
                                setSlotSelecionado(slot);
                                irPara(3);
                              }}
                              className={`relative flex h-11 items-center justify-center rounded-lg border text-body-sm font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-azul ${
                                selecionado
                                  ? "border-ouro bg-ouro text-tinta"
                                  : "border-cromo bg-branco text-tinta hover:border-ouro"
                              }`}
                            >
                              {selecionado && (
                                <CheckCircle2
                                  size={14}
                                  strokeWidth={2}
                                  className="absolute -right-1.5 -top-1.5 rounded-full bg-branco text-ouro-texto"
                                  aria-hidden
                                />
                              )}
                              {new Date(slot.inicio).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
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

              <div>
                <label className="mb-1 block text-body-sm font-semibold text-tinta" htmlFor="clienteNome">
                  Nome
                </label>
                <div className="relative">
                  <User
                    size={18}
                    strokeWidth={2}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta-70"
                    aria-hidden
                  />
                  <input
                    id="clienteNome"
                    name="clienteNome"
                    required
                    autoComplete="name"
                    placeholder="Seu nome completo"
                    className="w-full"
                    style={{ paddingLeft: 40 }}
                  />
                </div>
              </div>
              <div>
                <label
                  className="mb-1 block text-body-sm font-semibold text-tinta"
                  htmlFor="clienteTelefone"
                >
                  WhatsApp
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    strokeWidth={2}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta-70"
                    aria-hidden
                  />
                  <input
                    id="clienteTelefone"
                    name="clienteTelefone"
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(00) 00000-0000"
                    className="w-full"
                    style={{ paddingLeft: 40 }}
                  />
                </div>
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
