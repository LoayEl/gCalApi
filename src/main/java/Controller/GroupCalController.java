package Controller;

import Model.GroupCal;
import Service.GroupCalService;
import com.google.api.services.calendar.model.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

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
    public boolean addEvent(
            @PathVariable String groupCode,
            @RequestBody Event event,
            HttpSession session
    ) throws IOException, GeneralSecurityException {
        return groupCalService.addEvent(groupCode, event.getSummary(), event.getLocation(), event.getDescription(),
                event.getStart().getDateTime().toString(), event.getStart().getTimeZone(),
                event.getEnd().getDateTime().toString(), event.getEnd().getTimeZone(), session);
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
