-- CreateTable
CREATE TABLE "kvStore" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "kvStore_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" SERIAL NOT NULL,
    "quote" TEXT NOT NULL,
    "isPosted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);
