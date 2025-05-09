package Model;

import com.google.api.services.calendar.model.Event;
import java.util.ArrayList;
import java.util.List;

public class GroupCal {
    private Long id;
    private String groupCode; // Code of the group this calendar belongs to
    private String calendarId; // Google Calendar ID
    private List<Event> events; // List of events in this calendar

    public GroupCal(Long id, String groupCode, String calendarId) {
        this.id = id;
        this.groupCode = groupCode;
        this.calendarId = calendarId;
        this.events = new ArrayList<>();
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCalendarId() {
        return calendarId;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }

    public void addEvent(Event event) {
        this.events.add(event);
    }

    public boolean removeEvent(Event event) {
        return this.events.remove(event);
    }
}

