singIn(userInput: userInput!): User!
```
    to created new user
```

login(loginInput: loginInput!): AuthResponse!
```
    to login user
```
    
postCampaign(requestInput: requestInput!): CampaignRequest!
```
    to post new campaing with or without entities
```

postCampaignEntity(campaignRequestId: String!, entityInput: [entityInput]!): CampaignRequest!
```
    to post new entities to campaign
```

postCampaignDonation(campaignRequestId: String!, entity: DonationEntityInput!): CampaignRequest!
```
    to donated donation to campaign by a doner to a campaign request
```
postCampaignThumbnails(campaignRequestId: String!, thumbnails: Thumbnails): CampaignRequest!
```
    to add thumbnails (images or vdios) to campaign.
```
addOtherCampaignGroupMember(campaignRequestId: String!): User!
```
    to allow other user to become part of others campaign
```
postCampaignCompletionDescription(campaignRequestId: String!, description: String!): CampaignRequest!
```
    to allow other campaign creator to set the description and end the campaign.
```
postUserRewards(points: Int!): User!
```
    to post user rewards
```
postUserMaxDistance(distance: Int!): User!
```
    to post user max distance
```
