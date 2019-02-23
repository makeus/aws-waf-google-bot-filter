import * as WAFRegional from 'aws-sdk/clients/wafregional'
import IP from '../ip'

class Poster {

    private readonly waf: WAFRegional

    constructor(waf: WAFRegional) {
        this.waf = waf
    }

    public async updateIpSet(IPSetId: string, IPS: IP[]): Promise<void> {
        if (IPS.length === 0) {
            return
        }

        let {ChangeToken} = await this.waf.getChangeToken().promise()

        let Updates = IPS.reduce((updates: WAFRegional.IPSetUpdates, ip: IP) => {
            updates.push({
                IPSetDescriptor: ip,
                Action: 'INSERT',
            })
            return updates
        }, [])

        await this.waf.updateIPSet({ChangeToken, IPSetId, Updates}).promise()

    }
}


export default Poster