import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Asset } from 'src/asset/entity/asset.entity';
import { Network } from 'src/network/entity/network.entity';
import { Contract } from 'src/contract/entity/contract.entity';
import { Fiat } from 'src/fiat/entity/fiat.entity';
import { Cron, Interval } from '@nestjs/schedule';
import { ConfigService } from 'src/config/config.service';
import axios from 'axios';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { ethers } from 'ethers';
import * as fs from 'fs';

const abiCCFL = JSON.parse(fs.readFileSync('abi/CCFL.json', 'utf8'));
const abiCCFLLoan = JSON.parse(fs.readFileSync('abi/CCFLLoan.json', 'utf8'));

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,

    @InjectRepository(Network)
    private networkRepository: Repository<Network>,

    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,

    @InjectRepository(Fiat)
    private fiatRepository: Repository<Fiat>,

    @InjectBot() private bot: Telegraf<any>,
  ) {}

  @Cron(ConfigService.Cronjob.updateCryptoPrice)
  async handleUpdateCryptoPrice() {
    try {
      this.logger.log('Called every 1 minute to update all crypto prices');
      const data = await this.assetRepository
        .createQueryBuilder('asset')
        .select('DISTINCT(asset.coingecko_id)')
        .getRawMany();
      const allCgcIds = data.map((item) => item.coingecko_id).join(',');

      const coingeckoUrl = ConfigService.Coingecko.url;

      const price = await axios.get(`${coingeckoUrl}/v3/simple/price`, {
        params: {
          ids: allCgcIds,
          vs_currencies: 'usd',
        },
      });

      for (const item in price.data) {
        await this.assetRepository.update(
          { coingeckoId: item },
          { price: price.data[item]['usd'] },
        );
      }
      this.logger.log('Done for updating all crypto prices');
    } catch (error) {
      this.logger.error(
        `Error in updating all prices from coingecko: ${error}`,
      );
      this.bot.telegram.sendMessage(
        ConfigService.Telegram.groupId,
        `[SOS] Error in updating all prices from coingecko: ${error}`,
      );
    }
  }

  // @Cron(ConfigService.Cronjob.checkLiquidation)
  // @Interval(300000)
  async handleCheckLiquidation() {
    try {
      const ccfl = await this.contractRepository.findOneBy({
        isActive: true,
        type: ILike('ccfl'),
      });

      const network = await this.networkRepository.findOneBy({
        isActive: true,
        chainId: ccfl.chainId,
      });

      const provider = new ethers.JsonRpcProvider(network.rpcUrl);
      const wallet = new ethers.Wallet(ConfigService.Cronjob.operatorPrivateKey, provider);
      const contractCCFL = new ethers.Contract(ccfl.address, abiCCFL, wallet);

      const loandIds = await contractCCFL.loandIds();

      for (let i = 1; i < loandIds; i++) {
        console.log("\n================================");

        const loanAddress = await contractCCFL.getLoanAddress(i);

        const contractLoan = new ethers.Contract(
          loanAddress,
          abiCCFLLoan,
          provider,
        );

        const loanInfo = await contractLoan.getLoanInfo();

        if (!loanInfo.isClosed && !loanInfo.isLiquidated) {
          const healthFactor = await contractCCFL.getHealthFactor(i);
          this.logger.log(
            `Loan info:
            + loanId: ${i},
            + loanAddress: ${loanAddress},
            + healthFactor: ${healthFactor},
            + borrower: ${loanInfo.borrower},
            + amount: ${loanInfo.amount},
            + stableCoin: ${loanInfo.stableCoin},
            + isFiat: ${loanInfo.isFiat}`
          );

          if (healthFactor < 100) {
            const txResponse = await contractCCFL.liquidate(i);
            const txReceipt = await txResponse.wait();
            this.logger.log(
              `Liquidated successfully:
              + txReceipt: ${txReceipt}`
            );
            this.bot.telegram.sendMessage(
              ConfigService.Telegram.groupId,
              `Liquidated successfully:
              + loanId: ${i},
              + loanAddress: ${loanAddress},
              + healthFactor: ${healthFactor},
              + borrower: ${loanInfo.borrower},
              + amount: ${loanInfo.amount},
              + stableCoin: ${loanInfo.stableCoin},
              + isFiat: ${loanInfo.isFiat},
              + txReceipt: ${txReceipt}`
            );
            console.log("================================\n");
          } else {
            console.log('Good health factor');
            console.log("================================\n");
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error in checking liquidation: ${error}`);
      this.bot.telegram.sendMessage(
        ConfigService.Telegram.groupId,
        `[SOS] Error in checking liquidation: ${error}`,
      );
      console.log("================================\n");
    }
  }

  @Cron(ConfigService.Cronjob.updateFiatPrice)
  async handleUpdateFiatPrice() {
    try {
      this.logger.log('Called every 30 minutes to update all fiat prices');
      const prices = await axios.get(ConfigService.FiatPrice.url_1);

      for (const key in prices.data.conversion_rates) {
        await this.fiatRepository.save({
          currency: key,
          price: prices.data.conversion_rates[key],
        });
      }

      this.logger.log('Done for updating all fiat prices');
    } catch (err) {
      try {
        const prices = await axios.get(ConfigService.FiatPrice.url_2);

        for (const key in prices.data.rates) {
          await this.fiatRepository.save({
            currency: key,
            price: prices.data.rates[key],
          });
        }

        this.logger.log('Done for updating all fiat prices');
      } catch (error) {
        this.logger.error(
          `Error in updating fiat price with ${ConfigService.FiatPrice.url_1}: ${err}`,
        );
        this.logger.error(
          `Error in updating fiat price with ${ConfigService.FiatPrice.url_2}: ${error}`,
        );
        this.bot.telegram.sendMessage(
          ConfigService.Telegram.groupId,
          `[SOS] Error in updating fiat price with ${ConfigService.FiatPrice.url_1}: ${err}`,
        );
        this.bot.telegram.sendMessage(
          ConfigService.Telegram.groupId,
          `[SOS] Error in updating fiat price with ${ConfigService.FiatPrice.url_2}: ${error}`,
        );
      }
    }
  }
}
