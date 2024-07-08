import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageService {
  constructor() {}

  static USERNAME_ALREADY_USED = 'This username has already been used';
  static EMAIL_NOT_VERIFIED = 'Email has not been verified';
  static CANNOT_VERIFY_EMAIL = 'Cannot verify email';
  static USER_NOT_FOUND = 'User not found';
  static CANNOT_CHANGE_PASSWORD = 'Cannot change password';
}
