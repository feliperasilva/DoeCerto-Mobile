import { 
  IsOptional, 
  IsString, 
  IsUrl, 
  MaxLength 
} from 'class-validator';

/**
 * DTO para atualização de perfil do doador.
 * Como o perfil já nasce com o doador, usamos este DTO para complementar
 * ou editar as informações de vitrine.
 */
export class UpdateDonorProfileDto {
  @IsOptional()
  @IsString({ message: 'A bio deve ser um texto' })
  @MaxLength(500, { message: 'A bio não pode exceder 500 caracteres' })
  bio?: string;

  @IsOptional()
  @IsString({ message: 'O número de contato deve ser um texto' })
  @MaxLength(20, { message: 'O número de contato é muito longo' })
  contactNumber?: string;

  @IsOptional()
  @IsString({ message: 'O endereço deve ser um texto' })
  @MaxLength(255, { message: 'O endereço é muito longo' })
  address?: string;
}
