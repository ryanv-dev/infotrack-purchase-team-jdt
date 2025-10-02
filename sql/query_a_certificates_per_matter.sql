-- Query A: Return the count of certificates per matter (matter_id, certificates_count) 
-- for the last 30 days.

SELECT 
    m.id as matter_id,
    COUNT(c.id) as certificates_count
FROM Matters m
LEFT JOIN Orders o ON o.matter_id = m.id
LEFT JOIN Certificates c ON c.order_id = o.id
      AND c.created_at >= DATEADD(day, -30, GETDATE())
GROUP BY m.id;