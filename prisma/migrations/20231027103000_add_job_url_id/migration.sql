        -- 添加 jobUrlId 列，允许为 NULL，并添加唯一约束 (延迟生效或单独添加)
        ALTER TABLE "Job" ADD COLUMN "jobUrlId" TEXT;

        -- 添加唯一约束 (可选，如果确保每个职位都有唯一的数字 ID 且不为空)
        -- ALTER TABLE "Job" ADD CONSTRAINT "Job_jobUrlId_key" UNIQUE ("jobUrlId");