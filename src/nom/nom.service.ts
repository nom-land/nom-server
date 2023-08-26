import { Injectable } from '@nestjs/common';
import { Contract } from 'crossbell';
import Nomland, { Curation } from 'nomland.js';
import { appName, permissions } from './nom.constants';

@Injectable()
export class NomService {
  #nomland: Nomland;
  #contract: Contract;

  constructor() {
    let key = process.env.adminKey || '';
    key = key.startsWith('0x') ? key : '0x' + key;
    this.#nomland = new Nomland(appName, key as `0x${string}`);
    this.#contract = new Contract(key as `0x${string}`);
    console.log(this.#contract.account.address);
  }

  async processCuration(curation: Curation, url: string) {
    console.log(curation, url);

    const { cid, rid, record, curatorId, noteId } =
      await this.#nomland.processCuration(curation, url);
    if (typeof curation.curator === 'object') {
      const owner = curation.curator.handle as `0x${string}`;
      await this.#contract.operator.grantForCharacter({
        characterId: curatorId,
        permissions,
        operator: owner,
      });
    }
    console.log({ cid, rid, record, curatorId, noteId });
    return { cid, rid, record, curatorId, noteId };
  }

  async ls(community: string) {
    const { count, listNames } = await this.#nomland.ls(community);
    return { count, listNames };
  }

  async balanceOf(addr: string) {
    const { data } = await this.#nomland.balanceOf(addr as `0x${string}`);
    return data.toString();
  }
}
