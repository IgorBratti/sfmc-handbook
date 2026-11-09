SELECT a.SubscriberKey,
       a.EmailAddress
FROM [Audience_DE] a
LEFT JOIN [Exclusion_Staging_DE] e ON e.SubscriberKey = a.SubscriberKey
WHERE e.SubscriberKey IS NULL
