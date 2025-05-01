import Controller.CalController;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CalControllerTest {

    private Calendar calendarMock;
    private CalController controller;

    @BeforeEach
    void setup() throws Exception {
        calendarMock = mock(Calendar.class);

        // Inject mock into the static `service` field
        Field serviceField = CalController.class.getDeclaredField("service");
        serviceField.setAccessible(true);
        serviceField.set(null, calendarMock);

        controller = new CalController(); // not strictly needed since methods are not using instance state
    }

    @Test
    void testGetUpcomingEvents_whenNoEvents_shouldReturnMessage() throws IOException {
        // Mock: service.events().list(...).execute() returns empty list
        Calendar.Events eventsMock = mock(Calendar.Events.class);
        Calendar.Events.List listMock = mock(Calendar.Events.List.class);

        Events emptyEvents = new Events();
        emptyEvents.setItems(Collections.emptyList());

        when(calendarMock.events()).thenReturn(eventsMock);
        when(eventsMock.list("primary")).thenReturn(listMock);
        when(listMock.setMaxResults(anyInt())).thenReturn(listMock);
        when(listMock.setTimeMin(any(DateTime.class))).thenReturn(listMock);
        when(listMock.setOrderBy(anyString())).thenReturn(listMock);
        when(listMock.setSingleEvents(eq(true))).thenReturn(listMock);
        when(listMock.execute()).thenReturn(emptyEvents);

        String result = controller.getUpcomingEvents();
        assertEquals("No upcoming events found.", result);
    }

    @Test
    void testCreateEvent_shouldReturnConfirmation() throws IOException {
        // Mock: service.events().insert(...).execute() returns a mock Event with a link
        Calendar.Events eventsMock = mock(Calendar.Events.class);
        Calendar.Events.Insert insertMock = mock(Calendar.Events.Insert.class);
        Event createdEvent = new Event();
        createdEvent.setHtmlLink("http://mocked-link.com");

        when(calendarMock.events()).thenReturn(eventsMock);
        when(eventsMock.insert(eq("primary"), any(Event.class))).thenReturn(insertMock);
        when(insertMock.execute()).thenReturn(createdEvent);

        String result = controller.createEvent();
        assertTrue(result.contains("http://mocked-link.com"));
    }
}

