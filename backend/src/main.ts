import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { log } from 'console'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	// config swagger
	const config = new DocumentBuilder()
  .setTitle('API Documentation')
  .setDescription('API documentation for the project')
  .setVersion('1.0')
  .build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	// start app
	await app.listen(process.env.PORT ?? 8000)
	console.info(`Server is running on http://localhost:${process.env.PORT ?? 8000}`)
}
bootstrap()



