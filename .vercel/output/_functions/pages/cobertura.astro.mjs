/* empty css                                     */
import { a as createComponent, r as renderTemplate, e as renderComponent, F as Fragment, m as maybeRenderHead } from '../chunks/astro/server_BGiYoNzL.mjs';
import { a as $$Layout } from '../chunks/Layout_0PU9dyHb.mjs';
import { $ as $$Picture } from '../chunks/_astro_assets_Puu8IDyZ.mjs';
import { $ as $$Sectionhead } from '../chunks/sectionhead_C-twbBUn.mjs';
/* empty css                                     */
export { renderers } from '../renderers.mjs';

const mapaAmba = new Proxy({"src":"/_astro/mapaAmba.CVt_rXn1.png","width":1320,"height":1500,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Juan/FLEXAI/webFlexAi/astroship/src/assets/mapaAmba.png";
							}
							
							return target[name];
						}
					});

const $$Cobertura = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Cobertura", "data-astro-cid-eqwqe2d2": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Sectionhead", $$Sectionhead, { "data-astro-cid-eqwqe2d2": true }, { "desc": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "desc" })}`, "title": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result4) => renderTemplate`Cobertura` })}` })} ${maybeRenderHead()}<div class="flex justify-center px-20 lg:flex-row flex-col" data-astro-cid-eqwqe2d2> <div class="content_map" data-astro-cid-eqwqe2d2> <div class="map" data-astro-cid-eqwqe2d2> ${renderComponent($$result2, "Picture", $$Picture, { "src": mapaAmba, "alt": "Mapa AMBA", "widths": [200, 400, 600], "sizes": "(max-width: 600px) 100vw, 620px", "loading": "eager", "format": "avif", "data-astro-cid-eqwqe2d2": true })} </div> </div> <div class="bg-secondary p-8 md:px-20 md:py-10 mt-10 mx-auto max-w-5xl shadow-lg rounded-lg flex flex-col items-center text-center" data-astro-cid-eqwqe2d2> <h2 class="text-white text-4xl md:text-6xl tracking-tight" data-astro-cid-eqwqe2d2> Zonas Cubiertas </h2> <div data-astro-cid-eqwqe2d2><h3 class="text-white font-bold mt-5 text-lg md:text-2xl" data-astro-cid-eqwqe2d2>📍 CABA </h3> <p class="text-white text-lg md:text-xl" data-astro-cid-eqwqe2d2> Todas las comunas </p> </div> <div data-astro-cid-eqwqe2d2><h3 class="text-white font-bold mt-5 text-lg md:text-2xl" data-astro-cid-eqwqe2d2>📍 GBA 1 </h3> <p class="text-white text-lg md:text-xl" data-astro-cid-eqwqe2d2> Vicente López, San Isidro, San Fernando, San Martín, Tres de Febrero,
        Morón, Hurlingham, Ituzaingó, Matanza Norte, Lomas de Zamora, Lanús, Avellaneda. </p> </div> <div data-astro-cid-eqwqe2d2><h3 class="text-white font-bold mt-5 text-lg md:text-2xl" data-astro-cid-eqwqe2d2>📍 GBA 2 </h3> <p class="text-white text-lg md:text-xl" data-astro-cid-eqwqe2d2> Tigre, Malvinas Argentinas, José C. Paz, San Miguel, Moreno, Merlo,
        Matanza Sur, Ezeiza, Esteban Echeverría, Almirante Brown, Quilmes, Florencio Varela, Berazategui. </p> </div> <div data-astro-cid-eqwqe2d2><h3 class="text-white font-bold mt-5 text-lg md:text-2xl" data-astro-cid-eqwqe2d2>📍 GBA 3 </h3> <p class="text-white text-lg md:text-xl" data-astro-cid-eqwqe2d2>Berisso, Del Viso, Derqui, Ensenada, Escobar, General Rodríguez,
        Guernica, Cañuelas, Ingeniero Maschwitz, La Plata Centro, La Plata Norte, La Plata Oeste, Luján, Marcos Paz,
        Nordelta, Pilar, San Vicente, Villa Rosa, Garín. </p> </div> </div> </div> ` })} `;
}, "C:/Juan/FLEXAI/webFlexAi/astroship/src/pages/cobertura.astro", undefined);

const $$file = "C:/Juan/FLEXAI/webFlexAi/astroship/src/pages/cobertura.astro";
const $$url = "/cobertura";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Cobertura,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
