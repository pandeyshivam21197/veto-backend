// policy - 1) state 2) constituency policy
// policy - 1) in manifesto -> policy<=>party -> party performance(rating)  new update on the currect policy. comment the policy
//          2) as a proposal to their MLA in their area(proposal) policy <=> user(MLA)->partyMeberDetails-> rating based on problem solved. 


// party or user will store the ref of policy
import { Schema, Document, Types, model } from "mongoose";

// policy solved by each MLA can be used by Party to add in extra Policies addressed in their manifesto => report card.
// party => should show the work of each of their MLA => total progress.
type policyModel = Document & ({
    //area: '' -> for user to describe.
    //user: user ref -> can get the position and detail of person file the proposal/complaint
    //category - '' -> Category of policy eg - Agriculture, Education, Culture Heritage , Foreign policy , Others -> can create new category
    //title - '' -> Title of policy -> skill dev, secnd educ. (under a specific category)
    //description - '' -> breif description about the policy
    //facts - ['', '', '', ''] -> key listing why need this policy
    //comments- [{user: ref, comment: '', date: '', reply: [{user: ref, comment:'', date: ''}]}, {}, {}]
    //deadline - end date
    //status: '' -> eg - accepted, initiated, done etc -> when accepted then updated will be visible
    //updates -> update by party admin {start date, end date, status: [{date(createdAt): '', update: ''}, {}, {}]}
    area: string;
    user: Types.ObjectId;
    category: string;
    title: string;
    description: string;
    facts: [string];
    comments: [Types.ObjectId];
    deadline: string;
    policyStatus: string;
    updates: {
        startDate: string,
        endDate: string
    }
})

const statusType = {
    type: {
        date: {
            type: String,
            required: true
        },
        update: {
            type: String,
            required: true
        }
    }
}

const policySchema = new Schema({
    area: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    facts: [String],
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'Comment'
    },
    deadline: String,
    policyStatus: {
        type: 'String',
        enum: ['Inititated', 'Accepted', 'Completed', 'Dropped'],
        default: 'Inititated'
    },
    updates: {
        type: {
            startDate: {
                type: String,
                required: true,
            },
            endDate: String,
            status: {
                type: [statusType]
            }
        }
    }
});

const Policy = model<policyModel>('Portfolio', policySchema);

export default Policy;