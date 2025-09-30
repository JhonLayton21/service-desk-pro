# SPEC: F1 — Intake y creación de tickets por categoría

## 1) Resumen de negocio

Un **Requester** (empleado) debe poder crear un ticket seleccionando una categoría preconfigurada por el Manager. Esa categoría define **campos dinámicos**, **prioridades**, y **SLAs** específicos.

## 2) Actores

* **Requester** → empleado que crea ticket.
* **Agent** → equipo de soporte que atiende el ticket.
* **Manager** → configura categorías, campos dinámicos y reglas de SLA por prioridad.

## 3) Criterios de aceptación

* Solo el **Manager** puede gestionar categorías, campos adicionales y SLAs.
* El **Requester** elige una categoría y el sistema muestra los **campos dinámicos** definidos en `CATEGORY_FIELDS`.
* Los campos pueden ser **obligatorios** u **opcionales** (`is_required`).
* El ticket debe almacenar un **snapshot** de la categoría, prioridad y SLA en el momento de la creación (para trazabilidad histórica).
* Validaciones en **frontend** y **backend** para garantizar consistencia de datos.

## 4) Modelo de datos

### Tablas principales

* **CATEGORIES** → id, name, description, created_by.
* **CATEGORY_FIELDS** → id, category_id, field_name, field_type, is_required.
* **CATEGORY_PRIORITY_SLA** → id, category_id, priority_id, sla_first_response_hours, sla_resolution_hours.
* **TICKETS** → id, title, description, requester_id, category_id, status_id, priority_id, assigned_to, snapshots (category_name, priority_name, SLA horas, SLA due dates).
* **TICKET_FIELD_VALUES** → id, ticket_id, field_id, value.

### Snapshot en `TICKETS`

Se almacenan:

* `category_name_snapshot`
* `priority_name_snapshot`
* `sla_first_response_hours_snapshot`
* `sla_resolution_hours_snapshot`
* `sla_first_response_due`
* `sla_resolution_due`

## 5) API / Contratos

### `GET /categories`

Devuelve categorías con sus campos dinámicos y reglas SLA por prioridad.

**Response ejemplo:**

```json
[
  {
    "id": "uuid-cat",
    "name": "Acceso ERP",
    "fields": [
      { "id": "uuid-field", "field_name": "Sistema", "field_type": "text", "is_required": true },
      { "id": "uuid-field2", "field_name": "Motivo", "field_type": "textarea", "is_required": false }
    ],
    "priorities": [
      { "id": 1, "name": "Alta", "sla_first_response_hours": 2, "sla_resolution_hours": 24 },
      { "id": 2, "name": "Media", "sla_first_response_hours": 4, "sla_resolution_hours": 48 }
    ]
  }
]
```

### `POST /tickets`

**Request:**

```json
{
  "title": "No puedo acceder",
  "description": "Intento loguearme y no funciona",
  "categoryId": "uuid-cat",
  "priorityId": 1,
  "fields": [
    { "fieldId": "uuid-field", "value": "ERP" },
    { "fieldId": "uuid-field2", "value": "Falla login" }
  ]
}
```

**Response 201:**

```json
{
  "id": "uuid-ticket",
  "title": "No puedo acceder",
  "status": "open",
  "priority": "Alta",
  "sla_first_response_due": "2025-09-29T10:00:00Z",
  "sla_resolution_due": "2025-09-30T10:00:00Z"
}
```

## 6) Comportamiento UI

* Página `/tickets/new`.
* Al seleccionar **categoría**, se cargan dinámicamente los campos desde `CATEGORY_FIELDS`.
* Botón **"Crear"** deshabilitado hasta cumplir validaciones.

## 7) Validaciones

* Todos los campos con `is_required = true` deben estar presentes en `fields`.
* `priorityId` debe existir y tener reglas SLA definidas.
* Validación tanto en **frontend** (React/Yup) como en **backend** (NestJS/DTOs).

## 8) Plan de implementación

1. Definir entidades `Category`, `CategoryField`, `CategoryPrioritySLA`, `Ticket`, `TicketFieldValue`.
2. Implementar `GET /categories` incluyendo campos y SLAs por prioridad.
3. Implementar `POST /tickets`:

   * Validar campos requeridos.
   * Guardar ticket + snapshots.
   * Calcular SLA due dates (`created_at + sla_hours`).
4. Frontend: formulario dinámico con validación Yup.

## 9) Pruebas de aceptación

* Crear ticket con todos los campos → **éxito**.
* Omitir campo requerido → **error 400**.
* Revisar que las fechas de SLA se calculen correctamente según la prioridad.
* Cambiar reglas SLA en `CATEGORY_PRIORITY_SLA` y verificar que los nuevos tickets respeten los nuevos valores, sin alterar snapshots de tickets anteriores.

## 10) Uso de IA

* prompt para **crear entidades** con typeORM 
* Prompt para **generar formulario dinámico** en Next (Tailwind + Yup).
* Prompt para **endpoint NestJS** con validación dinámica de `fields`.
* Prompt para **tests automatizados** (e2e con Jest + Supertest).

