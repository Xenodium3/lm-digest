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
    focusPlaceholder: 'liquid lithium blankets · heavy-ion beam strippers · liquid metal batteries · soft robotics · thermal management · alloy design · magnetostrophic convection',
    commentsPlaceholder: 'Keywords, applications, materials, journals, or paper types you want LM Digest to pay attention to',
  },
  domain: {
    name: 'liquid metal',
    label: 'Liquid Metal',
    labelPlural: 'Liquid Metals',
    defaultCategory: 'Biomedical, Soft Robotics & Actuation',
  },
  topics: [
    { id: 'nuclear', label: 'Nuclear, Accelerator & Fusion Applications' },
    { id: 'planetary', label: 'Planetary & Geo/Astrophysics' },
    { id: 'energy-storage', label: 'Energy Storage & Electrochemical Systems' },
    { id: 'electronics', label: 'Flexible Electronics, Wearables & Soft Matter' },
    { id: 'biomedical', label: 'Biomedical, Soft Robotics & Actuation' },
  ],
  defaultTopicIds: ['nuclear', 'planetary'],
  categoryOrder: [
    'Planetary & Geo/Astrophysics',
    'Nuclear, Accelerator & Fusion Applications',
    'Energy Storage & Electrochemical Systems',
    'Flexible Electronics, Wearables & Soft Matter',
    'Biomedical, Soft Robotics & Actuation',
  ],
  categoryAliases: {
    'Nuclear & Fusion Applications': 'Nuclear, Accelerator & Fusion Applications',
    'Biomedical, Robotics & Energy': 'Biomedical, Soft Robotics & Actuation',
  },
};
