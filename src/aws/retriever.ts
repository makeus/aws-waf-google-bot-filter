import * as WAFRegional from 'aws-sdk/clients/wafregional'
import IP from '../ip'


class Retriever {

    private readonly waf: WAFRegional

    constructor(waf: WAFRegional) {
        this.waf = waf
    }

    public async getIps(IPSetId: string): Promise<IP[]> {
        let response: WAFRegional.Types.GetIPSetResponse = await this.waf.getIPSet({IPSetId}).promise()
        return response.IPSet.IPSetDescriptors as IP[]
    }
}

export default Retriever