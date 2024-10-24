import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CardanoLoan } from './entity/cardano-loan.entity';
import { CardanoLoanDto } from './dto/cardano-loan.dto';
import { OracleData } from './entity/oracle-data.entity';
import { OracleDataDto } from './dto/oracle-data.dto';

@Injectable()
export class CardanoService {
  private readonly logger = new Logger(CardanoService.name);

  constructor(
    @InjectRepository(CardanoLoan)
    private cardanoLoanRepository: Repository<CardanoLoan>,

    @InjectRepository(OracleData)
    private oracleDataRepository: Repository<OracleData>,
  ) {}

  async createCardanoLoan(cardanoLoanDto: CardanoLoanDto) {
    try {
      return await this.cardanoLoanRepository.save(cardanoLoanDto);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findAllCardanoLoan(
    loanTokenName?: string,
    oracleTokenName?: string,
    userPkh?: string,
  ) {
    try {
      const searchObj: any = {};

      if (loanTokenName) {
        searchObj.loanTokenName = ILike(`%${loanTokenName}%`);
      }

      if (oracleTokenName) {
        searchObj.oracleTokenName = ILike(`%${oracleTokenName}%`);
      }

      if (userPkh) {
        searchObj.userPkh = ILike(`%${userPkh}%`);
      }

      return await this.cardanoLoanRepository.findBy(searchObj);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async createOracleData(oracleDataDto: OracleDataDto) {
    try {
      return await this.oracleDataRepository.save(oracleDataDto);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findAllOracleData(oracleTokenName?: string) {
    try {
      const searchObj: any = {};

      if (oracleTokenName) {
        searchObj.oracleTokenName = ILike(`%${oracleTokenName}%`);
      }

      return await this.oracleDataRepository.findBy(searchObj);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
