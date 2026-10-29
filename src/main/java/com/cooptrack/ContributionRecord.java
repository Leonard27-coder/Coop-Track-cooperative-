package com.cooptrack;

public class ContributionRecord extends Record {

    public ContributionRecord() {
        super();
    }

    public ContributionRecord(
            int id,
            String member,
            String type,
            String description,
            double amount,
            String createdAt
    ) {
        super(id, member, type, description, amount, createdAt);
    }

    @Override
    public String getRecordType() {
        return "Contribution";
    }

    @Override
    public String getSummary() {
        return "Contribution by " + getMember()
                + ": " + getDescription()
                + " (Amount: " + getAmount() + ")";
    }
}
