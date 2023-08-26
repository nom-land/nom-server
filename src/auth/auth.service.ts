import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { generateNonce, SiweMessage } from 'siwe';
import { getAddress } from 'viem';
import { crossbell } from 'viem/chains';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateChallenge({
    address,
    domain,
    uri,
    statement,
  }: {
    address: `0x${string}`;
    domain: string;
    uri: string;
    statement: string;
  }) {
    const nonce = generateNonce();
    // 5 mintues
    const siweMessage = new SiweMessage({
      domain,
      address: getAddress(address),
      statement,
      uri,
      version: '1',
      chainId: crossbell.id,
      nonce,
      issuedAt: new Date().toISOString(),
    });

    const message = siweMessage.prepareMessage();

    // await this.redis.set(`siwe:challenge:${address}`, message, 'EX', 60 * 5);

    return message;
  }

  async signin(message: string, signature: string): Promise<string> {
    const siweMessage = new SiweMessage(message);
    try {
      siweMessage.verify({ signature });
      const jwtPayload = {
        address: siweMessage.address,
      };

      const token = await this.jwtService.signAsync(jwtPayload);

      return token;
    } catch {
      throw new HttpException('Signature verification failed', 400);
    }
  }
}
