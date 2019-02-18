import GoogleVerify from '../../src/google-verify'
import IP from '../../src/ip'
import Runner from '../../src/runner'

jest.mock('../../src/google-verify')

describe('Runner', () => {

    beforeEach(() => {
        // @ts-ignore
        GoogleVerify.mockClear()
    })

    describe('#run', () => {

        it('should call retriever and then poster with filtered response using GoogleVerify', async () => {

            // @ts-ignore
            GoogleVerify.isGoogleIp.mockImplementation((ip: IP) => {
                if (ip.Value === '68.249.66.4/32') {
                    return Promise.resolve(true)
                }
                return Promise.resolve(false)
            })

            let retriever = {
                getIps: jest.fn().mockResolvedValue([
                    {Value: '68.249.66.1/32', Type: 'IPV4'},
                    {Value: '68.249.66.4/32', Type: 'IPV4'},
                    {Value: '2001:4860:4801:1303:0:6006:1300:b075/128', Type: 'IPV6'},
                ]),
            }
            let poster = {
                updateIpSet: jest.fn().mockResolvedValue(undefined),
            }

            // @ts-ignore
            let runner = new Runner(poster, retriever)

            let resultSetId = 'example1ds3t-46da-4fdb-b8d5-22343dfsdf'
            let sourceSetId = 'example1ds3t-46da-4fdb-b8d5-abc321j569j5'
            await runner.run(sourceSetId, resultSetId)

            expect(GoogleVerify.isGoogleIp).toHaveBeenCalledTimes(3)
            expect(retriever.getIps).toHaveBeenCalledWith(sourceSetId)
            expect(poster.updateIpSet).toHaveBeenCalledWith(resultSetId, [{
                Value: '68.249.66.4/32', Type: 'IPV4',
            }])

        })

    })

})