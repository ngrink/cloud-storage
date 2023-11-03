import { PartialType } from '@nestjs/swagger';
import { Profile } from '../entities/profile.entity';

export class UpdateProfileDto extends PartialType(Profile) {}
