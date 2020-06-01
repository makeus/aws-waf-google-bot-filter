import IP from '../../src/ip'

jest.mock('dns')

import {reverse} from 'dns'
import GoogleVerify from '../../src/google-verify'

describe('GoogleVerify', () => {

    beforeEach(() => {
        // @ts-ignore
        reverse.mockClear()
    })

    describe('#isGoogleIp', () => {


        for (let hostnames of [
            ['crawl-66-249-66-1.googlebot.com'],
            ['somehos.com', 'google.com'],
        ]) {

            test('should on correct hostname return true', async () => {
                // @ts-ignore
                reverse.mockImplementation((ip: string, cb) => {
                    cb(null, hostnames)
                })

                let ip: IP = {
                    Value: '10.245.66.1/32',
                    Type: 'IPV4',
                }

                expect(await GoogleVerify.isGoogleIp(ip)).toEqual(true)
                expect(reverse).toHaveBeenCalledWith('10.245.66.1', expect.any(Function))

            })
        }


        test('should on correct other hostnames return false', async () => {
            // @ts-ignore
            reverse.mockImplementation((ip: string, cb) => {
                cb(null, ['crawl-66-249-66-1.googlebot.com.fake', 'crawl-66-249-66-1.google'])
            })

            let ip: IP = {
                Value: '10.241.66.1/32',
                Type: 'IPV4',
            }

            expect(await GoogleVerify.isGoogleIp(ip)).toEqual(false)
            expect(reverse).toHaveBeenCalledWith('10.241.66.1', expect.any(Function))

        })

        test('should not try to retrieve ipv6', async () => {

            let ip: IP = {
                Value: '2001:4860:4801:1303:0:6006:1300:b075/128',
                Type: 'IPV6',
            }

            expect(await GoogleVerify.isGoogleIp(ip)).toEqual(false)
            expect(reverse).not.toHaveBeenCalled()

        })

        test('should on error return false', async () => {

            // @ts-ignore
            reverse.mockImplementation((ip: string, cb) => {
                throw new Error('etHostByAddr ENOTFOUND 154.83.122.134')
            })

            let ip: IP = {
                Value: '154.83.122.134/32',
                Type: 'IPV4',
            }

            expect(await GoogleVerify.isGoogleIp(ip)).toEqual(false)
            expect(reverse).toHaveBeenCalledWith('154.83.122.134', expect.any(Function))
        })
    })

})