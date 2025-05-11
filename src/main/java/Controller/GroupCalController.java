package Controller;

import ConfigAndUtil.DateAdapter;
import Model.GroupCal;
import Service.GroupCalService;
import ConfigAndUtil.CalServiceBuilder;

import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/group/{groupCode}/calendar")
public class GroupCalController {

    private final GroupCalService groupCalService;

    @Autowired
    public GroupCalController(GroupCalService groupCalService) {
        this.groupCalService = groupCalService;
    }

    @GetMapping("/display")
    public List<Event> displayCalendar(
            @PathVariable String groupCode,
            HttpSession session
    ) throws IOException, GeneralSecurityException {
        return groupCalService.displayCalendar(groupCode, session);
    }

    @PostMapping("/addevent")
    public ResponseEntity<?> addEvent(
            @PathVariable String groupCode,
            @RequestBody Map<String,Object> data,
            HttpSession session
    ) throws IOException, GeneralSecurityException {

        // build cal service for user
        String userId = (String) session.getAttribute("userEmail");
        com.google.api.services.calendar.Calendar service =
                CalServiceBuilder.buildService(userId);

        // extract and adapt
        String summary = (String) data.get("summary");
        String location = (String) data.get("location");
        String description = (String) data.get("description");
        String startRaw = ((Map<?,?>)data.get("start")).get("dateTime").toString();
        String endRaw = ((Map<?,?>)data.get("end")).get("dateTime").toString();

        EventDateTime start = DateAdapter.parseEventDateTime(startRaw, ZoneId.of("America/New_York"));
        EventDateTime end   = DateAdapter.parseEventDateTime(endRaw,   ZoneId.of("America/New_York"));

        Event e = new Event()
                .setSummary(summary)
                .setLocation(location)
                .setDescription(description)
                .setStart(start)
                .setEnd(end);

        Event created = service.events()
                .insert("primary", e)
                .execute();

        return ResponseEntity.ok(created);
    }

    @GetMapping("/info")
    public GroupCal getCalendarInfo(@PathVariable String groupCode) {
        return groupCalService.getGroupCal(groupCode);
    }

    @PostMapping("/removeevent")
    public boolean removeEvent(
            @PathVariable String groupCode,
            @RequestBody Event event,
            HttpSession session
    ) throws IOException, GeneralSecurityException {
        return groupCalService.removeEvent(groupCode, event, session);
    }
}
