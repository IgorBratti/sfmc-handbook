SELECT s.YM AS YearMonth,
       s.Sends,
       ISNULL(u.Unsubscribes, 0) AS Unsubscribes,
       ISNULL(c.Complaints, 0) AS Complaints,
       CAST(100.0 * ISNULL(u.Unsubscribes, 0) / s.Sends AS DECIMAL(6,3)) AS UnsubscribeRate,
       CAST(100.0 * ISNULL(c.Complaints, 0) / s.Sends AS DECIMAL(6,3)) AS ComplaintRate
FROM (
    SELECT CONVERT(CHAR(7), EventDate, 120) AS YM, COUNT(*) AS Sends
    FROM _Sent
    GROUP BY CONVERT(CHAR(7), EventDate, 120)
) s
LEFT JOIN (
    SELECT CONVERT(CHAR(7), EventDate, 120) AS YM, COUNT(*) AS Unsubscribes
    FROM _Unsubscribe
    GROUP BY CONVERT(CHAR(7), EventDate, 120)
) u ON u.YM = s.YM
LEFT JOIN (
    SELECT CONVERT(CHAR(7), EventDate, 120) AS YM, COUNT(*) AS Complaints
    FROM _Complaint
    GROUP BY CONVERT(CHAR(7), EventDate, 120)
) c ON c.YM = s.YM
