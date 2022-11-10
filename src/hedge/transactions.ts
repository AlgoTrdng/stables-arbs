import { AccountMeta, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js'

import { ArbitrageType, connection, Mints, solWallet } from '../constants.js'
import { forceFetch } from '../utils/forceFetch.js'
import { sendAndConfirmTransaction } from '../utils/sendAndConfirmTransaction.js'
import { buildInstructionArguments } from './layouts.js'

const USH_PROGRAM_ID = new PublicKey('HedgeEohwU6RqokrvPU4Hb6XKPub8NuKbnPmY7FoMMtN')

const VAULT_SYSTEM_STATE = new PublicKey('57dko82JWxJxPkHvZAYtkAeCKQVrxBS1kgqPahuwFNzc')
const FEE_POOL = new PublicKey('CGRRN12pCXNTZToaJCqq11NeFbH4YKixqCNhXRXnFpi8')
const FEE_POOL_ATA_USH = new PublicKey('FD1JTui5tU9XKvPHveuPsb8CnvsZqaxeu8QJ8LS7oV4a')
const PSM_ACCOUNT = new PublicKey('Bizd3Pmkvp9C792ZNDn6ogpExqatUUHEzcvu2Q6JHDfb')
const PSM_ACCOUNT_ATA = new PublicKey('5Gs3r5gx6jm7f54f1D2YePv44CZnUAyz7h5tA9jbZCPN')
const REFERRAL_STATE = new PublicKey('6ENsq1nuZKuDv6qus91W4vzC37cEFEe1Xp1cgvMeQnDb')
const REFERRAL_ACCOUNT = new PublicKey('2iotFL6gxQmkjNaymEFamhQz1gnzSyZq6n1LKVVgNEKc')
const TOKEN_PROGRAM = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

const PSM_REDEEM_KEYS: AccountMeta[] = [
  // payer
  { pubkey: VAULT_SYSTEM_STATE, isWritable: true, isSigner: false },
  { pubkey: FEE_POOL, isWritable: true, isSigner: false },
  { pubkey: FEE_POOL_ATA_USH, isWritable: true, isSigner: false },
  { pubkey: PSM_ACCOUNT, isWritable: true, isSigner: false },
  { pubkey: PSM_ACCOUNT_ATA, isWritable: true, isSigner: false },
  // Owner ush
  // Owner collateral (usdc)
  { pubkey: Mints.USDC, isWritable: false, isSigner: false },
  { pubkey: Mints.USH, isWritable: true, isSigner: false },
  { pubkey: REFERRAL_STATE, isWritable: true, isSigner: false },
  { pubkey: REFERRAL_ACCOUNT, isWritable: true, isSigner: false },
  { pubkey: SystemProgram.programId, isWritable: false, isSigner: false },
  { pubkey: TOKEN_PROGRAM, isWritable: false, isSigner: false },
]

const buildRedeemTx = async (amountRaw: number) => {
  const latestBlockHash = await forceFetch(() => connection.getLatestBlockhash())
  const tx = new Transaction(latestBlockHash)

  const txData = buildInstructionArguments(amountRaw, 'redeem')
  tx.add(
    new TransactionInstruction({
      data: txData,
      keys: PSM_REDEEM_KEYS,
      programId: USH_PROGRAM_ID,
    }),
  )
  return tx
}

const buildMintTx = async (amountRaw: number) => {
  const latestBlockHash = await forceFetch(() => connection.getLatestBlockhash())
  const tx = new Transaction(latestBlockHash)

  const txData = buildInstructionArguments(amountRaw, 'mint')
  tx.add(
    new TransactionInstruction({
      data: txData,
      keys: PSM_REDEEM_KEYS,
      programId: USH_PROGRAM_ID,
    }),
  )
  return tx
}

export const redeemUsdh = async (amountRaw: number, type: ArbitrageType) => {
  const latestBlockHash = await forceFetch(() => connection.getLatestBlockhash())
  const tx = new Transaction(latestBlockHash)

  const txData = buildInstructionArguments(amountRaw, type)
  tx.add(
    new TransactionInstruction({
      data: txData,
      keys: PSM_REDEEM_KEYS,
      programId: USH_PROGRAM_ID,
    }),
  )
  tx.sign(solWallet)

  const res = await sendAndConfirmTransaction(tx)
}