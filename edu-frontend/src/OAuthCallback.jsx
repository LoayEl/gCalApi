// Express backend route to handle OAuth callback
const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

router.get('/oauth/callback', async (req, res) => {
    const { code } = req.query;  // Get the 'code' sent by Google

    if (!code) {
        return res.status(400).send('Authorization code is missing');
    }

    try {
        // Exchange code for tokens using the Google APIs
        const oauth2Client = new google.auth.OAuth2(
            YOUR_CLIENT_ID,
            YOUR_CLIENT_SECRET,
            'http://localhost:8080/oauth/callback'  // The same redirect URI
        );

        const { tokens } = await oauth2Client.getToken(code);  // Get tokens

        // Store tokens in the session or database for the user
        // Here you can store the tokens (access/refresh tokens) in your session/cookies/database
        req.session.tokens = tokens;

        // Now, you can redirect the user to your frontend
        res.redirect('http://localhost:5174/HomePage');  // Redirect to the HomePage route
    } catch (error) {
        console.error("Error exchanging code for token:", error);
        res.status(500).send('Error during OAuth flow');
    }
});

module.exports = router;
