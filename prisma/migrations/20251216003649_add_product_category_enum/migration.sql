/*
  Warnings:

  - Changed the type of `category` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('BAR', 'COIN', 'JEWELRY');

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "category" SET DATA TYPE "ProductCategory"
USING (
    CASE
        WHEN "category" = 'Bar' THEN 'BAR'::"ProductCategory"
        WHEN "category" = 'Coin' THEN 'COIN'::"ProductCategory"
        -- Add more mappings here if there are other string values
        -- A default is good practice to avoid errors on unexpected values
        ELSE 'BAR'::"ProductCategory"
    END
);
