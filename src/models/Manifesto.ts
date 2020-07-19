// manifesto <=> party
// manifesto <=> policies(for the state)

import { Document, Schema, model, Types } from "mongoose";

// manifesto (party can add in menifesto to show/know crediblity of their MLA) -> policies addr. by MLA by solving voters proposal/complaint.
type manifestoModel = Document & ({
    party: Types.ObjectId;
    policies: [Types.ObjectId]
})

const manifestoSchema = new Schema({
    party: {
        type: Schema.Types.ObjectId,
        ref: 'Party',
        required: true
    },
    policies: {
        type: [Schema.Types.ObjectId],
        ref: 'Policy',
        required: true
    },
    newPolicies: { // MLA based new policies
        type: [Schema.Types.ObjectId],
        ref: 'Policy'
    }
})

const Manifesto = model<manifestoModel>("Manifesto", manifestoSchema);

export default Manifesto;