-- AlterTable
ALTER TABLE "public"."Entrenador" ADD COLUMN     "tarifa_hora" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."nomina" ADD COLUMN     "horas_totales" DOUBLE PRECISION,
ADD COLUMN     "monto_horas" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "public"."HorasEntrenador" (
    "id" TEXT NOT NULL,
    "entrenador_id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "horas" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "HorasEntrenador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HorasEntrenador_entrenador_id_fecha_key" ON "public"."HorasEntrenador"("entrenador_id", "fecha");

-- AddForeignKey
ALTER TABLE "public"."HorasEntrenador" ADD CONSTRAINT "HorasEntrenador_entrenador_id_fkey" FOREIGN KEY ("entrenador_id") REFERENCES "public"."Entrenador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
