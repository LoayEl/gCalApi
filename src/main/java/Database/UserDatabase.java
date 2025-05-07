package Database;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.concurrent.ConcurrentHashMap;
import Model.User;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

//fake database using HashMap until we add a real one
public class UserDatabase {

    private static final ConcurrentHashMap<String, User> userMap = new ConcurrentHashMap<>();
    private static int idIndex = 0;

    public static void fillHashMap() {
        try (InputStream in = UserDatabase.class.getResourceAsStream("/userdb.json")) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode users = mapper.readTree(in).get("users");
            for (JsonNode uNode : users) {
                User u = new User(
                        uNode.get("userId").asInt(),
                        uNode.get("name").asText(),
                        uNode.get("email").asText(),
                        uNode.get("password").asText()
                );
                userMap.put(u.getEmail(), u);
                idIndex = Math.max(idIndex, u.getUserId() + 1);
            }


            User bob = userMap.get("bob.johnson@example.com");
            if (bob != null) {
                bob.getEnrolledClasses().add(new Model.Classroom(
                        1003L, "Algebra I", "High School Algebra", "ALG1", bob
                ));
            }
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to load userdb.json", e);
        }
    }

    public static void postUser(User user) {
        if (!userMap.containsKey(user.getEmail())) {
            user.setUserId(idIndex++);
        }
        userMap.put(user.getEmail(), user);
    }

    public static User getUser(String email) {

        return userMap.get(email);
    }
}
