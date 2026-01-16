import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RatingDto } from './dto/rating.dto';


@Injectable()
export class RatingsService {

    constructor(private readonly prisma: PrismaService) {}

    async rateOng(ratingDto: RatingDto, donorId: number) {
        const { ongId, score, comment } = ratingDto;

        // 1. Validações fundamentais
        await this.verifyOngExists(ongId);
        await this.verifyDonorCanRate(ongId, donorId);

        // Nota: Remova a chamada ao "alreadyRated" se quiser permitir a atualização,
        // pois agora o objetivo é permitir que ele sobrescreva a avaliação anterior.

        return await this.prisma.$transaction(async (tx) => {
            // 2. Upsert: Cria ou Atualiza
            const rating = await tx.rating.upsert({
                where: {
                    ongId_donorId: { ongId, donorId },
                },
                update: { score, comment }, // Se já existir, atualiza esses campos
                create: { ongId, donorId, score, comment }, // Se não existir, cria
            });

            // 3. Recalcula estatísticas
            const stats = await tx.rating.aggregate({
                where: { ongId },
                _avg: { score: true },
                _count: { score: true },
            });

            await tx.ong.update({
                where: { userId: ongId },
                data: {
                    averageRating: stats._avg.score || 0,
                    numberOfRatings: stats._count.score || 0,
                },
            });

            return rating;
        });
    }

    private async verifyOngExists(ongId: number) {
        const ong = await this.prisma.ong.findUnique({
            where: { userId: ongId },
        });

        if (!ong) {
            throw new NotFoundException('ONG not found');
        }
    }

    private async verifyDonorCanRate(ongId: number, donorId: number) {
        const totalDonations = await this.prisma.donation.count({
            where: {
                ongId,
                donorId,
            },
        });

        if (totalDonations === 0) {
            throw new ForbiddenException('You can only rate ONGs you have donated to');
        }
    }

    async getOngRatings(ongId: number, skip = 0, take = 20) {

        await this.verifyOngExists(ongId);

        return this.prisma.rating.findMany({
            where: { ongId },
            select: {
                score: true,
                comment: true,
                createdAt: true, // Útil para mostrar "há 2 dias"
                donor: {
                    select: {
                        user: {
                            select: {
                                name: true, // Mostra o nome de quem avaliou
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc', // Comentários mais recentes primeiro
            },
            skip,
            take,
        });
    }
}