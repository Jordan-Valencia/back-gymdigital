# GymDigital — API de gestión de gimnasio (Backend)

Backend REST para un sistema integral de gestión de gimnasio: control de **inventario**, **ventas**, **membresías**, **entrenadores**, **nómina**, **gastos** y **reportes financieros**.

Construido con **NestJS + Prisma + PostgreSQL**, con más de 20 módulos y validación de datos en cada endpoint.

---

## Stack

- **Framework:** NestJS 11 (adaptador Fastify) + TypeScript
- **ORM / BD:** Prisma + PostgreSQL
- **Validación:** class-validator / class-transformer
- **Reportes:** ExcelJS (Excel) y PDFKit (PDF)
- **Pruebas:** Jest

## Módulos principales

| Área | Módulos |
|------|---------|
| Inventario | `producto`, `iteminventario`, `categoriainventario`, `itemgaleria` |
| Ventas | `venta`, `detalleventa`, facturación en PDF |
| Membresías | `plan`, `membresia`, `pagos-membresias` |
| Personal | `entrenador`, `nomina` (horas y liquidación) |
| Finanzas | `gastos`, `ingreso-adicional`, `reportes`, `estadisticas` |
| Gestión | `usuarios`, `notificacion`, `evento`, `dashboard`, `trello` (tablero tipo Trello: boards, listas, tarjetas, etiquetas, comentarios) |

## Características

- **CRUD completo** por módulo con DTOs tipados y validación con `class-validator`.
- **Reportes financieros** exportables a **Excel** y **PDF**.
- **Generación de facturas** en PDF.
- **Persistencia** con Prisma ORM sobre PostgreSQL.
- **CORS** configurado para el front-end.

## Requisitos

- Node.js 20+
- PostgreSQL 14+

## Puesta en marcha

```bash
npm install

# Configura la conexión a la base de datos
# Crea un archivo .env con:
#   DATABASE_URL="postgresql://usuario:password@localhost:5432/gymdigital"
#   PORT=3000

# Aplica el esquema a la base de datos
npx prisma migrate dev

# Levanta el servidor en modo desarrollo
npm run start:dev
```

La API queda disponible en `http://localhost:3000`.

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run start:dev` | Servidor en modo watch |
| `npm run build` | Compila el proyecto (`prisma generate` + `nest build`) |
| `npm run start:prod` | Ejecuta el build de producción |
| `npm test` | Pruebas unitarias (Jest) |
| `npm run lint` | Linter (ESLint) |

## Proyecto relacionado

- **Front-end:** [front-gymdigital](https://github.com/Jordan-Valencia/front-gymdigital) — React + TypeScript

---

Desarrollado por **Jordan Valencia** · [github.com/Jordan-Valencia](https://github.com/Jordan-Valencia)
