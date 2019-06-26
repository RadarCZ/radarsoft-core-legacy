import { logger } from '../../config/winston'

export default (address: string, port: number) => {
    logger.info(`Connected to ${address}:${port}`)
}
