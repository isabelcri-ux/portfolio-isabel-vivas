const T = {
  es: {
    // Nav
    nav_home: "Inicio",
    nav_about: "Sobre mí",
    nav_portfolio: "Portafolio",
    nav_contact: "Contacto",
    skip_link: "Ir al contenido principal",

    // Hero buttons
    btn_view_portfolio: "Ver portafolio",
    btn_contact: "Contacto",
    available: "Disponible para proyectos",

    // About page
    sec_about: "Sobre mí",
    about_h1: "Diseñadora de producto",
    about_h2: "con mentalidad estratégica",
    about_tools: "Herramientas",
    about_ai: "Inteligencia Artificial",
    about_methods: "Metodologías",

    sec_experience: "Experiencia",
    exp_title: "Trayectoria profesional",

    sec_education: "Educación",
    edu_title: "Formación académica",

    // Portfolio page
    sec_portfolio: "Portafolio",
    portfolio_title: "Proyectos destacados",
    portfolio_sub: "Cada proyecto cuenta una historia: el problema, las decisiones estratégicas y el impacto.",
    filter_all: "Todos",
    featured: "Destacado",
    see_case: "Ver caso",
    see_case_study: "Ver caso de estudio",

    // Case study
    btn_back_portfolio: "← Volver al portafolio",
    btn_back: "← Volver",
    cs_role: "Rol",
    cs_company: "Empresa",
    cs_tools: "Tools",

    sec_context: "Contexto y problema",
    cs_context_q: "¿Qué problema existía?",
    cs_audience: "Audiencia objetivo",

    sec_my_role: "Mi rol y alcance",
    cs_role_q: "¿Qué lideré?",

    sec_process: "Proceso estratégico",
    cs_process_title: "Decisiones clave",

    sec_solution: "La solución",
    cs_solution_title: "Diseño final",

    sec_results: "Resultados e impacto",
    cs_results_q: "¿Qué se logró?",
    cs_learning: "Aprendizaje",

    btn_behance: "Ver en Behance ↗",

    // Process placeholder
    placeholder_process: "IMÁGENES DE PROCESO",
    placeholder_screens: "PANTALLAS FINALES",
    placeholder_process_desc: "Wireframes · Journey maps · Sketches · Screenshots de Figma",
    placeholder_screens_desc: "Mockups · Prototipos · Flujos conectados",

    // Contact
    sec_contact: "Contacto",

    // Lang toggle
    lang_toggle: "EN",
    lang_current: "ES",
  },

  en: {
    // Nav
    nav_home: "Home",
    nav_about: "About",
    nav_portfolio: "Portfolio",
    nav_contact: "Contact",
    skip_link: "Skip to main content",

    // Hero buttons
    btn_view_portfolio: "View portfolio",
    btn_contact: "Contact",
    available: "Available for projects",

    // About page
    sec_about: "About me",
    about_h1: "Product designer",
    about_h2: "with a strategic mindset",
    about_tools: "Tools",
    about_ai: "Artificial Intelligence",
    about_methods: "Methodologies",

    sec_experience: "Experience",
    exp_title: "Professional journey",

    sec_education: "Education",
    edu_title: "Academic background",

    // Portfolio page
    sec_portfolio: "Portfolio",
    portfolio_title: "Featured projects",
    portfolio_sub: "Each project tells a story: the problem, the strategic decisions and the impact.",
    filter_all: "All",
    featured: "Featured",
    see_case: "View case",
    see_case_study: "View case study",

    // Case study
    btn_back_portfolio: "← Back to portfolio",
    btn_back: "← Back",
    cs_role: "Role",
    cs_company: "Company",
    cs_tools: "Tools",

    sec_context: "Context & problem",
    cs_context_q: "What was the problem?",
    cs_audience: "Target audience",

    sec_my_role: "My role & scope",
    cs_role_q: "What did I lead?",

    sec_process: "Strategic process",
    cs_process_title: "Key decisions",

    sec_solution: "The solution",
    cs_solution_title: "Final design",

    sec_results: "Results & impact",
    cs_results_q: "What was achieved?",
    cs_learning: "Learning",

    btn_behance: "View on Behance ↗",

    // Process placeholder
    placeholder_process: "PROCESS IMAGES",
    placeholder_screens: "FINAL SCREENS",
    placeholder_process_desc: "Wireframes · Journey maps · Sketches · Figma screenshots",
    placeholder_screens_desc: "Mockups · Prototypes · Connected flows",

    // Contact
    sec_contact: "Contact",

    // Lang toggle
    lang_toggle: "ES",
    lang_current: "EN",
  },
};

export function useT() {
  // Lazy import to avoid circular deps — consumers must import useLang separately
  return T;
}

export default T;
