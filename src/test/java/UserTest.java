import Model.User;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class UserTest {

    // Simple concrete class to test the abstract User class
    static class TestUser extends User {
        public TestUser(int userId, String name, String email, String password) {
            super(userId, name, email, password);
        }
    }

    @Test
    void testUserConstructorAndGetters() {
        TestUser user = new TestUser(1, "Alice", "alice@example.com", "password123");

        assertEquals(1, user.getUserId());
        assertEquals("Alice", user.getName());
        assertEquals("alice@example.com", user.getEmail());
        assertEquals("password123", user.getPassword());
    }

    @Test
    void testUserSetters() {
        TestUser user = new TestUser(0, "", "", "");

        user.setUserId(10)
                .setName("Bob")
                .setEmail("bob@example.com")
                .setPassword("securePass");

        assertEquals(10, user.getUserId());
        assertEquals("Bob", user.getName());
        assertEquals("bob@example.com", user.getEmail());
        assertEquals("securePass", user.getPassword());
    }
}

