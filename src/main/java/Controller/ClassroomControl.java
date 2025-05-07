package Controller;

import Service.ClassroomService;
import Service.UserService;
import Model.Classroom;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.*;

@RestController
public class ClassroomControl {

    @Autowired
    private ClassroomService classService;

    @Autowired
    private UserService userService;

    @GetMapping("/my-classes")
    public List<Classroom> getUserClasses(HttpSession session) {
        String email = (String) session.getAttribute("userEmail");
        if (email != null) {
            return classService.getUsersClasses(email);
        }
        return null;
    }

    @PostMapping("/join")
    public boolean joinClass(HttpSession session, @RequestBody Map<String, String> body) {
        String code = body.get("code");

        boolean enrolled = userService.enrollInClassroom(session, code);
        System.out.println("Enrollment success: " + enrolled);

        return enrolled;
    }

}
