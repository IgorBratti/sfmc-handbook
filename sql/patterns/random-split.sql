SELECT a.SubscriberKey,
       a.EmailAddress,
       CASE ABS(CHECKSUM(NEWID())) % 2
           WHEN 0 THEN 'Control'
           ELSE 'Test'
       END AS TestGroup
FROM [Audience_DE] a
