import com.google.api.services.calendar.model.*;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class EventBuilderTest {

    @Test
    void testBasicEventBuild() {
        Event event = new EventBuilder()
                .setSummary("Team Sync")
                .setLocation("Meeting Room A")
                .setDescription("Weekly team sync-up")
                .setStart("2025-03-30T10:00:00-07:00", "America/Los_Angeles")
                .setEnd("2025-03-30T11:00:00-07:00", "America/Los_Angeles")
                .build();

        assertEquals("Team Sync", event.getSummary());
        assertEquals("Meeting Room A", event.getLocation());
        assertEquals("Weekly team sync-up", event.getDescription());
        assertNotNull(event.getStart());
        assertEquals("2025-03-30T10:00:00-07:00", event.getStart().getDateTime().toStringRfc3339());
        assertEquals(
                new DateTime("2025-03-30T10:00:00-07:00").getValue(),
                event.getStart().getDateTime().getValue()
        );
    }
}
