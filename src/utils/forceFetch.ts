import { setTimeout } from 'node:timers/promises'

export const forceFetch = async <SuccessResponse>(
  cb: () => Promise<SuccessResponse>,
) => {
  while (true) {
    try {
      const res = await cb()
      if (res) {
        return res
      }
      setTimeout(200)
    } catch (error) {
      setTimeout(200)
    }
  }
}
