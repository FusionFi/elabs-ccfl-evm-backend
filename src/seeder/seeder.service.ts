import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Network } from 'src/admin/entity/network.entity';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/role/role.enum';
import { ConfigService } from 'src/config/config.service';
// import { AdminService } from 'src/admin/admin.service';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    // private userService: UserService

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Network)
    private networkRepository: Repository<Network>,
  ) {}

  async seed() {
    try {
      // const users: User[] = [];
      const user = new User();
      user.firstName = 'admin';
      user.lastName = 'admin';
      user.username = 'admin';
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(ConfigService.Admin.password, salt);
      user.role = Role.Admin;
      user.email = 'admin@gmail.com';
      user.emailVerified = true;
      user.isActive = true;

      const existUser = await this.userRepository.findOneBy({
        username: user.username,
      });
      if (!existUser) {
        await this.userRepository.save(user);
      }

      let network = new Network();
      network.name = "Sepolia";
      network.code = "ETH_TESTNET_SEPOLIA";
      network.chainId = "11155111";
      network.txUrl = "https://sepolia.etherscan.io/tx/__TX_HASH__";
      network.rpcUrl = "https://1rpc.io/sepolia";
      network.isActive = true;

      let existNetwork = await this.networkRepository.findOneBy({
        chainId: network.chainId,
      });
      if (!existNetwork) {
        await this.networkRepository.save(network);
      }
      
      // users.push(await this.userService.signUp(userData));
      // return users;
    } catch (e) {
      this.logger.error("[Seeder] Failed with error: ", e);
    }
  }
}
