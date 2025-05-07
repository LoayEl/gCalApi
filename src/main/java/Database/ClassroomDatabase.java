package Database;

import Model.Classroom;
import Model.User;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.concurrent.ConcurrentHashMap;

public class ClassroomDatabase {
    private static final ConcurrentHashMap<String, Classroom> classroomMap = new ConcurrentHashMap<>();

    public static void fillHashMap() {
        try (InputStream in = ClassroomDatabase.class.getResourceAsStream("/classroomdb.json")) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode classrooms = mapper.readTree(in).get("classrooms");

            for (JsonNode cNode : classrooms) {
                String creatorEmail = cNode.get("createdBy").asText();
                User creator = UserDatabase.getUser(creatorEmail);

                Classroom classroom = new Classroom(
                        cNode.get("id").asLong(),
                        cNode.get("title").asText(),
                        cNode.get("description").asText(),
                        cNode.get("code").asText(),
                        creator
                );

                classroomMap.put(classroom.getCode(), classroom);
            }
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to load classroomdb.json", e);
        }
    }

    public static Classroom getClassroomByCode(String code) {
        return classroomMap.get(code);
    }

    public static void addClassroom(Classroom classroom) {
        classroomMap.put(classroom.getCode(), classroom);
    }

    public static boolean classroomExists(String code) {
        return classroomMap.containsKey(code);
    }



}
