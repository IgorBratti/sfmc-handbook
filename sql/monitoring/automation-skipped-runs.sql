SELECT ai.AutomationInstanceID,
       ai.AutomationName,
       ai.AutomationCustomerKey,
       ai.AutomationInstanceScheduledTime_UTC
FROM _AutomationInstance ai
WHERE ai.AutomationInstanceStartTime_UTC IS NULL
  AND ai.AutomationInstanceScheduledTime_UTC >= DATEADD(HOUR, -24, GETUTCDATE())
  AND ai.AutomationInstanceScheduledTime_UTC < GETUTCDATE()
