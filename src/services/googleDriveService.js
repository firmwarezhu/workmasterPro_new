import { initializeGoogleApi } from '../utils/googleApi';

const googleDriveService = {
  async initialize(accessToken) {
    try {
      // Ensure Google API is loaded
      await initializeGoogleApi();

      // Initialize the client with the access token
      await window.gapi.client.init({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: 'https://www.googleapis.com/auth/drive.readonly'
      });

      // Set the access token
      window.gapi.client.setToken({ access_token: accessToken });

      // Verify access by listing files (optional)
      const response = await window.gapi.client.drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name, mimeType)'
      });

      console.log('Drive service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Drive service:', error);
      throw error;
    }
  },

  async listFiles() {
    try {
      const response = await window.gapi.client.drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name, mimeType)'
      });

      return response.result.files;
    } catch (error) {
      console.error('Error listing Drive files:', error);
      throw error;
    }
  }
};

export default googleDriveService;
