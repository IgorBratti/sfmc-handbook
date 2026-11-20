SELECT sub.SubscriberKey,
       sub.DateJoined
FROM ENT._Subscribers sub
LEFT JOIN ENT.[Sent_Keys_All_BUs] k ON k.SubscriberKey = sub.SubscriberKey
WHERE k.SubscriberKey IS NULL
  AND sub.DateJoined < DATEADD(DAY, -180, GETDATE())
