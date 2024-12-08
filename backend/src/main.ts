import { AppModule } from '@/app.module'
import { clerkMiddleware } from '@clerk/express'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { log } from 'console'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	// config global prefix
	app.setGlobalPrefix('api')
	// config swagger
	const config = new DocumentBuilder()
		.setTitle('API Documentation')
		.setDescription('API documentation for the project')
		.setVersion('1.0')
		.addBearerAuth()
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document)
	log('[DEV]', `Swagger is running on http://localhost:${process.env.PORT || 8000}/api`)
	// config clerk
	app.use(clerkMiddleware())
	// Kích hoạt global validation pipe
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, // Loại bỏ các thuộc tính không khai báo trong DTO
			forbidNonWhitelisted: true, // Ném lỗi nếu có thuộc tính không hợp lệ
			transform: true // Tự động chuyển đổi dữ liệu (ví dụ: string thành số)
		})
	)
	// start app
	await app.listen(process.env.PORT ?? 8000)
}
bootstrap()
