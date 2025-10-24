import { OngResponseDto } from 'src/ongs/dto/ong-response.dto';

export function mapOng(ong: any): OngResponseDto {
  return {
    id: ong.id,
    name: ong.user.name,
    email: ong.user.email,
    cnpj: ong.cnpj,
    isVerified: ong.isVerified,
    createdAt: ong.createdAt,
    updatedAt: ong.updatedAt,
  };
}
