import {reverse} from 'dns'
import {promisify} from 'util'
import IP from './ip'

/**
 * @see https://support.google.com/webmasters/answer/80553
 */
const GOOGLEHOSTS = ['googlebot.com', 'google.com']

class GoogleVerify {

    /**
     * IP6 not supported
     * @param {IP} IP
     */
    public static async isGoogleIp(IP: IP): Promise<boolean> {
        if (IP.Type === 'IPV6') {
            return false
        }

        let ip = IP.Value.split('/').shift()

        let hostNames = await (promisify(reverse)(ip))

        return typeof hostNames.find((hostname: string) => {
            for (let host of GOOGLEHOSTS) {
                if (hostname.endsWith(host)) {
                    return true
                }
            }
            return false
        }) !== 'undefined'
    }
}

export default GoogleVerify