// src/common/utils/exclude-password.util.ts
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export function excludePassword(user: any): UserResponseDto {
  const { password, ...rest } = user;
  return rest as UserResponseDto;
}
