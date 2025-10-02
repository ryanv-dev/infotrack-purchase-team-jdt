-- Query B: Return all matter_id that do not have a Title certificate in the last 30 days.

SELECT DISTINCT m.id as matter_id
FROM Matters m
WHERE NOT EXISTS (
    SELECT 1
    FROM Orders o
    JOIN Certificates c ON c.order_id = o.id
    WHERE o.matter_id = m.id
      AND c.type = 'Title'
      AND c.created_at >= DATEADD(day, -30, GETDATE())
);