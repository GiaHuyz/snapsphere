import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class AuthGuard implements CanActivate {
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
		const { userId } = request.auth

		if (!userId) {
			throw new UnauthorizedException('User is not authenticated')
		}

		return true
	}
}
