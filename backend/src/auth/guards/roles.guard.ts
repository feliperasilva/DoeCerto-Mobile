import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, UserRole } from '../decorators/roles.decorator';
import { User } from 'generated/prisma';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        context.getHandler(), // Lê o decorador no método do controlador
        context.getClass(), // Lê o decorador na classe do controlador
      ],
    );

    // Se nenhum papel for especificado (@Roles não usado), permite o acesso.
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    const loggedInUser: User = user;

    return requiredRoles.some((role) => loggedInUser.role === role);
  }
}
