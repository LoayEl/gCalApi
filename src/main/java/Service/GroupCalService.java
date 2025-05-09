package Service;


import ConfigAndUtil.CalServiceBuilder;
import Model.GroupCal;
import Model.User;

import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.logging.Logger;

@Service
public class GroupCalService {

    private static final Logger logger = Logger.getLogger(GroupCalService.class.getName());

    @Autowired
    private GroupService groupService;

    public GroupCal displayCalendar(String groupCode, HttpSession session) throws IOException, GeneralSecurityException {
        String userEmail = (String) session.getAttribute("userEmail");
        if (userEmail == null) {
            throw new RuntimeException("Not authenticated");
        }

        GroupCal groupCal = retrieveGroupCal(groupCode);

        Calendar service = CalServiceBuilder.buildService(userEmail);
        Events events = service.events().list(groupCal.getCalendarId())
                .setMaxResults(10)
                .setOrderBy("startTime")
                .setSingleEvents(true)
                .execute();

        groupCal.setEvents(events.getItems());
        return groupCal;
    }

    public boolean addEvent(String groupCode, String summary, String location, String description,
                            String startDateTime, String startTimeZone, String endDateTime, String endTimeZone,
                            HttpSession session) throws IOException, GeneralSecurityException {
        String userEmail = (String) session.getAttribute("userEmail");
        if (userEmail == null) {
            throw new RuntimeException("Not authenticated");
        }

        GroupCal groupCal = retrieveGroupCal(groupCode);

        Event event = new EventBuilder()
                .setSummary(summary)
                .setLocation(location)
                .setDescription(description)
                .setStart(startDateTime, startTimeZone)
                .setEnd(endDateTime, endTimeZone)
                .build();

        Calendar service = CalServiceBuilder.buildService(userEmail);
        Event createdEvent = service.events().insert(groupCal.getCalendarId(), event).execute();
        groupCal.addEvent(createdEvent);

        // Add event to each student's personal calendar
        for (User user : groupService.getGroupMembers(groupCode)) {
            String studentEmail = user.getEmail();
            try {
                Calendar studentService = CalServiceBuilder.buildService(studentEmail);
                studentService.events().insert("primary", event).execute();
            } catch (Exception e) {
                logger.warning("Failed to add event for student: " + studentEmail + " - " + e.getMessage());
            }
        }


        return true;
    }

    public boolean removeEvent(String groupCode, Event event, HttpSession session) throws IOException, GeneralSecurityException {
        String userEmail = (String) session.getAttribute("userEmail");
        if (userEmail == null) {
            throw new RuntimeException("Not authenticated");
        }

        GroupCal groupCal = retrieveGroupCal(groupCode);

        Calendar service = CalServiceBuilder.buildService(userEmail);
        try {
            service.events().delete(groupCal.getCalendarId(), event.getId()).execute();
            return groupCal.removeEvent(event);
        } catch (IOException e) {
            logger.severe("Error removing event: " + e.getMessage());
            return false;
        }
    }

    private GroupCal retrieveGroupCal(String groupCode) {
        // TODO: Replace this stub with actual DB lookup
        return new GroupCal(1L, groupCode, "primary");
    }
}
