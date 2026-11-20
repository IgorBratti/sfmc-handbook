SELECT o.SubscriberKey
FROM _Open o
WHERE o.EventDate >= DATEADD(DAY, -180, GETDATE())
UNION
SELECT c.SubscriberKey
FROM _Click c
WHERE c.EventDate >= DATEADD(DAY, -180, GETDATE())
