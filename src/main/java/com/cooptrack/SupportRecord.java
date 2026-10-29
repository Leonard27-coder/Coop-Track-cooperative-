
package com.cooptrack;

public class SupportRecord extends Record {

    public SupportRecord() {
        super();
    }

    public SupportRecord(
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
        return "Support";
    }

    @Override
    public String getSummary() {
        return "Support for " + getMember()
                + ": " + getDescription()
                + " (Amount: " + getAmount() + ")";
    }
}
