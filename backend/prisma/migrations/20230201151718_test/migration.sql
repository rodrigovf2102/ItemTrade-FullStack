-- CreateEnum
CREATE TYPE "ITEMTYPE" AS ENUM ('Dinheiro', 'Equipamento', 'Recurso', 'Utilizavel', 'Raros', 'Outros', 'Todos');

-- CreateEnum
CREATE TYPE "OPERATIONTYPE" AS ENUM ('PURCHASE', 'SALE');

-- CreateEnum
CREATE TYPE "TRADESTATUS" AS ENUM ('COMPLETE', 'INCOMPLETE', 'WAITING');

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "CPF" VARCHAR(11) NOT NULL,
    "userId" INTEGER NOT NULL,
    "balance" INTEGER DEFAULT 0,
    "enrollmentUrl" TEXT NOT NULL,
    "freezedBalance" INTEGER DEFAULT 0,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "gameUrl" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "price" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "itemUrl" TEXT NOT NULL,
    "serverId" INTEGER NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "itemType" "ITEMTYPE" NOT NULL,
    "inTrade" BOOLEAN DEFAULT false,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" SERIAL NOT NULL,
    "creditCardLastDigits" VARCHAR(4) NOT NULL,
    "cardIssuer" VARCHAR(40) NOT NULL,
    "cardName" VARCHAR(100) NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "paymentHash" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "enrollmentId" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" SERIAL NOT NULL,
    "sellerEnrollmentId" INTEGER NOT NULL,
    "buyerEnrollmentId" INTEGER NOT NULL,
    "sellerStatus" "TRADESTATUS" DEFAULT 'INCOMPLETE',
    "buyerStatus" "TRADESTATUS" DEFAULT 'INCOMPLETE',
    "tradeStatus" "TRADESTATUS" DEFAULT 'INCOMPLETE',
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeAvaliation" (
    "id" SERIAL NOT NULL,
    "tradeType" "OPERATIONTYPE" NOT NULL,
    "tradeStatus" "TRADESTATUS" DEFAULT 'INCOMPLETE',
    "enrollmentId" INTEGER NOT NULL,
    "tradeId" INTEGER,

    CONSTRAINT "TradeAvaliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeMessage" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,
    "tradeId" INTEGER NOT NULL,

    CONSTRAINT "TradeMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_CPF_key" ON "Enrollment"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_key" ON "Enrollment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_enrollmentUrl_key" ON "Enrollment"("enrollmentUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Game_name_key" ON "Game"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Game_gameUrl_key" ON "Game"("gameUrl");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_buyerEnrollmentId_fkey" FOREIGN KEY ("buyerEnrollmentId") REFERENCES "Enrollment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_sellerEnrollmentId_fkey" FOREIGN KEY ("sellerEnrollmentId") REFERENCES "Enrollment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TradeAvaliation" ADD CONSTRAINT "TradeAvaliation_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TradeAvaliation" ADD CONSTRAINT "TradeAvaliation_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TradeMessage" ADD CONSTRAINT "TradeMessage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TradeMessage" ADD CONSTRAINT "TradeMessage_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "Trade"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
