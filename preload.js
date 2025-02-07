const { contextBridge } = require('electron');
const axios = require('axios');

const CLIENT_ID = 'your_client_id';
const CLIENT_SECRET = 'your_client_secret';
const USERNAME = 'your_twitch_username';

async function getOAuthToken() {
  const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    }
  });
  return response.data.access_token;
}

async function getViewerCount(oauthToken) {
  const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${USERNAME}`, {
    headers: {
      'Client-ID': CLIENT_ID,
      'Authorization': `Bearer ${oauthToken}`
    }
  });
  const data = response.data;
  if (data.data && data.data.length > 0) {
    return data.data[0].viewer_count;
  }
  return 0;
}

contextBridge.exposeInMainWorld('viewerCountAPI', {
  getViewerCount: async () => {
    const oauthToken = await getOAuthToken();
    return await getViewerCount(oauthToken);
  }
});