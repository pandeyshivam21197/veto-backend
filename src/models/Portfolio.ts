// portfolio <=> user(in some party)
import {Schema, model, Document} from 'mongoose';

const valueDenomination = {
    value: String,
    denomintion: String
}

export type portfolioModel = Document & {

}

const portfolioSchema: Schema = new Schema({
    assets: {
        type: [valueDenomination]
    },
    liablities: {
        type: {
            value: String,
            denomintion: String
        }
    }
})

const Portfolio = model<portfolioModel>('Portfolio', portfolioSchema);

export default Portfolio;