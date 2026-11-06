# Complete Guide to `src/timeline.js` (SongScript DSL Architecture)

The file [`src/timeline.js`](file:///c:/Users/rajas/Desktop/rrrhjjg/webvideosongmake-main/webvideosongmake-main/src/timeline.js) is the central orchestration engine of this entire project. Every visual, camera movement, layered character cutout, lyric sync, visual effect, particle system, and title credit in your video is configured inside this file.

By editing only this file, you can build a complete 5-minute song video or create entirely new songs without modifying the rendering engine or export scripts.

---

## 🏗️ Core Architecture Overview

The file exports a single master JavaScript object (`songScript`) containing 6 core sections:

```javascript
export const songScript = {
  meta,        // 1. Audio track & video global metadata
  sections,    // 2. Song structure & chapter markers
  shots,       // 3. Visual scenes, background plates, camera & cutouts
  lyricLines,  // 4. Word-by-word synced kinetic typography
  tracks,      // 5. Global overlays, atmospheric particles & text callouts
  credits,     // 6. Presentation titles, director/artist credits & Sanskrit shlokas
}
```

---

## 1. `meta` — Track & Video Settings

Defines the master configuration for the entire timeline.

```javascript
export const meta = {
  title: 'मुझे अपना बनाकर छोड़ गए', // Song title
  artist: 'Raja Hindustani',            // Artist / Vocalist
  duration: 289.0,                      // Total video duration in seconds
  audio: '/song/aaye%20na%20sawariya.mp3', // Path to the audio file
}
export const TOTAL_DURATION = meta.duration
```

### Property Keys
| Key | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Display title of the project. |
| `artist` | `string` | Artist or composer name. |
| `duration` | `number` | Exact duration of the video in seconds (e.g. `289.0` for full song). |
| `audio` | `string` | URL or public path to the audio file loaded into `<audio>`. |

---

## 2. `sections` — Song Chapters & Progress Markers

Divides the timeline into musical sections (Intro, Chorus, Verses, Outro). These appear on the stage scrubber for quick navigation.

```javascript
export const sections = [
  { id: 'intro', label: 'प्रस्तावना (Intro)', start: 0.0, end: 15.0, color: '#c99e64' },
  { id: 'chorus_1', label: 'मुखड़ा (Chorus)', start: 15.0, end: 57.0, color: '#8c2f2f' },
  { id: 'verse_1', label: 'अंतरा १ (Verse 1)', start: 58.0, end: 120.0, color: '#4a5d4e' },
]
```

### Property Keys
| Key | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier for the chapter. |
| `label` | `string` | Label displayed on hover and timeline UI. |
| `start` | `number` | Section start time in seconds. |
| `end` | `number` | Section end time in seconds. |
| `color` | `string` | Hex/CSS color code representing the section on the timeline bar. |

---

## 3. `shots` — Scenes, Camera Work, Layers & Effects

The `shots` array controls what the viewer sees on screen at any given second. Each shot represents a visual scene consisting of a background plate, camera motion, cinematic post-processing effects, and multi-layered character cutouts (e.g., Radha, Krishna, birds, props).

### Full Shot Structure Example

```javascript
export const shots = [
  {
    id: 's01',
    start: 0.0,
    end: 15.0,
    file: 'plate_04_face.png',              // File inside /assets/paper/
    src: '/assets/paper/plate_04_face.png',  // Direct path
    fade: 0.8,                              // Crossfade duration in seconds
    fadeOut: true,                          // Set to false if continuing into same plate next shot
    transition: { 
      type: 'ink-burst',                    // Transition style
      duration: 0.6 
    },
    camera: {
      scaleStart: 1.0,
      scaleEnd: 1.08,
      originStartX: 50,
      originStartY: 50,
      originEndX: 45,
      originEndY: 48,
    },
    effects: {
      vignette: { strength: 0.32, size: 65 },
      colorGrade: { 
        contrast: 1.08, 
        brightness: 1.02, 
        saturate: 1.05,
        sepia: 0.1,
        hueRotate: 0,
        grayscale: 0
      },
      blend: 'normal',
      filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.2))',
    },
    layers: [
      /* Multi-layer cutout elements */
    ],
  }
]
```

### Shot Top-Level Property Keys
| Key | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique ID for the shot. |
| `start` | `number` | Second when this shot begins. |
| `end` | `number` | Second when this shot ends. |
| `src` / `file` | `string` | Image file for the main scene background plate. |
| `fade` | `number` | Crossfade duration in seconds (default: `0.5`). |
| `fadeOut` | `boolean` | If `false`, disables fade-out at the end (useful when the next shot shares the same background). |
| `transition` | `object` | `{ type, duration }` entrance transition from the previous shot. |
| `camera` | `object` | Ken Burns motion parameters (zooms and pans). |
| `effects` | `object` | Post-processing effects (vignette, color grading, blend mode). |
| `layers` | `array` | Sub-elements (characters, items, props) rendered on top of the plate. |

---

### Camera Control (`camera`)
Controls the Ken Burns cinematic camera movement across the shot duration:
| Key | Type | Description |
| :--- | :--- | :--- |
| `scaleStart` | `number` | Initial zoom multiplier at `start` (e.g. `1.0`). |
| `scaleEnd` | `number` | Final zoom multiplier at `end` (e.g. `1.08` for a gentle slow push-in). |
| `originStartX`, `originStartY` | `number` | Starting focus point in percentages (`0` to `100`). E.g. `(76, 42)` focuses on a face in the top right. |
| `originEndX`, `originEndY` | `number` | Ending focus point in percentages. Panning happens smoothly between start and end origins. |

---

### Transition Types (`transition.type`)
The engine includes built-in transition styles:
* `'cut'` — Instant visual change.
* `'dissolve'` — Smooth alpha crossfade.
* `'ink-wash'` — Organic watercolor expanding outward on parchment paper.
* `'ink-burst'` — Fast impact radial ink splash opening with slight scale and bloom.
* `'smoke-bloom'` — Mist and haze clearing away with subtle scale shift.
* `'blur-through'` — Heavy camera focus pull / out-of-focus blur in.
* `'wipe-left'` / `'wipe-right'` / `'wipe-up'` / `'wipe-down'` — Directional clean edge wipes.
* `'iris-in'` / `'iris-out'` — Circular aperture expanding or contracting.
* `'slide-left'` / `'slide-right'` — Physical horizontal slide.

---

### Multi-Layer Character & Prop Elements (`shot.layers`)
Allows placing isolated Radha, Krishna, birds, or props on top of the background plate with independent timing, motion, and breathing animations.

```javascript
layers: [
  {
    id: 'mourning_peacock',
    src: '/assets/paper/cast_krishna/krishna_103_young_figure.png',
    start: 0.2,
    end: 15.0,
    removeBg: true,                 // Auto-detects paper tint and strips background to alpha!
    position: {
      top: '6%',
      left: '26%',
      width: '16%',
    },
    enter: { type: 'smoke-dissolve', duration: 1.0 },
    exit: { type: 'smoke-evaporate', duration: 0.8 },
    living: { type: 'sway', amp: 3.5, period: 4.2 },
    keyframes: [
      { at: 0.0, x: 0, y: 0, scale: 0.95 },
      { at: 0.5, x: 6, y: -4, scale: 1.0 },
      { at: 1.0, x: 12, y: 0, scale: 1.05 },
    ],
    blend: 'normal',
    zIndex: 2,
  }
]
```

#### Layer Property Keys
| Key | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier for the layer. |
| `src` | `string` | Path to the image cutout (character, feather, lamp, etc.). |
| `start`, `end` | `number` | Timestamps within the shot when this layer is visible. |
| `removeBg` | `boolean` | **Auto Background Isolation:** When `true` (default), the engine samples the corner parchment pixels in real-time on a canvas and isolates the drawing onto a transparent background! |
| `position` | `object` | CSS positioning: `{ top, left, right, bottom, width, height }`. |
| `enter` | `object` | `{ type, duration }` entrance animation. |
| `exit` | `object` | `{ type, duration }` exit animation. |
| `living` | `object` | Continuous organic micro-animation (breathing/floating/swaying). |
| `motion` | `object` | Linear motion config (`xStart`, `xEnd`, `yStart`, `yEnd`, `scaleStart`, `scaleEnd`, `rotStart`, `rotEnd`). |
| `keyframes` | `array` | Complex multi-stop keyframe timeline (`[{ at: 0.0, x, y, scale, rot }, ...]`). |
| `blend` | `string` | CSS `mixBlendMode` (e.g. `'normal'`, `'multiply'`, `'screen'`). |
| `zIndex` | `number` | Stacking order layer depth. |

#### Layer Entrance (`enter.type`)
* `'ink-bleed'` / `'watercolor'` — Inks bleed onto the paper through a radial organic mask.
* `'smoke-dissolve'` / `'mist'` — Emerges from an atmospheric smoke blur.
* `'float-up'` — Glides upward from below.
* `'fade'` — Soft opacity crossfade.

#### Layer Exit (`exit.type`)
* `'smoke-evaporate'` / `'mist-fade'` — Evaporates into thin mist.
* `'ink-dissolve'` — Softly loses contrast and fades away like water.
* `'fade'` — Standard fade out.

---

## 4. `living` — Organic Micro-Animations

The engine includes 8 continuous micro-motions that keep still drawings "alive" on screen throughout their duration:

| Preset Name | Best Used For | Configuration Options |
| :--- | :--- | :--- |
| `'float'` | Gentle vertical floating (gods, clouds, swans) | `{ amp: 6, period: 3.5 }` |
| `'sway'` | Pendulum swaying (peacocks, branches, jewelry) | `{ amp: 3.5, period: 4.2 }` |
| `'flicker'` | Diya / oil-lamp candlelight bloom and reflections | `{ amp: 0.05 }` |
| `'drift'` | Ambient floating dust or leaf motion in X & Y | `{ ampX: 8, ampY: 4, period: 6.0 }` |
| `'pulse'` | Divine breathing, heartbeat, sacred aura expansion | `{ amp: 0.04, period: 3.0 }` |
| `'tremble'` | Emotional shock, sobbing, tearful grief, intense tension | `{ amp: 1.5 }` |
| `'orbit'` | Circular orbital celestial motion | `{ radius: 5, period: 5.0 }` |
| `'wave'` | Fluid ripple motion combining translation and rotation | `{ amp: 4, period: 3.8 }` |

---

## 5. `lyricLines` — Kinetic Word-by-Word Synchronized Lyrics

This is where you synchronize the song lyrics with the vocal audio. Each entry represents one lyrical sentence or phrase, broken down word-by-word with exact timestamps.

### Example Lyric Line Definition

```javascript
export const lyricLines = [
  {
    id: 'l01',
    start: 15.0,
    end: 20.0,
    anchor: 'center', // Or position: { top: '75%', left: '50%' }
    words: [
      { text: 'मुझे',   time: 15.0, duration: 0.9 },
      { text: 'अपना',   time: 16.0, duration: 0.9 },
      { text: 'बनाकर', time: 17.0, duration: 1.8 },
      { text: 'छोड़',   time: 19.0, duration: 0.9 },
      { text: 'गए',     time: 20.0, duration: 0.8 },
    ],
    wordReveal: { type: 'ink-draw' }, // Calligraphy nib stroke reveal!
    enter: { type: 'glow-in', duration: 0.5 },
    exit: { type: 'fade-out', duration: 0.4 },
    style: {
      fontFamily: "'Rozha One', serif",
      fontSize: '4.2vw',
      color: '#6e1d1d',
      letterSpacing: '0.08em',
      textShadow: '0 2px 10px rgba(0,0,0,0.3)',
    },
    living: { type: 'pulse', amp: 0.02, period: 3.0 },
  }
]
```

### Word Reveal Styles (`wordReveal.type`)
The engine dynamically animates each word as it is sung by the vocalist:
1. `'ink-draw'` — Animated calligraphy pen-nib stroke drawing each character from left to right.
2. `'fade'` — Soft alpha emergence.
3. `'pop'` — Kinetic bounce scaling from small to slightly oversized then settling.
4. `'glow-pulse'` — Radiant golden aura flare when the word is vocalized.
5. `'stamp'` — Heavy ancient wooden block-print stamp slam onto paper.
6. `'typewriter'` — Stepped letterform reveal.
7. `'brush-stroke'` — Fluid ink brush swipe.
8. `'ripple'` — Circular liquid drop ripple revealing the word.
9. `'bloom'` — Scales up smoothly from the center point with atmospheric blur.
10. `'chisel'` — Ancient stone-inscribed relief shadows.

### Line Enter & Exit Styles
* **Enter:** `'ink-reveal'`, `'fade-in'`, `'blur-in'`, `'slide-up'`, `'slide-down'`, `'scale-in'`, `'float-up'`, `'drop-in'`, `'ink-bleed'`, `'glow-in'`, `'wave-in'`.
* **Exit:** `'fade-out'`, `'blur-out'`, `'slide-up'`, `'scale-out'`, `'float-away'`, `'ink-dissolve'`, `'smoke-out'`.

---

## 6. `tracks` — Atmospheric Particles, Overlays & Text Callouts

Global auxiliary layers that span across multiple shots.

```javascript
export const tracks = [
  // 1. Dynamic Canvas Particle System
  {
    id: 'ambient_dust',
    type: 'particle',
    start: 0.0,
    end: 289.0,
    particle: {
      count: 24,                            // Number of particles
      color: 'rgba(255, 215, 120, 0.4)',    // Golden aura dust
      sizeRange: [2, 5],                    // Particle radius in px
      speedRange: [0.2, 0.7],               // Vertical drift speed
      drift: 'float-up',
    },
    blend: 'screen',
    zIndex: 5,
  },

  // 2. Full-Screen Visual Texture / Film Grain / Smoke Overlay
  {
    id: 'vintage_scratches',
    type: 'overlay',
    start: 0.0,
    end: 15.0,
    src: '/assets/paper/vintage_grain.png',
    opacity: 0.35,
    blend: 'multiply',
    zIndex: 10,
    chromaKey: false, // Set true if overlay has a green background (#00FF00) to strip!
  },

  // 3. Floating Classical Banner / Text Callout
  {
    id: 'chapter_header',
    type: 'text',
    start: 0.2,
    end: 4.5,
    text: '॥ श्री राधा कृष्ण विरह चरितम् ॥',
    position: { top: '16%', left: '28%', textAlign: 'left' },
    style: {
      fontSize: '3.3vw',
      color: '#8c2f2f',
      letterSpacing: '0.16em',
    },
    enter: { type: 'glow-in', duration: 0.4 },
    exit: { type: 'fade-out', duration: 0.5 },
    zIndex: 15,
  }
]
```

---

## 7. `credits` — Title Cards, Director Credits & Shlokas

Dedicated typography blocks formatted for cinema presentation:
* Title screens (`isTitle: true`)
* Subtitles (`isSubtitle: true`)
* Poet / Artist credits (`isPoet: true`)
* Sanskrit verses / Stotrams (`isShloka: true`)

```javascript
export const credits = [
  {
    id: 'title',
    text: 'मुझे अपना बनाकर छोड़ गए',
    start: 2.2,
    end: 5.0,
    isTitle: true,
    position: { anchor: 'center', top: '44%', left: '30%' },
    motion: { scaleStart: 0.94, scaleEnd: 1.05, yStart: 12, yEnd: -8 },
    living: { type: 'pulse', amp: 0.025, period: 3.5 },
    style: {
      fontFamily: "'Rozha One', serif",
      fontSize: '4.8vw',
      background: 'linear-gradient(180deg, #9b3333 0%, #6e1d1d 70%, #4a1212 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 3px 6px rgba(42, 18, 18, 0.45)) drop-shadow(0 0 24px rgba(220, 140, 50, 0.55))',
    },
    enter: { type: 'glow-in', duration: 0.8 },
    exit: { type: 'smoke-out', duration: 0.6 },
  }
]
```

---

## 8. Step-by-Step Workflow: How to Build the Full Video

1. **Get Timestamps from [`song/timestampwithlyrics.md`](file:///c:/Users/rajas/Desktop/rrrhjjg/webvideosongmake-main/webvideosongmake-main/song/timestampwithlyrics.md):**
   Refer to the timestamp file which contains every single line and second of the song.
2. **Update `meta.duration`:**
   Change `meta.duration` to `289.0` (or the song length).
3. **Map Song Chapters in `sections`:**
   Add markers for Intro, Chorus 1, Chorus 2, Verses, and Outro.
4. **Sequence `shots`:**
   For each line or musical beat, add a shot with background plates (`plate_04_face.png`, `plate_05c_viraha_trio.png`, etc.), smooth camera push/pull, and add Radha/Krishna pose cutouts in `layers`.
5. **Populate `lyricLines`:**
   Input each line with its word timings and choose your favorite reveal effect (`ink-draw`, `bloom`, `glow-pulse`).
6. **Live Preview:**
   Run `npm run dev` to watch the video play in your browser with real-time audio synchronization.
7. **Export High-Definition Video:**
   Run `npm run export-full` or `npm run export-4k` to render lossless frames via Puppeteer directly into MP4.
