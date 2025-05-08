package Database;

import Model.Group;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class GroupDatabase {
    private static final ConcurrentHashMap<String, Group> groupMap = new ConcurrentHashMap<>();
    private static final File groupDbFile = new File("src/main/resources/groupdb.json");
    private static long idIndex = 0;

    public static void fillHashMap() {
        try (InputStream in = GroupDatabase.class.getResourceAsStream("/groupdb.json")) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode arr = mapper.readTree(in).get("groups");

            for (JsonNode n : arr) {
                Group g = new Group(
                        n.get("id").asLong(),
                        n.get("title").asText(),
                        n.get("code").asText(),
                        n.get("classCode").asText(),
                        n.get("createdBy").asText()
                );
                if (n.has("memberEmails")) {
                    for (JsonNode emailNode : n.get("memberEmails")) {
                        g.addMemberEmail(emailNode.asText());
                    }
                }
                groupMap.put(g.getCode(), g);
                idIndex = Math.max(idIndex, g.getId() + 1);
            }
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to load groupdb.json", e);
        }
    }

    public static List<Group> getGroupsForClass(String classCode) {
        return groupMap.values().stream()
                .filter(g -> classCode.equals(g.getClassCode()))
                .collect(Collectors.toList());
    }

    public static Group getByCode(String code) {
        return groupMap.get(code);
    }

    public static void addGroup(Group group) {
        if (group.getId() == null) {
            group.setId(idIndex++);
        }
        groupMap.put(group.getCode(), group);
        persistGroup(group);
    }

    public static void persistGroup(Group g) {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode root = mapper.createObjectNode();
        ArrayNode arr = mapper.createArrayNode();

        for (Group group : groupMap.values()) {
            ObjectNode gNode = mapper.createObjectNode();
            gNode.put("id", group.getId());
            gNode.put("title", group.getTitle());
            gNode.put("code", group.getCode());
            gNode.put("classCode", group.getClassCode());
            gNode.put("createdBy", group.getCreatedBy());

            ArrayNode members = mapper.createArrayNode();
            for (String email : group.getMemberEmails()) {
                members.add(email);
            }
            gNode.set("memberEmails", members);
            arr.add(gNode);
        }
        root.set("groups", arr);

        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(groupDbFile, root);
            System.out.println("groupdb.json updated.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
