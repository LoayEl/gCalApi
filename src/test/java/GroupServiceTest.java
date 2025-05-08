import Model.Group;
import Model.User;
import Database.GroupDatabase;
import Database.UserDatabase;
import Service.GroupService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.servlet.http.HttpSession;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


public class GroupServiceTest {

    private GroupService service;
    private HttpSession session;


    @BeforeEach
    void setup() {
        service = new GroupService();
        session = mock(HttpSession.class);
    }

    @Test
    void testCreateGroup_validSession_createsGroup() {
        User user = new User(1, "Dany", "dany@example.com", "pw");
        UserDatabase.postUser(user);

        when(session.getAttribute("userEmail")).thenReturn("dany@example.com");

        Group group = service.createGroup("CSC101", "Final Project", session);
        assertNotNull(group);
        assertEquals("Final Project", group.getTitle());
        assertEquals("CSC101", group.getClassCode());
        assertEquals("dany@example.com", group.getCreatedBy());
    }

    @Test
    void testJoinGroup_groupExists_addsUser() {
        User user = new User(2, "Leo", "leo@example.com", "pw");
        UserDatabase.postUser(user);

        Group group = new Group(null, "AI Group", "JOIN01", "CSC202", "someone@example.com");
        GroupDatabase.addGroup(group);

        when(session.getAttribute("userEmail")).thenReturn("leo@example.com");

        boolean joined = service.joinGroup("JOIN01", session);
        assertTrue(joined);

        Group updated = GroupDatabase.getByCode("JOIN01");
        assertTrue(updated.getMemberEmails().contains("leo@example.com"));
    }

    @Test
    void testLeaveGroup_groupExists_removesUser() {
        User user = new User(11, "Sam", "sam@example.com", "pw");
        UserDatabase.postUser(user);

        Group group = new Group(null, "Solo Group", "UNIQUE01", "SOLO101", "creator@example.com");
        group.addMemberEmail("sam@example.com");
        GroupDatabase.addGroup(group); // Don't use persistGroup, just fresh add

        when(session.getAttribute("userEmail")).thenReturn("sam@example.com");

        boolean result = service.leaveGroup("UNIQUE01", session);
        assertTrue(result);

        Group updated = GroupDatabase.getByCode("UNIQUE01");
        assertNotNull(updated);
        assertFalse(updated.getMemberEmails().contains("sam@example.com"));
    }

    @Test
    void testGetGroupMembers_returnsUserList() {
        User user = new User(12, "Mila", "mila@example.com", "pw");
        UserDatabase.postUser(user);

        Group group = new Group(null, "Science Team", "MEMFIX", "SCI101", "admin@example.com");
        group.addMemberEmail("mila@example.com");
        GroupDatabase.addGroup(group);

        List<User> members = service.getGroupMembers("MEMFIX");
        assertEquals(1, members.size());
        assertEquals("mila@example.com", members.get(0).getEmail());
    }

}
