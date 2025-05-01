package Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.io.InputStreamReader;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;

import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import ConfigAndUtil.Authorization;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthControl {

    @GetMapping("/auth/url")
    public String getAuthUrl() {
        try {
            return Authorization.getOAuthUrl();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error generating URL";
        }
    }

    //after clicking the oauth link the call back comes back to backend and gets the token
    @GetMapping("/oauth/callback")
    public void oauthCallback(@RequestParam("code") String code, HttpServletResponse response) {
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

            String accessToken = tokenResponse.getAccessToken();
            String refreshToken = tokenResponse.getRefreshToken();

            System.out.println("Access Token: " + accessToken);
            System.out.println("Refresh Token: " + refreshToken);

            //OK TO DO FIND OUT HOW TO SEND TOKENS

            response.sendRedirect("http://localhost:5174/homepage");
        } catch (Exception e) {
            e.printStackTrace();
            try {
                response.sendRedirect("http://localhost:5174/error");
            } catch (Exception ignored) {}
        }
    }
}
