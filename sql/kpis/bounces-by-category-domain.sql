SELECT b.BounceCategory,
       b.Domain,
       COUNT(*) AS Bounces,
       COUNT(DISTINCT b.SubscriberKey) AS Contacts
FROM _Bounce b
WHERE b.EventDate >= DATEADD(DAY, -30, GETDATE())
GROUP BY b.BounceCategory, b.Domain
