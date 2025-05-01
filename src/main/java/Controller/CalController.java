package Controller;

import ConfigAndUtil.Authorization;

import Service.EventBuilder;

import ConfigAndUtil.Authorization;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CalController {

    private static final String APPLICATION_NAME = "Gcal API TESTING";
    private static Calendar service;

    static {
        try {
            // Initialize the service with OAuth credentials
            final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
            Credential credentials = Authorization.getCredentials(HTTP_TRANSPORT);
            service = new Calendar.Builder(HTTP_TRANSPORT, GsonFactory.getDefaultInstance(), credentials)
                    .setApplicationName(APPLICATION_NAME)
                    .build();
        } catch (GeneralSecurityException | IOException e) {
            e.printStackTrace();
        }
    }

    // Fetch upcoming events from the user's calendar
    @GetMapping("/events")
    public String getUpcomingEvents() throws IOException {
        // Get the current time for filtering events
        DateTime now = new DateTime(System.currentTimeMillis());

        // Fetch the next 10 events
        Events events = service.events().list("primary")
                .setMaxResults(10)
                .setTimeMin(now)
                .setOrderBy("startTime")
                .setSingleEvents(true)
                .execute();

        List<Event> items = events.getItems();
        if (items.isEmpty()) {
            return "No upcoming events found.";
        } else {
            StringBuilder eventDetails = new StringBuilder("Upcoming events:\n");
            for (Event event : items) {
                DateTime start = event.getStart().getDateTime();
                if (start == null) {
                    start = event.getStart().getDate();
                }
                eventDetails.append(String.format("%s (%s)\n", event.getSummary(), start));
            }
            return eventDetails.toString();
        }
    }

    // Create a new event in the user's calendar
    @PostMapping("/createEvent")
    public String createEvent() throws IOException {
        // Build an event using Service.EventBuilder
        Event event = new EventBuilder()
                .setSummary("Google I/O 2025")
                .setLocation("800 Howard St., San Francisco, CA 94103")
                .setDescription("A chance to hear more about Google's developer products.")
                .setStart("2025-05-28T09:00:00-07:00", "America/Los_Angeles")
                .setEnd("2025-05-28T17:00:00-07:00", "America/Los_Angeles")
                .build();

        // Insert event into the primary calendar
        String calendarId = "primary";
        Event createdEvent = service.events().insert(calendarId, event).execute();

        return "Event created: " + createdEvent.getHtmlLink();
    }
}