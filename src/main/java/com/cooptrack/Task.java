package com.cooptrack;

public class Task {

    private int id;
    private String title;
    private String assignee;
    private String deadline;
    private int workDays;
    private String progress;

    public Task() {
        this.progress = "Pending";
    }

    public Task(
            int id,
            String title,
            String assignee,
            String deadline,
            int workDays,
            String progress
    ) {
        this.id = id;
        this.title = title;
        this.assignee = assignee;
        this.deadline = deadline;
        setWorkDays(workDays);
        this.progress = progress;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public int getWorkDays() {
        return workDays;
    }

    public void setWorkDays(int workDays) {
        if (workDays < 0) {
            throw new IllegalArgumentException(
                    "Work days cannot be negative."
            );
        }

        this.workDays = workDays;
    }

    public String getProgress() {
        return progress;
    }

    public void setProgress(String progress) {
        this.progress = progress;
    }
}
