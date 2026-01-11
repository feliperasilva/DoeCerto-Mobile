// prisma/seed.ts
import { PrismaClient, VerificationStatus, Ong } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Limpar dados existentes (opcional - comentar em produção)
  console.log('🗑️  Cleaning existing data...');
  await prisma.donation.deleteMany();
  await prisma.donor.deleteMany();
  await prisma.ong.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Data cleaned\n');

  // ==================== CRIAR ADMIN ====================
  console.log('👤 Creating admin...');
  const adminPassword = await bcrypt.hash('Admin@123456', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@sistema.com',
      password: adminPassword,
      role: 'admin',
    },
  });

  await prisma.admin.create({
    data: {
      userId: adminUser.id,
    },
  });

  console.log(`✅ Admin created: ${adminUser.email}`);
  console.log(`   Password: Admin@123456\n`);

  // ==================== CRIAR DOADOR ====================
  console.log('💰 Creating donor...');
  const donorPassword = await bcrypt.hash('Donor@123456', 10);
  
  const donorUser = await prisma.user.create({
    data: {
      name: 'Carlos Oliveira',
      email: 'carlos.oliveira@email.com',
      password: donorPassword,
      role: 'donor',
    },
  });

  await prisma.donor.create({
    data: {
      userId: donorUser.id,
      cpf: '123.456.789-00',
    },
  });

  console.log(`✅ Donor created: ${donorUser.email}`);
  console.log(`   Password: Donor@123456`);
  console.log(`   CPF: 123.456.789-00\n`);

  // ==================== CRIAR 10 ONGs ====================
  console.log('🏢 Creating 10 ONGs...\n');

  const ongsData = [
    {
      name: 'ONG Esperança',
      email: 'contato@ongesperanca.org',
      cnpj: '12.345.678/0001-90',
      status: 'pending',
    },
    {
      name: 'Instituto Viver Bem',
      email: 'contato@viverbem.org.br',
      cnpj: '98.765.432/0001-10',
      status: 'verified',
    },
    {
      name: 'Fundação Amigos do Futuro',
      email: 'admin@amigosdofuturo.org',
      cnpj: '11.222.333/0001-44',
      status: 'verified',
    },
    {
      name: 'Associação Mãos Solidárias',
      email: 'contato@maossolidarias.org',
      cnpj: '22.333.444/0001-55',
      status: 'pending',
    },
    {
      name: 'ONG Luz da Vida',
      email: 'contato@luzdavida.org.br',
      cnpj: '33.444.555/0001-66',
      status: 'rejected',
    },
    {
      name: 'Instituto Crescer',
      email: 'admin@institutocrescer.org',
      cnpj: '44.555.666/0001-77',
      status: 'verified',
    },
    {
      name: 'Casa da Esperança',
      email: 'contato@casaesperanca.org',
      cnpj: '55.666.777/0001-88',
      status: 'pending',
    },
    {
      name: 'Fundação Semear',
      email: 'admin@fundacaosemear.org.br',
      cnpj: '66.777.888/0001-99',
      status: 'verified',
    },
    {
      name: 'ONG Renascer',
      email: 'contato@ongrenascer.org',
      cnpj: '77.888.999/0001-11',
      status: 'rejected',
    },
    {
      name: 'Instituto Amor e Paz',
      email: 'admin@amorepaz.org.br',
      cnpj: '88.999.000/0001-22',
      status: 'pending',
    },
  ];

  const createdOngs: Ong[] = [];

  for (const [index, ongData] of ongsData.entries()) {
    const ongPassword = await bcrypt.hash('Ong@123456', 10);
    
    const ongUser = await prisma.user.create({
      data: {
        name: ongData.name,
        email: ongData.email,
        password: ongPassword,
        role: 'ong',
      },
    });

    const ong = await prisma.ong.create({
      data: {
        userId: ongUser.id,
        cnpj: ongData.cnpj,
        verificationStatus: ongData.status as VerificationStatus,
        verifiedAt: ongData.status !== 'pending' 
          ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          : null,
        verifiedById: ongData.status !== 'pending' ? adminUser.id : null,
        rejectionReason: ongData.status === 'rejected' 
          ? 'Documentação incompleta ou irregular.'
          : null,
      },
    });

    createdOngs.push(ong);

    const statusIcon = 
      ongData.status === 'verified' ? '✅' : 
      ongData.status === 'rejected' ? '❌' : 
      '⏳';

    console.log(`${statusIcon} ONG ${index + 1}: ${ongData.name}`);
    console.log(`   Email: ${ongData.email}`);
    console.log(`   CNPJ: ${ongData.cnpj}`);
    console.log(`   Status: ${ongData.status}`);
    console.log(`   Password: Ong@123456\n`);
  }

  // ==================== CRIAR DOAÇÕES DE EXEMPLO ====================
  console.log('💝 Creating sample donations...\n');

  // Pegar ONGs verificadas para receber doações
  const verifiedOngs = createdOngs.filter((_, i) => ongsData[i].status === 'verified');

  if (verifiedOngs.length > 0) {
    // Doação monetária
    await prisma.donation.create({
      data: {
        donationType: 'monetary',
        donationStatus: 'completed',
        monetaryAmount: 500.00,
        monetaryCurrency: 'BRL',
        donorId: donorUser.id,
        ongId: verifiedOngs[0].userId,
      },
    });

    // Doação material
    await prisma.donation.create({
      data: {
        donationType: 'material',
        donationStatus: 'pending',
        materialDescription: 'Cestas básicas',
        materialQuantity: 20,
        donorId: donorUser.id,
        ongId: verifiedOngs[1]?.userId || verifiedOngs[0].userId,
      },
    });

    // Doação cancelada
    await prisma.donation.create({
      data: {
        donationType: 'monetary',
        donationStatus: 'canceled',
        monetaryAmount: 100.00,
        monetaryCurrency: 'BRL',
        donorId: donorUser.id,
        ongId: verifiedOngs[2]?.userId || verifiedOngs[0].userId,
      },
    });

    console.log('✅ Created 3 sample donations');
  }

  // ==================== RESUMO ====================
  console.log('\n' + '='.repeat(50));
  console.log('📊 SEED SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ 1 Admin created`);
  console.log(`✅ 1 Donor created`);
  console.log(`✅ 10 ONGs created:`);
  console.log(`   - ${ongsData.filter(o => o.status === 'verified').length} Verified`);
  console.log(`   - ${ongsData.filter(o => o.status === 'pending').length} Pending`);
  console.log(`   - ${ongsData.filter(o => o.status === 'rejected').length} Rejected`);
  console.log(`✅ 3 Sample donations created\n`);

  console.log('🔑 LOGIN CREDENTIALS:');
  console.log('─'.repeat(50));
  console.log('ADMIN:');
  console.log(`  Email: admin@sistema.com`);
  console.log(`  Password: Admin@123456\n`);
  console.log('DONOR:');
  console.log(`  Email: carlos.oliveira@email.com`);
  console.log(`  Password: Donor@123456\n`);
  console.log('ONGs (all):');
  console.log(`  Password: Ong@123456`);
  console.log(`  Emails: Check the output above\n`);
  console.log('⚠️  REMEMBER: Change these passwords in production!');
  console.log('='.repeat(50) + '\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });