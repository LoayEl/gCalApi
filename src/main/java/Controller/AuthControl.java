package Controller;

import Model.User;
import Database.UserDatabase;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.auth.oauth2.Credential;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Arrays;


import ConfigAndUtil.Authorization;

@RestController
public class AuthControl {

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final List<String> SCOPES = Arrays.asList(
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/calendar"
    );

    @Value("${frontend.redirect-uri}")
    private String frontredirectUri;

    @GetMapping("/auth/url")
    public String getAuthUrl() {
        try {
            return Authorization.getOAuthUrl();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error generating URL";
        }
    }

    @GetMapping("/oauth/callback")
    public void oauthCallback(@RequestParam("code") String code, HttpServletResponse response) {
        System.out.println("***************called oauthCallback**************************");
        try {
            InputStream in = Authorization.class.getResourceAsStream("/credentials.json");
            GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(
                    GsonFactory.getDefaultInstance(), new InputStreamReader(in)
            );

            String clientId = clientSecrets.getDetails().getClientId();
            String clientSecret = clientSecrets.getDetails().getClientSecret();
            String redirectUri = "http://localhost:8080/oauth/callback";

            GoogleTokenResponse tokenResponse = new GoogleAuthorizationCodeTokenRequest(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance(),
                    "https://oauth2.googleapis.com/token",
                    clientId,
                    clientSecret,
                    code,
                    redirectUri
            ).execute();

            // Getting user info from token
            String idTokenString = tokenResponse.getIdToken();
            if (idTokenString == null) {
                throw new RuntimeException("ID token is null. Cannot identify user.");
            }

            GoogleIdToken idToken = GoogleIdToken.parse(JSON_FACTORY, idTokenString);

            //Storing user in our Temp Database file
            String userEmail = idToken.getPayload().getEmail();
            String userName = idToken.getPayload().get("name").toString();
            User newUser = new User(0, userName, userEmail, null);
            UserDatabase.postUser(newUser);
            System.out.println("\n Saved Authenticated user: " + newUser.getName() + ", ID: " + newUser.getUserId() + userEmail + "\n");

            // storing in googles flow
            NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
            GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                    httpTransport, JSON_FACTORY, clientSecrets, SCOPES)
                    .setDataStoreFactory(new FileDataStoreFactory(new File("tokens")))
                    .setAccessType("offline")
                    .build();

            flow.createAndStoreCredential(tokenResponse, userEmail);

            response.sendRedirect(frontredirectUri);
            //response.sendRedirect("http://localhost:5174/homepage");

        } catch (Exception e) {
            e.printStackTrace();
            try {
                response.sendRedirect("http://localhost:5174/error");
            } catch (Exception ignored) {}
        }
    }

    @GetMapping("/oauth/isAuth")
    public boolean isAuth() {

        //when multi user use userId instead of "user"
        // get current user using request header orrr session cookies,orrr  spring security or oauth bearer token
        //userId = getCurrentUserId(userId);
        String userId = "user";

        try {
            Credential credential = Authorization.getCurrentUser(userId);
            if (credential != null && credential.getAccessToken() != null) {
                System.out.println("*******************Authenticated************ " + userId);
                return true;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return false;
    }
}
