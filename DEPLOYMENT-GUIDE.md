# Guía de Despliegue - Sitio Web Gerontólogo

## 🚀 Pasos para Despliegue Completo

### 1. Preparación Local

#### Resolver Problema de Permisos OneDrive
```cmd
# Opción A: Mover a ubicación local (RECOMENDADO)
mkdir C:\proyectos
cd C:\proyectos
xcopy "ruta-actual\gerontologist-website" "C:\proyectos\gerontologist-website" /E /I
cd C:\proyectos\gerontologist-website

# Limpiar e instalar dependencias
rmdir /s /q node_modules
del package-lock.json
npm install

# Probar localmente
npm run dev
```

#### Verificar que Todo Funciona
- Sitio accesible en `http://localhost:4321`
- Todas las páginas cargan correctamente
- Tests pasan: `npm run test:run`
- Build funciona: `npm run build`

### 2. Configuración de GitHub

```cmd
# Si no tienes Git inicializado
git init

# Agregar archivos
git add .
git commit -m "Initial commit: Complete gerontologist website"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/TU-USUARIO/gerontologist-website.git
git branch -M main
git push -u origin main
```

### 3. Despliegue en Netlify

#### 3.1 Crear Sitio
1. Ve a [netlify.com](https://netlify.com) e inicia sesión
2. Clic en "New site from Git"
3. Conecta con GitHub y selecciona tu repositorio
4. Configuración de build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 18
5. Clic en "Deploy site"

#### 3.2 Configurar Dominio (Opcional)
1. En tu sitio de Netlify → "Domain settings"
2. "Add custom domain" si tienes uno
3. O usar el dominio gratuito de Netlify: `tu-sitio.netlify.app`

#### 3.3 Configurar Netlify Identity (IMPORTANTE para CMS)
1. En tu sitio → pestaña "Identity"
2. Clic en "Enable Identity"
3. En "Settings and usage":
   - Scroll hasta "Git Gateway"
   - Clic en "Enable Git Gateway"
4. En "Registration preferences":
   - Seleccionar "Invite only" (más seguro)

#### 3.4 Actualizar URLs del CMS
1. Copia tu URL de Netlify (ej: `https://amazing-site-123.netlify.app`)
2. Actualiza el archivo `public/admin/config.yml`:
   ```yaml
   site_url: https://tu-url-de-netlify.netlify.app
   display_url: https://tu-url-de-netlify.netlify.app
   ```
3. Commit y push los cambios:
   ```cmd
   git add .
   git commit -m "Update CMS URLs for production"
   git push
   ```

### 4. Configurar Acceso al CMS

#### 4.1 Invitar Usuario Administrador
1. En Netlify → tu sitio → "Identity"
2. Clic en "Invite users"
3. Ingresa el email del administrador
4. El usuario recibirá un email de invitación

#### 4.2 Primer Acceso al CMS
1. Ve a `https://tu-sitio.netlify.app/admin`
2. Clic en "Login with Netlify Identity"
3. Sigue el enlace del email de invitación
4. Crea una contraseña
5. ¡Ya puedes gestionar contenido!

### 5. Verificación Final

#### Checklist de Funcionalidades
- [ ] Sitio web carga correctamente
- [ ] Todas las páginas funcionan (Home, Servicios, Recursos)
- [ ] CMS accesible en `/admin`
- [ ] Login con Netlify Identity funciona
- [ ] Puedes crear/editar publicaciones en el CMS
- [ ] Las publicaciones aparecen en el sitio
- [ ] Imágenes se suben correctamente
- [ ] Responsive design funciona en móvil
- [ ] SEO meta tags están presentes

#### URLs Importantes
- **Sitio web:** `https://tu-sitio.netlify.app`
- **CMS Admin:** `https://tu-sitio.netlify.app/admin`
- **Repositorio:** `https://github.com/tu-usuario/gerontologist-website`

### 6. Uso del CMS

#### Para Crear Nueva Publicación
1. Ve a `/admin` e inicia sesión
2. Clic en "Publicaciones" → "Nueva Publicación"
3. Completa todos los campos:
   - Título (máx 60 caracteres)
   - Descripción (máx 160 caracteres)
   - Fecha de publicación
   - Imagen destacada (1200x630px recomendado)
   - Categoría
   - Contenido en Markdown
4. "Save" para borrador o "Publish" para publicar

#### Flujo Editorial
- **Borrador:** Artículo en proceso
- **En Revisión:** Listo para revisión
- **Listo:** Aprobado para publicación

### 7. Mantenimiento

#### Actualizaciones de Contenido
- Todo se gestiona desde el CMS en `/admin`
- Los cambios se reflejan automáticamente en el sitio
- Netlify reconstruye el sitio automáticamente

#### Copias de Seguridad
- El contenido se guarda en GitHub automáticamente
- Netlify mantiene historial de deployments
- Puedes revertir cambios desde Netlify o GitHub

### 8. Solución de Problemas

#### CMS no carga
- Verifica que Netlify Identity esté habilitado
- Confirma que Git Gateway esté configurado
- Revisa que las URLs en config.yml sean correctas

#### Cambios no aparecen
- Espera 2-3 minutos para el rebuild automático
- Verifica el estado del build en Netlify
- Confirma que el artículo no esté marcado como borrador

#### Errores de build
- Revisa los logs en Netlify → "Deploys"
- Verifica que todas las dependencias estén en package.json
- Confirma que el build funciona localmente: `npm run build`

### 9. Próximos Pasos

#### Optimizaciones Opcionales
- Configurar dominio personalizado (.com)
- Configurar Google Analytics
- Optimizar imágenes automáticamente
- Configurar formulario de contacto
- Añadir certificado SSL (automático en Netlify)

#### Contenido
- Crear más publicaciones de blog
- Actualizar información personal en el CMS
- Añadir más servicios si es necesario
- Optimizar SEO con palabras clave específicas

---

## 📞 Soporte

Si tienes problemas durante el despliegue:
1. Revisa los logs de build en Netlify
2. Verifica que el proyecto funcione localmente
3. Consulta la documentación de Netlify Identity
4. Revisa que todas las URLs estén actualizadas

¡Tu sitio web profesional está listo para ayudar a tus pacientes! 🎉