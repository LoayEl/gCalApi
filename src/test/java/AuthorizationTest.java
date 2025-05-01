import ConfigAndUtil.Authorization;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.http.javanet.NetHttpTransport;
import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

public class AuthorizationTest {

    @Test
    void testGetCredentials_ValidFile_ReturnsCredential() throws IOException {
        NetHttpTransport transport = new NetHttpTransport();
        Credential credential = Authorization.getCredentials(transport);

        assertNotNull(credential);
        assertNotNull(credential.getAccessToken());  // May be null if not yet authorized
    }
}
