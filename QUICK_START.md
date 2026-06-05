# 🔑 Getkey - Guía de Instalación Rápida

## ⚡ Quick Start

### 1️⃣ Backend (5 minutos)

```bash
# 1. Ir a la carpeta del servidor
cd server

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor
npm start

# ✅ Server corriendo en http://localhost:3000
```

### 2️⃣ Android App (10 minutos)

```bash
# 1. Copiar archivos
cp android/GetKeyApiService.kt app/src/main/java/com/tu_app/network/
cp android/LoginWithKeyActivity.kt app/src/main/java/com/tu_app/ui/auth/
cp android/activity_login_with_key.xml app/src/main/res/layout/

# 2. Agregar dependencias en build.gradle
# (Ver sección ANDROID DEPENDENCIES)

# 3. Cambiar URL en GetKeyApiService.kt
const val API_BASE_URL = "http://10.0.2.2:3000/"  # Para emulador
# o
const val API_BASE_URL = "http://tu-servidor:3000/"  # Para real

# 4. Build y Run
```

---

## 🌐 API URLs de Ejemplo

### Generar Clave (desde web)
```bash
curl -X POST http://localhost:3000/api/keys/generate
```

### Validar Clave (desde Android)
```bash
curl -X POST http://localhost:3000/api/keys/validate \
  -H "Content-Type: application/json" \
  -d '{"key":"A3F7B2E9C4D1F6G8H2K5L9M3N7P1Q4R8"}'
```

### Login con Clave (desde Android)
```bash
curl -X POST http://localhost:3000/api/keys/use \
  -H "Content-Type: application/json" \
  -d '{
    "key":"A3F7B2E9C4D1F6G8H2K5L9M3N7P1Q4R8",
    "email":"usuario@gmail.com",
    "deviceId":"uuid-123",
    "deviceName":"Samsung Galaxy S21"
  }'
```

---

## 🔧 ANDROID DEPENDENCIES

Agregar a `build.gradle` (Module: app):

```gradle
dependencies {
    // Retrofit
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    
    // OkHttp (logging)
    implementation 'com.squareup.okhttp3:okhttp:4.9.1'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.9.1'
    
    // Coroutines
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.0'
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.0'
    
    // Lifecycle
    implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.4.1'
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.4.1'
    
    // AndroidX
    implementation 'androidx.appcompat:appcompat:1.4.1'
    implementation 'com.google.android.material:material:1.5.0'
}
```

---

## 📱 Estructura de Carpetas Android

```
MyApp/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/tu_app/
│   │   │   │   ├── network/
│   │   │   │   │   └── GetKeyApiService.kt          ← Copiar aquí
│   │   │   │   ├── ui/auth/
│   │   │   │   │   └── LoginWithKeyActivity.kt      ← Copiar aquí
│   │   │   │   └── MainActivity.kt
│   │   │   ├── res/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── activity_login_with_key.xml  ← Copiar aquí
│   │   │   │   │   └── activity_main.xml
│   │   │   │   └── values/
│   │   │   │       └── strings.xml
│   │   │   └── AndroidManifest.xml
│   │   └── test/
│   └── build.gradle
└── build.gradle
```

---

## 🔒 Variables de Entorno (.env)

```bash
# server/.env

# Puerto del servidor
PORT=3000

# Entorno (development, production)
NODE_ENV=development

# URL de la API (para CORS)
API_URL=http://localhost:3000

# URL de la web (para CORS)
WEB_URL=http://localhost:8000

# Base de datos (opcional, si usas MongoDB)
MONGODB_URI=mongodb://localhost:27017/getkey

# JWT Secret (para tokens seguros)
JWT_SECRET=tu_secret_muy_seguro_aqui

# CORS Origins (producción)
CORS_ORIGINS=https://getkey.com,https://api.getkey.com
```

---

## 🚀 Deploy en Producción

### Opción 1: Heroku

```bash
# 1. Crear app
heroku create getkey-api

# 2. Desplegar
git push heroku main

# 3. Ver logs
heroku logs --tail
```

### Opción 2: AWS

```bash
# 1. Crear instancia EC2
# 2. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clonar repositorio
git clone https://github.com/CrissModz/Getkey.git

# 4. Instalar y ejecutar
cd Getkey/server
npm install
npm start
```

### Opción 3: DigitalOcean

```bash
# 1. Crear droplet Ubuntu 20.04
# 2. SSH a la instancia
ssh root@tu-ip

# 3. Instalar Node
apt update
apt install nodejs npm

# 4. Clonar y ejecutar
git clone https://github.com/CrissModz/Getkey.git
cd Getkey/server
npm install
npm start
```

---

## 🧪 Testing

### Test API con Postman

1. Importar colección: `server/getkey-postman.json`
2. Configurar variables de entorno
3. Ejecutar endpoints

### Test Manual

```bash
# 1. Health check
curl http://localhost:3000/api/health

# 2. Generar clave
curl -X POST http://localhost:3000/api/keys/generate

# 3. Validar clave
curl -X POST http://localhost:3000/api/keys/validate \
  -H "Content-Type: application/json" \
  -d '{"key":"TU_CLAVE_AQUI"}'
```

---

## 🐳 Docker (Opcional)

### Dockerfile

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### Build y Run

```bash
# Build
docker build -t getkey-api .

# Run
docker run -p 3000:3000 getkey-api
```

---

## ❌ Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot find module 'express'` | Dependencias no instaladas | Ejecutar `npm install` |
| `EADDRINUSE: address already in use` | Puerto 3000 ocupado | Cambiar puerto en `.env` |
| `ECONNREFUSED` desde Android | No puede alcanzar servidor | Usar `10.0.2.2` en emulador |
| `Clave no encontrada` | Clave inválida | Verificar clave o generar nueva |

---

## 📚 Archivos Incluidos

```
Getkey/
├── server/
│   ├── server.js              ← Backend API
│   ├── package.json           ← Dependencias
│   ├── .env.example          ← Variables de entorno
│   └── keys.json             ← Base de datos (auto-creado)
│
├── android/
│   ├── GetKeyApiService.kt   ← Cliente Retrofit
│   ├── LoginWithKeyActivity.kt ← Activity de login
│   └── activity_login_with_key.xml ← Layout
│
├── index.html                 ← Página web
├── style.css                  ← Estilos cyberpunk
├── script.js                  ← Lógica de generación
│
└── ANDROID_INTEGRATION.md     ← Documentación completa
```

---

## ✅ Checklist de Implementación

- [ ] Servidor corriendo en puerto 3000
- [ ] Android SDK instalado
- [ ] Dependencias agregadas a build.gradle
- [ ] Archivos Kotlin copiados
- [ ] URL del backend configurada
- [ ] Permisos de INTERNET agregados
- [ ] App compilada sin errores
- [ ] Test de login exitoso
- [ ] Token guardado en SharedPreferences
- [ ] Listo para producción

---

## 🆘 Soporte

¿Problemas? Consulta:
1. ANDROID_INTEGRATION.md (documentación completa)
2. Crea un issue en GitHub
3. Contáctame en WhatsApp/YouTube

---

**¡Listo! Tu sistema de autenticación con Getkey está completamente configurado** 🎉
