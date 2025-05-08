package Service;

import Model.User;
import Model.Classroom;
import org.springframework.stereotype.Service;
import Database.UserDatabase;
import Database.ClassroomDatabase;
import javax.servlet.http.HttpSession;


// sign up login etc logic
@Service
public class UserService {

    public void login() {}
    public void logout() {}

    public User getCurrentUser(HttpSession session) {
        String email = (String) session.getAttribute("userEmail");
        if (email == null) return null;
        return UserDatabase.getUser(email);
    }

    public Boolean enrollInClassroom(HttpSession session, String code) {

        Classroom classroom = ClassroomDatabase.getClassroomByCode(code);
        if (classroom == null) {
            System.out.println("Classroom not found");
            return false;
        }

        User user = getCurrentUser(session);
        if (user == null) {
            System.out.println("User not found");
            return false;
        }

        boolean enrolled = user.enroll(classroom);
        if (enrolled) {
            UserDatabase.persistUser(user); //since user changed updating file
        }
        else{
            System.out.println("already enrolled");
        }
        return enrolled;

    }

    public boolean leaveClassroom(HttpSession session, String code) {
        Classroom classroom = ClassroomDatabase.getClassroomByCode(code);
        if (classroom == null) {
            System.out.println("Classroom not found");
            return false;
        }

        User user = getCurrentUser(session);
        if (user == null) {
            System.out.println("User not found");
            return false;
        }

        boolean removed = user.getEnrolledClasses().remove(classroom);

        if (removed) {
            System.out.println("Classroom removed");
            return true;
        } else {
            System.out.println("Classroom not enrolled");
            return true;
        }

    }

}
