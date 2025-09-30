# SPEC: F3 — SLA y dashboard

## 1) Resumen de negocio

El sistema debe calcular y monitorear los **SLAs** definidos por **categoría y prioridad** (primer respuesta y resolución). Managers deben poder ver un dashboard con métricas clave, y recibir alertas de SLA próximos a expirar.

## 2) Actores

* **Manager**: monitorea métricas y SLAs.  

## 3) Criterios de aceptación

* Cada ticket debe almacenar:
  * `sla_first_response_due` (fecha límite para primera respuesta).  
  * `sla_resolution_due` (fecha límite para resolución).  
  * Campos snapshot (`category_name_snapshot`, `priority_name_snapshot`, horas SLA aplicadas al ticket).  

* Dashboard debe mostrar:
  * Tickets creados en los últimos 7 dias. 
  * Porcentaje cumplimiento tickets en tiempos establecidos.  
  * Tiempos promedio de resolución.  

* Sistema debe generar alertas (`SLA_ALERTS`) cuando un ticket esté por vencer o se venza.

## 4) Modelo de datos

Basado en el diagrama ERD:

* `tickets.sla_first_response_due`  
* `tickets.sla_resolution_due`  
* `tickets.sla_first_response_hours_snapshot`  
* `tickets.sla_resolution_hours_snapshot`  
* `sla_alerts(ticket_id, alert_type, triggered_at, resolved)`  
* `category_priority_sla(category_id, priority_id, sla_first_response_hours, sla_resolution_hours)`  

## 5) API / Contratos

* `GET /dashboard`  
  **Response 200**:  

  ```json
  {
  "tickets_last_7_days": 42,
  "sla_compliance_percentage": 85,
  "average_resolution_hours": 36
  }
## 6) Comportamiento UI

- Página `/dashboard` con métricas accesible solo a **Managers**.  
- Tarjetas con **KPIs**.  
- Gráficas de **barras/pie** para:
  - Tickets por categoría  
  - SLA compliance  
- **Notificaciones de alerta SLA** visibles para **Agents** en tickets asignados.  

---

## 7) Validaciones

- Solo **Managers** pueden acceder al dashboard.  
- **Agents** solo visualizan alertas SLA de sus tickets.  

---

## 8) Plan de implementación

- Calcular y guardar **fechas SLA** al crear ticket, usando reglas en `category_priority_sla`.  
- Generar registros en `sla_alerts` cuando aplique.  
- Endpoint `GET /dashboard` que muestre datos.  
- UI: página con **tarjetas + gráficas** . 

---

## 9) Pruebas de aceptación

- Crear 10 tickets, 2 fuera de SLA → dashboard muestra **80% compliance**.  
- **Manager** puede ver dashboard, **Agent** no.  
- Al acercarse un SLA, **Agent recibe alerta**.  
- Si SLA se incumple, alerta registrada en `sla_alerts`.  

---

## 10) Uso de IA

- Prompt para generar **dashboard UI**.  
- Prompt para **detección automática** de tickets en riesgo de SLA.  

