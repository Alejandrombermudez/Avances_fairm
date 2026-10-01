# Estado del proyecto — Migración web ARM

Página de seguimiento que el equipo de la Alianza por la Minería Responsable
puede consultar en cualquier momento para ver en qué va el proyecto.

Next.js 16 · Tailwind v4 · desplegada en Vercel.

## Cómo actualizar el avance

**Se edita un solo archivo: [`src/data/progreso.ts`](src/data/progreso.ts).**

1. Cambia el `estado` de las tareas que avanzaron
2. Actualiza `meta.actualizado` con la fecha de hoy
3. Haz push — Vercel redespliega solo

Los cuatro estados posibles:

| Estado | Significa |
|---|---|
| `hecho` | Terminado. Aparece tachado |
| `curso` | Trabajándose ahora |
| `espera` | Detenido esperando algo del cliente |
| `pendiente` | Aún no empieza |

El porcentaje de avance, el contador de tareas y la fase actual **se calculan
solos** a partir de esos estados. No hay que tocarlos.

Los días que lleva pendiente cada insumo también se calculan solos, a partir de
la fecha `desde` de cada entrada en `esperando`. La página se regenera cada hora
en Vercel, así que ese contador se mantiene al día sin hacer push.

## Los entregables

Cada fase declara un campo `entregable`: lo que deja al terminar, en una frase.

Las tareas que ya produjeron un documento llevan además un campo `doc`, que
apunta a una clave de [`src/data/documentos.ts`](src/data/documentos.ts). Eso
enciende la flecha que abre el documento: al pulsarla el anillo y el calendario
se pliegan y el documento ocupa el espacio.

```ts
{ t: "Modelo de contenido", estado: "curso", doc: "modelo-de-contenido" }
```

**El `doc` se pone solo cuando el documento existe y ya se puede leer.** Una
flecha que abre un documento a medias es peor que no tener flecha.

Un documento se parte en `hojas`, y la hoja es la unidad: si no cabe en una
pantalla sin desplazarse mucho, se parte en dos. Cada hoja es una lista de
bloques (`texto`, `par`, `ficha`, `junta`, `cifras`, `tabla`, `barras`, `nota`,
`puntos`). El asterisco marca negrita: `"se arman *solas*"`.

Los documentos se escriben para quien no conoce los nombres técnicos: dicen
*esto pasa a ser esto*, con números medidos, no con adjetivos.

## Qué NO va en esta página

Es una página pública y la ve el cliente. Antes de agregar algo, comprobar que
no sea ninguna de estas cosas:

- **Versiones de software, direcciones IP o paneles de administración** del
  cliente. Publicar que un sistema está desactualizado es dar información a
  quien quiera atacarlo
- **Credenciales o accesos**, en cualquier forma
- **Asuntos contractuales**: honorarios, plazos en disputa, cláusulas
- **Nada que suene a reproche.** Los insumos pendientes se presentan como
  "el equipo los está gestionando", nunca como un incumplimiento

La sección de insumos en espera existe para dar transparencia sobre por qué
algo no avanza, no para señalar a nadie. El tono importa: esta página la puede
abrir cualquier persona de la organización, incluida la dirección.

## Desarrollo

```bash
npm install
npm run dev
```

En `http://localhost:3000`.

```bash
npm run build    # verifica tipos y genera el sitio
```

## Estructura

```
src/
├── app/
│   ├── layout.tsx      tipografías y metadatos
│   ├── page.tsx        la página; lee de progreso.ts
│   └── globals.css     tokens de color y el plegado del cronograma
├── components/
│   ├── Cronograma.tsx  anillo, calendario y las flechas de entregable
│   └── Documento.tsx   visor por hojas; dibuja cada tipo de bloque
└── data/
    ├── progreso.ts     ← lo que se edita para actualizar el avance
    └── documentos.ts   los entregables que ya se pueden leer
```

La página no se indexa en buscadores (`robots: noindex`). Es para compartir por
enlace, no para que aparezca en Google.
