# 🚀 Emmott Systems – Support API

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

Backend de soporte técnico empresarial para **Emmott Systems**, diseñado para gestionar el ciclo de vida completo de incidencias y suscripciones de un ERP contable.

Este proyecto va más allá de un simple CRUD: simula un entorno de producción real, aplicando arquitectura limpia, principios SOLID y patrones de diseño escalables.

---

## 📖 Tabla de Contenidos

- [🚀 Emmott Systems – Support API](#-emmott-systems--support-api)
  - [📖 Tabla de Contenidos](#-tabla-de-contenidos)
  - [🧠 Contexto del Proyecto](#-contexto-del-proyecto)
  - [✨ Funcionalidades (Diseño del Sistema)](#-funcionalidades-diseño-del-sistema)
    - [🎫 Gestión de Tickets (Help Desk)](#-gestión-de-tickets-help-desk)
    - [🏢 Gestión de Clientes (CRM Light)](#-gestión-de-clientes-crm-light)
    - [💳 Suscripciones y Módulos](#-suscripciones-y-módulos)
    - [👥 Gestión de Usuarios y Roles](#-gestión-de-usuarios-y-roles)
    - [🏛️ Gestión de Áreas](#️-gestión-de-áreas)
    - [📊 Dashboard y Métricas (Planned)](#-dashboard-y-métricas-planned)
  - [🏗️ Arquitectura y Diseño](#️-arquitectura-y-diseño)
    - [Diagrama de Módulos](#diagrama-de-módulos)
    - [Principios Aplicados](#principios-aplicados)
  - [📦 Stack Tecnológico](#-stack-tecnológico)
  - [⚙️ Pre-requisitos](#️-pre-requisitos)
  - [🔧 Instalación y Configuración](#-instalación-y-configuración)
  - [📚 Documentación API](#-documentación-api)
  - [📋 Endpoints Disponibles](#-endpoints-disponibles)
  - [🗂️ Datos Iniciales](#️-datos-iniciales)
  - [🛣️ Roadmap](#️-roadmap)
  - [📄 Licencia](#-licencia)

---

## 🧠 Contexto del Proyecto

**Emmott Systems** provee software contable (SaaS). A medida que la base de clientes crece, la gestión de incidencias vía email se vuelve insostenible.

Este backend es la solución centralizada para el equipo de **Soporte Nivel 1 y 2**, permitiendo:
1.  **Centralización**: Un único punto de verdad para tickets, clientes y contratos.
2.  **Trazabilidad**: Historial completo de interacciones y cambios de estado.
3.  **Eficiencia**: Asignación inteligente de tickets basada en la carga de trabajo y especialidad del analista.

---

## ✨ Funcionalidades (Diseño del Sistema)

Las siguientes funcionalidades describen el diseño objetivo del sistema.
Algunas se encuentran actualmente en desarrollo según el roadmap.

### 🎫 Gestión de Tickets (Help Desk)
- Creación de tickets con prioridades (Alta, Media, Baja) y SLA definidos.
- Flujo de estados: `Abierto` → `En Progreso` → `En Espera` → `Resuelto` → `Cerrado`.
- Asignación automática o manual a analistas.

### 🏢 Gestión de Clientes (CRM Light)
- Administración de empresas clientes y sus sedes.
- Gestión de contactos autorizados para crear tickets.

### 💳 Suscripciones y Módulos
- Control de qué módulos del ERP ha contratado cada cliente (ej. Contabilidad, RRHH, Inventario).
- Validación de soporte activo antes de permitir la creación de tickets.

### 👥 Gestión de Usuarios y Roles
- CRUD completo de usuarios del sistema.
- Asignación de roles con diferentes niveles de acceso.
- Roles predefinidos:
  - **ADMIN**: Administrador del sistema
  - **SUPERVISOR**: Supervisor de área
  - **ANALYST**: Analista de soporte
  - **QA**: Analista de calidad
  - **DEVELOPER**: Desarrollador de software

### 🏛️ Gestión de Áreas
- Organización de usuarios por áreas funcionales.
- Áreas predefinidas:
  - Soporte
  - Desarrollo de Software
  - Marketing
  - Finanzas
  - Recursos Humanos

### 📊 Dashboard y Métricas (Planned)
- Reportes de tickets por área.
- Tiempos promedios de respuesta y resolución.

---

## 🏗️ Arquitectura y Diseño

El proyecto sigue una arquitectura de **Monolito Modular**, preparando el terreno para una eventual migración a microservicios si fuese necesario.

### Diagrama de Módulos
```mermaid
graph TD
    A[Client Request] --> B{API Gateway / Controller}
    B --> C[Tickets Module]
    B --> D[Companies Module]
    B --> E[Users Module]
    B --> F[Roles Module]
    B --> G[Areas Module]
    
    C --> H[(PostgreSQL)]
    D --> H
    E --> H
    F --> H
    G --> H
    
    subgraph "Core Business Logic"
    C
    D
    end
    
    subgraph "User Management"
    E
    F
    G
    end
```

### Principios Aplicados
- **Domain-Driven Design (DDD) – Enfoque conceptual**: Separación clara por contextos delimitados.
- **Dependency Injection**: Uso nativo del contenedor de NestJS para mejorar la testabilidad.
- **DTOs (Data Transfer Objects)**: Validación estricta de datos de entrada usando `class-validator`.
- **Repository Pattern**: Abstracción de la capa de datos con TypeORM.

---

## 📦 Stack Tecnológico

| Area | Tecnología | Uso |
|------|------------|-----|
| **Core** | [NestJS](https://nestjs.com/) | Framework principal del backend |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) | Tipado estático y seguridad |
| **Base de Datos** | [PostgreSQL](https://www.postgresql.org/) | Persistencia relacional robusta |
| **ORM** | [TypeORM](https://typeorm.io/) | Mapeo objeto-relacional |
| **Contenerización** | [Docker](https://www.docker.com/) | Entorno de desarrollo reproducible |
| **API Docs** | [Swagger](https://swagger.io/) | Documentación interactiva (OpenAPI 3.0) |
| **Testing** | [Jest](https://jestjs.io/) | Unit & Integration Testing |

---

## ⚙️ Pre-requisitos

Asegúrate de tener instalado en tu sistema:
- **Node.js** v18 o superior.
- **Docker Desktop** (con Docker Compose).
- **Git**

---

## 🔧 Instalación y Configuración

Sigue estos pasos para levantar el entorno de desarrollo localmente:

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/tu-usuario/soporte-api.git
    cd soporte-api
    ```

2.  **Configurar Variables de Entorno**
    Crea un archivo `.env` en la raíz basado en el ejemplo:
    ```bash
    cp .env.example .env
    ```
    *(Asegúrate de que las credenciales de DB coincidan con tu docker-compose)*

3.  **Instalar Dependencias**
    ```bash
    npm install
    ```

4.  **Levantar Base de Datos (Docker)**
    ```bash
    docker-compose up -d
    ```
    Esto levantará:
    - **PostgreSQL** en puerto `5432`
    - **Adminer** (gestor de BD) en puerto `8080`

5.  **Ejecutar el Servidor**
    ```bash
    # Modo desarrollo (con hot-reload)
    npm run start:dev
    ```

El servidor estará corriendo en: `http://localhost:3000`

---

## 📚 Documentación API

La documentación interactiva de la API se genera automáticamente con Swagger.

Una vez iniciada la aplicación, visita:
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

Aquí podrás probar los endpoints, ver los esquemas de datos y autenticarte.

---

## 📋 Endpoints Disponibles

| Recurso | Método | Endpoint | Descripción |
|---------|--------|----------|-------------|
| **Empresas** | GET | `/empresas` | Listar todas las empresas |
| | POST | `/empresas` | Crear una empresa |
| | GET | `/empresas/:id` | Obtener empresa por ID |
| | PATCH | `/empresas/:id` | Actualizar empresa |
| | DELETE | `/empresas/:id` | Eliminar empresa |
| **Contactos** | GET | `/contactos` | Listar todos los contactos |
| | POST | `/contactos` | Crear un contacto |
| | GET | `/contactos/:id` | Obtener contacto por ID |
| | PATCH | `/contactos/:id` | Actualizar contacto |
| | DELETE | `/contactos/:id` | Eliminar contacto |
| **Suscripciones** | GET | `/suscripciones` | Listar todas las suscripciones |
| | POST | `/suscripciones` | Crear una suscripción |
| | GET | `/suscripciones/:id` | Obtener suscripción por ID |
| | PATCH | `/suscripciones/:id` | Actualizar suscripción |
| | DELETE | `/suscripciones/:id` | Eliminar suscripción |
| **Áreas** | GET | `/areas` | Listar todas las áreas |
| | POST | `/areas` | Crear un área |
| | GET | `/areas/:id` | Obtener área por ID |
| | PATCH | `/areas/:id` | Actualizar área |
| | DELETE | `/areas/:id` | Eliminar área |
| **Usuarios** | GET | `/usuarios` | Listar todos los usuarios |
| | POST | `/usuarios` | Crear un usuario |
| | GET | `/usuarios/:id` | Obtener usuario por ID |
| | PATCH | `/usuarios/:id` | Actualizar usuario |
| | DELETE | `/usuarios/:id` | Eliminar usuario |
| **Roles** | GET | `/roles` | Listar todos los roles |
| | POST | `/roles` | Crear un rol |
| | GET | `/roles/:id` | Obtener rol por ID |
| | PATCH | `/roles/:id` | Actualizar rol |
| | DELETE | `/roles/:id` | Eliminar rol |
| **Tickets** | GET | `/tickets` | Listar todos los tickets |
| | POST | `/tickets` | Crear un ticket |
| | GET | `/tickets/:id` | Obtener ticket por ID |
| | PATCH | `/tickets/:id` | Actualizar ticket |
| | DELETE | `/tickets/:id` | Eliminar ticket |

---

## 🗂️ Datos Iniciales

Una vez iniciada la aplicación, puedes crear los datos iniciales:

### Roles disponibles
| ID | Nombre | Descripción |
|----|--------|-------------|
| 1 | ADMIN | Administrador del sistema |
| 2 | SUPERVISOR | Supervisor de área |
| 3 | ANALYST | Analista de soporte |
| 4 | QA | Analista de calidad |
| 5 | DEVELOPER | Desarrollador de software |

### Áreas disponibles
| ID | Nombre | Descripción |
|----|--------|-------------|
| 1 | Soporte | Área de soporte técnico |
| 2 | Desarrollo de Software | Área de desarrollo |
| 3 | Marketing | Área de marketing |
| 4 | Finanzas | Área de finanzas |
| 5 | Recursos Humanos | Área de RRHH |

### Ejemplo: Crear un usuario
```json
POST /usuarios
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@empresa.com",
  "rut": "12345678-9",
  "roleId": 5,
  "areaId": 2
}
```

---

## 🛣️ Roadmap

- [x] Configuración inicial del proyecto y Docker.
- [x] Conexión a Base de Datos PostgreSQL.
- [x] Implementación del módulo de **Empresas**.
- [x] Implementación del módulo de **Contactos**.
- [x] Implementación del módulo de **Suscripciones**.
- [x] Implementación del módulo de **Áreas** (CRUD completo).
- [x] Implementación del módulo de **Roles** (CRUD completo).
- [x] Implementación del módulo de **Usuarios** (CRUD completo).
- [x] Implementación del módulo de **Tickets**.
- [ ] Implementación de **Autenticación (JWT)**.
- [ ] Tests unitarios y de integración.
- [ ] Pipeline CI/CD (GitHub Actions).

---

## 📄 Licencia

Este proyecto se distribuye bajo licencia **MIT**. Puedes usarlo libremente para fines educativos o profesionales.

---
<p align="center">
  <sub>Desarrollado con ❤️ para el portafolio profesional.</sub>
</p>
