# Monitoring

Queries on the Automation Studio Data Views (`_AutomationInstance`, `_AutomationActivityInstance`) to catch failures, skipped runs and activities close to the 30-minute limit. Both views are BU-scoped, cover roughly the last month and use **UTC** dates. Field details: [data-views.md](../data-views.md#automations).

Status of every query: **Ready to test**. Alerting on top of these queries: [automation failure alerts playbook](../../playbooks/automation-failure-alerts/).

## automation-failures.sql

Automation runs with status `Error` that started in the last 24 hours, one row per failing activity (or one row per run when the activity detail isn't available).

**Target DE:** `Automation_Failures_24h` · `AutomationInstanceID` (Text 50, PK), `ActivityStep` (Text 10, PK), `AutomationName` (Text 200), `AutomationCustomerKey` (Text 100), `AutomationInstanceStatus` (Text 20), `AutomationInstanceStartTime_UTC` (Date), `ActivityName` (Text 200, nullable), `ErrorDetails` (Text 4000, nullable) · **Overwrite**.

## automation-skipped-runs.sql

Runs scheduled in the last 24 hours that never started. The usual cause is the previous run still executing when the next one was due.

**Target DE:** `Automation_Skipped_24h` · `AutomationInstanceID` (Text 50, PK), `AutomationName` (Text 200), `AutomationCustomerKey` (Text 100), `AutomationInstanceScheduledTime_UTC` (Date) · **Overwrite**.

## activity-durations.sql

Average and maximum duration (seconds) per activity over the last 7 days. Sort the target by `MaxSeconds` to find the queries and scripts closest to the 30-minute timeout before they fail.

**Target DE:** `Activity_Durations_7d` · `AutomationName` (Text 200, PK), `ActivityName` (Text 200, PK), `Runs`, `AvgSeconds`, `MaxSeconds` (Number) · **Overwrite**.

## Run them

Put the three queries in a monitoring automation scheduled every hour (or every few hours) in each business unit you want to watch. Show the target DEs in a CloudPage dashboard or send an alert when `Automation_Failures_24h` has rows.

[← SQL & Data Views](../README.md)
