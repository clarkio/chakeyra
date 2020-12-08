const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const getTokenUrl = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials&scope=`
let authToken;

class UserData {
    constructor(userId, displayName, profileImageUrl) {
        this.userId = userId;
        this.displayName = displayName;
        this.profileImageUrl = profileImageUrl;
    }
}

async function getTwitchAccessToken() {
    try {
        authToken = axios.post(getTokenUrl)
    }
    catch {
    }
    return authToken;
}

async function getUserProfile(userId, accessToken) {
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Client-ID': process.env.TWITCH_CLIENT_ID
    };
    var response = await getUser(`https://api.twitch.tv/helix/users?id=${userId}`, headers)
    var user = response.data.data[0];

    var userObject = new UserData(user.id, user.display_name, user.profile_image_url.replace('300x300', '70x70'));
    return userObject;
}

async function getUser(url, headers) {
    return await axios.get(url, { headers })
}

module.exports = {
    getTwitchAccessToken,
    getUserProfile
};