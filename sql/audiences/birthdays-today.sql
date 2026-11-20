SELECT c.SubscriberKey,
       c.EmailAddress,
       c.FirstName
FROM [Customers_DE] c
WHERE c.BirthDate IS NOT NULL
  AND (
        (MONTH(c.BirthDate) = MONTH(DATEADD(HOUR, 3, GETDATE()))
         AND DAY(c.BirthDate) = DAY(DATEADD(HOUR, 3, GETDATE())))
     OR (MONTH(c.BirthDate) = 2 AND DAY(c.BirthDate) = 29
         AND MONTH(DATEADD(HOUR, 3, GETDATE())) = 2
         AND DAY(DATEADD(HOUR, 3, GETDATE())) = 28
         AND DAY(EOMONTH(DATEADD(HOUR, 3, GETDATE()))) = 28)
      )
