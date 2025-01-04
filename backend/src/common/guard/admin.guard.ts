import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ])

        if (isPublic) {
            return true
        }

		const request = context.switchToHttp().getRequest()
		const { sessionClaims } = request.auth

		if (!sessionClaims?.metadata?.role) {
			throw new ForbiddenException('You are not have permission to access this resource')
		}

		return true
	}
}
