import { ethers } from 'ethers';
import * as fs from 'fs';

const abi = JSON.parse(fs.readFileSync('./abi/CCFL.json', 'utf8'));

const contractAddress = '0x03aEf0CffcD9EdDE95692bF262B24E4240B19203';

const providerURL =
  'https://eth-sepolia.g.alchemy.com/v2/h_yCYWntvdt2dbI4vL2J-XjZnQk0jYnl';

const provider = new ethers.JsonRpcProvider(providerURL);

const privateKey =
  '0xac9b9103b72ac0281f5e82414478a54ebb4e6489195d072891168d74958141c6';
const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, abi, wallet);

async function createLoan() {
  try {
    const txResponse = await contract.createLoan(
      BigInt(10e6),
      '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
      BigInt(1e5),
      '0x29f2D40B0605204364af54EC677bD022dA425d03',
      false,
      false,
      { gasLimit: BigInt(200000) },
    );
    const txReceipt = await txResponse.wait();
    console.log('Transaction successful:', txReceipt);
  } catch (error) {
    console.error('Error calling contract method:', error);
  }
}

createLoan();
