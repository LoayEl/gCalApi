package ConfigAndUtil;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;


import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.util.store.FileDataStoreFactory;
import java.io.File;
import java.util.Collections;
import java.util.Arrays;



public class Authorization {

    //Flow for everyone get user info and such
    private static GoogleAuthorizationCodeFlow flow = null;

    private static final String CREDENTIALS_FILE_PATH = "/credentials.json";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final List<String> SCOPES = Arrays.asList(
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/calendar"
    );

    public static GoogleAuthorizationCodeFlow getFlow() throws IOException {
        if (flow == null) {
            InputStream in = Authorization.class.getResourceAsStream(CREDENTIALS_FILE_PATH);
            if (in == null) {
                throw new IOException("Error: credentials.json not found in resources.");
            }
            GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

            flow = new GoogleAuthorizationCodeFlow.Builder(
                    new NetHttpTransport(), JSON_FACTORY, clientSecrets, SCOPES)
                    .setDataStoreFactory(new FileDataStoreFactory(new java.io.File("tokens")))
                    .setAccessType("offline")
                    .build();
        }
        return flow;
    }

    public static Credential getCredentials(final NetHttpTransport httpTransport) throws IOException {

        InputStream in = Authorization.class.getResourceAsStream(CREDENTIALS_FILE_PATH);
        if (in == null) {
            throw new IOException("Error: credentials.json not found in resources.");
        }
        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                httpTransport, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new File("tokens")))
                .setAccessType("offline")
                .build();


        Credential credential = flow.loadCredential("user");
        System.out.println("Loaded credential: " + (credential != null ? "FOUND" : "NOT FOUND"));


        return flow.loadCredential("user");
    }

    public static String getOAuthUrl() throws IOException {
        InputStream in = Authorization.class.getResourceAsStream(CREDENTIALS_FILE_PATH);
        if (in == null) {
            throw new IOException("Error: credentials.json not found in resources.");
        }
        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

        String clientId = clientSecrets.getDetails().getClientId();
        String redirectUri = "http://localhost:8080/oauth/callback"; // backend endpoint

        String scope = URLEncoder.encode(String.join(" ", SCOPES), StandardCharsets.UTF_8);

        return "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=" + clientId
                + "&redirect_uri=" + URLEncoder.encode(redirectUri, StandardCharsets.UTF_8)
                + "&response_type=code"
                + "&scope=" + scope
                + "&access_type=offline"
                + "&prompt=consent";
    }

    public static Credential getCurrentUser(String userId) throws IOException {

            GoogleAuthorizationCodeFlow flow = getFlow();
            return flow.loadCredential(userId);

    }
}
