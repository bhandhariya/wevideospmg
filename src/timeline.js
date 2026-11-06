// SongScript DSL Timeline definitions for "मुझे अपना बनाकर छोड़ गए" (15 Seconds Cinematic Cut)
// Total song duration is 15.0 seconds

export const meta = {
  title: 'मुझे अपना बनाकर छोड़ गए',
  artist: 'Raja Hindustani',
  duration: 15.5,
  audio: '/song/aaye%20na%20sawariya.mp3',
}

export const TOTAL_DURATION = meta.duration

export const sections = [
  { id: 'intro', label: 'प्रस्तावना (Title)', start: 0.0, end: 5.0, color: '#c99e64' },
  { id: 'krishna_viraha', label: 'कृष्ण दर्शन (Krishna Glance)', start: 5.0, end: 7.5, color: '#3f5e78' },
  { id: 'barsana_longing', label: 'स्मृति वियोग (Separation)', start: 7.5, end: 10.0, color: '#8c4a4a' },
  { id: 'radha_grief', label: 'राधा विरह (Radha Grief)', start: 10.0, end: 15.0, color: '#6e2b2b' },
]

export const credits = [
  {
    id: 'pres',
    text: 'GOVERDHAN DIVINE SCAPE',
    start: 0.15,
    end: 2.3,
    isCredit: true,
    position: { anchor: 'left', top: '42%', left: '8%', textAlign: 'left' },
    motion: { scaleStart: 0.94, scaleEnd: 1.05, xStart: -8, xEnd: 10 },
    style: {
      fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
      fontSize: '2.4vw',
      fontWeight: '700',
      letterSpacing: '0.20em',
      lineHeight: '1.4',
      background: 'linear-gradient(135deg, #c59b27 0%, #f7e089 35%, #9e731b 70%, #faebb0 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 2px 4px rgba(40, 20, 10, 0.45)) drop-shadow(0 0 18px rgba(230, 175, 75, 0.65))',
    },
    enter: { type: 'glow-in', duration: 0.6 },
    exit: { type: 'smoke-out', duration: 0.5 },
  },
  {
    id: 'presents_sub',
    text: '— P R E S E N T S —',
    start: 0.7, // 0.3s baad aayega — cinematic punch!
    end: 2.4,
    position: { top: '48%', left: '36%', textAlign: 'center' }, // Theek uske neeche beech mein!
    style: {
      fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
      fontSize: '2.4vw',
      fontWeight: '700',
      letterSpacing: '0.20em',
      lineHeight: '1.4',
      background: 'linear-gradient(135deg, #c59b27 0%, #f7e089 35%, #9e731b 70%, #faebb0 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 2px 4px rgba(40, 20, 10, 0.45)) drop-shadow(0 0 18px rgba(230, 175, 75, 0.65))',
    },
    enter: { type: 'glow-in', duration: 0.6 },
    exit: { type: 'smoke-out', duration: 0.5 },
  },
    {
    id: 'title',
    text: 'मुझे अपना बनाकर छोड़ गए',
    start: 2.2,
    end: 5.0,
    isTitle: true,
    position: { anchor: 'center', top: '44%', left: '30%', textAlign: 'center' },
    
    // Smooth cinematic upward float
    motion: { scaleStart: 0.94, scaleEnd: 1.05, yStart: 12, yEnd: -8 },

    // Continuous divine breathing while on screen!
    living: { type: 'pulse', amp: 0.025, period: 3.5 },

    style: {
      fontFamily: "'Rozha One', 'Tiro Devanagari Hindi', serif",
      fontSize: '4.8vw',          // Thoda bada aur authoritative
      fontWeight: '700',
      letterSpacing: '0.06em',
      // Royal Kumkum Gradient Texture
      background: 'linear-gradient(180deg, #9b3333 0%, #6e1d1d 70%, #4a1212 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      // 3D Depth + Warm Diya Candlelight Bloom
      filter: 'drop-shadow(0 3px 6px rgba(42, 18, 18, 0.45)) drop-shadow(0 0 24px rgba(220, 140, 50, 0.55))',
    },

    // Diya lighting bloom entrance
    enter: { type: 'glow-in', duration: 0.8 },
    // Soft disperse exit
    exit: { type: 'smoke-out', duration: 0.6 },
  },
  {
    id: 'sub',
    text: 'आए ना सँवरिया बेदरदी',
    start: 2.5,
    end: 5.0,
    isSubtitle: true,
    position: { anchor: 'center', top: '56%', left: '40%' },
     motion: { scaleStart: 0.94, scaleEnd: 1.05, yStart: 12, yEnd: -8 },

    // Continuous divine breathing while on screen!
    living: { type: 'pulse', amp: 0.025, period: 3.5 },

    style: {
      fontFamily: "'Rozha One', 'Tiro Devanagari Hindi', serif",
      fontSize: '4.9vw',          // Thoda bada aur authoritative
      fontWeight: '700',
      letterSpacing: '0.06em',
      // Royal Kumkum Gradient Texture
      background: 'linear-gradient(180deg, #9b3333 0%, #6e1d1d 70%, #4a1212 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      // 3D Depth + Warm Diya Candlelight Bloom
      filter: 'drop-shadow(0 3px 6px rgba(42, 18, 18, 0.45)) drop-shadow(0 0 24px rgba(220, 140, 50, 0.55))',
    },

    // Diya lighting bloom entrance
    enter: { type: 'glow-in', duration: 0.8 },
    // Soft disperse exit
    exit: { type: 'smoke-out', duration: 0.6 },
  },
  {
    id: 'artist_credit',
    text: 'स्वर व प्रस्तुति — राजा हिंदुस्तानी',
    subtext: '॥ विरह भाव काव्य-गाथा ॥',
    start: 5.2,
    end: 9.0,
    isPoet: true,
    position: { top: '81%', right: '48%', textAlign: 'right' },
    motion: { xStart: 25, xEnd: 0 },
    style: { 
      fontSize: '2.2vw',
      fontFamily: "'Rozha One', 'Tiro Devanagari Hindi', serif",
      color: '#6e1d1d',
      letterSpacing: '0.08em',
      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.25))',
    },
    enter: { type: 'slide-down', duration: 0.7 },
    exit: { type: 'fade-out', duration: 0.5 },
  },
]

export const tracks = [
  {
    id: 'opening_sparkle_blast',
    type: 'particle',
    start: 0.0,
    end: 3.5,
    particle: {
      count: 30,
      color: 'rgba(255, 205, 90, 0.7)',
      sizeRange: [2.5, 5.5],
      speedRange: [0.6, 1.5],
      drift: 'float-up',
    },
    blend: 'screen',
    zIndex: 6,
  },
  {
    id: 'transition_light_bridge',
    type: 'particle',
    start: 4.6,
    end: 5.8,
    particle: {
      count: 26,
      color: 'rgba(255, 220, 130, 0.8)',
      sizeRange: [3, 6.5],
      speedRange: [0.7, 1.8],
      drift: 'float-up',
    },
    blend: 'screen',
    zIndex: 7,
  },
  {
    id: 'ambient_dust',
    type: 'particle',
    start: 0.0,
    end: 15.5,
    particle: {
      count: 22,
      color: 'rgba(215, 190, 160, 0.35)',
      sizeRange: [2, 5],
      speedRange: [0.2, 0.6],
      drift: 'float-up',
    },
    blend: 'screen',
    zIndex: 5,
  },
  {
    id: 'crescendo_sparkle',
    type: 'particle',
    start: 13.2,
    end: 15.5,
    particle: {
      count: 24,
      color: 'rgba(255, 215, 120, 0.8)',
      sizeRange: [2.5, 5.5],
      speedRange: [0.8, 1.8],
      drift: 'float-up',
    },
    blend: 'screen',
    zIndex: 7,
  },
  // {
  //   id: 'intro_scene_callout',
  //   type: 'text',
  //   start: 0.2,
  //   end: 4.5,
  //   text: '॥ श्री राधा कृष्ण विरह चरितम् ॥',
  //   position: { top: '16%', left: '28%', textAlign: 'left' },
  //   motion: { xStart: -15, xEnd: 0 },
  //   style: {
  //     fontSize: '3.3vw',
  //     color: '#8c2f2f',
  //     letterSpacing: '0.16em',
  //     textShadow: '0 0 10px rgba(140, 47, 47, 0.35)',
  //   },
  //   enter: { type: 'glow-in', duration: 0.4 },
  //   exit: { type: 'fade-out', duration: 0.5 },
  //   zIndex: 15,
  // },
]

export const shots = [
  {
    id: 's01',
    start: 0.0,
    end: 5.4,
    file: 'plate_04_face.png',
    src: '/assets/paper/plate_04_face.png',
    fade: 0.8,
    transition: { type: 'ink-burst', duration: 0.6 },
    effects: {
      vignette: { strength: 0.32, size: 65 },
      colorGrade: { contrast: 1.08, brightness: 1.02 },
    },
    camera: { scaleStart: 1.0, scaleEnd: 1.05, originStartX: 76, originStartY: 42, originEndX: 76, originEndY: 42 },
    layers: [
      {
        id: 'mourning_peacock',
        src: '/assets/paper/cast_krishna/krishna_103_young_figure_contemplating_radha.png',
        start: 0.2,
        end: 15.0,
        enter: { type: 'smoke-dissolve', duration: 1.0 },
        living: { type: 'sway', amp: 3.5, period: 4.2 },
        keyframes: [
          { at: 0.0, x: 0, y: 0, scale: 0.95 },
          { at: 0.5, x: 6, y: -4, scale: 1.0 },
          { at: 1.0, x: 12, y: 0, scale: 1.05 },
        ],
        position: {
          top: '6%',
          left: '26%',
          width: '16%',
        },
        blend: 'normal',
        zIndex: 2,
      },]
  },
  {
    id: 's02',
    start: 4.8,
    end: 7.6,
    file: 'intro_05_radha_krishna_dawn.png',
    src: '/assets/paper/intro_05_radha_krishna_dawn.png',
    fade: 0.8,
    transition: { type: 'ink-wash', duration: 1.0 },
    effects: {
      vignette: { strength: 0.28, size: 70 },
      colorGrade: { saturate: 1.08, brightness: 1.02, contrast: 1.06 },
    },
    camera: { scaleStart: 1.0, scaleEnd: 1.06, originStartX: 68, originStartY: 42, originEndX: 62, originEndY: 40 },
    layers: [
      {
        id: 'kadamba_breeze',
        src: '/assets/paper/ref_ancient_kadamba_blossoms.png',
        start: 5.0,
        end: 7.6,
        enter: { type: 'mist', duration: 0.8 },
        living: { type: 'drift', ampX: 6, ampY: 4, period: 4.5 },
        position: {
          top: '6%',
          left: '6%',
          width: '20%',
        },
        blend: 'normal',
        zIndex: 2,
      },
    ],
  },
  {
    id: 's03',
    start: 7.0,
    end: 10.2,
    file: 'plate_05c_viraha_trio.png',
    src: '/assets/paper/plate_05c_viraha_trio.png',
    fade: 0.6,
    fadeOut: false,
    transition: { type: 'blur-through', duration: 0.8 },
    effects: {
      vignette: { strength: 0.25, size: 74 },
      colorGrade: { contrast: 1.06, brightness: 1.01 },
    },
    camera: { scaleStart: 1.0, scaleEnd: 1.06, originStartX: 32, originStartY: 52, originEndX: 42, originEndY: 50 },
    layers: [
      {
        id: 'mourning_peacock',
        src: '/assets/paper/ref_peacock_mourning.png',
        start: 7.2,
        end: 10.2,
        enter: { type: 'smoke-dissolve', duration: 0.9 },
        living: { type: 'sway', amp: 3.5, period: 4.2 },
        keyframes: [
          { at: 0.0, x: 0, y: 0, scale: 0.95 },
          { at: 0.5, x: 6, y: -4, scale: 1.0 },
          { at: 1.0, x: 12, y: 0, scale: 1.05 },
        ],
        position: {
          top: '8%',
          left: '24%',
          width: '16%',
        },
        blend: 'normal',
        zIndex: 2,
      },
      {
        id: 'dropped_bansuri',
        src: '/assets/paper/ref_bansuri_peacock_feather.png',
        start: 7.5,
        end: 10.2,
        enter: { type: 'ink-bleed', duration: 1.0 },
        living: { type: 'pulse', amp: 0.03, period: 3.5 },
        keyframes: [
          { at: 0.0, scale: 0.9, rot: -4 },
          { at: 0.6, scale: 1.0, rot: -1 },
          { at: 1.0, scale: 1.03, rot: 2 },
        ],
        position: {
          bottom: '10%',
          left: '32%',
          width: '15%',
        },
        blend: 'normal',
        zIndex: 2,
      },
      {
        id: 'flying_swan',
        src: '/assets/paper/ref_flying_swan_messenger.png',
        start: 7.8,
        end: 10.2,
        enter: { type: 'float-up', duration: 0.8 },
        living: { type: 'float', amp: 5, period: 3.2 },
        keyframes: [
          { at: 0.0, x: -30, y: 12, scale: 0.85, rot: -2 },
          { at: 0.4, x: -5, y: 2, scale: 0.94, rot: 1 },
          { at: 0.7, x: 18, y: -6, scale: 1.02, rot: -1 },
          { at: 1.0, x: 40, y: -14, scale: 1.08, rot: 0 },
        ],
        position: {
          top: '42%',
          left: '42%',
          width: '18%',
        },
        blend: 'normal',
        zIndex: 3,
      },
    ],
  },
  {
    id: 's04',
    start: 9.8,
    end: 15.5,
    file: 'plate_08b_radha_grief.png',
    src: '/assets/paper/plate_08b_radha_grief.png',
    fade: 0.8,
    transition: { type: 'ink-wash', duration: 1.0 },
    effects: {
      vignette: { strength: 0.32, size: 68 },
      colorGrade: { contrast: 1.08, brightness: 1.02, saturate: 1.04 },
    },
    camera: { scaleStart: 1.0, scaleEnd: 1.07, originStartX: 48, originStartY: 46, originEndX: 52, originEndY: 44 },
    layers: [
      {
        id: 'viraha_diya',
        src: '/assets/paper/ref_clay_diya_flickering.png',
        start: 10.2,
        end: 15.5,
        enter: { type: 'glow-in', duration: 0.8 },
        living: { type: 'flicker', amp: 0.08 },
        position: {
          bottom: '35%',
          left: '42%',
          width: '13%',
        },
        blend: 'normal',
        zIndex: 3,
      },
      {
        id: 'krishna_viraha_memory',
        src: '/assets/paper/cast_krishna/krishna_042_looking_back_with_sorrow.png',
        start: 10.0,
        end: 15.5,
        enter: { type: 'smoke-dissolve', duration: 1.2 },
        living: { type: 'pulse', amp: 0.025, period: 3.8 },
        keyframes: [
          { at: 0.0, x: -8, y: 0, scale: 2.10, opacity: 0.8 },
          { at: 0.5, x: 0, y: -3, scale: 1.10, opacity: 0.95 },
          { at: 1.0, x: 8, y: 0, scale: 1.12, opacity: 1.0 },
        ],
        position: {
          top: '32%',
          right: '12%',
          width: '22%',
        },
        blend: 'normal',
        zIndex: 2,
      },
    ],
  },
]

export const lyricLines = []

export const songScript = {
  meta,
  sections,
  shots,
  lyricLines,
  tracks,
  credits,
}

export default songScript
