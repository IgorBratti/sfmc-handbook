SELECT x.SubscriberKey,
       x.EmailAddress,
       x.Phone,
       x.UpdatedAt
FROM (
    SELECT SubscriberKey, EmailAddress, Phone, UpdatedAt,
           ROW_NUMBER() OVER (PARTITION BY SubscriberKey ORDER BY UpdatedAt DESC) AS rn
    FROM [Source_DE]
) x
WHERE x.rn = 1
