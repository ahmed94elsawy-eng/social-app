# DB Design

## User

- id
- userName
- email
- password
- phoneNumber
- gender
- provider
- createdAt
- updatedAt
- isDeleted

## post

- id
- content
- userId
- createdAt
- updatedAt
- isDeleted
- commentsCounts
- reactionsCounts
- allowsComments Boolean

## Comment/Reply

- id
- content
- userId
- postId
- parentId
- reactionsCount
- createdAt
- updatedAt 

## Reactions

- id
- userId
- refId [postId, commentId ]
- onModel ["post", "Comment"]
- type ENUM('Like', 'Care', 'Love', 'Angry')
- createdAt
- updatedAt