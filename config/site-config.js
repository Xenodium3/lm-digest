// Public site configuration for retargeting LM Digest.
// This file is served by GitHub Pages, so do not put secrets here.
// Keep topic IDs/categories aligned with the backend research profile.

window.LM_DIGEST_SITE_CONFIG = {
  backendUrl: 'https://lm-digest-intake-internal.yufanxu.workers.dev',
  brand: {
    digestName: 'LM Digest',
    pageTitle: 'LM·DIGEST — Liquid Metal Research Intelligence',
    heroTitle: 'Liquid Metals Research Digest',
    digestHeading: 'Recent research in liquid metals',
    focusPlaceholder: 'liquid lithium blankets · heavy-ion beam strippers · soft robotics · thermal management · 3D printing · alloy design · catalysis · magnetostrophic convection',
    commentsPlaceholder: 'Keywords, applications, materials, journals, or paper types you want LM Digest to pay attention to',
  },
  domain: {
    name: 'liquid metal',
    label: 'Liquid Metal',
    labelPlural: 'Liquid Metals',
    defaultCategory: 'Biomedical, Robotics & Energy',
  },
  topics: [
    { id: 'nuclear', label: 'Nuclear, Accelerator & Fusion Applications' },
    { id: 'planetary', label: 'Planetary & Geo/Astrophysics' },
    { id: 'electronics', label: 'Flexible Electronics, Wearables & Soft Matter' },
    { id: 'biomedical', label: 'Biomedical, Robotics & Energy' },
  ],
  defaultTopicIds: ['nuclear', 'planetary'],
  categoryOrder: [
    'Planetary & Geo/Astrophysics',
    'Nuclear, Accelerator & Fusion Applications',
    'Flexible Electronics, Wearables & Soft Matter',
    'Biomedical, Robotics & Energy',
  ],
  categoryAliases: {
    'Nuclear & Fusion Applications': 'Nuclear, Accelerator & Fusion Applications',
  },
};
