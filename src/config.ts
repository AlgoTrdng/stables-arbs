import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
	SOL_PUBLIC_KEY: z.string().min(1),
	SOL_PRIVATE_KEY: z.string().min(1),
})

export const { SOL_PUBLIC_KEY, SOL_PRIVATE_KEY } = envSchema.parse(process.env)
