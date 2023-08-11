const {TwitterApi} = require("twitter-api-v2");

const client = new TwitterApi({
    appkey: "cdIx6h1nSEYZkYqBImhYnGlFp",
    appSecret: "Uy1019vCw93RN35aDdIcqqeBl1uaPFgmDJIgOh8B5vgJwTdyZz",
    accessToken: "1687042801551495168-5FeFV9cFKdhjTsODXOKNLk6SngQWS6",
    accessSecret: "hVbEyOqstFPqMpm6t73yuMfNPzNUEO2bOblXBNJY40T4Y",
})

const rwClient = client.readwrite

const tweet = async () => {
    try {
        await rwClient.v1.tweet("Good morning")
    } catch(e){
        console.error(e)
    }
}

tweet()

