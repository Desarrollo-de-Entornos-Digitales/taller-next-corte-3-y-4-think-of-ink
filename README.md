# Think of Ink

Red social para tatuadores, estudios y amantes del tatuaje. Los usuarios pueden publicar trabajos, explorar por estilos, dar like, comentar, y descubrir estudios cercanos.

## Requisitos previos

- Node.js v20 o superior
- npm
- Backend API corriendo en `http://localhost:3001`

## Instalación

```bash
npm install
```

## Configuración

Crear archivo `.env.local` en la raíz del proyecto:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Ejecución

### Desarrollo

```bash
npm run dev
```

La aplicación se monta en `http://localhost:3000`.

### Producción

```bash
npm run build
npm start
```

### Backend

La aplicación requiere un backend API corriendo en la URL configurada en `NEXT_PUBLIC_API_URL`. Sin backend, el login y registro no funcionarán; las demás funcionalidades usarán datos mock de respaldo.

---

## Funcionalidades implementadas

### 1. Autenticación

#### Registro (`/register`)
- Formulario con nombre completo, nombre de usuario, correo electrónico, contraseña, ubicación y rol (`Usuario` o `Tatuador/Estudio`).
- Validación de términos y condiciones.
- Consume `POST /auth/register`.
- Al registrarse redirige a `/login`.

#### Inicio de sesión (`/login`)
- Formulario con correo electrónico y contraseña.
- Consume `POST /auth/login`.
- En éxito, almacena el JWT en `localStorage` bajo la clave `token` y redirige a `/feed`.
- Incluye enlace a registro y recuperación de contraseña.

#### Recuperación de contraseña (`/forgot-password`)
- Página estática con enlaces a login y registro.

### 2. Feed de publicaciones (`/feed`)

Tres pestañas:

- **Para ti**: Muestra todas las publicaciones obtenidas desde `GET /posts`, paginadas de 3 en 3.
- **Recientes**: Ordena las publicaciones por fecha de creación descendente.
- **Siguiendo**: Pendiente de implementar (actualmente muestra datos mock).

Cada publicación muestra:
- Avatar, nombre de usuario y ubicación del autor.
- Badge de categoría con icono.
- Título, descripción e imagen.
- Botones de like, comentario, y eliminar (si es propia).
- Fecha de publicación.

### 3. Creación de publicaciones

Modal en la página de inicio (`/feed`) y página dedicada (`/feed/new-post`).

- Tipos: `Diseño`, `Promoción`, `Solicitud`.
- Campos: título, descripción, categoría (desde 13 categorías predefinidas), ubicación e imagen opcional.
- **Con imagen**: envía `FormData` (multipart/form-data).
- **Sin imagen**: envía JSON.
- Validación de formato de imagen (JPG, PNG, WebP, máx. 10 MB).
- Vista previa de imagen antes de publicar.

### 4. Likes

- Toggle de like vía `POST /posts/{postId}/like`.
- Actualización optimista del estado (el contador se actualiza inmediatamente en la UI).
- Manejo de rollback si el API falla.
- Estados visuales: corazón ❤️ (liked) / 🤍 (unliked).

### 5. Comentarios

Disponibles en el modal de detalle de cada publicación.

- **Listar**: `GET /posts/{postId}/comments`.
- **Crear**: `POST /posts/{postId}/comments` con el contenido del comentario.
- **Eliminar**: `DELETE /posts/{postId}/comments/{commentId}` (solo el autor del comentario).
- Envío con tecla Enter.

### 6. Categorías (`/categories`)

Exploración de publicaciones filtradas por estilo de tatuaje.

- 13 categorías: Blackwork, Realismo, Fine Line, Tradicional, Neo Tradicional, Minimalista, Geométrico, Anime, Lettering, Color, Tribal, Piercing, Estudios.
- Filtro por categoría mediante botones tipo pill.
- Secciones:
  - **Recientes**: Últimas 4 publicaciones de la categoría seleccionada.
  - **Más virales**: Publicaciones destacadas.
  - **Más likes**: Publicaciones con más likes.
  - **Tatuadores cerca de ti**: Estudios recomendados con logo, rating y especialidad.
  - **Estudios destacados**: Estudios con logo y calificación.

### 7. Perfiles de usuario (`/profile`, `/profile/[userId]`)

- **Perfil propio** (`/profile`): Muestra avatar, nombre, usuario, profesión, biografía, ubicación, seguidores, seguidos y enlaces a redes sociales.
- **Perfil público** (`/profile/[userId]`): Vista de solo lectura del perfil de otro usuario.
- Cuadrícula de publicaciones del usuario con modal de detalle.

### 8. Perfiles de estudio (`/studio/[studioId]`)

- Logo del estudio, nombre, especialidades, descripción, ubicación, rating y enlaces a redes.
- Cuadrícula de trabajos publicados por el estudio.
- Modal de detalle de cada trabajo con likes y comentarios.

### 9. Edición de perfil (`/profile/settings`)

- Campos editables: nombre completo, nombre de usuario, profesión, biografía, correo, sitio web, ubicación y enlaces a redes (LinkedIn, Behance, Instagram, portafolio).
- Subida de avatar (`POST /users/avatar` con FormData).
- Sincronización con `localStorage` y `UserContext`.

### 10. Filtro por rango de precio (`/price-range`)

- Slider de rango de precio (0 — $1.500.000 COP).
- Botones predefinidos: `< $100K`, `$100K–$300K`, `$300K–$600K`, `$600K–$1M`, `> $1M`.
- Ordenamiento: Recomendados, Mejor calificados, Menor precio, Mayor precio.
- Consume `GET /posts/filter-by-price?minPrice=X&maxPrice=Y`.

### 11. Ubicación (`/location`)

- Mapa interactivo con Leaflet centrado en Cali, Colombia.
- 5 estudios hardcodeados con coordenadas.
- Búsqueda y filtro de estudios por nombre o dirección.
- Al hacer clic en un estudio, el mapa vuela a su ubicación y abre un popup.
- Marcadores personalizados con iconos `divIcon` de Leaflet.

### 12. Mis publicaciones (`/profile/my-posts`)

- Lista de publicaciones del usuario autenticado con opción de eliminar.
- Modal de comentarios para cada publicación.

### 13. Notificaciones

- Campana en la barra de navegación con contador de no leídas.
- Dropdown con notificaciones mock.
- Cada notificación muestra avatar, texto de acción, tiempo transcurrido e indicador de leída/no leída.

---

## Autenticación, autorización y gestión de estado

### Autenticación

El flujo de autenticación funciona mediante JWT:

1. El usuario se registra (`POST /auth/register`) o inicia sesión (`POST /auth/login`).
2. El backend responde con un `access_token` (JWT).
3. El frontend almacena el token en `localStorage` bajo la clave `token`.
4. Cada petición a la API incluye el token en el header `Authorization: Bearer {token}`.

**Login** (`src/app/login/`):
- Usa `axios.post()` para enviar credenciales al backend.
- En éxito, guarda `access_token` en `localStorage` y redirige a `/feed`.
- Datos adicionales del usuario (`username`, `location`, `profession`) se cachean en `localStorage`.

**Registro** (`src/app/register/`):
- Permite seleccionar rol (`Usuario` o `Tatuador/Estudio`).
- En éxito, muestra alerta y redirige a `/login`.

### Autorización

El control de acceso se implementa exclusivamente en el cliente:

1. **Protección de rutas**: Cada página protegida verifica la existencia del token en `localStorage`. Si no existe, redirige a `/login` mediante `window.location.href = '/login'`.

2. **Identidad del usuario**: El JWT se decodifica en el cliente (`atob(token.split('.')[1])`) para extraer el `sub`, `id` o `userId`. Este ID se usa para determinar la pertenencia de publicaciones y comentarios.

3. **Control de acciones**: Los botones de eliminar publicación o comentario solo se muestran si `String(item.user?.id) === String(currentUserId)`.

4. **Roles**: El rol seleccionado en registro (`Usuario` o `Tatuador/Estudio`) se envía al backend pero no se utiliza para control de acceso en el frontend. La distinción entre perfil de usuario y estudio se maneja mediante rutas separadas (`/profile/[userId]` vs `/studio/[studioId]`).

### Gestión de estado

La aplicación utiliza tres estrategias de gestión de estado:

#### 1. Context API (estado global de usuario)

**Archivo**: `src/app/context/UserContext.tsx`

`UserProvider` envuelve todo el árbol de componentes desde `layout.tsx`. Expone:
- `user`: Objeto `UserProfile` con datos del usuario autenticado.
- `loading`: Estado de carga inicial.
- `refreshUser()`: Recarga el perfil desde `GET /users/profile`.
- `updateAvatar(url)`: Actualiza el avatar en el contexto y `localStorage`.
- `updateProfile(partial)`: Actualiza campos del perfil en el contexto y `localStorage`.

Al montarse, el provider:
1. Verifica si hay un token en `localStorage`.
2. Si existe, hace fetch a `GET /users/profile`.
3. Normaliza la respuesta y la almacena en el contexto y `localStorage`.
4. Si no hay token o el fetch falla, el usuario se queda como `null`.

#### 2. Estado local en componentes (useState, useEffect, useCallback)

Cada página maneja su propio estado local:
- `allPosts`, `loading`, `error` en el feed.
- `activeCategory`, `search` en la página de categorías.
- `likedPosts` como `Set<string>` en componentes que requiren like.
- `likeCounts` como `Record<string, number>` para conteos optimistas.

Los efectos secundarios (fetch de datos) se manejan con `useEffect` y `useCallback` para memoización.

#### 3. localStorage como capa de persistencia

Se usa para mantener sesión y datos del usuario entre recargas:
- `token`: JWT de autenticación.
- `user`: Objeto `UserProfile` serializado.
- `username`, `location`, `profession`: Datos de acceso rápido.

No se utilizan cookies, Redux, Zustand ni otras bibliotecas de estado.

### Manejo de datos mock

Cuando el backend no está disponible o la autenticación falla, la aplicación cuenta con datos mock de respaldo definidos en `src/lib/mock-profiles.ts`:
- `MOCK_USERS`, `MOCK_STUDIOS`, `MOCK_FEED_POSTS`, `MOCK_RESULTS`, entre otros.
- Las funciones `getMockPostsForUser()` y `getMockPostsForStudio()` devuelven publicaciones mock para perfiles específicos.
- Los datos mock permiten navegar y explorar la aplicación incluso sin backend, aunque el login/registro siempre requieren conexión al API.
