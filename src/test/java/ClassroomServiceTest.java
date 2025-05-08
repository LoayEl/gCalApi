import Model.Classroom;
import Model.User;
import Database.UserDatabase;
import Service.ClassroomService;

import org.junit.jupiter.api.Test;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ClassroomServiceTest {

    @Test
    void testGetUsersClasses_withRealStaticUserDatabase() {
        User user = new User(99, "Test", "test@example.com", "pass");
        Classroom classroom = new Classroom(1L, "Math", "MATH101", "Intro", user);
        user.getEnrolledClasses().add(classroom);
        UserDatabase.postUser(user);

        List<Classroom> result = ClassroomService.getUsersClasses("test@example.com");

        assertEquals(1, result.size());
        assertEquals("Math", result.get(0).getTitle());
    }
}
