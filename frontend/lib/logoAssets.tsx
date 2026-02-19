// Bowling Team Logo Lab - SVG Asset Library
// Add more assets here by following the LogoAsset type structure

// Main bowling assets - using public paths for Next.js
const mainBowlingBall = "/attached_assets/bowling_144281_1765566805672.png";
const mainBowlingPins = "/attached_assets/bowling_4796426_1765566805672.png";
const mainBowlingStrike = "/attached_assets/bowling_8242811_1765566805672.png";
const mainBowlingBallAlt = "/attached_assets/bowling-ball_2438288_1765566805672.png";

// Decoration assets
const decorArcade = "/attached_assets/arcade-machine_934473_1765566963584.png";
const decorBeer = "/attached_assets/beer_934213_1765566963586.png";
const decorCola = "/attached_assets/cola_5443677_1765566963586.png";
const decorPizza = "/attached_assets/pizza_1384676_1765566963587.png";
const decorSkull = "/attached_assets/skull_2099721_1765566977055.png";

export type LogoAsset = {
  id: string;
  name: string;
  svg: JSX.Element;
  vibes: string[]; // Which vibes this asset works with
  layer: number; // Z-index ordering (0 = background, higher = foreground)
  category: "main" | "decoration" | "baio" | "holidays";
  imageUrl?: string; // For image-based assets
};

// Helper for image-based assets
const ImageWrapper = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
);

// Helper to create consistent SVG wrappers
const SvgWrapper = ({
  children,
  viewBox = "0 0 100 100",
}: {
  children: React.ReactNode;
  viewBox?: string;
}) => (
  <svg
    viewBox={viewBox}
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", height: "100%" }}
  >
    {children}
  </svg>
);

// ============================================
// MAIN ASSETS (layer 2-4)
// ============================================

const bowlingBall: LogoAsset = {
  id: "bowling-ball",
  name: "Bowling Ball",
  svg: <ImageWrapper src={mainBowlingBall} alt="Bowling Ball" />,
  vibes: ["Retro", "Cartoon", "Serious League", "Gothic", "Cosmic"],
  layer: 2,
  category: "main",
  imageUrl: mainBowlingBall,
};

const bowlingPins: LogoAsset = {
  id: "bowling-pins",
  name: "Bowling Pins",
  svg: <ImageWrapper src={mainBowlingPins} alt="Bowling Pins" />,
  vibes: ["Retro", "Cartoon", "Serious League"],
  layer: 3,
  category: "main",
  imageUrl: mainBowlingPins,
};

const bowlingStrike: LogoAsset = {
  id: "bowling-strike",
  name: "Strike!",
  svg: <ImageWrapper src={mainBowlingStrike} alt="Bowling Strike" />,
  vibes: ["Retro", "Cartoon", "Cosmic"],
  layer: 3,
  category: "main",
  imageUrl: mainBowlingStrike,
};

const bowlingBallAlt: LogoAsset = {
  id: "bowling-ball-alt",
  name: "Ball & Pins",
  svg: <ImageWrapper src={mainBowlingBallAlt} alt="Ball and Pins" />,
  vibes: ["Gothic", "Cosmic", "Serious League"],
  layer: 3,
  category: "main",
  imageUrl: mainBowlingBallAlt,
};

// ============================================
// DECORATION ASSETS (layer 5-6)
// ============================================

const arcadeMachine: LogoAsset = {
  id: "decor-arcade",
  name: "Arcade Machine",
  svg: <ImageWrapper src={decorArcade} alt="Arcade Machine" />,
  vibes: ["Retro", "Cartoon"],
  layer: 5,
  category: "decoration",
  imageUrl: decorArcade,
};

const beerMug: LogoAsset = {
  id: "decor-beer",
  name: "Beer Mug",
  svg: <ImageWrapper src={decorBeer} alt="Beer Mug" />,
  vibes: ["Retro", "Cartoon"],
  layer: 5,
  category: "decoration",
  imageUrl: decorBeer,
};

const colaSoda: LogoAsset = {
  id: "decor-cola",
  name: "Soda Bottle",
  svg: <ImageWrapper src={decorCola} alt="Soda Bottle" />,
  vibes: ["Retro", "Cartoon"],
  layer: 5,
  category: "decoration",
  imageUrl: decorCola,
};

const pizzaSlice: LogoAsset = {
  id: "decor-pizza",
  name: "Pizza Slice",
  svg: <ImageWrapper src={decorPizza} alt="Pizza Slice" />,
  vibes: ["Retro", "Cartoon"],
  layer: 5,
  category: "decoration",
  imageUrl: decorPizza,
};

const skullDecor: LogoAsset = {
  id: "decor-skull",
  name: "Skull",
  svg: <ImageWrapper src={decorSkull} alt="Skull" />,
  vibes: ["Gothic", "Cosmic"],
  layer: 5,
  category: "decoration",
  imageUrl: decorSkull,
};

// ============================================
// BAiO ASSETS (Premium stickers)
// ============================================

const baioSticker1 = "/attached_assets/S11_(1)_1765477102711.webp";
const baioSticker2 = "/attached_assets/S22_1765477102711.webp";
const baioSticker3 = "/attached_assets/S33_1765477102711.webp";
const baioSticker4 = "/attached_assets/S44_(1)_1765477102712.webp";

// Holiday assets
const holidaySock = "/attached_assets/christmas-sock_9155513_1765566311237.png";
const holidayGingerbread = "/attached_assets/gingerbread_9009021_1765566311238.png";
const holidaySantaHat = "/attached_assets/hat_3651870_1765566311238.png";
const holidayCandyCane = "/attached_assets/candy-cane_144348_1765566329629.png";
const holidaySanta = "/attached_assets/xmas_13372285_1765566329630.png";

const bornToBowl: LogoAsset = {
  id: "baio-born-to-bowl",
  name: "Born To Bowl",
  svg: <ImageWrapper src={baioSticker1} alt="Born To Bowl" />,
  vibes: ["Cartoon", "Retro"],
  layer: 3,
  category: "baio",
  imageUrl: baioSticker1,
};

const toBowlOrNot: LogoAsset = {
  id: "baio-to-bowl-or-not",
  name: "To Bowl Or Not",
  svg: <ImageWrapper src={baioSticker2} alt="To Bowl Or Not" />,
  vibes: ["Gothic"],
  layer: 3,
  category: "baio",
  imageUrl: baioSticker2,
};

const inBowlingWeTrust: LogoAsset = {
  id: "baio-in-bowling-we-trust",
  name: "In Bowling We Trust",
  svg: <ImageWrapper src={baioSticker3} alt="In Bowling We Trust" />,
  vibes: ["Cosmic", "Gothic"],
  layer: 3,
  category: "baio",
  imageUrl: baioSticker3,
};

const makeBowlingNotWar: LogoAsset = {
  id: "baio-make-bowling-not-war",
  name: "Make Bowling Not War",
  svg: <ImageWrapper src={baioSticker4} alt="Make Bowling Not War" />,
  vibes: ["Retro", "Cartoon"],
  layer: 3,
  category: "baio",
  imageUrl: baioSticker4,
};

// ============================================
// HOLIDAY ASSETS
// ============================================

const christmasSock: LogoAsset = {
  id: "holiday-christmas-sock",
  name: "Christmas Stocking",
  svg: <ImageWrapper src={holidaySock} alt="Christmas Stocking" />,
  vibes: ["Cartoon", "Retro"],
  layer: 3,
  category: "holidays",
  imageUrl: holidaySock,
};

const gingerbreadMan: LogoAsset = {
  id: "holiday-gingerbread",
  name: "Gingerbread Man",
  svg: <ImageWrapper src={holidayGingerbread} alt="Gingerbread Man" />,
  vibes: ["Cartoon", "Retro"],
  layer: 3,
  category: "holidays",
  imageUrl: holidayGingerbread,
};

const santaHat: LogoAsset = {
  id: "holiday-santa-hat",
  name: "Santa Hat",
  svg: <ImageWrapper src={holidaySantaHat} alt="Santa Hat" />,
  vibes: ["Cartoon", "Retro"],
  layer: 4,
  category: "holidays",
  imageUrl: holidaySantaHat,
};

const candyCane: LogoAsset = {
  id: "holiday-candy-cane",
  name: "Candy Cane",
  svg: <ImageWrapper src={holidayCandyCane} alt="Candy Cane" />,
  vibes: ["Cartoon", "Retro"],
  layer: 3,
  category: "holidays",
  imageUrl: holidayCandyCane,
};

const santaXmas: LogoAsset = {
  id: "holiday-santa",
  name: "Santa Claus",
  svg: <ImageWrapper src={holidaySanta} alt="Santa Claus" />,
  vibes: ["Cartoon", "Retro"],
  layer: 3,
  category: "holidays",
  imageUrl: holidaySanta,
};

// ============================================
// EXPORTED ASSET LIBRARY
// Add new assets to this array
// ============================================

export const logoAssets: LogoAsset[] = [
  // Main elements
  bowlingBall,
  bowlingPins,
  bowlingStrike,
  bowlingBallAlt,
  // Decorations
  arcadeMachine,
  beerMug,
  colaSoda,
  pizzaSlice,
  skullDecor,
  // BAiO Assets
  bornToBowl,
  toBowlOrNot,
  inBowlingWeTrust,
  makeBowlingNotWar,
  // Holiday Assets
  christmasSock,
  gingerbreadMan,
  santaHat,
  candyCane,
  santaXmas,
];

// Helper to get assets by category
export const getAssetsByCategory = (category: LogoAsset["category"]) =>
  logoAssets.filter((a) => a.category === category);

// Helper to get assets by vibe
export const getAssetsByVibe = (vibe: string) =>
  logoAssets.filter((a) => a.vibes.includes(vibe));

// All available vibes
export const VIBES = [
  "Gothic",
  "Retro",
  "Cosmic",
  "Cartoon",
  "Serious League",
] as const;

export type Vibe = (typeof VIBES)[number];
