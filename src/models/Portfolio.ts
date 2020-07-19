// portfolio <=> user(in some party)
import {Schema, model, Document} from 'mongoose';

const valueDenomination = {
    value: String,
    denomintion: String
}

export type portfolioModel = Document & {
    assets: [{
        value: string,
        denomination: string
    }];
    liablities: {
        value: string,
        denomination: string
    }
}

const portfolioSchema: Schema = new Schema({
    assets: {
        type: [valueDenomination]
    },
    liablities: {
        type: valueDenomination
    }
})

const Portfolio = model<portfolioModel>('Portfolio', portfolioSchema);

export default Portfolio;