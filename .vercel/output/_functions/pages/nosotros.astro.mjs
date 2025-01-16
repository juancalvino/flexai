/* empty css                                     */
import { c as createAstro, a as createComponent, r as renderTemplate, e as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_BGiYoNzL.mjs';
import { $ as $$Container, a as $$Layout } from '../chunks/Layout_0PU9dyHb.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://flexai.com.ar");
const $$Nosotros = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Nosotros;
  Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Nosotros" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="mt-16 text-center"> <h1 class="text-4xl lg:text-5xl font-bold lg:tracking-tight"> FlexAI </h1> <h2 class="text-lg mt-4 text-slate-600">Tu Socio Logístico en Mercado Libre</h2> <img src="../assets/meliIcon.svg" alt="Mercado Libre" class="inline-block h-40 w-40"> </div> <div class="flex flex-col gap-3 mx-auto max-w-4xl "> <p class="text-lg leading-relaxed text-slate-500">
Entendemos que la logística es un componente clave para el éxito de tu negocio, y por eso, nos esforzamos por ser más que un proveedor. Somos tu aliado estratégico, garantizando la cobertura en todas las zonas habilitadas por Mercado Libre, dos recorridos diarios de lunes a sábado y un sistema innovador que te permite gestionar tus envíos con total facilidad.</p> <p class="text-lg leading-relaxed text-slate-500"> En FlexAI, no solo transportamos paquetes; también construimos confianza. Nuestra misión es respaldar tu reputación y cuidar de tus productos como si fueran nuestros. Porque entendemos que cada entrega es una oportunidad para hacer la diferencia.</p> </div> ` })} ` })}`;
}, "C:/Juan/FLEXAI/webFlexAi/astroship/src/pages/nosotros.astro", undefined);

const $$file = "C:/Juan/FLEXAI/webFlexAi/astroship/src/pages/nosotros.astro";
const $$url = "/nosotros";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Nosotros,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
