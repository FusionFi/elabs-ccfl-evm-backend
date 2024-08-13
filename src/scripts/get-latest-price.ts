import { ethers } from 'ethers';
import * as fs from 'fs';

const abi = JSON.parse(fs.readFileSync('./abi/CCFL.json', 'utf8'));

const contractAddress = '0x03aEf0CffcD9EdDE95692bF262B24E4240B19203';

const providerURL =
  'https://eth-sepolia.g.alchemy.com/v2/h_yCYWntvdt2dbI4vL2J-XjZnQk0jYnl';

const provider = new ethers.JsonRpcProvider(providerURL);

const contract = new ethers.Contract(contractAddress, abi, provider);

async function getContractData() {
  try {
    const data = await contract.getLatestPrice(
      '0x29f2D40B0605204364af54EC677bD022dA425d03',
      false,
    );
    console.log('Data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

getContractData();
