# Sistema de Despachos

Una aplicación web para la gestión de despachos, productos y puntos de entrega. Construida con React y Vite, utilizando Material-UI para la interfaz de usuario y Axios para las comunicaciones con la API backend.

## Características

- **Autenticación de usuarios**: Sistema de login seguro con tokens JWT.
- **Gestión de productos**: Crear, leer, actualizar y eliminar productos.
- **Gestión de despachos**: Crear y gestionar despachos con estados.
- **Puntos de entrega**: Administrar puntos de entrega para despachos.
- **Interfaz responsiva**: Diseño adaptativo para dispositivos móviles y desktop.
- **Protección de rutas**: Rutas privadas que requieren autenticación.

## Tecnologías utilizadas

- **Frontend**:
  - React 18.3.1
  - Vite 5.4.9
  - Material-UI (@mui/material) 5.16.7
  - React Router DOM 6.27.0
  - Axios 1.7.7

- **Herramientas de desarrollo**:
  - ESLint para linting
  - Vite para construcción y desarrollo

## Instalación

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/gualdronjl/dispatch-management-app.git
   cd dispatch-management-app
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno (opcional):
   Crea un archivo `.env` en la raíz del proyecto y configura la URL de la API:
   ```
   VITE_API_URL=http://localhost:8000
   ```
   Si no se configura, usará `http://localhost:8000` por defecto.

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

La aplicación estará disponible en `http://localhost:5173`.

## Uso

### Scripts disponibles

- `npm run dev`: Inicia el servidor de desarrollo con hot reload.
- `npm run build`: Construye la aplicación para producción.
- `npm run preview`: Previsualiza la aplicación construida.

### Navegación

- **Login**: Página de inicio de sesión.
- **Productos**: Gestión de productos (requiere autenticación).
- **Puntos de entrega**: Gestión de puntos de entrega (requiere autenticación).
- **Lista de despachos**: Ver despachos existentes (requiere autenticación).
- **Crear despacho**: Formulario para crear nuevos despachos (requiere autenticación).

### Autenticación

La aplicación utiliza tokens JWT almacenados en localStorage. Las rutas protegidas redirigirán al login si no hay token válido.

## Estructura del proyecto

```
src/
├── api/                 # Clientes de API
│   ├── apiClient.js     # Configuración base de Axios
│   ├── dispatchApi.js   # API para despachos y puntos de entrega
│   └── productApi.js    # API para productos
├── assets/              # Recursos estáticos
├── components/          # Componentes reutilizables
│   ├── DispatchForm.jsx # Formulario de despacho
│   ├── Navbar.jsx       # Barra de navegación
│   ├── PrivateRoute.jsx # Componente de ruta protegida
│   └── ProductForm.jsx  # Formulario de producto
├── context/             # Contextos de React
│   └── AuthContext.jsx  # Contexto de autenticación
├── hooks/               # Hooks personalizados
│   └── useAuth.js       # Hook para autenticación
├── pages/               # Páginas de la aplicación
│   ├── DeliveryPoints.jsx # Página de puntos de entrega
│   ├── DispatchCreate.jsx # Página de creación de despacho
│   ├── DispatchList.jsx    # Página de lista de despachos
│   ├── Login.jsx           # Página de login
│   └── Products.jsx        # Página de productos
├── App.css              # Estilos globales
├── App.jsx              # Componente principal
├── index.css            # Estilos base
└── main.jsx             # Punto de entrada
```

## API

La aplicación se comunica con un backend API REST. Los endpoints principales incluyen:

### Autenticación
- `POST /auth/login`: Iniciar sesión
- `POST /auth/register`: Registrar usuario
- `POST /auth/forgot-password`: Recuperar contraseña

### Productos
- `GET /products/`: Obtener todos los productos
- `GET /products/{id}`: Obtener producto por ID
- `POST /products/`: Crear producto
- `PUT /products/{id}`: Actualizar producto
- `DELETE /products/{id}`: Eliminar producto

### Despachos
- `GET /dispatches/`: Obtener todos los despachos
- `GET /dispatches/{id}`: Obtener despacho por ID
- `POST /dispatches/`: Crear despacho
- `PATCH /dispatches/{id}/status`: Actualizar estado del despacho

### Puntos de entrega
- `GET /delivery-points/`: Obtener todos los puntos
- `GET /delivery-points/{id}`: Obtener punto por ID
- `POST /delivery-points/`: Crear punto de entrega
- `PUT /delivery-points/{id}`: Actualizar punto
- `DELETE /delivery-points/{id}`: Eliminar punto

## Despliegue

La aplicación está configurada para desplegarse en Vercel. El archivo `vercel.json` contiene la configuración necesaria.
Tambien incluye soporte PWA con `manifest.webmanifest`, `service-worker.js`, iconos instalables y meta tags moviles.

Para desplegar:

1. Construye la aplicación:
   ```bash
   npm run build
   ```

2. Despliega en Vercel o tu plataforma preferida.

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Ajustes solicitados en mayo de 2026

- Se agrega el modulo de conductores asociados a placas vehiculares.
- `ADMIN` puede crear, editar y desactivar conductores.
- `SUPERVISOR` puede consultar el grid de conductores en solo lectura.
- `OPERADOR` no ve el modulo de conductores, pero puede buscar conductor/placa activa desde el formulario de despacho.
- El formulario de despacho exige punto de entrega, conductor/placa y productos antes de crear el registro.
- La lista de despachos muestra conductor y placa guardada en base de datos.
- Al iniciar sesion como `OPERADOR`, se muestra una ventana de terminos y condiciones con boton `Siguiente`.
- La app queda preparada como PWA instalable y mantiene layout responsive en mobile/desktop.

### Endpoints nuevos usados por el frontend

- `GET /drivers/?search=texto&status=ACTIVO&limit=20`
- `POST /drivers/`
- `PUT /drivers/{id}`
- `DELETE /drivers/{id}`

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
