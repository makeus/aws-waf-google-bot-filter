import Poster from '../../../src/aws/poster'
import Retriever from '../../../src/aws/retriever'

describe('Retriever', () => {

    describe('#getIps', () => {

        it('should get ips in the getIPSetResponse after calling waf client', async () => {

            let wafClient = {
                getIPSet: jest.fn().mockImplementation(() => (
                    {
                        promise: () => Promise.resolve({
                            IPSet: {
                                IPSetDescriptors: [
                                    {Type: 'IPV6', Value: '2001:4860:4801:1303:0:6006:1300:b075/128'},
                                    {Type: 'IPV4', Value: '66.249.66.1/32'},
                                ],
                            },
                        }),
                    }
                )),
            }

            // @ts-ignore
            let poster = new Retriever(wafClient)

            let result = await poster.getIps('example1ds3t-46da-4fdb-b8d5-abc321j569j5')

            expect(result[0].Type).toEqual('IPV6')
            expect(result[1].Value).toEqual('66.249.66.1/32')
        })
    })
})