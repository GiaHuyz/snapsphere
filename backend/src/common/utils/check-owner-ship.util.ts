import { UnauthorizedException } from '@nestjs/common';
import { Document } from 'mongoose';

export function checkOwnership(
  document: { user_id: string } & Document,
  currentUserId: string,
): void {
  if (document.user_id !== currentUserId) {
    throw new UnauthorizedException([`You are not the owner of this ${document.constructor.name}`]);
  }
}
