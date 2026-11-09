SELECT sub.SubscriberKey,
       sub.DateJoined
FROM ENT._Subscribers sub
LEFT JOIN (
    SELECT DISTINCT SubscriberKey
    FROM _Sent
) s ON s.SubscriberKey = sub.SubscriberKey
WHERE s.SubscriberKey IS NULL
  AND sub.DateJoined < DATEADD(DAY, -180, GETDATE())
