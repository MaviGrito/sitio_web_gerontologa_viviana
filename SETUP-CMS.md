# Configuración del CMS (Decap CMS con Netlify Identity)

Este documento explica cómo configurar el sistema de gestión de contenido (CMS) para el sitio web del gerontólogo.

## Requisitos Previos

- Sitio web desplegado en Netlify
- Repositorio de GitHub conectado a Netlify
- Acceso administrativo a la cuenta de Netlify

## Configuración de Netlify Identity

### Paso 1: Habilitar Netlify Identity

1. Ve a tu dashboard de Netlify
2. Selecciona tu sitio web
3. Ve a la pestaña "Identity"
4. Haz clic en "Enable Identity"

### Paso 2: Configurar Git Gateway

1. En la sección Identity, ve a "Settings and usage"
2. Scroll hacia abajo hasta "Git Gateway"
3. Haz clic en "Enable Git Gateway"
4. Esto permitirá que el CMS haga commits directamente al repositorio

### Paso 3: Configurar Registro de Usuarios

1. En Identity Settings, ve a "Registration preferences"
2. Selecciona "Invite only" para mayor seguridad
3. Esto significa que solo usuarios invitados podrán acceder al CMS

### Paso 4: Invitar Usuario Administrador

1. En la pestaña Identity, haz clic en "Invite users"
2. Ingresa el email del administrador del sitio
3. El usuario recibirá un email de invitación
4. Debe seguir el enlace y crear una contraseña

## Acceso al CMS

Una vez configurado Netlify Identity:

1. Ve a `https://tu-sitio.netlify.app/admin`
2. Haz clic en "Login with Netlify Identity"
3. Ingresa tus credenciales
4. ¡Ya puedes gestionar el contenido!

## Funcionalidades del CMS

### Gestión de Publicaciones

- **Crear**: Nuevos artículos de blog
- **Editar**: Contenido existente
- **Borrador**: Guardar sin publicar
- **Previsualizar**: Ver cómo se verá antes de publicar
- **Programar**: Establecer fecha de publicación futura

### Campos Disponibles

- **Título**: Título principal del artículo
- **Descripción**: Meta descripción para SEO
- **Fecha de Publicación**: Cuándo se publicará
- **Imagen Destacada**: Imagen principal del artículo
- **Categoría**: Geriatría, Nutrición, Ejercicio, Salud Mental
- **Etiquetas**: Palabras clave relacionadas
- **Autor**: Nombre del autor
- **Borrador**: Marcar para no publicar
- **Extracto**: Resumen breve para las tarjetas
- **Contenido**: Texto principal en Markdown

### Configuración del Sitio

El CMS también permite editar:
- Información general del sitio
- Datos del doctor
- Información de contacto
- Enlaces de redes sociales

## Flujo de Trabajo Editorial

El CMS está configurado con un flujo de trabajo editorial:

1. **Borrador**: Artículo en proceso de escritura
2. **En Revisión**: Listo para revisión
3. **Listo**: Aprobado para publicación

## Subida de Imágenes

- Las imágenes se suben a la carpeta `/public/uploads/`
- Se recomienda usar imágenes optimizadas para web
- Tamaño recomendado para imágenes destacadas: 1200x630px

## Consejos de Uso

### Para Escribir Contenido

1. **Títulos SEO**: Mantén los títulos bajo 60 caracteres
2. **Descripciones**: Máximo 160 caracteres para meta descripciones
3. **Imágenes**: Siempre incluye una imagen destacada
4. **Categorías**: Usa las categorías predefinidas
5. **Etiquetas**: Añade palabras clave relevantes

### Para Markdown

El editor soporta Markdown. Algunos ejemplos:

```markdown
# Título Principal
## Subtítulo
### Subtítulo Menor

**Texto en negrita**
*Texto en cursiva*

- Lista con viñetas
- Otro elemento

1. Lista numerada
2. Segundo elemento

[Enlace](https://ejemplo.com)

![Imagen](ruta-a-imagen.jpg)
```

## Solución de Problemas

### No puedo acceder al CMS

1. Verifica que Netlify Identity esté habilitado
2. Confirma que Git Gateway esté configurado
3. Asegúrate de haber sido invitado como usuario

### Los cambios no aparecen en el sitio

1. Verifica que el artículo no esté marcado como borrador
2. Espera unos minutos para que Netlify reconstruya el sitio
3. Revisa el estado del build en Netlify

### Error al subir imágenes

1. Verifica que la imagen no sea demasiado grande (máximo 5MB)
2. Usa formatos compatibles: JPG, PNG, GIF, WebP
3. Evita caracteres especiales en nombres de archivo

## Seguridad

- Nunca compartas las credenciales de acceso
- Usa contraseñas seguras
- Revisa regularmente los usuarios con acceso
- Considera habilitar autenticación de dos factores en Netlify

## Soporte

Para problemas técnicos:
1. Revisa la documentación de Netlify Identity
2. Consulta los logs de build en Netlify
3. Contacta al desarrollador del sitio

---

*Este CMS está diseñado para ser fácil de usar. ¡No dudes en experimentar y crear contenido valioso para tus pacientes!*