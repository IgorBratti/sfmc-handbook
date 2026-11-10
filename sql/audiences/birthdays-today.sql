SELECT c.SubscriberKey,
       c.EmailAddress,
       c.FirstName
FROM [Customers_DE] c
WHERE c.BirthDate IS NOT NULL
  AND MONTH(c.BirthDate) = MONTH(DATEADD(HOUR, 3, GETDATE()))
  AND DAY(c.BirthDate) = DAY(DATEADD(HOUR, 3, GETDATE()))
