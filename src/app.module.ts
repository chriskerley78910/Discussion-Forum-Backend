import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionModule } from './api/question/question.module';
import { QuestionEntity }from './api/question/question.entity'
import { ReplyEntity } from './api/reply/reply.entity';
import { ReplyModule } from './api/reply/reply.module';
import { UserModule } from './api/user/user.module';
import { UserEntity } from './api/user/user.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),   
    }),
    QuestionModule,
    ReplyModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql_service', // docker container name of the database.
      port: 3306,
      username: 'chris',
      password: 'password',
      database: 'chris',
      entities: [QuestionEntity, ReplyEntity, UserEntity],
      synchronize: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
