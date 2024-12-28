import { AuthGuard } from '@/common/guard/auth.guard'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { BoardsModule } from './boards/boards.module'
import { CommonModule } from './common/common.module'
import { ImagesModule } from './images/images.module'
import { PinsModule } from './pins/pins.module'
import { UsersModule } from './users/users.module'
import { BoardPinModule } from './board-pin/board-pin.module';
import { CommentsModule } from './comments/comments.module';
import { FollowsModule } from './follows/follows.module';

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
		ImagesModule,
		BoardsModule,
		PinsModule,
		BoardPinModule,
		CommentsModule,
		FollowsModule
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		}
	]
})
export class AppModule {}
