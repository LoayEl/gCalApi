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


@Service
public class ClassroomService {

    public List<Classroom> getUsersClasses(String email) {
        User user = UserDatabase.getUser(email);

        List<Classroom> classList = new ArrayList<>();

        if (user == null) return classList;

        for (String code : user.getEnrolledClassCodes()) {
            Classroom classroom = ClassroomDatabase.getClassroomByCode(code);
            if (classroom != null) {
                classList.add(classroom);
            }
        }
        return classList;
    }

    public Classroom getClassroomByCode(String code) {
        return ClassroomDatabase.getClassroomByCode(code);
    }

    public List<Integer> getStudentIdsForClass(String classCode) {
        Classroom curClass = ClassroomDatabase.getClassroomByCode(classCode);
        if (curClass == null) return Collections.emptyList();
        return curClass.getStudentIds();
    }

    // Placeholder
    public void addClass(Classroom classroom) {}
    public void remClass(Classroom classroom) {}
    public void addGroup(Group group) {}
    public void remGroup(Group group) {}

}
