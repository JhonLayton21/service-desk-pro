# SPEC: F2 — Ciclo de vida del ticket

## 1) Resumen de negocio

Los tickets creados deben transitar entre diferentes estados (ej. **open → in_progress → resolved → closed**), registrando:  
- **Transiciones de estado** con trazabilidad completa.  
- **Auditoría de quién hizo qué**.  
- **Comentarios asociados** al ciclo de vida.  
- **Alertas SLA** cuando se incumplen tiempos.  

## 2) Actores

* **Agent** → atiende ticket, cambia estado, agrega comentarios.  
* **Manager** → puede re-asignar, escalar o forzar cambios de estado.  
* **Requester** → puede comentar y cerrar si el ticket está en `resolved`.  

## 3) Criterios de aceptación

* Estados válidos definidos en tabla `TICKET_STATUS`: `open`, `in_progress`, `resolved`, `closed`.  
* Se registra en `TICKET_TRANSITIONS` cada cambio de estado, con `previous_status_id`, `new_status_id`, `changed_by`.  
* Solo ciertos roles pueden ejecutar determinadas transiciones:  
  - **Agent** → `open → in_progress`, `in_progress → resolved`.  
  - **Manager** → cualquier transición excepto reabrir `closed`.  
  - **Requester** → `resolved → closed` (solo en sus propios tickets).  
* `TICKET_STATUS.is_final = true` indica que el ticket no puede salir de ese estado.  
* SLA Alerts (`SLA_ALERTS`) se generan automáticamente si se incumplen plazos de respuesta o resolución.  

## 4) Modelo de datos

* `TICKETS.status_id` (FK a `TICKET_STATUS`).  
* `TICKET_STATUS` (id, name, is_final).  
* `TICKET_TRANSITIONS` (id, ticket_id, previous_status_id, new_status_id, changed_by, changed_at).  
* `TICKET_COMMENTS` (id, ticket_id, author_id, comment, created_at).  
* `SLA_ALERTS` (id, ticket_id, alert_type, triggered_at, resolved).  

## 5) API / Contratos

### `PATCH /tickets/:id/status`  
**Request:**  
```json
{ "statusId": 2 }
```

**Response 200:**  
``` json
{
  "id": "uuid",
  "status": { "id": 2, "name": "in_progress" },
  "updated_at": "2025-09-28T16:00:00Z"
}
```

### `GET /tickets/:id/transitions`  

**Response 200:**  
``` json
[
  {
    "previous_status": "open",
    "new_status": "in_progress",
    "changed_by": "uuid-user",
    "changed_at": "2025-09-28T16:00:00Z"
  }
]
```

### `POST /tickets/:id/comments`  

**Request:**  
``` json
{ "comment": "Estoy trabajando en el ticket" }
```

**Response 201:**  
``` json
{
  "id": "uuid-comment",
  "author_id": "uuid-agent",
  "comment": "Estoy trabajando en el ticket",
  "created_at": "2025-09-28T16:10:00Z"
}
```

### `GET /tickets/:id/comments`  

### 6) Comportamiento UI

La vista de detalle de un ticket debe mostrar un **timeline cronológico** que combine las transiciones de estado y los comentarios en un solo flujo, de modo que el usuario pueda seguir fácilmente la historia del ticket; además, debe:

- Mostrar el **estado actual** de forma destacada.  
- Incluir **alertas SLA** si existen.  
- Ofrecer **acciones contextualizadas** en botones visibles únicamente si el rol y el estado lo permiten.  

---

### 7) Validaciones

- No se permite pasar de un estado con `is_final = true` (ejemplo: `closed`) a ningún otro estado posterior.  
- Únicamente un **Manager** puede reasignar el agente responsable, incluso si el ticket sigue en progreso.  
- Un **Requester** puede cerrar únicamente **sus propios tickets**, y únicamente si se encuentran en estado `resolved`.  
- Toda transición solicitada debe existir en la tabla `TICKET_STATUS`; si no está registrada, debe considerarse **inválida**.  

---

### 8) Plan de implementación

1. Agregar entidad `TICKET_STATUS` y relación con `TICKETS`.  
2. Implementar endpoint:  
   - `PATCH /tickets/:id/status` con validaciones de rol, control de transición y registro en `TICKET_TRANSITIONS`.  
3. Implementar APIs de comentarios:  
   - `POST /tickets/:id/comments`  
   - `GET /tickets/:id/comments`  
4. Implementar API de alertas SLA:  
   - `GET /tickets/:id/sla-alerts`  
5. Construir en UI un detalle de ticket con timeline que combine transiciones, comentarios y alertas SLA.  

---

### 9) Pruebas de aceptación

- Un **Agent** cambia ticket de `open → in_progress` y el cambio se refleja en transición.  
- Un **Requester** intenta cerrar ticket aún en `open` y recibe error **403**.  
- Un **Manager** fuerza transición `in_progress → closed` y se registra en historial.  
- Un **SLA** expira y se genera alerta visible mediante `/tickets/:id/sla-alerts`.  

---

### 10) Uso de IA

- Prompt para generar **interceptor NestJS** que registre transiciones en `TICKET_TRANSITIONS`.  
- Prompt para **UI de timeline en Next + Tailwind** que combine transiciones y comentarios.  
- Prompt para **componente de comentarios en Next** con validación de entrada dinámica.  
- Prompt para **servicio de alertas SLA** que dispare eventos y cree registros en `SLA_ALERTS`.  
