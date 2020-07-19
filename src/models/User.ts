import {Document, model, Schema, Types} from 'mongoose';

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

// Note - voter complaints are proposal, those proposal are the complaints sent to part member of that area (Policy)

export type UserModel = Document & {
    name: string;
    username: string;
    email: string;
    password: string;
    location: string;
    idProofType: string;
    idProofImageUrl: string;
    born: {
        dob: string,
        place: string
    },
    sex: string,
    maritalStatus: string,
    spouse: string,
    contactNumber: string;
    userImage: string;
    proposals: Types.ObjectId[];
    isPartyAdmin: boolean;
    partyDetails: Types.ObjectId;
    partyMemberDetails: {
        educationDetails: {
            institution: string,
            degree: string,
            marks: string,
            year: string,
            place: string,
            image: string
        },
        politicalCareer: {
            position: string,
            description: string,
            year: string,
        },
        complaints: Types.ObjectId[],
        portfolio: Types.ObjectId
    }
};

const proposalRef = {
    type: Schema.Types.ObjectId,
    ref: 'Policy',
};

const complaintRef = {
    type: Schema.Types.ObjectId,
    ref: 'Policy'
}

const eductionType = {
    institution: String,
    degree: String,
    marks: String,
    year: String,
    place: String,
    image: {
        type: String,
    }
}

const politicalCareerType = {
    position: String,
    description: String,
    year: String,
}

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
    born: {
        type: {
            dob: String,
            place: String,
        },
        required: true,
    },
    sex: {
        type: String,
        required: true
    },
    maritalStatus: {
        type: String,
        enum: ['Married', 'Unmarried'],
        required: true
    },
    spouse: {
        type: String,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    userImage: {
        type: String,
    },
    proposals: {
        type: [proposalRef],
    },
    isPartyAdmin: {
        type: Boolean,
    },
    partyDetails: { // 1) party member can add the person to party, once he adds partyDetails stores the ref of party
        type: {
            type: Schema.Types.ObjectId,
            ref: 'Party'
        },
    },
    partyMemberDetails: { // 2) once addded to party the person can fill the his required details and ther user ref stored in party model
        type: {
            educationDetails: {
                type: [eductionType],
            },
            politicalCareer: {
                type: [politicalCareerType],
            },
            complaints: {
                type: [complaintRef],
            },
            portfolio: {
                type: Schema.Types.ObjectId,
                ref: 'Portfolio'
            }
            // education details. can add top degree photo.
            // political career => biggest position till now and prev info
            // policies (proposal/complaints)
            // portfolio
        }
    }
});

const User = model<UserModel>('User', userSchema);

export default User;
