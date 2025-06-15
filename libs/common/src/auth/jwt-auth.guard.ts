import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { UserDto } from '../dto';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // const jwt = context.switchToHttp().getRequest().cookies?.Authentication;

    const request = context.switchToHttp().getRequest() as Request;
    const jwt = request.cookies?.Authentication;

    if (!jwt) {
      return false;
    }
    return this.authClient
      .send<UserDto>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((res: UserDto) => {
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
        catchError((err) => {
          console.error('Authentication microservice error:', err);
          return throwError(
            () => new UnauthorizedException('Authentication failed'),
          );
        }),
      );
  }
}
