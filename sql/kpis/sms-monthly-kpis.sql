SELECT CONVERT(CHAR(7), t.CreateDateTime, 120) AS YearMonth,
       SUM(CASE WHEN t.Outbound = 1 AND t.Sent = 1 THEN 1 ELSE 0 END) AS Sent,
       SUM(CASE WHEN t.Outbound = 1 AND t.Delivered = 1 THEN 1 ELSE 0 END) AS Delivered,
       SUM(CASE WHEN t.Outbound = 1 AND t.Undelivered = 1 THEN 1 ELSE 0 END) AS Undelivered,
       SUM(CASE WHEN t.OptOut = 1 THEN 1 ELSE 0 END) AS OptOuts,
       CAST(100.0 * SUM(CASE WHEN t.Outbound = 1 AND t.Delivered = 1 THEN 1 ELSE 0 END)
            / NULLIF(SUM(CASE WHEN t.Outbound = 1 AND t.Sent = 1 THEN 1 ELSE 0 END), 0) AS DECIMAL(6,2)) AS DeliveryRate
FROM _SMSMessageTracking t
GROUP BY CONVERT(CHAR(7), t.CreateDateTime, 120)
