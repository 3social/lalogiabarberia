# La Logia Barbería — lalogiabarberia.com

Landing page de **La Logia Barbería**, barbería clásica en San Joaquín de Flores, Heredia,
Costa Rica. Un solo objetivo: que quien llegue termine agendando en
[WeiBook](https://book.weibook.co/la-logia-barberia).

HTML, CSS y JS planos. Sin build, sin framework, sin dependencias.
Se sube y funciona.

---

## Estructura

```
.
├── index.html            Toda la página + datos estructurados (JSON-LD)
├── 404.html
├── .htaccess             HTTPS, sin www, caché, compresión, cabeceras
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── favicon.ico
└── assets/
    ├── css/logia.css     Sistema visual completo
    ├── js/logia.js       Revelado al desplazar y estado de la barra
    └── img/              Logo (fondo transparente), favicon, og:image
```

## Desplegar en Hostinger

**Opción A — Administrador de archivos (2 minutos)**

1. hPanel → *Sitios web* → `lalogiabarberia.com` → **Administrador de archivos**.
2. Entre a `public_html/` y borre lo que traiga por defecto (`default.php`, etc.).
3. Suba el contenido de este repositorio — **el contenido, no la carpeta**.
   `index.html` tiene que quedar en la raíz de `public_html/`.
4. hPanel → *Seguridad* → **SSL**: active el certificado gratuito.

**Opción B — Git desde hPanel**

hPanel → *Avanzado* → **Git** → conecte este repositorio, rama `main`,
directorio `public_html`. Cada `git push` queda listo con un clic en *Desplegar*.

**Opción C — Automático con GitHub Actions**

Ya viene `.github/workflows/deploy.yml`. En GitHub → *Settings* → *Secrets and
variables* → *Actions*, cree tres secretos con los datos de hPanel → *Archivos* → *Cuentas FTP*:

| Secreto | Valor |
|---|---|
| `FTP_SERVER` | servidor FTP de Hostinger (ej. `ftp.lalogiabarberia.com`) |
| `FTP_USERNAME` | usuario FTP |
| `FTP_PASSWORD` | contraseña FTP |

Desde ahí, cada push a `main` publica solo.

## Qué falta confirmar con el cliente

- **Horario de atención.** En `index.html` hay un comentario marcando el lugar exacto.
  Al llenarlo, agregue también `openingHoursSpecification` en el JSON-LD.
- **Fotos reales** del local, los barberos y trabajos terminados. El diseño está armado
  para recibirlas: entran bien entre *La casa* y *La carta*.
- **Precios**, si se quieren visibles en el sitio y no solo en la agenda.
- **Instagram / TikTok**, si existen, para sumarlos a `.redes` y a `sameAs` del JSON-LD.

## Notas de mantenimiento

- El logo se sirve con fondo transparente (`assets/img/logo-la-logia.png`), derivado del
  original. Sobre fondos claros hay que usar una versión en positivo.
- La reputación (4,9 / 1.067 reseñas) está escrita a mano en dos lugares: el bloque
  `.prueba` y el `aggregateRating` del JSON-LD. Si cambia, actualice ambos.
- El enlace de reserva aparece en 9 lugares del `index.html` (botones, barra móvil y JSON-LD).
  Búsquelo siempre como `book.weibook.co`.

---

Hecho por [FLAMIA](https://flamia.dev).
