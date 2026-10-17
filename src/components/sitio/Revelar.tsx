"use client";

/**
 * Hace aparecer suave lo que lleva `data-revelar` cuando llega a la vista.
 *
 * Por defecto todo está visible. Solo si el navegador puede observar lo que
 * entra en pantalla, y quien mira no pidió menos movimiento, se pone la clase
 * `revelar` en la página y lo marcado empieza escondido; sin JavaScript, o si
 * algo falla, no queda nada oculto. Vigila también lo que aparece después —al
 * pasar de una página a otra sin recargar—, que si no se quedaría invisible.
 *
 * Y una salvaguarda: un navegador normal avisa enseguida de cada cosa que se
 * vigila, esté o no a la vista. Si en segundo y medio no avisó de nada —una
 * ventana que no se pinta, un capturador de miniaturas—, se quita la clase y
 * se ve todo. Pasó al probarlo con el navegador escondido: la página quedaba
 * en blanco.
 */

import { useEffect } from "react";

export default function Revelar() {
  useEffect(() => {
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const raiz = document.documentElement;
    let avisa = false;
    const vigia = new IntersectionObserver(
      (entradas) => {
        avisa = true;
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add("visto");
            vigia.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 },
    );
    const vigilar = (desde: ParentNode) =>
      desde.querySelectorAll("[data-revelar]:not(.visto)").forEach((el) => vigia.observe(el));

    vigilar(document);
    raiz.classList.add("revelar");
    const salvaguarda = window.setTimeout(() => {
      if (!avisa) raiz.classList.remove("revelar");
    }, 1500);

    const cambios = new MutationObserver((m) => {
      for (const r of m) {
        r.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches("[data-revelar]:not(.visto)")) vigia.observe(n);
          vigilar(n);
        });
      }
    });
    cambios.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(salvaguarda);
      cambios.disconnect();
      vigia.disconnect();
      raiz.classList.remove("revelar");
    };
  }, []);

  return null;
}
