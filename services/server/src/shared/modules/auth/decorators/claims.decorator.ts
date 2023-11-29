import { SetMetadata } from '@nestjs/common';

export const CLAIMS_KEY = 'claims';
export const Claims = (...claims: any[]) => SetMetadata(CLAIMS_KEY, claims);
