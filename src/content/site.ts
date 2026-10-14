// Texts from "20260923 - Textos de la Landing Page de Walk Forward - Edwin.pdf" and the Figma design.

import type { IconName } from "@/components/ui/icon-paths";

export const links = {
  /** Shared by every WhatsApp button (header, mobile menu, hero, floating). `null` disables them all. */
  whatsapp: "https://wa.me/5491122945551" as string | null,
  sgm: "https://sgm.walkforward.com.ar/",
  arca: "http://qr.afip.gob.ar/?qr=EhMuxVy9TyQXO7CFG9oB1g,,",
  map: "https://www.google.com/maps?q=San+Mart%C3%ADn+536,+C1004AAL+Ciudad+Aut%C3%B3noma+de+Buenos+Aires,+Argentina&output=embed",
};

export const nav = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#marcas", label: "Marcas" },
  { href: "#clientes", label: "Clientes" },
  { href: "#contacto", label: "Contacto" },
] as const;

export const hero = {
  eyebrow: "+10 años en el mercado argentino",
  title: "Su organización requiere talento y calidad de servicio",
  description:
    "Walk Forward SAS es una empresa de informática con más de 10 años en el mercado argentino que comercializa hardware, software y servicios expertos de IT con talento para todo tipo de organizaciones públicas y privadas.",
  whatsappCta: "Consultar en WhatsApp",
  servicesCta: "Ver servicios",
  featuredLabel: "Servicios destacados",
  highlights: [
    "Distribuidor autorizado de +20 marcas oficiales",
    "Presupuestos a medida y precios accesibles",
    "Disponibilidad de horas de servicios expertos de TIC",
  ],
};

export type Category = "hardware" | "software" | "experts";

export type Service = {
  id: string;
  category: Category;
  icon: IconName;
  title: string;
  paragraphs: string[];
};

export const services: Service[] = [
  {
    id: "infraestructura-tic",
    category: "hardware",
    icon: "cpu",
    title: "Diseño y venta de soluciones de infraestructura TIC",
    paragraphs: [
      "Lo asesoramos para analizar la capacidad de cómputo requerida, diseñamos la solución de hardware y software, cotizamos, proyectamos, vendemos y ayudamos a instalarla en su centro de cómputos para que tenga la mejor relación costo-beneficio.",
      "Cotizamos y renovamos el soporte anual de sus activos de hardware para cuidar su inversión y extender su vida útil.",
    ],
  },
  {
    id: "licenciamiento",
    category: "software",
    icon: "key",
    title: "Licenciamiento de software",
    paragraphs: [
      "Provisión de licencias perpetuas y de suscripciones temporales de software Adobe, Dell, DocuSign, Fortinet, GOP, HPE, IBM, Kaspersky, Lenovo, Microsoft, Oracle, Red Hat, SUSE, Thales-Gemalto, Veeam, VMWare, XolidoSign y otras.",
      "Asesoramiento en la adopción de servicios en la nube.",
    ],
  },
  {
    id: "gestion-infraestructura",
    category: "experts",
    icon: "server",
    title: "Gestión remota de infraestructura y centros de cómputos",
    paragraphs: [
      "Administramos en forma remota sus activos informáticos tales como servidores, switches, storages, unidades de backup y routers para mantenerlos actualizados, seguros y disponibles.",
    ],
  },
  {
    id: "migracion-nube",
    category: "experts",
    icon: "uploadCloud",
    title: "Despliegue de equipos y migración a la nube",
    paragraphs: [
      "Lo asistimos en el despliegue de servidores físicos y virtuales a medida de su organización en su centro de cómputos o en la migración a la nube (Microsoft Azure® y otros).",
    ],
  },
  {
    id: "bases-de-datos",
    category: "experts",
    icon: "database",
    title: "Gestión remota de bases de datos SQL Server y Oracle",
    paragraphs: [
      "Brindamos servicio remoto de administración de bases de datos con disponibilidad estándar de 9x5, premium de 24x7 o adaptable a su organización.",
    ],
  },
  {
    id: "servidores",
    category: "experts",
    icon: "terminal",
    title: "Gestión remota de servidores Windows y Linux",
    paragraphs: [
      "Brindamos servicio de instalación, mantenimiento y optimización de servidores Windows y Linux con despliegue de bases de datos, antivirus y clientes VPN.",
      "Gestión de Active Directory, DNS, DHCP, ADFS, ADCS, WSUS, etc.",
    ],
  },
  {
    id: "firma-digital",
    category: "experts",
    icon: "penTool",
    title: "Gestión documental electrónica y firma digital",
    paragraphs: [
      "Implementamos flujos de procesos ágiles con documentos PDF seguros con firma digital por e-token USB y software firmador/verificador y de gestión de flujos a medida de su organización, que le permitirán reducir costos, tiempo de entrega y riesgos de adulteraciones o fraudes.",
    ],
  },
];

export const servicesSection = {
  title: "¿Qué podemos hacer por usted y su organización?",
  filtersLabel: "Filtrar servicios por categoría",
  categories: [
    { id: "all", label: "Todos" },
    { id: "hardware", label: "Hardware" },
    { id: "software", label: "Software" },
    { id: "experts", label: "Servicios expertos TIC" },
  ] as const,
};

export const sgm = {
  eyebrow: "Producto propio",
  title: "Walk Forward® SGM",
  description:
    "Solución completa para la gestión del mantenimiento preventivo y correctivo de activos fijos, móviles e intangibles.",
  benefits: [
    "100% nube: infraestructura, plataforma y software.",
    "Interfaz liviana, fácil de operar y amigable.",
    "Sin inversión en hardware ni en licencias de SO ni de base de datos.",
    "Cotización e implementación a medida de su organización.",
  ],
  cta: "Conocer Walk Forward® SGM",
};

/**
 * A brand or client in the carousels. Without a logo and a site it is shown as plain text
 * (pending information from the client). `dark` marks white logos that need a dark tile.
 * Logos and sites confirmed in "Logos de marcas y clientes.pdf".
 */
export type Entity = {
  name: string;
  logo?: string;
  url?: string;
  dark?: boolean;
};

export const brands: { title: string; rows: Entity[][] } = {
  title: "Distribuidor autorizado de las siguientes marcas oficiales:",
  rows: [
    [
      { name: "Adobe", logo: "/logos/adobe.svg", url: "https://www.adobe.com/" },
      { name: "APC", logo: "/logos/apc.svg", url: "https://www.apc.com/" },
      { name: "Apple", logo: "/logos/apple.svg", url: "https://www.apple.com/" },
      { name: "Aruba", logo: "/logos/aruba.svg", url: "https://www.arubanetworks.com/" },
      { name: "Asus", logo: "/logos/asus.svg", url: "https://www.asus.com/" },
      { name: "Dell", logo: "/logos/dell.svg", url: "https://www.dell.com/" },
      { name: "Docusign", logo: "/logos/docusign.svg", url: "https://www.docusign.com/" },
      { name: "Epson", logo: "/logos/epson.svg", url: "https://epson.com/" },
      { name: "Fortinet", logo: "/logos/fortinet.svg", url: "https://www.fortinet.com/" },
      { name: "GOP", logo: "/logos/gop.png", url: "https://gop.kafesistemas.com/gop" },
      { name: "HP", logo: "/logos/hp.svg", url: "https://www.hp.com/ar-es/home.html" },
      { name: "HPE", logo: "/logos/hpe.svg", url: "https://www.hpe.com/" },
      { name: "Huawei", logo: "/logos/huawei.svg", url: "https://www.huawei.com/" },
      { name: "IBM", logo: "/logos/ibm.svg", url: "https://www.ibm.com/" },
      { name: "Kaspersky", logo: "/logos/kaspersky.svg", url: "https://www.kaspersky.com/" },
      { name: "Lenovo", logo: "/logos/lenovo.svg", url: "https://www.lenovo.com/" },
      { name: "LG", logo: "/logos/lg.svg", url: "https://www.lg.com/" },
    ],
    [
      { name: "Microsoft", logo: "/logos/microsoft.svg", url: "https://www.microsoft.com/" },
      { name: "Microtik", logo: "/logos/mikrotik.svg", url: "https://mikrotik.com/" },
      { name: "MSI", logo: "/logos/msi.svg", url: "https://www.msi.com/" },
      { name: "NSX", logo: "/logos/nsx.png", url: "https://www.nsx.com.ar/", dark: true },
      { name: "Oracle", logo: "/logos/oracle.svg", url: "https://www.oracle.com/" },
      { name: "QNAP", logo: "/logos/qnap.svg", url: "https://www.qnap.com/" },
      { name: "Red Hat", logo: "/logos/redhat.svg", url: "https://www.redhat.com/" },
      { name: "Samsung", logo: "/logos/samsung.svg", url: "https://www.samsung.com/" },
      { name: "SUSE", logo: "/logos/suse.svg", url: "https://www.suse.com/", dark: true },
      { name: "Thales-Gemalto", logo: "/logos/thales.svg", url: "https://www.thalesgroup.com/" },
      { name: "TP-Link", logo: "/logos/tplink.svg", url: "https://www.tp-link.com/" },
      { name: "Ubiquiti", logo: "/logos/ubiquiti.svg", url: "https://www.ui.com/" },
      { name: "Veeam", logo: "/logos/veeam.svg", url: "https://www.veeam.com/" },
      { name: "VMWare", logo: "/logos/vmware.svg", url: "https://www.vmware.com/" },
      { name: "XolidoSign", logo: "/logos/xolidosign.png", url: "https://www.xolido.com/lang/xolidosign/" },
    ],
  ],
};

export const clients: { title: string; description: string; items: Entity[] } = {
  title: "Organizaciones que ya trabajan con nosotros",
  description:
    "Participamos en proyectos e implementaciones y proveemos de productos y servicios a los siguientes clientes:",
  items: [
    { name: "AUSA", logo: "/logos/ausa.svg", url: "https://www.ausa.com.ar/" },
    { name: "Belgrano Cargas y Logística", logo: "/logos/belgrano.png", url: "https://comercial.bcyl.com.ar/", dark: true },
    { name: "Colegio de Farmacéuticos de la Pcia. de Buenos Aires", logo: "/logos/colfarma.png", url: "https://colfarma.org.ar/" },
    { name: "Grupo Dietrich", logo: "/logos/dietrich.webp", url: "https://grupodietrich.com/", dark: true },
    { name: "Grupo Distriland", logo: "/logos/distriland.png", url: "https://www.distriland.com.ar/", dark: true },
    { name: "Grupo Randazzo", logo: "/logos/randazzo.svg", url: "https://www.gruporandazzo.com/", dark: true },
    { name: "Universidad de Morón", logo: "/logos/unimoron.svg", url: "https://www.unimoron.edu.ar/" },
  ],
};

export const contact = {
  title: "Pida su cotización o haga su consulta",
  description:
    "Precios competitivos, entrega rápida y personalizada. Disponibilidad de talento y experiencia para sus necesidades de TIC.",
  whatsappNumber: "(+54-9-11) 2294-5551",
  whatsappNote: "WhatsApp. Consultas y cotizaciones.",
  officeLabel: "Oficina",
  office: "San Martín 536, PB, entre Lavalle y Tucumán, C.A.B.A., C.P.A. C1004AAL, Argentina.",
  officeShort: "San Martín 536, C.A.B.A.",
  form: {
    name: { label: "Nombre", placeholder: "Su nombre", error: "Ingrese su nombre." },
    email: { label: "E-mail", placeholder: "nombre@empresa.com", error: "Ingrese un e-mail válido, por ejemplo nombre@empresa.com." },
    country: { label: "País", placeholder: "Argentina" },
    city: { label: "Ciudad", placeholder: "Buenos Aires" },
    source: {
      label: "¿Cómo nos encontraste?",
      placeholder: "Seleccione una opción",
      options: ["Un amigo me comentó", "Búsqueda en Google", "Redes sociales", "Ya soy cliente", "Otro"],
    },
    sector: { label: "¿Sector privado o sector público?", options: ["Privado", "Público"] },
    message: { label: "Mensaje", placeholder: "Cuéntenos qué necesita cotizar o resolver", error: "Cuéntenos qué necesita cotizar o resolver." },
    privacy:
      "Recopilamos cierta información personal para brindarle una mejor experiencia en línea. Al visitar nuestro sitio usted acepta nuestros términos.",
    accept: "Leí y acepto el aviso de privacidad.",
    submit: "Enviar consulta",
    sending: "Enviando consulta…",
    success: "¡Gracias! Recibimos su consulta y le respondemos a la brevedad.",
    again: "Enviar otra consulta",
  },
};

const year = new Date().getFullYear();

export const footer = {
  tagline: "Walk Forward SAS - Hardware, software y servicios expertos de IT – Argentina",
  arcaLabel: "QR de ARCA de Walk Forward SAS",
  legal: [
    `© 2014-${year} Edwin Mateo Lewitzki Dujmusic. Todos los derechos reservados. Walk Forward SAS es la única licenciataria autorizada por el titular de los derechos del software SGM.`,
    "Walk Forward® SGM y su interfaz de usuario están protegidos por las leyes del software, de derechos de autor y de propiedad intelectual en Argentina y otros países.",
    "Walk Forward® y sus logotipos son marcas registradas en INPI (títulos N° 2952072, 2952073 y 2952074) y protegidas por ley en Argentina y otros países. Otras marcas mencionadas y sus logotipos son propiedad de sus respectivos dueños.",
  ],
};
