package ConfigAndUtil;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import com.google.api.client.util.store.FileDataStoreFactory;
import java.io.File;
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
    public static final String REDIRECT_URI = "http://localhost:8080/oauth/callback";



    // gets client secrets from credential path for easy reuse so i dont have to call it every time
    public static GoogleClientSecrets loadClientSecrets() throws IOException {
        InputStream in = Authorization.class.getResourceAsStream(CREDENTIALS_FILE_PATH);
        if (in == null) throw new IOException("credentials.json not found");
        return GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));
    }


    public static GoogleAuthorizationCodeFlow getFlow() throws IOException {
        if (flow == null) {
            flow = new GoogleAuthorizationCodeFlow.Builder(
                    new NetHttpTransport(), JSON_FACTORY, loadClientSecrets(), SCOPES)
                    .setDataStoreFactory(new FileDataStoreFactory(new File("tokens")))
                    .setAccessType("offline")
                    .build();
        }
        return flow;
    }


    public static String getOAuthUrl() throws IOException {

        String clientId = loadClientSecrets().getDetails().getClientId();
        String scope = URLEncoder.encode(String.join(" ", SCOPES), StandardCharsets.UTF_8);

        return "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=" + clientId
                + "&redirect_uri=" + URLEncoder.encode(REDIRECT_URI, StandardCharsets.UTF_8)
                + "&response_type=code"
                + "&scope=" + scope
                + "&access_type=offline"
                + "&prompt=consent";
    }

    public static Credential getUserCredentials(String userId) throws IOException {
        if (userId == null) throw new RuntimeException("No user ID in session");
        return getFlow().loadCredential(userId);
    }
}
