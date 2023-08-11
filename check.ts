import Twitter, { TweetV1 } from 'twitter-api-v2'

const client = new Twitter(credentials)
const result = await client.v1.tweet('tweet content')

result // TweetV1