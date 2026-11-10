SELECT a.SubscriberKey,
       a.EmailAddress
FROM [Audience_DE] a
LEFT JOIN (
    SELECT SubscriberKey
    FROM _Sent
    WHERE EventDate >= DATEADD(DAY, -7, GETDATE())
    GROUP BY SubscriberKey
    HAVING COUNT(*) >= 3
) f ON f.SubscriberKey = a.SubscriberKey
WHERE f.SubscriberKey IS NULL
