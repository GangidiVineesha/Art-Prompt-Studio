import { StyleDefinition } from '../types';

export const STYLE_CATALOG: StyleDefinition[] = [
  {
    id: 'realistic',
    name: 'Realistic Photography',
    category: 'Digital & Cinematic',
    medium: '35mm full-frame photographic sensor',
    lighting: 'Natural soft ambient daylight with accurate specular highlights',
    substrate: 'Digital RAW photographic capture',
    signatureModifiers: [
      'realistic photo',
      'natural lighting',
      'sharp photographic focus',
      'authentic shadows',
    ],
    colorPalette: ['#1e293b', '#d97706', '#94a3b8', '#f8fafc'],
    diffusionBehavior:
      'Emphasizes subsurface scattering, realistic skin and surface micro-textures, and accurate ambient ray bounces.',
    styleBleedRisk: 'Low',
    promptTemplate:
      'A realistic photo of {subject}.',
  },
  {
    id: 'cartoon-anime',
    name: 'Cartoon / Anime Illustration',
    category: 'Graphic & Avant-Garde',
    medium: 'Digital 2D animation cel illustration',
    lighting: 'Warm sunlit cel shading with high-key cheerful tones',
    substrate: 'Digital vector & raster cel canvas',
    signatureModifiers: [
      'cartoon / anime style illustration',
      'vibrant cel shading',
      'expressive eyes',
      'clean 2D contour linework',
    ],
    colorPalette: ['#1d4ed8', '#f59e0b', '#38bdf8', '#fb7185'],
    diffusionBehavior:
      'Flattens complex photorealistic skin textures into clean cel shading gradients with animated facial features.',
    styleBleedRisk: 'Moderate',
    promptTemplate:
      'A cartoon / anime style illustration of {subject}.',
  },
  {
    id: 'watercolor',
    name: 'Watercolor Painting',
    category: 'Fine Art & Historical',
    medium: 'Aquarelle pigment wash on textured paper',
    lighting: 'Soft translucent daylight diffusing through pigment granulations',
    substrate: 'Heavyweight cold-press 300gsm watercolor paper',
    signatureModifiers: [
      'watercolor painting',
      'wet-on-wet pigment wash',
      'paper texture',
      'translucent color pools',
    ],
    colorPalette: ['#0284c7', '#fbbf24', '#f43f5e', '#fef3c7'],
    diffusionBehavior:
      'Introduces fluid edge bleeding, granular pigment pooling, and authentic water stain blooms.',
    styleBleedRisk: 'Moderate',
    promptTemplate:
      'A watercolor painting of {subject}.',
  },
  {
    id: 'sketch-pencil',
    name: 'Sketch / Pencil Drawing',
    category: 'Craft & Tactile',
    medium: 'Graphite pencil hatching on textured paper',
    lighting: 'Monochromatic tonal gradation from ambient window lighting',
    substrate: 'Acid-free cartridge sketching paper',
    signatureModifiers: [
      'pencil sketch',
      'graphite hatching',
      'monochromatic shading',
      'fine cross-hatch lines',
    ],
    colorPalette: ['#18181b', '#52525b', '#a1a1aa', '#f4f4f5'],
    diffusionBehavior:
      'Strips chroma completely, translating luminance values strictly into graphite stroke density and paper highlights.',
    styleBleedRisk: 'Moderate',
    promptTemplate:
      'A pencil sketch of {subject}.',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    category: 'Digital & Cinematic',
    medium: 'Digital 3D concept render with emissive neon shaders',
    lighting: 'High-contrast nocturnal illumination with magenta and cyan neon backlights',
    substrate: 'Emissive displays, chrome, and rain-slicked surfaces',
    signatureModifiers: [
      'cyberpunk style',
      'neon lights',
      'futuristic city view',
      'emissive reflections',
    ],
    colorPalette: ['#ec4899', '#06b6d4', '#6366f1', '#090d16'],
    diffusionBehavior:
      'Injects high-saturation neon glow, nocturnal backlighting, and futuristic architectural elements.',
    styleBleedRisk: 'Moderate',
    promptTemplate:
      'A cyberpunk style image of {subject}, neon lights, city view.',
  },
  {
    id: 'oil-painting',
    name: 'Oil Painting',
    category: 'Fine Art & Historical',
    medium: 'Heavy-body oil on woven canvas',
    lighting: 'Dappled golden sunlight rendered through broken brushwork',
    substrate: 'Rough Belgian linen canvas with visible impasto relief',
    signatureModifiers: [
      'oil painting',
      'thick impasto brushstrokes',
      'tactile canvas texture',
      'palette knife marks',
    ],
    colorPalette: ['#b45309', '#0369a1', '#15803d', '#fef3c7'],
    diffusionBehavior:
      'Dissolves sharp digital boundaries into physical brushstroke facets and rich oil impasto glazes.',
    styleBleedRisk: 'Moderate',
    promptTemplate:
      'An oil painting of {subject}.',
  },
  {
    id: 'ukiyo-e',
    name: 'Edo Ukiyo-e Woodblock',
    category: 'Fine Art & Historical',
    medium: 'Woodcut print on washi paper',
    lighting: 'Flat ambient illumination with subtle bokashi color gradation',
    substrate: 'Antique fibrous mulberry washi paper',
    signatureModifiers: [
      'delicate woodcut linework',
      'bokashi gradation',
      'mineral pigments',
      'Japanese Edo aesthetic',
    ],
    colorPalette: ['#1e293b', '#c2410c', '#e2d9c8', '#0284c7'],
    diffusionBehavior:
      'Flattens 3D spatial depth into decorative 2D planes; outlines subject geometry in calligraphic ink lines.',
    styleBleedRisk: 'Moderate',
    promptTemplate:
      'Traditional Japanese Edo period Ukiyo-e woodblock print of {subject}, delicate woodcut linework, bokashi color gradation, antique washi paper texture, indigo and vermilion mineral pigments.',
  },
  {
    id: 'claymation-stopmotion',
    name: 'Tactile Stop-Motion Claymation',
    category: 'Craft & Tactile',
    medium: 'Hand-modeled polymer clay with miniature studio set',
    lighting: 'Studio macro bounce lighting with crisp rim separation and shallow depth of field',
    substrate: 'Tactile polymer clay with miniature armature',
    signatureModifiers: [
      'tactile polymer clay',
      'fingerprint textures',
      'studio macro photography',
      'shallow depth of field',
    ],
    colorPalette: ['#f97316', '#78716c', '#0284c7', '#facc15'],
    diffusionBehavior:
      'Transforms rigid edges into rounded, organic handcrafted contours with authentic tactile imperfections.',
    styleBleedRisk: 'High',
    promptTemplate:
      'Tactile stop-motion claymation sculpture of {subject}, hand-modeled polymer clay with visible gentle fingerprint textures, studio macro photography with soft rim lighting.',
  },
];
