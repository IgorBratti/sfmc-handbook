SELECT ai.AutomationInstanceID,
       ISNULL(aai.ActivityInstanceStep, '0') AS ActivityStep,
       ai.AutomationName,
       ai.AutomationCustomerKey,
       ai.AutomationInstanceStatus,
       ai.AutomationInstanceStartTime_UTC,
       aai.ActivityName,
       LEFT(ISNULL(aai.ActivityInstanceStatusDetails, ai.AutomationInstanceActivityErrorDetails), 4000) AS ErrorDetails
FROM _AutomationInstance ai
LEFT JOIN _AutomationActivityInstance aai
    ON aai.AutomationInstanceID = ai.AutomationInstanceID
   AND aai.ActivityInstanceStatus = 'Error'
WHERE ai.AutomationInstanceStatus = 'Error'
  AND ai.AutomationInstanceStartTime_UTC >= DATEADD(HOUR, -24, GETUTCDATE())
