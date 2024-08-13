import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Network } from 'src/network/entity/network.entity';
import { Collateral } from 'src/collateral/entity/collateral.entity';
import { Supply } from 'src/supply/entity/supply.entity';
import { Setting } from 'src/setting/entity/setting.entity';
import { Role } from 'src/role/role.enum';
import { ConfigService } from 'src/config/config.service';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Network)
    private networkRepository: Repository<Network>,

    @InjectRepository(Collateral)
    private collateralRepository: Repository<Collateral>,

    @InjectRepository(Supply)
    private supplyRepository: Repository<Supply>,

    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,
  ) {}

  async seed() {
    try {
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

      const networks = [
        {
          name: 'Ethereum Mainnet',
          code: 'ETH_MAINNET',
          chainId: '1',
          txUrl: 'https://etherscan.io/tx/__TX_HASH__',
          rpcUrl: 'https://eth-pokt.nodies.app',
          isMainnet: true,
          isActive: true,
        },
        {
          name: 'Sepolia',
          code: 'ETH_TESTNET_SEPOLIA',
          chainId: '11155111',
          txUrl: 'https://sepolia.etherscan.io/tx/__TX_HASH__',
          rpcUrl: 'https://1rpc.io/sepolia',
          isMainnet: false,
          isActive: true,
        },
        {
          name: 'Polygon Mainnet',
          code: 'POLYGON_MAINNET',
          chainId: '137',
          txUrl: 'https://polygonscan.com/tx/__TX_HASH__',
          rpcUrl: 'https://polygon.drpc.org',
          isMainnet: true,
          isActive: true,
        },
        {
          name: 'Amoy',
          code: 'POLYGON_TESTNET_AMOY',
          chainId: '80002',
          txUrl: 'https://amoy.polygonscan.com/tx/__TX_HASH__',
          rpcUrl: 'https://polygon-amoy.drpc.org',
          isMainnet: false,
          isActive: true,
        },
      ];

      for (const item of networks) {
        const existNetwork = await this.networkRepository.findOneBy({
          chainId: item.chainId,
        });
        if (!existNetwork) {
          await this.networkRepository.save(item);
        }
      }

      const collaterals = [
        {
          type: 'native',
          chain: 'ETH_MAINNET',
          name: 'Ethereum Mainnet',
          symbol: 'ETH',
          address: null,
          decimals: 18,
          price: 4000,
          isMainnet: true,
          isActive: true,
        },
        {
          type: 'token',
          chain: 'ETH_MAINNET',
          name: 'Wrapped BTC',
          symbol: 'WBTC',
          address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
          decimals: 8,
          price: 60000,
          isMainnet: true,
          isActive: true,
        },
        {
          type: 'native',
          chain: 'ETH_TESTNET_SEPOLIA',
          name: 'Ethereum Testnet Sepolia',
          symbol: 'ETH',
          address: null,
          decimals: 18,
          price: 4000,
          isMainnet: false,
          isActive: true,
        },
        {
          type: 'token',
          chain: 'ETH_TESTNET_SEPOLIA',
          name: 'WBTC',
          symbol: 'WBTC',
          address: '0x29f2d40b0605204364af54ec677bd022da425d03',
          decimals: 8,
          price: 60000,
          isMainnet: false,
          isActive: true,
        },
        {
          type: 'token',
          chain: 'POLYGON_MAINNET',
          name: 'Wrapped Ether',
          symbol: 'WETH',
          address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
          decimals: 18,
          price: 4000,
          isMainnet: true,
          isActive: true,
        },
        {
          type: 'token',
          chain: 'POLYGON_MAINNET',
          name: '(PoS) Wrapped BTC',
          symbol: 'WBTC',
          address: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
          decimals: 8,
          price: 60000,
          isMainnet: true,
          isActive: true,
        },
        {
          type: 'token',
          chain: 'POLYGON_TESTNET_AMOY',
          name: 'Wrapped Ether',
          symbol: 'WETH',
          address: '0x52ef3d68bab452a294342dc3e5f464d7f610f72e',
          decimals: 18,
          price: 4000,
          isMainnet: false,
          isActive: true,
        },
        {
          type: 'token',
          chain: 'POLYGON_TESTNET_AMOY',
          name: 'WBTC',
          symbol: 'WBTC',
          address: '0xd0b33a7acb9303d9fe2de7ba849ec9b96a4c10c1',
          decimals: 8,
          price: 60000,
          isMainnet: false,
          isActive: true,
        },
      ];

      for (const item of collaterals) {
        const existCollateral = await this.collateralRepository.findOneBy({
          chain: item.chain,
          symbol: item.symbol,
          address: item.address,
        });
        if (!existCollateral) {
          await this.collateralRepository.save(item);
        }
      }

      const supply = [
        {
          chain: 'ETH_MAINNET',
          name: 'USDC',
          symbol: 'USDC',
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          decimals: 6,
          price: 1,
          isMainnet: true,
          isActive: true,
        },
        {
          chain: 'ETH_MAINNET',
          name: 'Tether USD',
          symbol: 'USDT',
          address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          decimals: 6,
          price: 1,
          isMainnet: true,
          isActive: true,
        },
        {
          chain: 'ETH_TESTNET_SEPOLIA',
          name: 'USDC',
          symbol: 'USDC',
          address: '0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8',
          decimals: 6,
          price: 1,
          isMainnet: false,
          isActive: true,
        },
        {
          chain: 'ETH_TESTNET_SEPOLIA',
          name: 'USDT',
          symbol: 'USDT',
          address: '0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0',
          decimals: 6,
          price: 1,
          isMainnet: false,
          isActive: true,
        },
        {
          chain: 'POLYGON_MAINNET',
          name: 'USD Coin',
          symbol: 'USDC',
          address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
          decimals: 6,
          price: 1,
          isMainnet: true,
          isActive: true,
        },
        {
          chain: 'POLYGON_MAINNET',
          name: '(PoS) Tether USD',
          symbol: 'USDT',
          address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
          decimals: 6,
          price: 1,
          isMainnet: true,
          isActive: true,
        },
        {
          chain: 'POLYGON_TESTNET_AMOY',
          name: 'USD Coin',
          symbol: 'USDC',
          address: '0xc091020dd0e357989f303fc99ac5899fa343ff6d',
          decimals: 6,
          price: 1,
          isMainnet: false,
          isActive: true,
        },
        {
          chain: 'POLYGON_TESTNET_AMOY',
          name: 'Tether USD',
          symbol: 'USDT',
          address: '0x1616d425cd540b256475cbfb604586c8598ec0fb',
          decimals: 6,
          price: 1,
          isMainnet: false,
          isActive: true,
        },
      ];

      for (const item of supply) {
        const existSupply = await this.supplyRepository.findOneBy({
          chain: item.chain,
          symbol: item.symbol,
          address: item.address,
        });
        if (!existSupply) {
          await this.supplyRepository.save(item);
        }
      }

      const settings = [
        {
          key: 'MAX_LTV',
          value: '50',
          type: 'number',
        },
        {
          key: 'LIQUIDATION_THRESHOLD',
          value: '70',
          type: 'number',
        },
        {
          key: 'LIQUIDATOR',
          value: '0x17883e3728E7bB528b542B8AAb354022eD20C149',
          type: 'string',
        },
        {
          key: 'PLATFORM',
          value: '0x17883e3728E7bB528b542B8AAb354022eD20C149',
          type: 'string',
        },
        {
          key: 'YIELD_BORROWER',
          value: '70',
          type: 'number',
        },
        {
          key: 'YIELD_PLATFORM',
          value: '20',
          type: 'number',
        },
        {
          key: 'YIELD_LENDER',
          value: '10',
          type: 'number',
        },
        {
          key: 'PENALTY_TOTAL',
          value: '2',
          type: 'number',
        },
        {
          key: 'PENALTY_LIQUIDATOR',
          value: '1',
          type: 'number',
        },
        {
          key: 'PENALTY_PLATFORM',
          value: '0.5',
          type: 'number',
        },
        {
          key: 'PENALTY_LENDER',
          value: '0.5',
          type: 'number',
        },
      ];

      for (const item of settings) {
        const existSetting = await this.settingRepository.findOneBy({
          key: item.key,
        });
        if (!existSetting) {
          await this.settingRepository.save(item);
        }
      }
    } catch (e) {
      this.logger.error('[Seeder] Failed with error: ', e);
    }
  }
}
