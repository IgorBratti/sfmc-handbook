# Journey Builder

[← Back to contents](README.md)

## 1. Exit Criteria is not continuous

**Problem:** a contact who should have left the journey still gets the next message.

**Why:** Exit Criteria is evaluated when the contact moves between activities (typically as they come out of a wait), not every second.

**Fix:** put a wait before the activities that matter, and use a Decision Split right before a critical send when you need a check at that exact moment.

## 2. Journey Data vs Contact Data

- **Journey Data** is a snapshot taken when the contact entered the journey. It never changes.
- **Contact Data** reads the current value in the data extension.

**Practical rule:** use Contact Data in splits and exit rules when the decision depends on something that can change during the journey (purchased, converted, unsubscribed). Use Journey Data when you want the value as it was at entry.

When a split reads Contact Data through a one-to-many relationship, the condition is true if **any** related record matches.

## 3. Group reports by `JourneyID`, not by name

**Problem:** a dashboard shows the same journey twice, or loses history after someone renames it.

**Why:** names can change between versions. `JourneyID` stays the same across versions; `VersionID` changes with each one.

**Fix:**

```sql
SELECT j.JourneyID, MAX(j.JourneyName) AS JourneyName, COUNT(DISTINCT j.VersionID) AS Versions
FROM _Journey j
GROUP BY j.JourneyID
```
