package com.cooptrack;

public abstract class Record {

    private int id;
    private String member;
    private String type;
    private String description;
    private double amount;
    private String createdAt;

    protected Record() {
    }

    protected Record(
            int id,
            String member,
            String type,
            String description,
            double amount,
            String createdAt
    ) {
        this.id = id;
        this.member = member;
        this.type = type;
        this.description = description;
        setAmount(amount);
        this.createdAt = createdAt;
    }

    public abstract String getSummary();

    public abstract String getRecordType();

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMember() {
        return member;
    }

    public void setMember(String member) {
        this.member = member;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        if (!Double.isFinite(amount) || amount < 0) {
            throw new IllegalArgumentException(
                    "Amount must be a non-negative number."
            );
        }
        this.amount = amount;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
