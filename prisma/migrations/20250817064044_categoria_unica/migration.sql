/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `CategoriaInventario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CategoriaInventario_nombre_key" ON "public"."CategoriaInventario"("nombre");
