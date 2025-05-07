package Model;

public class Classroom {
    private Long id;
    private String title;
    private String description;
    private String code;
    private User createdBy;

    public Classroom(Long id, String title, String description, String code, User createdBy) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.code = code;
        this.createdBy = createdBy;
    }

    // Getters and setters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCode() { return code; }
    public User getCreatedBy() { return createdBy; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setCode(String code) { this.code = code; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }


}
