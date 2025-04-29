package Service;

import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventReminder;
import com.google.api.client.util.DateTime; // Google's DateTime class

import java.util.List;
import java.util.Arrays;

//TO DO;
// lists recurrence, reminders, attendees
// start and end time with adapter
// do we want getters?


public class EventBuilder {
    private Event event;

    public EventBuilder() {
        this.event = new Event();
    }

    public EventBuilder setSummary(String summary) {
        event.setSummary(summary);
        return this;
    }

    public EventBuilder setLocation(String location) {
        event.setLocation(location);
        return this;
    }

    public EventBuilder setDescription(String description) {
        event.setDescription(description);
        return this;
    }

    public EventBuilder setStart(String dateTime, String timeZone) {
        event.setStart(new EventDateTime().setDateTime(new DateTime(dateTime)).setTimeZone(timeZone));
        return this;
    }

    public EventBuilder setEnd(String dateTime, String timeZone) {
        event.setEnd(new EventDateTime().setDateTime(new DateTime(dateTime)).setTimeZone(timeZone));
        return this;
    }

    public EventBuilder setRecurrence(List<String> recurrence) {
        event.setRecurrence(recurrence);
        return this;
    }

    public EventBuilder setAttendees(List<String> emails) {
        EventAttendee[] attendees = new EventAttendee[emails.size()];
        for (int i = 0; i < emails.size(); i++) {
            attendees[i] = new EventAttendee().setEmail(emails.get(i));
        }
        event.setAttendees(Arrays.asList(attendees));
        return this;
    }

    public EventBuilder setReminders(List<EventReminder> remindersList) {
        Event.Reminders reminders = new Event.Reminders()
                .setUseDefault(false)
                .setOverrides(remindersList);
        event.setReminders(reminders);
        return this;
    }


    public Event build() {
        return event;
    }
}
