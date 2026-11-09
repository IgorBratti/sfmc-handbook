SELECT s.SubscriberKey,
       s.Sends AS SendsLast180Days
FROM (
    SELECT SubscriberKey, COUNT(*) AS Sends
    FROM _Sent
    WHERE EventDate >= DATEADD(DAY, -180, GETDATE())
    GROUP BY SubscriberKey
) s
LEFT JOIN (
    SELECT DISTINCT SubscriberKey
    FROM _Open
    WHERE EventDate >= DATEADD(DAY, -180, GETDATE())
) o ON o.SubscriberKey = s.SubscriberKey
LEFT JOIN (
    SELECT DISTINCT SubscriberKey
    FROM _Click
    WHERE EventDate >= DATEADD(DAY, -180, GETDATE())
) c ON c.SubscriberKey = s.SubscriberKey
WHERE s.Sends >= 5
  AND o.SubscriberKey IS NULL
  AND c.SubscriberKey IS NULL
