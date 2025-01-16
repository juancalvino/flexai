/* empty css                                     */
import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, e as renderComponent, F as Fragment } from '../chunks/astro/server_BGiYoNzL.mjs';
import { $ as $$Container, a as $$Layout, w as whatsappLink } from '../chunks/Layout_0PU9dyHb.mjs';
import { $ as $$Sectionhead } from '../chunks/sectionhead_C-twbBUn.mjs';
import { $ as $$Link, a as $$Icon } from '../chunks/Icon_B75y6upq.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://flexai.com.ar");
const $$Pricing = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Pricing;
  const { plan } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div> <div class="flex flex-col w-full order-first lg:order-none border-2 border-[#D8DEE9] border-opacity-50 py-5 px-6 rounded-md"> <div class="text-center"> <p class="font-medium text-gray-500"> Por dia </p> <p class="text-lg font-medium text-gray-500">${plan.description}</p> <p class="mt-3 text-4xl font-bold text-gray-700 md:text-4xl"> ${plan.category} </p> </div> <ul class="grid mt-8 text-center gap-y-3 justify-center"> ${plan.prices.map((item) => renderTemplate`<li class="flex items-center justify-center gap-3 text-gray-700"> ${renderComponent($$result, "Icon", $$Icon, { "class": "text-secondary w-6 h-6", "name": "bx:bx-package" })} <span>${item["zone"]} -->  $${item["price"]}</span> </li>`)} </ul> <div class="flex mt-8"> ${renderComponent($$result, "Link", $$Link, { "href": plan.button.link || "#", "block": true }, { "default": ($$result2) => renderTemplate`${plan.button.text || "Contactenos"}` })} </div> </div> </div>`;
}, "C:/Juan/FLEXAI/webFlexAi/astroship/src/components/pricing.astro", undefined);

const $$Precios = createComponent(($$result, $$props, $$slots) => {
  const pricing = [
    {
      description: "de 10 hasta 50 paquetes",
      category: "Standar Seller",
      prices: [
        { zone: "CABA", price: 2600 },
        { zone: "GBA1", price: 3200 },
        { zone: "GBA2", price: 4e3 },
        { zone: "GBA3", price: 5500 }
      ],
      button: {
        text: "Contactarme",
        link: whatsappLink
      }
    },
    {
      description: "entre 50 y 100 paquetes",
      category: "Pro Seller",
      prices: [
        { zone: "CABA", price: 2300 },
        { zone: "GBA1", price: 2900 },
        { zone: "GBA2", price: 3700 },
        { zone: "GBA3", price: 5200 }
      ],
      button: {
        text: "Contactarme",
        link: whatsappLink
      }
    },
    {
      description: "mas de 100 paquetes",
      category: "Best Seller",
      prices: [
        { zone: "CABA", price: 2e3 },
        { zone: "GBA1", price: 2600 },
        { zone: "GBA2", price: 3400 },
        { zone: "GBA3", price: 4900 }
      ],
      button: {
        text: "Contactarme",
        link: whatsappLink
      }
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Precios" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Sectionhead", $$Sectionhead, {}, { "desc": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "desc" }, { "default": ($$result5) => renderTemplate`
Tarifas claras y competitivas. Sin costos ocultos.
` })}`, "title": ($$result4) => renderTemplate`${renderComponent($$result4, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result5) => renderTemplate`Precios` })}` })} ${maybeRenderHead()}<div class="grid md:grid-cols-3 gap-5 shadow-lg mx-auto max-w-screen-lg mt-8"> ${pricing.map((item) => renderTemplate`${renderComponent($$result3, "PricingCard", $$Pricing, { "plan": item })}`)} </div> ` })} <div class="bg-primary p-10 md:px-15 md:py-15 mt-10 mx-auto max-w-5xl rounded-lg shadow-lg flex flex-col items-center text-center space-y-6"> <p class="text-gray-700 text-xl md:text-xl leading-relaxed">📦🤝 Si tu comercio está a menos de 5 cuadras de otro, pueden unir sus paquetes para acceder a tarifas más bajas. Por ejemplo, sumando 25 paquetes tuyos con 30 del vecino, califican para precios de +50 envíos diarios. ¡Optimiza costos uniéndote a otros comercios cercanos! 🚀💰</p> </div> ` })}`;
}, "C:/Juan/FLEXAI/webFlexAi/astroship/src/pages/precios.astro", undefined);

const $$file = "C:/Juan/FLEXAI/webFlexAi/astroship/src/pages/precios.astro";
const $$url = "/precios";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Precios,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
