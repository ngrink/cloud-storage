import { AuthGuard } from '@nestjs/passport';

export class YandexGuard extends AuthGuard('yandex') {}
