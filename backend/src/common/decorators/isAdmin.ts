import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const IsAdmin = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest()
    const { sessionClaims } = request.auth
	return sessionClaims?.metadata?.role === 'admin'
})
