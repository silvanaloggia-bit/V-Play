# VPLAY

Plataforma de streaming de películas y series hecha con React y TypeScript. Proyecto final del Módulo 2 de **Rolling Code School**.

**Ver la página:** https://v-play-mu.vercel.app/

**Tablero de Trello:** [V-Play - Streaming de películas](https://trello.com/b/ifgw3U4a/v-play-streaming-de-pel%C3%ADculas)

---

## Funcionalidades

**Para todos**
- Inicio con un hero de títulos destacados, filas por categoría y el Top 5 de películas y series.
- Tráiler al pasar el mouse por cada título, traído desde la API de TMDb.
- Buscador por nombre desde la barra de navegación.
- Planes de suscripción (Básico, Estándar y Premium) con sus precios y beneficios.
- Registro de usuario con validación de cada campo.
- Páginas de Acerca de nosotros, Contacto, Términos de uso y error 404.

**Para suscriptores**
- Compra de plan con una pasarela de pago simulada.
- Mi lista: guardar títulos para verlos después.
- Contacto con el motivo "Cambiar de plan" ya elegido desde la página de planes.

**Para el equipo (admin y editor)**
- Panel de administración con CRUD de títulos, categorías y tops.
- Búsqueda de títulos en TMDb al cargar uno nuevo.
- Gestión de usuarios registrados: plan, estado y vencimiento.
- Solo el admin puede eliminar títulos y usuarios; el editor puede cargar y editar.
- Rutas protegidas según el rol de cada usuario.

## Tecnologías

| Para qué | Qué usamos |
|---|---|
| Interfaz | React 19 con TypeScript |
| Proyecto y build | Vite |
| Navegación | React Router |
| Estilos | Bootstrap 5, React Bootstrap y Bootstrap Icons |
| Formularios | React Hook Form con Zod |
| Datos | LocalStorage |
| Películas y tráileres | API de TMDb |
| Publicación | Vercel |

## Cómo correrlo en la compu

**Necesitás:** Node.js y pnpm.

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/silvanaloggia-bit/V-Play.git
   ```
2. Entrar a la carpeta:
   ```bash
   cd V-Play
   ```
3. Instalar las dependencias:
   ```bash
   pnpm install
   ```
4. Crear un archivo `.env` en la carpeta principal con tu key de TMDb:
   ```
   VITE_TMDB_API_KEY=tu_key_de_tmdb
   ```
   La key se saca gratis en [themoviedb.org](https://www.themoviedb.org/settings/api). Sin la key la página funciona igual, pero sin tráileres ni búsqueda en TMDb.
5. Levantar el proyecto:
   ```bash
   pnpm dev
   ```
6. Abrir [http://localhost:5173](http://localhost:5173).

**Otros comandos**

| Comando | Qué hace |
|---|---|
| `pnpm build` | arma la versión para publicar |
| `pnpm preview` | muestra esa versión en la compu |
| `pnpm lint` | revisa el código con ESLint |

## Usuarios de prueba

| Rol | Email | Contraseña | Qué puede hacer |
|---|---|---|---|
| Admin | admin@vplay.com | Admin123 | todo el panel, incluido eliminar títulos y usuarios |
| Editor | editor@vplay.com | editor123 | cargar y editar títulos, categorías, tops y usuarios |
| Suscriptor | diego@vplay.com | Diego12345 | ya tiene el plan Estándar y Mi lista |

También se puede crear un usuario nuevo desde **Registrarse**.

## Estructura de carpetas

```
src/
├── assets/       imágenes, logos y pósters
├── components/   piezas que se reusan (navbar, footer, tarjetas, admin)
├── config/       constantes y configuración de TMDb
├── data/         datos iniciales: títulos, planes, usuarios y equipo
├── hooks/        hooks propios (useAuth, useMovies, useCategories, useTops)
├── pages/        una página por ruta
├── routes/       rutas protegidas por rol
├── schemas/      validaciones con Zod
├── services/     lectura y escritura en LocalStorage y llamadas a TMDb
├── styles/       estilos globales y variables de color
├── types/        tipos de TypeScript
└── utils/        funciones de ayuda
```

## Equipo

| Integrante | Rol |
|---|---|
| Silvana Loggia | Team Leader |
| Lucas Díez | Scrum Master |
| Julián Medina | Developer |
| Luciana Villca | Developer |

**Product Owner:** Rolling Code

Trabajamos con Scrum: Sprint Planning, dailies y un tablero de Trello con una historia de usuario por tarjeta. Cada historia tiene su rama, y se une a `main` con un Pull Request revisado y probado por otro integrante (cross testing).
