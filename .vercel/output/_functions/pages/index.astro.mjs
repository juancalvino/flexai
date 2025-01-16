/* empty css                                     */
import { a as createComponent, r as renderTemplate, m as maybeRenderHead, e as renderComponent } from '../chunks/astro/server_BGiYoNzL.mjs';
import { w as whatsappLink, $ as $$Container, a as $$Layout } from '../chunks/Layout_0PU9dyHb.mjs';
import { $ as $$Link, a as $$Icon } from '../chunks/Icon_B75y6upq.mjs';
import { $ as $$Picture } from '../chunks/_astro_assets_Puu8IDyZ.mjs';
export { renderers } from '../renderers.mjs';

const $$Cta = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="bg-secondary p-8 md:px-20 md:py-20 mt-20 mx-auto max-w-5xl rounded-lg flex flex-col items-center text-center"> <h2 class="text-white text-4xl md:text-6xl tracking-tight">
Simplifica tu logística.
</h2> <p class="text-slate-400 mt-4 text-lg md:text-xl">
Gestiona tus envíos de forma rápida y segura con nuestra plataforma integrada. Cubrimos todas las regiones de CABA y GBA, asegurando entregas a tiempo.
</p> <div class="flex mt-5"> ${renderComponent($$result, "Link", $$Link, { "href": "/precios", "style": "inverted" }, { "default": ($$result2) => renderTemplate`Ver precios` })} </div> </div>`;
}, "C:/Juan/FLEXAI/webFlexAi/astroship/src/components/cta.astro", undefined);

const $$Features = createComponent(($$result, $$props, $$slots) => {
  const diferenciales = [
    {
      title: "Cobertura total en CABA y GBA",
      description: "Llegamos a todas las zonas, incluyendo las nuevas localidades habilitadas por Mercado Libre.",
      icon: "bx:bx-map"
    },
    {
      title: "Entregas r\xE1pidas y eficientes",
      description: "Dos recorridos diarios, de lunes a s\xE1bado, para que tus productos lleguen a tiempo.",
      icon: "bx:bxs-truck"
    },
    {
      title: "Flexibilidad y control",
      description: "Sistema integrado 'lighdata' para gestionar tus env\xEDos y acceder a informaci\xF3n detallada.",
      icon: "bx:bxs-data"
    },
    {
      title: "M\xE1xima seguridad",
      description: "Garantizamos el 100% de las entregas, protegiendo tu reputaci\xF3n y tu mercader\xEDa.",
      icon: "bx:bxs-shield"
    },
    {
      title: "Atenci\xF3n personalizada",
      description: "Nuestro equipo est\xE1 siempre disponible para resolver tus dudas y brindarte el mejor servicio.",
      icon: "bx:bxs-user-voice"
    },
    {
      title: "Reprogramaciones sin preocupaciones",
      description: "Gestionamos las reprogramaciones con los compradores, asegurando la entrega en tiempo y forma.",
      icon: "bx:bxs-calendar"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<div class="mt-16 md:mt-0"> <h2 class="text-4xl lg:text-5xl font-bold lg:tracking-tight">
Todo lo que necesitas para gestionar tus envíos
</h2> <p class="text-lg mt-4 text-slate-600">
Con FLEXAI, tienes todo lo que necesitas. Combinamos las mejores prácticas logísticas con nuestra tecnología innovadora para simplificar y optimizar tus entregas.
</p> </div> <div class="grid sm:grid-cols-2 md:grid-cols-3 mt-16 gap-16"> ${diferenciales.map((item) => renderTemplate`<div class="flex gap-4 items-start"> <div class="mt-1 bg-secondary rounded-full  p-2 w-8 h-8 shrink-0"> ${renderComponent($$result, "Icon", $$Icon, { "class": "text-white", "name": item.icon })} </div> <div> <h3 class="font-semibold text-lg">${item.title}</h3>${" "} <p class="text-slate-500 mt-2 leading-relaxed">${item.description}</p> </div> </div>`)} </div>`;
}, "C:/Juan/FLEXAI/webFlexAi/astroship/src/components/features.astro", undefined);

const motoPedido = new Proxy({"src":"/_astro/motoPedido.O5oXCkSM.svg","width":750,"height":500,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Juan/FLEXAI/webFlexAi/astroship/src/assets/motoPedido.svg";
							}
							
							return target[name];
						}
					});

const $$Intro = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<main class="grid lg:grid-cols-2 place-items-center pt-16 pb-8 md:pt-12 md:pb-24"> <div class="py-6 md:order-1 hidden md:block"> ${renderComponent($$result, "Picture", $$Picture, { "src": motoPedido, "alt": "GPS y moto de FLEXAI", "widths": [200, 400, 600], "sizes": "(max-width: 800px) 100vw, 620px", "loading": "eager", "format": "avif" })} </div> <div> <h1 class="text-5xl lg:text-6xl xl:text-7xl font-bold lg:tracking-tight xl:tracking-tighter">
La forma flex de realizar envios inteligentes
</h1> <p class="text-lg mt-4 text-slate-600 max-w-xl">
¡Impulsa tus ventas con envíos Flex sin complicaciones!🚀 <br>
Nos encargamos de tu logística de forma rápida y eficiente,
      para que te concentres en lo que realmente importa: hacer crecer tu negocio.📈
      Olvídate de las demoras y la complejidad, ¡nosotros te simplificamos el proceso!
</p> <div class="mt-6 flex flex-col sm:flex-row gap-3"> ${renderComponent($$result, "Link", $$Link, { "href": whatsappLink, "target": "_self", "class": "flex gap-1 items-center justify-center", "rel": "noopener" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Icon", $$Icon, { "class": "text-white w-5 h-5", "name": "bx:bxs-rocket" })}
Comenzar con FLEXAI
` })} ${renderComponent($$result, "Link", $$Link, { "size": "lg", "style": "outline", "rel": "noopener", "href": "/precios", "class": "flex gap-1 items-center justify-center", "target": "_self" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Icon", $$Icon, { "class": "text-black w-4 h-4", "name": "bx:bx-bar-chart-alt-2" })}
Ver precios
` })} </div> </div> </main>`;
}, "C:/Juan/FLEXAI/webFlexAi/astroship/src/components/intro.astro", undefined);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Intro", $$Intro, {})} ${renderComponent($$result3, "Features", $$Features, {})} ${renderComponent($$result3, "Cta", $$Cta, {})} ` })} ` })}`;
}, "C:/Juan/FLEXAI/webFlexAi/astroship/src/pages/index.astro", undefined);

const $$file = "C:/Juan/FLEXAI/webFlexAi/astroship/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
