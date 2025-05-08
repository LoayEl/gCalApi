package Service;

import Model.Classroom;
import Model.Group;
import Model.User;
import Database.UserDatabase;
import Database.ClassroomDatabase;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Collections;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ClassroomService {

    public static List<Classroom> getUsersClasses(String email) {

        User user = UserDatabase.getUser(email);
        return user != null ? user.getEnrolledClasses() : new ArrayList<>();
    }

    public Classroom getClassroomByCode(String code) {
        return ClassroomDatabase.getClassroomByCode(code);
    }

    public List<Integer> getStudentIdsForClass(String classCode) {
        Classroom cls = ClassroomDatabase.getClassroomByCode(classCode);
        if (cls == null) return Collections.emptyList();
        return cls.getStudentIds();
    }

    // Placeholder
    public void addClass(Classroom classroom) {}
    public void remClass(Classroom classroom) {}
    public void addGroup(Group group) {}
    public void remGroup(Group group) {}

}
