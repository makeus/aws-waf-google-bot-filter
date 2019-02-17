import Runner from './runner'
import Poster from './aws/poster'
import Retriever from './aws/retriever'

import {WAFRegional} from 'aws-sdk';

type event = { sourceIpSetId: string, resultSourceSetId: string }


exports.handler = async ({sourceIpSetId, resultSourceSetId}: event, context: object) => {
    let runner = new Runner(new Poster(new WAFRegional()), new Retriever(new WAFRegional()))

    await runner.run(sourceIpSetId, resultSourceSetId)
};