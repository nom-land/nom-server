import { ConfigService } from '@nestjs/config';

export const authConstants = {
  secret: process.env.Secret,
};

console.log('authConstants.secret', authConstants.secret);
