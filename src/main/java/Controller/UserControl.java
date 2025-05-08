package Controller;

import Database.UserDatabase;
import Model.User;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpSession;

@RestController
public class UserControl {

    @GetMapping("/profile")
    public User getCurrentUser(HttpSession session) {

        String email = (String) session.getAttribute("userEmail");
        System.out.println("profile call has Session email: " + email);

        return UserDatabase.getUser(email);
    }

}

