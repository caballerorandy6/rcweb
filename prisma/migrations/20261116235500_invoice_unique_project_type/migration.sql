-- One invoice of each type per project. Fails if a project already has two
-- invoices of the same type: check with
--   SELECT "projectId", type, count(*) FROM "Invoice" GROUP BY 1, 2 HAVING count(*) > 1;

-- DropIndex
DROP INDEX "Invoice_projectId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_projectId_type_key" ON "Invoice"("projectId", "type");
