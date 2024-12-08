import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CommonModule } from './common/common.module'
import { ImagesModule } from './images/images.module'
import { UsersModule } from './users/users.module'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '@/common/guard/auth.guard'

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
		CommonModule,
		UsersModule,
		ImagesModule
	],
	controllers: [AppController],
	providers: [AppService, {
        provide: APP_GUARD,
        useClass: AuthGuard
    }]
})
export class AppModule {}
