SELECT COUNT(DISTINCT JourneyID) AS RunningJourneys
FROM _Journey
WHERE JourneyStatus = 'Running'
