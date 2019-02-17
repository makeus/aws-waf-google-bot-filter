import Poster from '../../../src/aws/poster'

describe('Poster', () => {

    describe('#updateIpSet', () => {

        test('should get changetoken after which it should call updateIPSet with updates generated from given IPS', async () => {

            let wafClient = {
                getChangeToken: jest.fn().mockImplementation(() => (
                    {promise: () => Promise.resolve({ChangeToken: 'abcd12f2-46da-4fdb-b8d5-fbd4c466928f'})}
                )),
                updateIPSet: jest.fn().mockImplementation(() => (
                    {promise: () => Promise.resolve()}
                )),
            }

            // @ts-ignore
            let poster = new Poster(wafClient)

            let IP1 = {Value: '66.249.66.1', Type: 'IPV4'}
            let IP2 = {Value: '66.249.66.4', Type: 'IPV4'}

            await poster.updateIpSet('example1ds3t-46da-4fdb-b8d5-abc321j569j5', [IP1, IP2])

            expect(wafClient.updateIPSet).toHaveBeenCalledWith({
                ChangeToken: 'abcd12f2-46da-4fdb-b8d5-fbd4c466928f',
                IPSetId: 'example1ds3t-46da-4fdb-b8d5-abc321j569j5',
                Updates: [
                    {
                        IPSetDescriptor: IP1,
                        Action: 'DELETE',
                    },
                    {
                        IPSetDescriptor: IP1,
                        Action: 'INSERT',
                    },
                    {
                        IPSetDescriptor: IP2,
                        Action: 'DELETE',
                    },
                    {
                        IPSetDescriptor: IP2,
                        Action: 'INSERT',
                    },
                ],
            })
        })


    })

})