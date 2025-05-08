import Model.Classroom;
import Model.User;
import Database.ClassroomDatabase;
import Database.UserDatabase;
import Service.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.servlet.http.HttpSession;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    private UserService service;
    private HttpSession session;

    @BeforeEach
    void setup() {
        service = new UserService();
        session = mock(HttpSession.class);
    }

    @Test
    void testGetCurrentUser_returnsUser() {
        User user = new User(99, "Alice", "alice@example.com", "pass");
        UserDatabase.postUser(user);

        when(session.getAttribute("userEmail")).thenReturn("alice@example.com");

        User result = service.getCurrentUser(session);
        assertNotNull(result);
        assertEquals("Alice", result.getName());
    }

    @Test
    void testEnrollInClassroom_success() {
        User user = new User(100, "Bob", "bob@example.com", "pass");
        UserDatabase.postUser(user);

        Classroom classroom = new Classroom(1L, "CS101", "Intro", "CS1", user);
        ClassroomDatabase.addClassroom(classroom);

        when(session.getAttribute("userEmail")).thenReturn("bob@example.com");

        Boolean enrolled = service.enrollInClassroom(session, "CS1");
        assertTrue(enrolled);

        List<Classroom> enrolledClasses = UserDatabase.getUser("bob@example.com").getEnrolledClasses();
        assertEquals(1, enrolledClasses.size());
        assertEquals("CS101", enrolledClasses.get(0).getTitle());
    }

    @Test
    void testLeaveClassroom_success() {
        User user = new User(101, "Charlie", "charlie@example.com", "pass");
        Classroom classroom = new Classroom(2L, "Math", "Basic Math", "MATH101", user);
        user.getEnrolledClasses().add(classroom);

        UserDatabase.postUser(user);
        ClassroomDatabase.addClassroom(classroom);

        when(session.getAttribute("userEmail")).thenReturn("charlie@example.com");

        boolean result = service.leaveClassroom(session, "MATH101");
        assertTrue(result);

        List<Classroom> remaining = UserDatabase.getUser("charlie@example.com").getEnrolledClasses();
        assertTrue(remaining.isEmpty());
    }
}
