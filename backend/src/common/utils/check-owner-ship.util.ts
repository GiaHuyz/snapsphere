import { UnauthorizedException } from '@nestjs/common';
import { Document, Model } from 'mongoose';

export function checkOwnership(
  document: { user_id: string } & Document,
  currentUserId: string,
): void {
  if (document.user_id !== currentUserId) {
    // TODO: Get the model name dynamically
    const modelName = document.constructor.name;
    throw new UnauthorizedException([`You are not the owner of this ${modelName}`]);
  }
}
