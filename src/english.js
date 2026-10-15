// English copy is maintained separately from the original Chinese project evidence.
export const englishProfile = {
  introduction: 'Connecting research, service design and visual communication to turn real needs into thoughtful experiences.',
  positioning: 'Understand the context. Make the experience clearer.',
  skills: ['User research', 'Experience design', 'Service design', 'Product design', 'Content strategy', 'Collaboration'],
};

export const categories = {
  '用户体验': 'User experience', '服务设计': 'Service design', '产品设计': 'Product design',
  '数字内容': 'Digital content', '展览策划': 'Exhibition', '设计研究': 'Design research',
};

export const sectionTitles = ['Background', 'Challenge & goals', 'My role', 'Research & analysis', 'Design process', 'Solution', 'Outcomes', 'Reflection'];
export const sectionHints = [
  'Add the context, audience and real problem behind this project.',
  'Describe the challenge, design goals and criteria for success.',
  'Clarify your responsibilities, project stages and team contributions.',
  'Add the methods, observations and evidence informing design decisions.',
  'Show the decisions connecting insights, concepts and iterations.',
  'Explain how the solution responds to the problem and supports the experience.',
  'Add actual work, feedback or results. Label unvalidated effects clearly.',
  'Reflect on value, limitations, learning and next steps.',
];

export const englishProjects = {
  'horticulture-experience': {
    title: 'From garden products to everyday possibilities',
    client: 'Yushun Horticulture / Jianji Balcony Garden',
    summary: 'Connecting content research, visual communication and customer conversations, then bringing feedback into the next iteration.',
    status: 'Practice / in progress', role: 'Content operations, visual production & customer communication',
    tags: ['Content strategy', 'User needs', 'Service touchpoints'],
    sections: {
      context: 'Built content operations for the Jianji Balcony Garden account from the ground up, while handling customer enquiries, purchase-intent conversations and designer handovers.',
      challenge: 'Turn garden products into searchable, understandable everyday scenarios, and connect content interest with subsequent customer conversations.',
      role: 'Account and keyword research; visual production and review using Figma and AI tools; customer follow-up via WeChat; purchase-intent clarification and designer handover.',
      research: 'Account comparisons, keyword research, comments, private messages and customer conversations helped identify recurring questions. The scope of formal user research is still to be documented.',
      process: 'Research → visual production and publishing → feedback → customer conversations → synthesis → the next content cycle. AI supported information processing and image generation; selection, judgement and communication remained human-led.',
      solution: 'Organise content around spatial outcomes, plant combinations and annotated lists. Pair the overall effect with plant names and individual references to make the information easier to use.',
      outcome: 'The supplied records show 1,172 new followers over 30 days, with 1,433 total followers at that stage. A separate 7-day window records 52,000 views and 3,513 interactions. These are different reporting windows, not combined results or verified sales conversion.',
      reflection: 'Use saves, likes and enquiries as signals for the next test: lighting conditions, differences between combinations, care steps and balcony constraints. Sales conversion and formal experience validation remain to be added.',
    },
  },
  loopy: {
    title: 'Loopy — connecting circular materials', client: 'UAL × IBM / collaborative service concept',
    summary: 'A circular-material service concept connecting sourcing, trust and sustainability information for fashion SMEs.',
    status: 'Team concept', role: '', tags: ['Service design', 'Platform concept', 'User journey'],
    sections: {
      context: 'Fashion SMEs face cost, time and supply uncertainty when sourcing deadstock or second-hand materials. They also need transparent information to support sustainability claims.',
      challenge: 'How might a transparent collaborative network help fashion SMEs find reliable materials and production support within an unstable supply chain?',
      role: 'A UAL × IBM team project. The work shown is a shared team outcome. Individual responsibilities, contributions and team roles still need to be documented.',
      research: 'The supplied material includes a pilot-brand analysis, competitive context and stakeholder mapping, focused on material access, reliability and transparency. Research samples and individual contributions remain to be added.',
      process: 'Design thinking connects understanding, definition, ideation, prototyping and testing. Findings inform a proposed journey and service blueprint; these are designed scenarios, not evidence of completed user testing.',
      solution: 'Connect a material library, recommendations, sample requests, order tracking and digital sustainability information. Keep human consultation and judgement alongside AI recommendations.',
      outcome: 'Supplied outputs include a brand system, mobile concepts, a user journey, a service blueprint and a staged roadmap. Business scale, GMV and waste-reduction figures in the deck are hypothetical scenarios or reference-brand figures, not achieved Loopy results.',
      reflection: 'Next questions include matching efficiency, low minimum orders, information trustworthiness, AI bias, data privacy and the environmental effects of transport.',
    },
  },
  'product-design': {
    title: 'From a user problem to a product experience', client: 'UX / UI product design',
    summary: 'A reserved framework for user flows, interfaces and prototype validation.',
    status: 'To be developed', tags: ['Product design', 'UI design'], sections: {},
  },
  'digital-content': {
    title: 'Turning campaign content into visual experiences', client: 'iQIYI Campus / campaign communication',
    summary: 'From film posters to long-form content, use information hierarchy to connect a campaign theme with the reading experience.',
    status: 'Visual work', role: 'Visual design, layout & format adaptation', tags: ['Visual communication', 'Content design'],
    sections: {
      context: 'The supplied work includes a Spring Festival screening campaign, Cloud Fair activation, eye-care campaign and campus food-education content.',
      challenge: 'Organise film lists, timing, venues and long-form information clearly, while keeping a consistent identity across formats.',
      role: 'The supplied work covers layout, information hierarchy and format adaptation. Specific responsibilities, collaboration and timing for each campaign remain to be added.',
      solution: 'Use a red-and-gold visual system for the screening campaign, adapted into different film lists and city versions. Divide long-form public-interest and campus content into readable chapters.',
      outcome: 'This version presents the supplied visual outputs. Reach, event participation and business outcomes have not been provided and are not claimed.',
    },
  },
  'pg-show': {
    title: 'From exhibition planning to the live experience', client: 'PG Show / exhibition production',
    summary: 'A reserved framework for spatial planning, teamwork, installation and delivery.',
    status: 'To be developed', tags: ['Exhibition design', 'Project management'], sections: {},
  },
  'graduation-research': {
    title: 'Who Shapes the Post?', client: 'MA research / human judgement, AI & animal welfare',
    summary: 'Exploring where AI enters small pet-brand content workflows, and how human judgement and animal needs can become visible earlier.',
    status: 'Research & prototype', tags: ['Design research', 'Responsible AI', 'Animal welfare'],
    sections: {
      context: 'Small pet brands use AI under limited staffing and frequent publishing pressure, while human judgement and animal welfare may enter the workflow late.',
      challenge: 'Bring product evidence, human creative judgement and animal needs into the beginning of content generation, rather than only correcting outputs before publishing.',
      research: 'The work combines literature, qualitative research, workflow mapping and AI-content experiments to examine timing, responsibility and animal representation. The complete methodology and boundaries can be developed further.',
      process: 'Develop Workflow V1 into a V2 animal-welfare decision module, with separate routes for AI-generated animal content and real-animal filming.',
      solution: 'Welfare Prompt Cat supports checks before AI generation. An Animal Welfare Clapperboard records decisions before, during and after real-animal filming.',
      outcome: 'A lightweight workflow and tool prototypes have been developed. Workplace trials of V2 and longer-term effects still require validation; expected value is not an achieved outcome.',
      reflection: 'The research is situated and exploratory. Animal needs are interpreted through observation, participant accounts and literature, and need further professional input and workplace validation.',
    },
  },
  'doctor-content': {
    title: 'Making expert knowledge easier to follow', client: 'Doctor accounts / Douyin content',
    summary: 'Organise expert explanations with on-camera speech, key captions and diagrams, while maintaining account recognition.',
    status: 'Practice / in progress', role: 'Period-specific account operations / filming & editing',
    tags: ['Content operations', 'Video production', 'Information design'],
    sections: {
      context: 'The supplied work covers two accounts independently operated during specific periods, plus filming and editing contributions for other doctor accounts.',
      role: 'Ning Xu and Qing Xiaobai are presented as period-specific independent account operations. Other accounts are shown as filming and editing contributions, keeping personal and team work distinct.',
      solution: 'Introduce a question with diagrams, explain it through speech and captions, then add animation or split-screen demonstrations where useful.',
      outcome: 'The current version presents content and video outputs. Individual-post interactions, cumulative account figures and personally managed periods need separate reporting contexts.',
    },
  },
};

export function localiseProjects(projects, language) {
  if (language !== 'en') return projects;
  return projects.map(project => {
    const copy = englishProjects[project.slug];
    if (!copy) return project;
    return {
      ...project, ...copy, category: categories[project.category] || project.category,
      sections: Object.fromEntries(Object.entries(project.sections).map(([id, section]) => [id, {
        text: copy.sections[id] || '',
        images: (section.images || []).map((image, i) => ({ ...image, alt: `${copy.title} — ${id}, figure ${i + 1}`, caption: 'From the supplied project document. Original artwork and reporting context retained.' })),
      }])),
    };
  });
}
