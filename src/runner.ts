import Poster from './aws/poster'
import Retriever from './aws/retriever'
import IP from './ip'
import GoogleVerify from './google-verify'


class Runner {

    private readonly poster: Poster
    private readonly retriever: Retriever

    constructor(poster: Poster, retriever: Retriever) {
        this.poster = poster
        this.retriever = retriever
    }

    public async run(sourceIPSetId: string, resultIPSetId: string): Promise<void> {
        let IPs = await this.retriever.getIps(sourceIPSetId)

        let IPsToAdd: IP[] = []

        await Promise.all(IPs.map((IP: IP) => GoogleVerify.isGoogleIp(IP).then((isGoogleIp) => {
            if (isGoogleIp) {
                IPsToAdd.push(IP)
            }
        })))

        await this.poster.updateIpSet(resultIPSetId, IPsToAdd)
    }
}

export default Runner