package Service;

import Database.GroupDatabase;
import Database.UserDatabase;
import Model.Group;
import Model.User;
import org.springframework.stereotype.Service;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GroupService {

    public List<Group> getGroupsForClass(String classCode) {
        return GroupDatabase.getGroupsForClass(classCode);
    }


    public Group createGroup(String classCode, String title, HttpSession session) {
        String userEmail = (String) session.getAttribute("userEmail");
        if (userEmail == null) {
            throw new RuntimeException("Not authenticated");
        }
        String groupCode = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        Group group = new Group(null, title, groupCode, classCode, userEmail);
        GroupDatabase.addGroup(group);
        return group;
    }

    public boolean joinGroup(String groupCode, HttpSession session) {
        String userEmail = (String) session.getAttribute("userEmail");
        if (userEmail == null) return false;
        Group group = GroupDatabase.getByCode(groupCode);
        if (group == null) return false;
        boolean added = group.addMemberEmail(userEmail);
        if (added) {
            GroupDatabase.persistGroup(group);
        }
        return added;
    }

    public boolean leaveGroup(String groupCode, HttpSession session) {
        String userEmail = (String) session.getAttribute("userEmail");
        if (userEmail == null) return false;
        Group group = GroupDatabase.getByCode(groupCode);
        if (group == null) return false;
        boolean removed = group.removeMemberEmail(userEmail);
        if (removed) {
            GroupDatabase.persistGroup(group);
        }
        return removed;
    }

    public List<User> getGroupMembers(String groupCode) {
        Group group = GroupDatabase.getByCode(groupCode);
        if (group == null) return List.of();
        return group.getMemberEmails().stream()
                .map(UserDatabase::getUser)
                .filter(u -> u != null)
                .collect(Collectors.toList());
    }
}
