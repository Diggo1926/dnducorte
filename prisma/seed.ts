import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash("admin123", 10);

  const barbearia = await prisma.barbearia.upsert({
    where: { slug: "dndu-corte" },
    update: {},
    create: {
      slug: "dndu-corte",
      nome: "Dndu Corte",
      telefone: "5511999999999",
      endereco: "Rua Exemplo, 100 - São Paulo/SP",
    },
  });

  await prisma.usuario.upsert({
    where: { email: "admin@dnducorte.com" },
    update: {},
    create: {
      barbeariaId: barbearia.id,
      nome: "Admin Dndu Corte",
      email: "admin@dnducorte.com",
      senhaHash,
      papel: "ADMIN",
    },
  });

  const servicos = [
    { nome: "Corte", precoCentavos: 4000, duracaoMinutos: 30, ordem: 1 },
    { nome: "Barba", precoCentavos: 3000, duracaoMinutos: 20, ordem: 2 },
    { nome: "Corte + Barba", precoCentavos: 6000, duracaoMinutos: 50, ordem: 3 },
    { nome: "Sobrancelha", precoCentavos: 1500, duracaoMinutos: 10, ordem: 4 },
  ];

  for (const servico of servicos) {
    const existente = await prisma.servico.findFirst({
      where: { barbeariaId: barbearia.id, nome: servico.nome },
    });
    if (!existente) {
      await prisma.servico.create({
        data: { ...servico, barbeariaId: barbearia.id },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
