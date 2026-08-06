# CLAUDE.md — La Logia Barbería

Guía para cualquier instancia de Claude que trabaje en este repositorio.

## El trabajo real

Esta página tiene un solo trabajo: **llevar al visitante a agendar en WeiBook**.
Todo lo demás —el sello, la tipografía, el mapa— existe para que confíe lo suficiente
como para hacer clic. Si un cambio no ayuda a eso, no va.

## Reglas duras

1. **Sin build.** HTML, CSS y JS planos. Nada de npm, bundlers ni frameworks.
   Se sube a `public_html` y funciona. Esa restricción es una decisión, no una carencia.
2. **Sin dependencias en tiempo de ejecución**, salvo Google Fonts. Nada de jQuery,
   Tailwind CDN ni librerías de animación.
3. **Un solo CSS** (`assets/css/logia.css`) con las variables del sistema en `:root`.
   Ningún color literal fuera de ahí.
4. **No inventar datos del negocio.** Horarios, precios, nombres de barberos y reseñas
   se escriben solo si el cliente los confirmó. Si falta un dato, se marca con un
   comentario HTML y se pregunta.

## Sistema visual

Concepto: **carta de logia** — el impreso de una hermandad de finales del XIX cruzado con
la placa esmaltada de una barbería. La página abre en tinta (la calle de noche) y se abre
a hueso (el salón por dentro). Ese cambio de fondo es la estructura, no un adorno.

| Token | Valor | Uso |
|---|---|---|
| `--tinta` | `#0B0B0C` | Fondo del logo, portada, rito, cierre |
| `--hueso` / `--hueso-2` | `#E8E1D3` / `#F3EEE5` | Superficies claras |
| `--rojo` | `#D81E15` | Tomado del logotipo. Solo acción y énfasis |
| `--rojo-hondo` | `#7A0E0A` | Hover y versalitas sobre claro |
| `--laton` | `#B08D4F` | Filetes, cejillas, el sello |

Tipografía: **Bodoni Moda** (display, alto contraste como el logotipo),
**Cinzel** (versalitas y numerales romanos, con mucha moderación),
**Archivo** (texto e interfaz).

Elemento firma: **el sello circular** en la junta entre la portada y el cuerpo.
Es lo único que gira. No agregue más movimiento compitiendo con él.

## Al escribir

Español de Costa Rica, tratamiento de usted, registro cálido y sobrio.
Frases cortas. Verbos concretos. Nada de "soluciones integrales" ni "experiencia única".
El botón dice *Agendar cita* en toda la página: un mismo nombre para una misma acción.

## Piso de calidad

Responsive hasta 320 px · foco visible con teclado · `prefers-reduced-motion` respetado ·
JSON-LD `HairSalon` válido · sin errores en consola.
