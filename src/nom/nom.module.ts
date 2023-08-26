import { NomController } from './nom.controller';
import { NomService } from './nom.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('Secret'),
        signOptions: { expiresIn: '365d' },
      }),
      inject: [ConfigService],
    }),
    // JwtModule.register({
    //   // global: true
    //   secret:
    //     '407F0B8384D36B470966F99A79AC4B06F85EF71DBD71CB99BC8D539CBEC999B7',
    //   signOptions: { expiresIn: '365d' },
    // }),
  ],
  controllers: [NomController],
  providers: [NomService],
})
export class NomModule {}
