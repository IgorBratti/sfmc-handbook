SELECT s.YM AS YearMonth,
       s.Sends,
       ISNULL(c.UniqueClicks, 0) AS UniqueClicks,
       ISNULL(b.HardBounces, 0) AS HardBounces,
       CAST(100.0 * ISNULL(c.UniqueClicks, 0) / s.Sends AS DECIMAL(6,2)) AS ClickRate,
       CAST(100.0 * ISNULL(b.HardBounces, 0) / s.Sends AS DECIMAL(6,2)) AS HardBounceRate
FROM (
    SELECT CONVERT(CHAR(7), EventDate, 120) AS YM, COUNT(*) AS Sends
    FROM _Sent
    GROUP BY CONVERT(CHAR(7), EventDate, 120)
) s
LEFT JOIN (
    SELECT CONVERT(CHAR(7), EventDate, 120) AS YM, COUNT(*) AS UniqueClicks
    FROM _Click
    WHERE IsUnique = 1
    GROUP BY CONVERT(CHAR(7), EventDate, 120)
) c ON c.YM = s.YM
LEFT JOIN (
    SELECT CONVERT(CHAR(7), EventDate, 120) AS YM, COUNT(*) AS HardBounces
    FROM _Bounce
    WHERE BounceCategory = 'Hard bounce'
    GROUP BY CONVERT(CHAR(7), EventDate, 120)
) b ON b.YM = s.YM
