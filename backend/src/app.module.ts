import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CommonModule } from './common/common.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				uri: configService.get<string>('MONGODB_URI')
			}),
			inject: [ConfigService]
		}),
		CommonModule
	],
	controllers: [AppController, UsersController],
	providers: [AppService, UsersService]
})
export class AppModule { }


