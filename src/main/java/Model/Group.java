package Model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

// group within a classroom
public class Group {
    private Long id;
    private String title;
    private String code;
    private String classCode;    // the Classroom.code this group belongs to
    private String createdBy;    // email of the creator
    private List<String> memberEmails = new ArrayList<>();
    // group cal object id
    private String groupCalId;

    public Group() {
    }

    public Group(Long id, String title, String code, String classCode, String createdBy) {
        this.id = id;
        this.title = title;
        this.code = code;
        this.classCode = classCode;
        this.createdBy = createdBy;
    }

    //when group is made build a group cal model and save its id here

    // Getters and setters

    public String getGroupCalId() {
        return groupCalId;
    }

    public void setGroupCalId(String groupCalId) {
        this.groupCalId = groupCalId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getClassCode() {
        return classCode;
    }

    public void setClassCode(String classCode) {
        this.classCode = classCode;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public List<String> getMemberEmails() {
        return memberEmails;
    }

    public void setMemberEmails(List<String> memberEmails) {
        this.memberEmails = memberEmails;
    }

    public boolean addMemberEmail(String email) {
        if (!memberEmails.contains(email)) {
            return memberEmails.add(email);
        }
        return false;
    }

    public boolean removeMemberEmail(String email) {
        return memberEmails.remove(email);
    }
}
