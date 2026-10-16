"use strict";

/* ===== Dados ===== */

const DESTINATIONS = [
  {
    id: "japao",
    country: "Japão",
    city: "Tóquio e Kyoto",
    cat: "Cultura",
    desc: "Templos centenários, jardins e a energia de neon de Tóquio.",
    img: "japao.jpg",
    alt: "Rua de Tóquio iluminada à noite",
  },
  {
    id: "franca",
    country: "França",
    city: "Paris",
    cat: "Cidades",
    desc: "Museus, cafés e a Torre Eiffel nos ritmos de uma cidade-ícone.",
    img: "franca.jpg",
    alt: "Torre Eiffel ao entardecer",
  },
  {
    id: "italia",
    country: "Itália",
    city: "Roma e Veneza",
    cat: "Cultura",
    desc: "Ruínas imperiais, canais e uma gastronomia que merece tempo.",
    img: "italia.jpg",
    alt: "Coliseu em Roma",
  },
  {
    id: "suica",
    country: "Suíça",
    city: "Alpes suíços",
    cat: "Natureza",
    desc: "Trilhas, lagos cristalinos e trens panorâmicos entre montanhas.",
    img: "suica.jpg",
    alt: "Vilarejo nos Alpes suíços",
  },
  {
    id: "maldivas",
    country: "Maldivas",
    city: "Ilhas paradisíacas",
    cat: "Praias",
    desc: "Águas translúcidas, bangalôs sobre o mar e descanso total.",
    img: "maldivas.jpg",
    alt: "Bangalôs sobre águas turquesa nas Maldivas",
  },
  {
    id: "eua",
    country: "Estados Unidos",
    city: "Nova York",
    cat: "Cidades",
    desc: "Arranha-céus, musicais, compras e bairros para todos os gostos.",
    img: "eua.jpg",
    alt: "Skyline de Nova York",
  },
];

const PACKAGES = [
  {
    id: "p1",
    dest: "Japão",
    days: "10 dias",
    price: "R$ 18.900",
    inc: [
      "Tóquio e Kyoto",
      "Visita guiada a templos",
      "Aula de culinária japonesa",
    ],
    img: DESTINATIONS[0].img,
    alt: DESTINATIONS[0].alt,
    desc: "Roteiro cultural que combina a metrópole moderna e a tradição de Kyoto.",
  },
  {
    id: "p2",
    dest: "Maldivas",
    days: "7 dias",
    price: "R$ 24.500",
    inc: ["Resort à beira-mar", "Passeio de snorkel", "Jantar na praia"],
    img: DESTINATIONS[4].img,
    alt: DESTINATIONS[4].alt,
    desc: "Sete dias de descanso, mar calmo e atividades leves.",
  },
  {
    id: "p3",
    dest: "Suíça",
    days: "8 dias",
    price: "R$ 21.300",
    inc: ["Trens panorâmicos", "Trilhas guiadas", "Hospedagem nos Alpes"],
    img: DESTINATIONS[3].img,
    alt: DESTINATIONS[3].alt,
    desc: "Montanhas, lagos e vilarejos em um roteiro ao ar livre.",
  },
];

const TESTIMONIALS = [
  {
    q: "Depoimento: o roteiro respeitou meu ritmo e deixou espaço para improvisar.",
    who: "Robson Oliveira",
  },
  {
    q: "Depoimento: gostei de ter alguém para conversar sobre cada decisão do planejamento.",
    who: "Carlos Roberto",
  },
  {
    q: "Depoimento: saí da conversa com uma ideia clara do que fazer em cada dia.",
    who: "Roberto Oliver",
  },
];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== Imagens com erro ===== */
document.addEventListener(
  "error",
  (e) => {
    if (e.target.tagName === "IMG") {
      e.target.classList.add("img-fail");
      e.target.alt = "Imagem indisponível";
    }
  },
  true,
);

/* ===== Cabeçalho e menu ===== */
const header = $("#header"),
  nav = $("#nav"),
  burger = $("#burger");
const onScroll = () => header.classList.toggle("scrolled", scrollY > 40);
addEventListener("scroll", onScroll, { passive: true });
onScroll();
const setMenu = (open) => {
  nav.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
};
burger.addEventListener("click", () =>
  setMenu(!nav.classList.contains("open")),
);
addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

/* ===== Navegação suave ===== */
const goTo = (id) =>
  $(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
$$("[data-nav]").forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    setMenu(false);
    goTo(a.getAttribute("href"));
  }),
);

/* ===== Destinos e filtros ===== */
const grid = $("#destGrid"),
  empty = $("#destEmpty");
let activeFilter = "Todos";

function renderDestinations(list) {
  grid.innerHTML = list
    .map(
      (d, i) => `
    <article class="card" style="animation-delay:${i * 60}ms">
      <div class="card-img"><img src="${d.img}" alt="${d.alt}" loading="lazy"></div>
      <div class="card-body">
        <span class="badge">${d.cat}</span>
        <h3>${d.country} — ${d.city}</h3>
        <p>${d.desc}</p>
        <button class="btn btn-accent btn-sm" data-plan="${d.id}">Descobrir destino</button>
      </div>
    </article>`,
    )
    .join("");
  empty.hidden = list.length > 0;
}

function applyFilter(cat, onlyDest = null) {
  activeFilter = cat;
  $$(".chip").forEach((c) =>
    c.setAttribute("aria-pressed", c.dataset.f === cat),
  );
  let list =
    cat === "Todos" ? DESTINATIONS : DESTINATIONS.filter((d) => d.cat === cat);
  if (onlyDest) list = list.filter((d) => d.id === onlyDest);
  renderDestinations(list);
}

$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest(".chip");
  if (b) applyFilter(b.dataset.f);
});
grid.addEventListener("click", (e) => {
  const b = e.target.closest("[data-plan]");
  if (!b) return;
  $("#fDest").value = b.dataset.plan;
  goTo("#planejar");
});
$$("[data-exp]").forEach((b) =>
  b.addEventListener("click", () => {
    applyFilter(b.dataset.exp);
    goTo("#destinos");
  }),
);

/* ===== Selects de destino ===== */
const destOptions = (first) =>
  `<option value="">${first}</option>` +
  DESTINATIONS.map(
    (d) => `<option value="${d.id}">${d.country} — ${d.city}</option>`,
  ).join("");
$("#sDest").innerHTML = destOptions("Selecione").replace(
  "</option>",
  '</option><option value="todos">Qualquer destino</option>',
);
$("#fDest").innerHTML = destOptions("Selecione");

/* ===== Validação ===== */
function setError(input, msg) {
  const out = $("#" + input.id + "Err");
  input.classList.toggle("invalid", !!msg);
  input.setAttribute("aria-invalid", !!msg);
  if (out) out.textContent = msg || "";
  return !msg;
}
const required = (input, msg) => setError(input, input.value.trim() ? "" : msg);

/* ===== Busca ===== */
const today = new Date().toISOString().slice(0, 10);
$("#sIn").min = $("#sOut").min = today;
$("#searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const dest = $("#sDest"),
    inD = $("#sIn"),
    outD = $("#sOut"),
    trav = $("#sTrav"),
    msg = $("#searchMsg");
  let ok = required(dest, "Escolha um destino.");
  ok = required(inD, "Informe a data de ida.") && ok;
  let outOk = required(outD, "Informe a data de volta.");
  if (outOk && inD.value && outD.value < inD.value)
    outOk = setError(outD, "A volta não pode ser antes da ida.");
  ok = outOk && ok;
  const n = Number(trav.value);
  ok =
    setError(trav, n >= 1 && n <= 20 ? "" : "Use de 1 a 20 viajantes.") && ok;
  msg.classList.toggle("error", !ok);
  if (!ok) {
    msg.textContent = "Revise os campos destacados.";
    return;
  }

  const type = $("#sType").value;
  let list = DESTINATIONS;
  if (dest.value !== "todos") list = list.filter((d) => d.id === dest.value);
  if (type) list = list.filter((d) => d.cat === type);
  activeFilter = "Todos";
  $$(".chip").forEach((c) =>
    c.setAttribute("aria-pressed", c.dataset.f === (type || "Todos")),
  );
  renderDestinations(list);
  msg.textContent = list.length
    ? `${list.length} destino(s) combinam com sua busca.`
    : "Nenhum destino combina com essa escolha. Tente outro tipo de experiência.";
  goTo("#destinos");
});

/* ===== Pacotes e modal ===== */
$("#offerGrid").innerHTML = PACKAGES.map(
  (p) => `
  <article class="card reveal">
    <div class="card-img"><img src="${p.img}" alt="${p.alt}" loading="lazy"></div>
    <div class="card-body">
      <span class="badge">${p.days}</span>
      <h3>${p.dest}</h3>
      <ul>${p.inc.map((i) => `<li>${i}</li>`).join("")}</ul>
      <p class="price">${p.price} <small>por pessoa</small></p>
      <button class="btn btn-accent btn-sm" data-pkg="${p.id}">Ver detalhes</button>
    </div>
  </article>`,
).join("");

const modal = $("#modal");
let lastTrigger = null;
$("#offerGrid").addEventListener("click", (e) => {
  const b = e.target.closest("[data-pkg]");
  if (!b) return;
  const p = PACKAGES.find((x) => x.id === b.dataset.pkg);
  lastTrigger = b;
  $("#mImg").src = p.img;
  $("#mImg").alt = p.alt;
  $("#mTitle").textContent = `${p.dest} — ${p.days}`;
  $("#mMeta").textContent = `${p.price} por pessoa`;
  $("#mDesc").textContent = p.desc;
  $("#mList").innerHTML = p.inc.map((i) => `<li>${i}</li>`).join("");
  modal.showModal();
});
$("#mClose").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close();
}); // clique fora
modal.addEventListener("close", () => lastTrigger?.focus()); // Esc fecha nativamente
$("#mCta").addEventListener("click", (e) => {
  e.preventDefault();
  modal.close();
  goTo("#planejar");
});

/* ===== Carrossel de depoimentos ===== */
let t = 0;
const tQ = $("#tQuote"),
  tW = $("#tWho"),
  tC = $("#tCount");
function showTestimonial(i) {
  t = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
  tQ.classList.add("out");
  setTimeout(
    () => {
      tQ.textContent = TESTIMONIALS[t].q;
      tW.textContent = TESTIMONIALS[t].who;
      tC.textContent = `${t + 1} de ${TESTIMONIALS.length}`;
      tQ.classList.remove("out");
    },
    reduced ? 0 : 250,
  );
}
$("#tPrev").addEventListener("click", () => showTestimonial(t - 1));
$("#tNext").addEventListener("click", () => showTestimonial(t + 1));
showTestimonial(0);

/* ===== Formulário de planejamento  ===== */
$("#planForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = (id) => $("#" + id),
    msg = $("#formMsg");
  const mail = f("fMail");
  let ok = required(f("fNome"), "Informe seu nome.");
  const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim());
  ok = setError(mail, mailOk ? "" : "Digite um e-mail válido.") && ok;
  ok = required(f("fDest"), "Escolha um destino.") && ok;
  ok = required(f("fPer"), "Informe um período aproximado.") && ok;
  const n = Number(f("fTrav").value);
  ok =
    setError(f("fTrav"), n >= 1 && n <= 10 ? "" : "Use de 1 a 10 viajantes.") &&
    ok;
  ok = required(f("fTipo"), "Escolha o tipo de viagem.") && ok;
  msg.classList.toggle("error", !ok);
  if (!ok) {
    msg.textContent = "Corrija os campos destacados e tente novamente.";
    $(".invalid")?.focus();
    return;
  }
  msg.textContent =
    "Pedido validado! Modo de demonstração: nenhum dado foi enviado ou armazenado.";
  e.target.reset();
});

/* ===== Animações de entrada ===== */
const io = new IntersectionObserver(
  (es) =>
    es.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    }),
  { threshold: 0.12 },
);
$$(".reveal").forEach((el) => io.observe(el));

/* ===== Inicialização ===== */
renderDestinations(DESTINATIONS);
$("#year").textContent = new Date().getFullYear();
