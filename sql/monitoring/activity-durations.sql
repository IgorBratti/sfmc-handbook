SELECT aai.AutomationName,
       aai.ActivityName,
       COUNT(*) AS Runs,
       AVG(DATEDIFF(SECOND, aai.ActivityInstanceStartTime_UTC, aai.ActivityInstanceEndTime_UTC)) AS AvgSeconds,
       MAX(DATEDIFF(SECOND, aai.ActivityInstanceStartTime_UTC, aai.ActivityInstanceEndTime_UTC)) AS MaxSeconds
FROM _AutomationActivityInstance aai
WHERE aai.ActivityInstanceStartTime_UTC >= DATEADD(DAY, -7, GETUTCDATE())
  AND aai.ActivityInstanceEndTime_UTC IS NOT NULL
GROUP BY aai.AutomationName, aai.ActivityName
