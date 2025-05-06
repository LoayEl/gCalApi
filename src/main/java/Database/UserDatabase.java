package Database;
import java.util.concurrent.ConcurrentHashMap;
import Model.User;

//fake database using HashMap until we add a real one
public class UserDatabase {

    private static final ConcurrentHashMap<String, User> userMap = new ConcurrentHashMap<>();
    private static int idIndex = 0;

    //initalize hash with fake db json
    public static void fillHashMap() {
        //call from userdb.json
        //format for hash
        //fill user map on startup
    }

    public static void postUser(User user) {
        if (!userMap.containsKey(user.getEmail())) {
            user.setUserId(idIndex++);
        }
        userMap.put(user.getEmail(), user);
    }

    public static User getUser(String email) {
        return userMap.get(email);
    }
}
