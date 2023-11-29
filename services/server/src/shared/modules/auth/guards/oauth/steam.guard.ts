import { AuthGuard } from '@nestjs/passport';

export class SteamGuard extends AuthGuard('steam') {}
