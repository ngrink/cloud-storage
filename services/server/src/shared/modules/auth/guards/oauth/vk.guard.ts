import { AuthGuard } from '@nestjs/passport';

export class VKGuard extends AuthGuard('vkontakte') {}
