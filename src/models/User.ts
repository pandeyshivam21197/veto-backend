import {Document, model, Schema, Types} from 'mongoose';

interface IDonationHistory {
    campaignRequestId: Types.ObjectId;
    donationAmount: number;
}

//     name: string; // normal user or party admin or party member
//     username: string;
//     email: string;
//     password: string;
//     location: string;
//     DOB: string;
//     contactNumber: string;
//     userImage: string;
//                              policies: {comments: []}
//     proposals(complaints): [refs] => proposal of new policy to their resp MLA policy <=> user(MLA) -> party can use any of the policy addressed by their MLA into theit manifesto. proposals(policies addr. by MLA) <=> party model
//     isPartyAdmin: boolean;
//     partyDetails: ref(party model); // party model => list of all members  (manifesto(ref), scheme/policies(refs))
//     partyMemberDetails: {} (portfolio (ref)) => seeing member qulification and achivements and portfolio => users(voters) get broad view.


export type UserModel = Document & {
    name: string;
    username: string;
    email: string;
    password: string;
    location: string;
    idProofType: string;
    idProofImageUrl: string;
    DOB: string;
    contactNumber: string;
    rewardPoints: number;
    campaignRequestIds: Types.ObjectId[];
    joinedCampaignIds: Types.ObjectId[];
    donationHistory: IDonationHistory[];
    maxDistance: number;
    userImage: string;
    createdAt: string;
    updatedAt: string;
};

const proposalRef = {
    type: Schema.Types.ObjectId,
    ref: 'Policy',
};

const userSchema: Schema = new Schema({
    name: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        require: true,
    },
    location: { // location of the user
        type: String,
        required: true,
    },
    DOB: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    userImage: {
        type: String,
        default: '',
    },
    proposals: {
        type: [proposalRef],
        default: []
    },
    isPartyAdmin: {
        type: Boolean,
        default: false
    },
    partyDetails: { // 1) party member can add the person to party, once he adds partyDetails stores the ref of party
        type: {
            type: Schema.Types.ObjectId,
            ref: 'Party'
        },
        default: null
    },
    partyMemberDetails: { // 2) once addded to party the person can fill the his required details and ther user ref stored in party model
        type: {
            // education details. can add top degree photo.
            // political career => biggest position till now and prev info
            // policies (proposal/complaints)
            // portfolio
        },
        default: null
    }
});

const User = model<UserModel>('User', userSchema);

export default User;
