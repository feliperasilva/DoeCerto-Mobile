import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDonationDto, DonationType } from './dto/create-donation.dto';
import { DonationStatus, UpdateDonationDto } from './dto/update-donation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class DonationsService {
  private readonly donationInclude = {
    ong: true,
    donor: true,
  } as const;

  constructor(private readonly prisma: PrismaService) {}

  async create(createDonationDto: CreateDonationDto, donorId: number) {
    const {
      ongId,
      materialDescription,
      materialQuantity,
      donationType,
      monetaryAmount,
      monetaryCurrency,
    } = createDonationDto;

    // Verify ONG exists
    await this.verifyOngExists(ongId);

    return this.prisma.donation.create({
      data: {
        donorId,
        ongId,
        donationType,
        monetaryAmount,
        monetaryCurrency,
        materialDescription,
        materialQuantity,
      },
      include: this.donationInclude,
    });
  }

  async findAll() {
    return this.prisma.donation.findMany({
      include: this.donationInclude,
    });
  }

  async findOne(id: number) {
    const donation = await this.prisma.donation.findUnique({
      where: { id },
      include: this.donationInclude,
    });

    if (!donation) {
      throw new NotFoundException(`Donation with id ${id} not found`);
    }

    return donation;
  }

  async findByDonor(donorId: number, type?: DonationType) {
    const where: Prisma.DonationWhereInput = { donorId };

    if (type) {
      where.donationType = type;
    }

    return this.prisma.donation.findMany({
      where,
      include: this.donationInclude,
    });
  }

  async findByOng(ongId: number, type?: DonationType) {
    const where: Prisma.DonationWhereInput = { ongId };

    if (type) {
      where.donationType = type;
    }

    return this.prisma.donation.findMany({
      where,
      include: this.donationInclude,
    });
  }

  async update(
    id: number,
    updateDonationDto: UpdateDonationDto,
    requesterId: number,
  ) {
    const { donationStatus, materialDescription, materialQuantity } =
      updateDonationDto;

    const donation = await this.prisma.donation.findUnique({
      where: { id },
      select: {
        donorId: true,
        ongId: true,
        donationStatus: true,
        donationType: true,
      },
    });

    if (!donation) {
      throw new NotFoundException(`Donation with id ${id} not found`);
    }

    this.verifyUserAuthorization(donation, requesterId);

    const updateData: Prisma.DonationUpdateInput = {};
    const isCancelling = donationStatus === DonationStatus.canceled;

    // Handle cancellation
    if (isCancelling) {
      this.validateCancellation(donation.donationStatus);
      updateData.donationStatus = DonationStatus.canceled;
    } else if (donation.donationType === DonationType.monetary) {
      throw new BadRequestException('Monetary donations can only be canceled');
    }

    const isDonor = donation.donorId === requesterId;

    // Handle donor updates
    if (isDonor && donation.donationType === DonationType.material) {
      this.handleDonorUpdate(
        donation,
        updateData,
        materialDescription,
        materialQuantity,
        donationStatus,
      );
    }

    // Handle ONG updates
    if (!isDonor) {
      this.handleOngUpdate(
        donation,
        updateData,
        donationStatus,
        materialDescription,
        materialQuantity,
      );
    }

    // Only update if there are changes
    if (Object.keys(updateData).length === 0) {
      return this.findOne(id);
    }

    return this.prisma.donation.update({
      where: { id },
      data: updateData,
      include: this.donationInclude,
    });
  }

  async remove(id: number, requesterId: number) {
    const cancelDto: UpdateDonationDto = {
      donationStatus: DonationStatus.canceled,
    };
    return this.update(id, cancelDto, requesterId);
  }

  // Private helper methods
  private async verifyOngExists(ongId: number): Promise<void> {
    const ong = await this.prisma.ong.findUnique({ where: { userId: ongId } });
    if (!ong) {
      throw new NotFoundException(`ONG with id ${ongId} not found`);
    }

    if (ong.verificationStatus !== 'verified') {
      throw new BadRequestException(
        'Cannot donate to an unverified ONG. Please choose a verified organization.',
      );
    }
  }

  private verifyUserAuthorization(
    donation: { donorId: number; ongId: number },
    requesterId: number,
  ): void {
    const isDonor = donation.donorId === requesterId;
    const isOng = donation.ongId === requesterId;

    if (!isDonor && !isOng) {
      throw new BadRequestException(
        'You are not authorized to update this donation',
      );
    }
  }

  private validateCancellation(currentStatus: string): void {
    if (currentStatus !== DonationStatus.pending) {
      throw new BadRequestException('Only pending donations can be canceled');
    }
  }

  private handleDonorUpdate(
    donation: { donationStatus: string },
    updateData: Prisma.DonationUpdateInput,
    materialDescription?: string,
    materialQuantity?: number,
    donationStatus?: DonationStatus,
  ): void {
    if (donation.donationStatus !== DonationStatus.pending) {
      throw new BadRequestException('Only pending donations can be updated');
    }

    if (materialDescription !== undefined) {
      updateData.materialDescription = materialDescription;
    }

    if (materialQuantity !== undefined) {
      updateData.materialQuantity = materialQuantity;
    }

    if (donationStatus === DonationStatus.completed) {
      throw new BadRequestException(
        'Donors cannot mark donations as completed',
      );
    }
  }

  private handleOngUpdate(
    donation: { donationStatus: string },
    updateData: Prisma.DonationUpdateInput,
    donationStatus?: DonationStatus,
    materialDescription?: string,
    materialQuantity?: number,
  ): void {
    if (materialDescription !== undefined || materialQuantity !== undefined) {
      throw new BadRequestException(
        'Only donors can update material donation details',
      );
    }

    if (donationStatus !== undefined) {
      this.validateOngStatusUpdate(donation.donationStatus, donationStatus);
      updateData.donationStatus = donationStatus;
    }
  }

  private validateOngStatusUpdate(
    currentStatus: string,
    newStatus: DonationStatus,
  ): void {
    if (newStatus === DonationStatus.pending) {
      throw new BadRequestException(
        'Donation status can only be updated to CANCELED or COMPLETED',
      );
    }

    if (
      currentStatus === DonationStatus.canceled ||
      currentStatus === DonationStatus.completed
    ) {
      throw new BadRequestException(
        `Status cannot be changed for donations that are already ${currentStatus}`,
      );
    }
  }
}
