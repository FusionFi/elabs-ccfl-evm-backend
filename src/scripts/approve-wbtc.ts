import { ethers } from "ethers";
import * as fs from 'fs';

const abi = JSON.parse(fs.readFileSync('./abi/WBTC.json', 'utf8'));

const providerURL =
  'https://eth-sepolia.g.alchemy.com/v2/h_yCYWntvdt2dbI4vL2J-XjZnQk0jYnl';

const provider = new ethers.JsonRpcProvider(providerURL);

// Replace with your wallet's private key
const wallet = new ethers.Wallet('0xac9b9103b72ac0281f5e82414478a54ebb4e6489195d072891168d74958141c6', provider);

// The address of the ERC20 token contract
const tokenAddress = '0x29f2d40b0605204364af54ec677bd022da425d03';

// The address to approve
const spenderAddress = '0x03aEf0CffcD9EdDE95692bF262B24E4240B19203';

// Create a contract instance
const tokenContract = new ethers.Contract(tokenAddress, abi, wallet);

async function approve() {
    try {
        // Send the approval transaction
        const tx = await tokenContract.approve(spenderAddress, BigInt(1e7));
        console.log('Transaction hash:', tx.hash);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log('Transaction was mined in block:', receipt.blockNumber);
    } catch (error) {
        console.error('Error during approval:', error);
    }
}

approve();
