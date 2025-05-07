package Service;

import Model.Classroom;
import Model.Group;
import Model.User;
import Database.UserDatabase;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClassroomService {

    //TODO CALL ACTUAL DATABASE AND RETURN BASED ON USER
    public static List<Classroom> getUsersClasses(String email) {

        User user = UserDatabase.getUser(email);
        return user != null ? user.getEnrolledClasses() : new ArrayList<>();
    }

    // Placeholder
    public void addClass(Classroom classroom) {}
    public void remClass(Classroom classroom) {}
    public void addGroup(Group group) {}
    public void remGroup(Group group) {}

}
