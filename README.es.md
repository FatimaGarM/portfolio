# Portafolio · Fátima García Muriana

*[Read in English](README.md)*

Mi web personal como desarrolladora web junior: quién soy, qué he hecho, dónde he trabajado y cómo contactarme.

<!-- **Web:** añade la URL cuando esté publicada -->
<!-- ![Portafolio](docs/captura.png) -->

## Qué tiene

- Proyectos, experiencia, formación, tecnologías y contacto, todo leído de un único archivo de contenido (`src/data/content.json`)
- Mi CV para descargar en PDF
- Un pequeño **panel de administración** en `/admin` para cambiar cualquier texto, reordenar elementos y subir imágenes sin tocar código

## Diseño

Tranquilo a propósito: fondos marfil y rosa empolvado, detalles en oro rosa y dorado claro, Fraunces para los títulos e Inter para el texto. Todos los colores de texto cumplen el contraste WCAG AA.

El movimiento es suave y opcional:
- Las secciones aparecen con un fundido y suben 16 px al hacer scroll, una sola vez, con un pequeño desfase entre tarjetas
- Las tarjetas se elevan un poco con una sombra rosada al pasar el ratón (solo con ratón, nunca en pantallas táctiles)
- Bajo cada título se dibuja una línea dorada fina

Con `prefers-reduced-motion` no se mueve nada: el contenido aparece sin más, las líneas ya están dibujadas y los círculos del fondo se quedan quietos. Está hecho con Framer Motion (`MotionConfig reducedMotion="user"`) y media queries de CSS.

## El panel de administración

No quería editar el JSON a mano cada vez que terminara un proyecto, así que en vez de meter un CMS hice un panel propio sencillo:

- **Se entra con Google, y solo con mi cuenta.** No hay contraseña: el servidor hace el flujo OAuth 2.0 con código de autorización, PKCE y comprobación de `state`, y solo acepta la entrada si Google confirma el email verificado que está en `ADMIN_EMAIL`
- La sesión va en una cookie `httpOnly` firmada con HMAC-SHA256 y caduca a las 8 horas
- **Cada vez que guardas se valida todo con Zod**, para que una errata no rompa la web. Los errores salen campo por campo
- **Cada guardado conserva la versión anterior** (las 30 últimas), y se puede volver a cualquiera
- Subida de imágenes comprobando extensión, tipo MIME y tamaño
- La página pública se actualiza después de cada guardado (`revalidatePath`)

## Tecnologías

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Zod · Phosphor Icons · Fontsource (Fraunces, Inter)

## Cómo arrancarlo en local

```bash
npm install
cp .env.example .env.local   # y rellena los valores
npm run dev
```

Para el panel, `.env.local` necesita el cliente OAuth de Google (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`), la cuenta que puede entrar (`ADMIN_EMAIL`), `APP_URL` y `SESSION_SECRET` (mínimo 32 caracteres aleatorios). La URL de retorno que hay que registrar en Google Cloud es `APP_URL/api/admin/login/callback`. La web pública funciona sin ninguna de ellas.

## Sobre el despliegue

El panel guarda en el disco: funciona en local y en un servidor Node normal. En un hosting serverless (Vercel, Netlify) no se pueden cambiar archivos en producción, así que ahí la idea es editar en local y volver a desplegar, o más adelante pasar el contenido a una base de datos.

## Contacto

[GitHub](https://github.com/FatimaGarM) · [LinkedIn](https://www.linkedin.com/in/fatimagarciamuriana/)
