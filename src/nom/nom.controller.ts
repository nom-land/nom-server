import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NomService } from './nom.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Accountish, Curation } from 'nomland.js';
import { Contract } from 'crossbell';
import { permissions } from './nom.constants';

async function authorized(requester: `0x${string}`, curator: Accountish) {
  if (typeof curator === 'object') {
    return curator.handle.toLowerCase() === requester.toLowerCase();
  } else {
    const c = new Contract(undefined);
    const { data } = await c.operator.getPermissionsForCharacter({
      characterId: curator,
      operator: requester,
    });
    for (const p of permissions) {
      if (!data.includes(p)) {
        return false;
      }
    }
    return true;
  }
}

@Controller('nom')
export class NomController {
  constructor(private readonly nomService: NomService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/processCuration')
  async processCuration(@Body() body: any, @Request() req: any) {
    const { curation, url } = body;
    const user = req.user.address as `0x${string}`;
    const curator = (curation as Curation)?.curator;
    if (!(await authorized(user, curator))) {
      console.log('Invalid permission.');
      throw new Error('Invalid permission.');
    }
    return await this.nomService.processCuration(curation, url);
  }

  @Post('/ls')
  async ls(@Body() body: any, @Request() req: any) {
    console.log(body, req.user);
    const { community } = body;
    return await this.nomService.ls(community);
  }

  @Get('/ls/:listId')
  async lsById(@Param('listId') listId: any, @Request() req: any) {
    console.log(listId);
    const data = await this.nomService.lsById(listId);
    return JSON.stringify(data, (_, v) =>
      typeof v === 'bigint' ? v.toString() : v,
    );
  }

  @Get('/balanceOf/:addr')
  async balanceOf(@Param('addr') addr: string) {
    console.log(addr);
    return await this.nomService.balanceOf(addr);
  }
}
