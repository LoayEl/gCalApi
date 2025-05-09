package Model;

import java.util.ArrayList;
import java.util.List;

public class User {

    protected int userId;
    protected String name;
    protected String email;
    protected String password;


    private List<Classroom> enrolledClasses = new ArrayList<>();

    public User(int userId, String name, String email, String password) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Getters and setters
    public int getUserId() { return userId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }

    public User setPassword(String password) {
        this.password = password;
        return this;
    }

    public User setEmail(String email) {
        this.email = email;
        return this;
    }

    public User setName(String name) {
        this.name = name;
        return this;
    }

    public User setUserId(int userId) {
        this.userId = userId;
        return this;
    }

    public boolean enroll(Classroom classroom) {
        if (!enrolledClasses.contains(classroom)) {
            return enrolledClasses.add(classroom);
        }
        return false;
    }



    public List<Classroom> getEnrolledClasses() {
        return enrolledClasses;
    }


}
