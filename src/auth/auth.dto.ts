export class SiweChallengeBody {
  address!: `0x${string}`;

  domain!: string;

  uri!: string;

  statement: string = 'Sign-in with Ethereum';
}

export class SiweSigninBody {
  message!: string;

  signature!: string;
}
