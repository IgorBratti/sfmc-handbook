SELECT x.SendWeekday,
       x.SendHour,
       COUNT(*) AS Sends,
       SUM(x.Clicked) AS UniqueClicks,
       CAST(100.0 * SUM(x.Clicked) / COUNT(*) AS DECIMAL(6,2)) AS ClickRate
FROM (
    SELECT DATENAME(WEEKDAY, DATEADD(HOUR, 3, s.EventDate)) AS SendWeekday,
           DATEPART(HOUR, DATEADD(HOUR, 3, s.EventDate)) AS SendHour,
           CASE WHEN c.SubscriberID IS NULL THEN 0 ELSE 1 END AS Clicked
    FROM _Sent s
    LEFT JOIN _Click c
        ON c.JobID = s.JobID
       AND c.ListID = s.ListID
       AND c.BatchID = s.BatchID
       AND c.SubscriberID = s.SubscriberID
       AND c.IsUnique = 1
    WHERE s.EventDate >= DATEADD(DAY, -90, GETDATE())
) x
GROUP BY x.SendWeekday, x.SendHour
