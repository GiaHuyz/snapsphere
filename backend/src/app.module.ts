import { AuthGuard } from '@/common/guard/auth.guard'
import KeyvRedis, { Keyv } from '@keyv/redis'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { BoardPinModule } from './board-pin/board-pin.module'
import { BoardsModule } from './boards/boards.module'
import { CommentsModule } from './comments/comments.module'
import { CommonModule } from './common/common.module'
import { FollowsModule } from './follows/follows.module'
import { LikesModule } from './likes/likes.module'
import { PinsModule } from './pins/pins.module'
import { ReportsModule } from './reports/reports.module'
import { TagsModule } from './tags/tags.module'

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
		CacheModule.registerAsync({
			isGlobal: true,
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				stores: [
					new Keyv({
						store: new KeyvRedis({
							username: configService.get<string>('REDIS_USERNAME'),
							password: configService.get<string>('REDIS_PASSWORD'),
							socket: {
								host: configService.get<string>('REDIS_HOST'),
								port: configService.get<number>('REDIS_PORT'),
								keepAlive: 30000
							},
							database: 0
						}),
						namespace: 'snapsphere',
						ttl: 30 * 60 * 1000
					})
				]
			}),
			inject: [ConfigService]
		}),
		CommonModule,
		BoardsModule,
		PinsModule,
		BoardPinModule,
		CommentsModule,
		FollowsModule,
		ReportsModule,
		LikesModule,
		TagsModule
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
