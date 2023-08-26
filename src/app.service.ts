import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { readFile } from 'fs/promises';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async demo() {
    const demoHtml = await readFile(
      resolve(__dirname + './../examples/demo.html'),
      'utf-8',
    );
    return demoHtml;
  }
}
