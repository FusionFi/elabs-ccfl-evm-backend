import { ethers } from 'ethers';
import * as fs from 'fs';

const abi = JSON.parse(fs.readFileSync('./abi/CCFLPool.json', 'utf8'));

const contractAddress = '0xD6483bb4aBEfc87812E5eb5a601Cfe70cD84F419';

const providerURL =
  'https://eth-sepolia.g.alchemy.com/v2/h_yCYWntvdt2dbI4vL2J-XjZnQk0jYnl';

const provider = new ethers.JsonRpcProvider(providerURL);

const contract = new ethers.Contract(contractAddress, abi, provider);

async function getContractData() {
  try {
    const data = await contract.getTotalSupply();
    console.log('Data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

getContractData();
