import { Controller, Get, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Render('index')
  async getList() {
    const list = await this.appService.getSongsList();
    return { songs: list, title: 'Список композиций' };
  }

  @Get('song/:id')
  @Render('song')
  async getSong(@Param('id') id: string) {
    const item = await this.appService.getById(id);
    return item;
  }
}
