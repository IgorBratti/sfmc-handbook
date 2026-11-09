SELECT s.SubscriberKey,
       c.LastClick,
       ISNULL(c.Clicks90, 0) AS Clicks90,
       ISNULL(o.Opens90, 0) AS Opens90,
       CASE
           WHEN c.LastClick >= DATEADD(DAY, -30, GETDATE()) AND c.Clicks90 >= 3 THEN 'Champion'
           WHEN c.LastClick >= DATEADD(DAY, -90, GETDATE()) THEN 'Engaged'
           WHEN o.Opens90 > 0 THEN 'Passive'
           ELSE 'At risk'
       END AS EngagementSegment
FROM (
    SELECT DISTINCT SubscriberKey
    FROM _Sent
    WHERE EventDate >= DATEADD(DAY, -90, GETDATE())
) s
LEFT JOIN (
    SELECT SubscriberKey, MAX(EventDate) AS LastClick, COUNT(*) AS Clicks90
    FROM _Click
    WHERE IsUnique = 1
      AND EventDate >= DATEADD(DAY, -90, GETDATE())
    GROUP BY SubscriberKey
) c ON c.SubscriberKey = s.SubscriberKey
LEFT JOIN (
    SELECT SubscriberKey, COUNT(*) AS Opens90
    FROM _Open
    WHERE IsUnique = 1
      AND EventDate >= DATEADD(DAY, -90, GETDATE())
    GROUP BY SubscriberKey
) o ON o.SubscriberKey = s.SubscriberKey
