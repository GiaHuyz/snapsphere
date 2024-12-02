import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { log } from 'console'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	// config swagger
	const config = new DocumentBuilder()
  .setTitle('API Documentation')
  .setDescription('API documentation for the project')
  .setVersion('1.0')
	.addBearerAuth()
  .build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	log('[DEV]',`Swagger is running on http://localhost:${process.env.PORT || 8000}/api`)
	// config clerk
  app.use(ClerkExpressWithAuth());
	// start app
	await app.listen(process.env.PORT ?? 8000)
	log('[DEV]',`Server is running on http://localhost:${process.env.PORT || 8000}` )
}
bootstrap()



