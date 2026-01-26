export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: 'donor' | 'ong' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
