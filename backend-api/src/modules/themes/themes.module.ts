import { Module } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { ThemesController } from './themes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemeEntity } from './entities/theme.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ThemeEntity])],
  providers: [ThemesService],
  controllers: [ThemesController]
})
export class ThemesModule {}
