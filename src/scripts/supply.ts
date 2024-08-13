import { ethers } from 'ethers';
import * as fs from 'fs';

const abi = JSON.parse(fs.readFileSync('./abi/CCFLPool.json', 'utf8'));

const contractAddress = '0xD6483bb4aBEfc87812E5eb5a601Cfe70cD84F419';

const providerURL =
  'https://eth-sepolia.g.alchemy.com/v2/h_yCYWntvdt2dbI4vL2J-XjZnQk0jYnl';

const provider = new ethers.JsonRpcProvider(providerURL);

const privateKey =
  '0xac9b9103b72ac0281f5e82414478a54ebb4e6489195d072891168d74958141c6';
const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, abi, wallet);

async function addSupply() {
  try {
    const txResponse = await contract.supply(BigInt(50e6), {
      gasLimit: BigInt(200000),
    });
    const txReceipt = await txResponse.wait();
    console.log('Transaction successful:', txReceipt);
  } catch (error) {
    console.error('Error calling contract method:', error);
  }
}

addSupply();
