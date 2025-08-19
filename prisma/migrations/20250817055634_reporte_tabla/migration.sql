-- CreateEnum
CREATE TYPE "public"."TipoGasto" AS ENUM ('OPERATIVO', 'NOMINA', 'MANTENIMIENTO', 'MARKETING', 'SERVICIOS', 'IMPUESTOS', 'OTROS');

-- CreateEnum
CREATE TYPE "public"."EstadoGasto" AS ENUM ('PENDIENTE', 'PAGADO', 'VENCIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "public"."EstadoPago" AS ENUM ('PENDIENTE', 'PAGADO', 'VENCIDO', 'PARCIAL');

-- CreateEnum
CREATE TYPE "public"."CategoriaTipo" AS ENUM ('IMPLEMENTO', 'PRODUCTO');

-- CreateTable
CREATE TABLE "public"."CategoriaInventario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "public"."CategoriaTipo" NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "CategoriaInventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReporteFinanciero" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "datos" JSONB NOT NULL,
    "fecha_generacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generado_por" TEXT,

    CONSTRAINT "ReporteFinanciero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DetalleVenta" (
    "id" TEXT NOT NULL,
    "venta_id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetalleVenta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Entrenador" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "especialidad" TEXT,
    "tarifa_mensual" DOUBLE PRECISION NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL,
    "fecha_primer_pago" TIMESTAMP(3),
    "fecha_ultimo_pago" TIMESTAMP(3),

    CONSTRAINT "Entrenador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Evento" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3),
    "tipo" TEXT NOT NULL,
    "color" TEXT,
    "fecha_registro" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Gasto" (
    "id" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "categoria_id" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha_registro" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ItemGaleria" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "ruta_imagen" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemGaleria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ItemInventario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "stock_minimo" INTEGER NOT NULL,
    "precio_unitario" DOUBLE PRECISION,
    "descripcion" TEXT,
    "fecha_registro" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemInventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Membresia" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "precio_pagado" DOUBLE PRECISION NOT NULL,
    "metodo_pago" TEXT NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membresia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notificacion" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL,
    "referencia_id" TEXT,
    "referencia_tipo" TEXT,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Plan" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Producto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "stock_minimo" INTEGER NOT NULL,
    "precio_venta" DOUBLE PRECISION NOT NULL,
    "costo" DOUBLE PRECISION NOT NULL,
    "descripcion" TEXT,
    "fecha_registro" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL,
    "notas" TEXT,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Venta" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "fecha_venta" TIMESTAMP(3) NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "metodo_pago" TEXT NOT NULL,
    "notas" TEXT,

    CONSTRAINT "Venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categorias_gastos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" "public"."TipoGasto" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categorias_gastos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."gastos_detallados" (
    "id" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "categoria_id" TEXT NOT NULL,
    "descripcion" TEXT,
    "comprobante_url" TEXT,
    "proveedor" TEXT,
    "metodo_pago" TEXT NOT NULL,
    "estado" "public"."EstadoGasto" NOT NULL DEFAULT 'PAGADO',
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_vencimiento" TIMESTAMP(3),

    CONSTRAINT "gastos_detallados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."nomina" (
    "id" TEXT NOT NULL,
    "entrenador_id" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "año" INTEGER NOT NULL,
    "salario_base" DOUBLE PRECISION NOT NULL,
    "bonificaciones" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deducciones" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_pagar" DOUBLE PRECISION NOT NULL,
    "fecha_pago" TIMESTAMP(3),
    "estado" "public"."EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "notas" TEXT,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nomina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pagos_membresias" (
    "id" TEXT NOT NULL,
    "membresia_id" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL,
    "fecha_vencimiento" TIMESTAMP(3) NOT NULL,
    "metodo_pago" TEXT NOT NULL,
    "estado" "public"."EstadoPago" NOT NULL DEFAULT 'PAGADO',
    "notas" TEXT,
    "descuento" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recargo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_membresias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ingresos_adicionales" (
    "id" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "categoria" TEXT NOT NULL,
    "descripcion" TEXT,
    "metodo_pago" TEXT NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingresos_adicionales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resumen_financiero" (
    "id" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "año" INTEGER NOT NULL,
    "total_ingresos" DOUBLE PRECISION NOT NULL,
    "total_gastos" DOUBLE PRECISION NOT NULL,
    "utilidad_bruta" DOUBLE PRECISION NOT NULL,
    "ingresos_membresias" DOUBLE PRECISION NOT NULL,
    "ingresos_ventas" DOUBLE PRECISION NOT NULL,
    "ingresos_adicionales" DOUBLE PRECISION NOT NULL,
    "gastos_operativos" DOUBLE PRECISION NOT NULL,
    "gastos_nomina" DOUBLE PRECISION NOT NULL,
    "fecha_calculo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resumen_financiero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."configuracion_financiera" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "configuracion_financiera_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_documento_key" ON "public"."Usuario"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "nomina_entrenador_id_mes_año_key" ON "public"."nomina"("entrenador_id", "mes", "año");

-- CreateIndex
CREATE UNIQUE INDEX "resumen_financiero_mes_año_key" ON "public"."resumen_financiero"("mes", "año");

-- CreateIndex
CREATE UNIQUE INDEX "configuracion_financiera_nombre_key" ON "public"."configuracion_financiera"("nombre");

-- AddForeignKey
ALTER TABLE "public"."DetalleVenta" ADD CONSTRAINT "DetalleVenta_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "public"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DetalleVenta" ADD CONSTRAINT "DetalleVenta_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "public"."Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Gasto" ADD CONSTRAINT "Gasto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias_gastos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemInventario" ADD CONSTRAINT "ItemInventario_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."CategoriaInventario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Membresia" ADD CONSTRAINT "Membresia_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Membresia" ADD CONSTRAINT "Membresia_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Producto" ADD CONSTRAINT "Producto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."CategoriaInventario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Venta" ADD CONSTRAINT "Venta_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."gastos_detallados" ADD CONSTRAINT "gastos_detallados_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias_gastos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nomina" ADD CONSTRAINT "nomina_entrenador_id_fkey" FOREIGN KEY ("entrenador_id") REFERENCES "public"."Entrenador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pagos_membresias" ADD CONSTRAINT "pagos_membresias_membresia_id_fkey" FOREIGN KEY ("membresia_id") REFERENCES "public"."Membresia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
