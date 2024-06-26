import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import 'dotenv/config';

@Injectable()
export class SeederService {
  constructor(private userService: UserService) {}

  async seed(): Promise<void> {
    try {
      // TODO
    } catch (e) {}
  }
}
