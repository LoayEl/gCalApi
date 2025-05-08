package Database;

import Model.User;
import Model.Classroom;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.concurrent.ConcurrentHashMap;
import java.io.File;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;



//fake database using HashMap until we add a real one
public class UserDatabase {

    private static final ConcurrentHashMap<String, User> userMap = new ConcurrentHashMap<>();
    private static int idIndex = 0;
    private static final File userDbFile = new File("src/main/resources/userdb.json");

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

                if (uNode.has("enrolledClasses")) {
                    for (JsonNode cNode : uNode.get("enrolledClasses")) {
                        String creatorEmail = cNode.get("createdBy").asText();
                        User creator = userMap.getOrDefault(creatorEmail, new User(0, "Unknown", creatorEmail, null));

                        Classroom classroom = new Classroom(
                                cNode.get("id").asLong(),
                                cNode.get("title").asText(),
                                cNode.get("description").asText(),
                                cNode.get("code").asText(),
                                creator
                        );

                        u.getEnrolledClasses().add(classroom);
                    }
                }

                userMap.put(u.getEmail(), u);
                idIndex = Math.max(idIndex, u.getUserId() + 1);
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

    public static void persistUser(User user) {
        userMap.put(user.getEmail(), user);
        saveToJsonFile();
    }

    private static void saveToJsonFile() {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode root = mapper.createObjectNode();
        ArrayNode usersArray = mapper.createArrayNode();

        for (User user : userMap.values()) {
            ObjectNode userNode = mapper.createObjectNode();
            userNode.put("userId", user.getUserId());
            userNode.put("name", user.getName());
            userNode.put("email", user.getEmail());
            userNode.put("password", user.getPassword());

            ArrayNode enrolled = mapper.createArrayNode();
            for (Classroom c : user.getEnrolledClasses()) {
                ObjectNode cNode = mapper.createObjectNode();
                cNode.put("id", c.getId());
                cNode.put("title", c.getTitle());
                cNode.put("description", c.getDescription());
                cNode.put("code", c.getCode());
                cNode.put("createdBy", c.getCreatedBy().getEmail());
                enrolled.add(cNode);
            }

            userNode.set("enrolledClasses", enrolled);
            usersArray.add(userNode);
        }

        root.set("users", usersArray);

        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(userDbFile, root);
            System.out.println(" userdb.json updated.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }



}
