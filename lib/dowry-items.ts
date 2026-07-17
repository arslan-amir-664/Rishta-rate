export interface DowryItemOption {
  id: string;
  name: string;
  price: number; // in PKR
}

export interface QuantityItem {
  id: string;
  name: string;
  unitPrice: number; // price per unit (e.g. per tola)
  unitLabel: string; // e.g. "tola"
}

// ---------------- FURNITURE ----------------
export const FURNITURE_ITEMS: DowryItemOption[] = [
  { id: 'bedroom-set', name: 'Bedroom Set (Bed, Side Tables, Dressing Table)', price: 150000 },
  { id: 'sofa-set', name: 'Sofa Set (7-Seater)', price: 120000 },
  { id: 'dining-table', name: 'Dining Table Set (6-Seater)', price: 80000 },
  { id: 'almari', name: 'Almari / Wardrobe', price: 60000 },
  { id: 'drawing-room-set', name: 'Drawing Room Set', price: 200000 },
];

// ---------------- ELECTRONICS ----------------
export const LED_TV_ITEMS: DowryItemOption[] = [
  { id: 'led-32', name: 'LED TV 32"', price: 65000 },
  { id: 'led-43', name: 'LED TV 43"', price: 75000 },
  { id: 'led-50', name: 'LED TV 50"', price: 105000 },
  { id: 'led-55', name: 'LED TV 55"', price: 125000 },
  { id: 'led-65', name: 'LED TV 65"', price: 160000 },
  { id: 'led-75', name: 'LED TV 75"', price: 240000 },
];

export const ELECTRONICS_ITEMS: DowryItemOption[] = [
  ...LED_TV_ITEMS,
  { id: 'fridge', name: 'Refrigerator', price: 160000 },
  { id: 'washing-machine', name: 'Washing Machine', price: 90000 },
  { id: 'split-ac', name: 'Split AC (1.5 Ton)', price: 150000 },
  { id: 'microwave', name: 'Microwave Oven', price: 45000 },
];

// ---------------- JEWELRY ----------------
export const GOLD_RATE_PER_TOLA = 280000; // update this constant as gold rate changes

export const JEWELRY_QUANTITY_ITEMS: QuantityItem[] = [
  { id: 'gold', name: 'Gold', unitPrice: GOLD_RATE_PER_TOLA, unitLabel: 'tola' },
];

export const JEWELRY_FIXED_ITEMS: DowryItemOption[] = [
  { id: 'diamond-set', name: 'Diamond Set', price: 500000 },
];

// ---------------- VEHICLE ----------------
export const VEHICLE_ITEMS: DowryItemOption[] = [
  { id: 'suzuki-alto', name: 'Suzuki Alto', price: 3000000 },
  { id: 'suzuki-cultus', name: 'Suzuki Cultus', price: 4500000 },
  { id: 'suzuki-swift', name: 'Suzuki Swift', price: 5150000 },
  { id: 'suzuki-fronx', name: 'Suzuki Fronx', price: 6200000 },
  { id: 'suzuki-every', name: 'Suzuki Every', price: 3400000 },
  { id: 'toyota-yaris', name: 'Toyota Yaris', price: 5400000 },
  { id: 'toyota-corolla-altis', name: 'Toyota Corolla Altis', price: 6800000 },
  { id: 'toyota-corolla-cross-hybrid', name: 'Toyota Corolla Cross Hybrid', price: 10750000 },
  { id: 'toyota-fortuner', name: 'Toyota Fortuner', price: 17250000 },
  { id: 'toyota-hilux', name: 'Toyota Hilux', price: 14500000 },
  { id: 'honda-city', name: 'Honda City', price: 5300000 },
  { id: 'honda-civic', name: 'Honda Civic', price: 9550000 },
  { id: 'honda-brv', name: 'Honda BR-V', price: 6550000 },
  { id: 'honda-hrv', name: 'Honda HR-V', price: 7950000 },
  { id: 'hyundai-tucson', name: 'Hyundai Tucson', price: 11750000 },
  { id: 'hyundai-elantra-hybrid', name: 'Hyundai Elantra Hybrid', price: 10350000 },
  { id: 'hyundai-santafe-hybrid', name: 'Hyundai Santa Fe Hybrid', price: 18500000 },
  { id: 'kia-picanto', name: 'Kia Picanto', price: 4050000 },
  { id: 'kia-stonic', name: 'Kia Stonic', price: 5300000 },
  { id: 'kia-sportage', name: 'Kia Sportage', price: 10750000 },
  { id: 'kia-sorento-hybrid', name: 'Kia Sorento Hybrid', price: 14750000 },
  { id: 'changan-alsvin', name: 'Changan Alsvin', price: 4300000 },
  { id: 'changan-oshan-x7', name: 'Changan Oshan X7', price: 9600000 },
  { id: 'changan-karvaan', name: 'Changan Karvaan', price: 3500000 },
  { id: 'mg-hs', name: 'MG HS', price: 9850000 },
  { id: 'mg-hs-phev', name: 'MG HS PHEV', price: 12000000 },
  { id: 'mg-4-ev', name: 'MG 4 EV', price: 7000000 },
  { id: 'byd-atto3', name: 'BYD Atto 3', price: 9250000 },
  { id: 'byd-seal', name: 'BYD Seal', price: 14000000 },
  { id: 'byd-shark6', name: 'BYD Shark 6', price: 20000000 },
  { id: 'haval-h6-hev', name: 'Haval H6 HEV', price: 12250000 },
  { id: 'haval-jolion-hev', name: 'Haval Jolion HEV', price: 10000000 },
  { id: 'gwm-tank500-hev', name: 'GWM Tank 500 HEV', price: 21000000 },
  { id: 'jetour-dashing', name: 'Jetour Dashing', price: 9000000 },
  { id: 'jetour-t2', name: 'Jetour T2', price: 12800000 },
  { id: 'jac-t9-hunter', name: 'JAC T9 Hunter', price: 11250000 },
  { id: 'isuzu-dmax', name: 'Isuzu D-Max', price: 12000000 },
];

export type CategoryKey = 'furniture' | 'electronics' | 'jewelry' | 'vehicle' | 'cash' | 'property';

export const DOWRY_CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'furniture', label: 'Furniture' },
  { key: 'electronics', label: 'Electronics' },
  { key: 'jewelry', label: 'Jewelry' },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'cash', label: 'Cash' },
  { key: 'property', label: 'Property' },
];