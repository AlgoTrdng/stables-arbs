import { ConfirmedTransactionMeta, Transaction } from '@solana/web3.js'
import { setTimeout } from 'node:timers/promises'

import { connection } from '../constants.js'

const MAX_CONFIRMATION_TIME = 120_000

export enum TransactionResponse {
	BLOCK_HEIGHT_EXCEEDED = 'blockHeightExceeded',
	GENERIC_ERROR = 'genericError',
	/** Max redemption time is exceeded */
	TIMEOUT = 'transactionTimedOut',
}

const watchTxConfirmation = async (startTime: number, txId: string, abortSignal: AbortSignal) => {
	while (new Date().getTime() - startTime < MAX_CONFIRMATION_TIME && !abortSignal.aborted) {
		const response = await Promise.any([
			connection.getTransaction(txId, {
				commitment: 'confirmed',
				maxSupportedTransactionVersion: 2,
			}),
			setTimeout(5000),
		])
		if (response?.meta) {
			if (response.meta.err) {
				return TransactionResponse.GENERIC_ERROR
			}

			return response.meta
		}
		await setTimeout(500)
	}

	return TransactionResponse.TIMEOUT
}

const watchBlockHeight = async (
	startTime: number,
	transaction: Transaction,
	abortSignal: AbortSignal,
) => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const txValidUntilBlockHeight = transaction.lastValidBlockHeight!

	while (new Date().getTime() - startTime < MAX_CONFIRMATION_TIME && !abortSignal.aborted) {
		let blockHeight = -1
		try {
			blockHeight = await connection.getBlockHeight(connection.commitment)
		} catch (err) {}

		if (blockHeight > txValidUntilBlockHeight) {
			return TransactionResponse.BLOCK_HEIGHT_EXCEEDED
		}

		await setTimeout(2000)
	}

	return TransactionResponse.TIMEOUT
}

export type SuccessResponse = {
	success: true
	data: ConfirmedTransactionMeta
}

export type ErrorResponse = {
	success: false
	err: null | TransactionResponse.BLOCK_HEIGHT_EXCEEDED
}

export const sendAndConfirmTransaction = async (
	transaction: Transaction,
): Promise<SuccessResponse | ErrorResponse> => {
	const rawTx = transaction.serialize()
	const txId = await connection.sendRawTransaction(rawTx, {
		maxRetries: 20,
		skipPreflight: true,
	})
	const startTime = new Date().getTime()

	const abortController = new AbortController()
	const response = await Promise.any([
		watchTxConfirmation(startTime, txId, abortController.signal),
		watchBlockHeight(startTime, transaction, abortController.signal),
	])
	abortController.abort()

	const blockHeightErr = TransactionResponse.BLOCK_HEIGHT_EXCEEDED
	if (typeof response === 'string') {
		return {
			success: false,
			err: response === blockHeightErr ? blockHeightErr : null,
		}
	}

	return {
		success: true,
		data: response,
	}
}
