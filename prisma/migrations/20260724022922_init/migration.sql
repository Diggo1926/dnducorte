-- CreateEnum
CREATE TYPE "Papel" AS ENUM ('ADMIN', 'BARBEIRO');

-- CreateEnum
CREATE TYPE "StatusAgendamento" AS ENUM ('PENDENTE', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO', 'FALTOU');

-- CreateEnum
CREATE TYPE "TipoLancamento" AS ENUM ('ENTRADA', 'SAIDA');

-- CreateTable
CREATE TABLE "Barbearia" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "logoUrl" TEXT,
    "corPrimaria" TEXT NOT NULL DEFAULT '#C9A227',
    "corSecundaria" TEXT NOT NULL DEFAULT '#0B0B0D',
    "corDestaque" TEXT NOT NULL DEFAULT '#E8C55A',
    "intervaloMinutos" INTEGER NOT NULL DEFAULT 15,
    "antecedenciaMinimaHoras" INTEGER NOT NULL DEFAULT 1,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Barbearia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "barbeariaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "papel" "Papel" NOT NULL DEFAULT 'ADMIN',

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servico" (
    "id" TEXT NOT NULL,
    "barbeariaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "precoCentavos" INTEGER NOT NULL,
    "duracaoMinutos" INTEGER NOT NULL,
    "fotoUrl" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HorarioTrabalho" (
    "id" TEXT NOT NULL,
    "barbeariaId" TEXT NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "HorarioTrabalho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bloqueio" (
    "id" TEXT NOT NULL,
    "barbeariaId" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT,

    CONSTRAINT "Bloqueio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agendamento" (
    "id" TEXT NOT NULL,
    "barbeariaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,
    "clienteNome" TEXT NOT NULL,
    "clienteTelefone" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3) NOT NULL,
    "precoCentavos" INTEGER NOT NULL,
    "status" "StatusAgendamento" NOT NULL DEFAULT 'PENDENTE',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lancamento" (
    "id" TEXT NOT NULL,
    "barbeariaId" TEXT NOT NULL,
    "tipo" "TipoLancamento" NOT NULL,
    "descricao" TEXT NOT NULL,
    "valorCentavos" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "categoria" TEXT NOT NULL,
    "agendamentoId" TEXT,

    CONSTRAINT "Lancamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Barbearia_slug_key" ON "Barbearia"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_barbeariaId_idx" ON "Usuario"("barbeariaId");

-- CreateIndex
CREATE INDEX "Servico_barbeariaId_idx" ON "Servico"("barbeariaId");

-- CreateIndex
CREATE INDEX "HorarioTrabalho_barbeariaId_idx" ON "HorarioTrabalho"("barbeariaId");

-- CreateIndex
CREATE INDEX "Bloqueio_barbeariaId_idx" ON "Bloqueio"("barbeariaId");

-- CreateIndex
CREATE INDEX "Agendamento_barbeariaId_idx" ON "Agendamento"("barbeariaId");

-- CreateIndex
CREATE UNIQUE INDEX "Agendamento_barbeariaId_inicio_key" ON "Agendamento"("barbeariaId", "inicio");

-- CreateIndex
CREATE UNIQUE INDEX "Lancamento_agendamentoId_key" ON "Lancamento"("agendamentoId");

-- CreateIndex
CREATE INDEX "Lancamento_barbeariaId_idx" ON "Lancamento"("barbeariaId");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorarioTrabalho" ADD CONSTRAINT "HorarioTrabalho_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bloqueio" ADD CONSTRAINT "Bloqueio_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lancamento" ADD CONSTRAINT "Lancamento_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lancamento" ADD CONSTRAINT "Lancamento_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "Agendamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
