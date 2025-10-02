-- Proposed index to optimize Query B

CREATE INDEX idx_cert_type_created_order ON Certificates (type, created_at, order_id);

-- Justification:
-- Accelerates filtering by type and recent creation date, while optimizing joins via order_id.
