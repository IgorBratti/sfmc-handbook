SELECT x.JourneyID,
       MAX(x.JourneyName) AS JourneyName,
       SUM(x.Sends) AS Sends,
       SUM(x.UniqueClicks) AS UniqueClicks,
       CAST(100.0 * SUM(x.UniqueClicks) / SUM(x.Sends) AS DECIMAL(6,2)) AS ClickRate
FROM (
    SELECT j.JourneyID, j.JourneyName, s.Sends, ISNULL(c.UniqueClicks, 0) AS UniqueClicks
    FROM (
        SELECT TriggererSendDefinitionObjectID AS TSD, COUNT(*) AS Sends
        FROM _Sent
        GROUP BY TriggererSendDefinitionObjectID
    ) s
    INNER JOIN _JourneyActivity ja ON ja.JourneyActivityObjectID = s.TSD
    INNER JOIN _Journey j ON j.VersionID = ja.VersionID
    LEFT JOIN (
        SELECT TriggererSendDefinitionObjectID AS TSD, COUNT(*) AS UniqueClicks
        FROM _Click
        WHERE IsUnique = 1
        GROUP BY TriggererSendDefinitionObjectID
    ) c ON c.TSD = s.TSD
) x
GROUP BY x.JourneyID
