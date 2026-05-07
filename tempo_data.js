/**
 * tempo_data.js — Toronto Tempo card collection data
 *
 * Loaded via <script> tag BEFORE tracker.jsx so TEMPO_ALL_CARDS and
 * TEMPO_ROSTER are globals available to the tracker.
 *
 * Card structure mirrors TB's ALL_CARDS exactly, with one extra field:
 *   { id, year, product, cardNumber, cardSet, player, ... }
 *
 *   - id: positional, stable, 1-indexed. Test card stays at id=1 forever.
 *   - cardSet: variant name (matches TB convention — "Base", "Refractor", etc.)
 *   - player: lowercase last-name slug ('rice', 'sabally', 'mabrey', etc.)
 *
 * IMPORTANT — same rule as TB:
 *   The test card at id=1 must NEVER be removed from this array.
 *   Removing it shifts all positional IDs by -1 and corrupts cardDetails
 *   keyed by ID in tempo-alldata-v1.
 */

// ─── ROSTER ────────────────────────────────────────────────────────────────
// Single source of truth for player display + active-roster filtering.
// Toggling `active: false` removes a player from the sidebar/stats but
// preserves their stored card data — flip back any time.
window.TEMPO_ROSTER = {
  // 2026 active roster
  rice:      { name: "Kiki Rice",         number: 1,  position: "G",   active: true,  role: "player" },
  juskaite:  { name: "Laura Juskaite",    number: 2,  position: "F",   active: true,  role: "player" },
  mabrey:    { name: "Marina Mabrey",     number: 3,  position: "G",   active: true,  role: "player" },
  key:       { name: "Teonni Key",        number: 7,  position: "F",   active: true,  role: "player" },
  sabally:   { name: "Nyara Sabally",     number: 8,  position: "F",   active: true,  role: "player" },
  conde:     { name: "Maria Conde",       number: 10, position: "F",   active: true,  role: "player" },
  nurse:     { name: "Kia Nurse",         number: 11, position: "G",   active: true,  role: "player" },
  held:      { name: "Lexi Held",         number: 12, position: "G",   active: true,  role: "player" },
  nye:       { name: "Aaliyah Nye",       number: 13, position: "G-F", active: true,  role: "player" },
  fagbenle:  { name: "Temi Fagbenle",     number: 14, position: "C",   active: true,  role: "player" },
  sykes:     { name: "Brittney Sykes",    number: 20, position: "G",   active: true,  role: "player" },
  harrison:  { name: "Isabelle Harrison", number: 21, position: "F",   active: true,  role: "player" },
  allemand:  { name: "Julie Allemand",    number: 22, position: "G",   active: true,  role: "player" },
  milic:     { name: "Nikolina Milic",    number: 31, position: "C",   active: true,  role: "player" },
  laksa:     { name: "Kitija Laksa",      number: 33, position: "G",   active: true,  role: "player" },
  // Coaching staff with cards
  brondello: { name: "Sandy Brondello",   active: true,  role: "coach", title: "Head Coach" },
  // Inactive (data on disk but not on current roster)
  wallace:   { name: "Lexi Wallace",      active: false, role: "player" },
  wright:    { name: "Hannah Wright",     active: false, role: "player" }
};

// Helper: list of active player slugs in roster order, with coaches at end
window.TEMPO_ACTIVE_PLAYERS = (function () {
  var entries = Object.keys(window.TEMPO_ROSTER).map(function (k) {
    return Object.assign({ slug: k }, window.TEMPO_ROSTER[k]);
  });
  return entries
    .filter(function (e) { return e.active; })
    .sort(function (a, b) {
      // Players first (by jersey number), coaches at end
      if (a.role === "coach" && b.role !== "coach") return 1;
      if (b.role === "coach" && a.role !== "coach") return -1;
      return (a.number || 999) - (b.number || 999);
    });
})();

// ─── CARD DATA ─────────────────────────────────────────────────────────────
// Source: hand-entered from TCDB by user (Saturday morning Apr 26 2026).
// 2090 real cards across 14 players.
// Test card at id=1 — DO NOT REMOVE — used to verify storage round-trips.
// Note: source `printRun` is emitted as `copies` (string) to match what TB
// tracker code reads when displaying /N print run indicators.
window.TEMPO_ALL_CARDS = [
  {
    id: 1,
    year: 2099,
    product: "TEST SET — DO NOT DELETE",
    cardNumber: "TEST-1",
    cardSet: "Test Variant",
    player: "__test__",
    isTestCard: true
  },
  {
    id: 2,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Base",
    player: "mabrey",
    team: "Dallas Wings",
    isRookie: true
  },
  {
    id: 3,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms 25th Anniversary",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "25"
  },
  {
    id: 4,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms Black",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "1"
  },
  {
    id: 5,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms Black Gold",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "5"
  },
  {
    id: 6,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms Blue",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "149"
  },
  {
    id: 7,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms Gold",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "10"
  },
  {
    id: 8,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms Green",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 9,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms Green Ice",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 10,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms Green Pulsar",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "25"
  },
  {
    id: 11,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms Hyper",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 12,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms Ice",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 13,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms Mojo",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "25"
  },
  {
    id: 14,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms Mosaic",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "3"
  },
  {
    id: 15,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms Orange",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "50"
  },
  {
    id: 16,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms Purple",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "99"
  },
  {
    id: 17,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms Red",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "299"
  },
  {
    id: 18,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms Ruby Wave",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 19,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms Silver",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 20,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Prizms White Sparkle",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 21,
    year: 2021,
    product: "Panini Prizm WNBA Premium",
    cardNumber: "15",
    cardSet: "Base",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "99"
  },
  {
    id: 22,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Base",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 23,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Black Gold",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "5"
  },
  {
    id: 24,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Blue",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "149"
  },
  {
    id: 25,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Gold",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "10"
  },
  {
    id: 26,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Gold Vinyl",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "1"
  },
  {
    id: 27,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Green",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 28,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Green Ice",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 29,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Green Pulsar",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "25"
  },
  {
    id: 30,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Hyper",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 31,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Ice",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 32,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Mojo",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "25"
  },
  {
    id: 33,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Mosaic",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "3"
  },
  {
    id: 34,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Orange",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "49"
  },
  {
    id: 35,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Premium Box Set",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "99"
  },
  {
    id: 36,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Purple",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "99"
  },
  {
    id: 37,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Red",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "199"
  },
  {
    id: 38,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Ruby Wave",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 39,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "Silver",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 40,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "90",
    cardSet: "White Sparkle",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 41,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "15",
    cardSet: "Base",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 42,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "15",
    cardSet: "Astro",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 43,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "15",
    cardSet: "Cosmic",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "99"
  },
  {
    id: 44,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "15",
    cardSet: "Cubic",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "50"
  },
  {
    id: 45,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "15",
    cardSet: "Fractal",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 46,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "15",
    cardSet: "Galactic",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 47,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "15",
    cardSet: "Groove",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 48,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "15",
    cardSet: "Impact",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "149"
  },
  {
    id: 49,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "15",
    cardSet: "Lava",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "10"
  },
  {
    id: 50,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "15",
    cardSet: "Sunburst",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "75"
  },
  {
    id: 51,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "22",
    cardSet: "Shock Wave",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 52,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "22",
    cardSet: "Shock Wave Cubic",
    player: "mabrey",
    team: "Dallas Wings",
    copies: "50"
  },
  {
    id: 53,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "22",
    cardSet: "Shock Wave Fractal",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 54,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "22",
    cardSet: "Shock Wave Galactic",
    player: "mabrey",
    team: "Dallas Wings"
  },
  {
    id: 55,
    year: 2023,
    product: "Chicago Sky",
    cardNumber: "NNO",
    cardSet: "Base",
    player: "mabrey",
    team: "Chicago Sky"
  },
  {
    id: 56,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "12",
    cardSet: "Splitting Image",
    player: "mabrey",
    team: "Chicago Sky"
  },
  {
    id: 57,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "12",
    cardSet: "Splitting Image Black",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "1"
  },
  {
    id: 58,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "12",
    cardSet: "Splitting Image Gold",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "10"
  },
  {
    id: 59,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "66",
    cardSet: "Base",
    player: "mabrey",
    team: "Chicago Sky"
  },
  {
    id: 60,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "66",
    cardSet: "Black",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "1"
  },
  {
    id: 61,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "66",
    cardSet: "Blue",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "75"
  },
  {
    id: 62,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "66",
    cardSet: "Gold",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "10"
  },
  {
    id: 63,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "66",
    cardSet: "Rainbow",
    player: "mabrey",
    team: "Chicago Sky"
  },
  {
    id: 64,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "66",
    cardSet: "Red",
    player: "mabrey",
    team: "Chicago Sky"
  },
  {
    id: 65,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "66",
    cardSet: "Teal",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "35"
  },
  {
    id: 66,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Base",
    player: "mabrey",
    team: "Chicago Sky"
  },
  {
    id: 67,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Black Gold Prizms",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "5"
  },
  {
    id: 68,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Blue",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "175"
  },
  {
    id: 69,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Blue Wave",
    player: "mabrey",
    team: "Chicago Sky"
  },
  {
    id: 70,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Gold",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "10"
  },
  {
    id: 71,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Gold Vinyl",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "1"
  },
  {
    id: 72,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Green",
    player: "mabrey",
    team: "Chicago Sky"
  },
  {
    id: 73,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Green Pulsar",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "25"
  },
  {
    id: 74,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Hyper",
    player: "mabrey",
    team: "Chicago Sky"
  },
  {
    id: 75,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Ice",
    player: "mabrey",
    team: "Chicago Sky"
  },
  {
    id: 76,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Mojo",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "25"
  },
  {
    id: 77,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Mosaic",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "3"
  },
  {
    id: 78,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Orange",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "99"
  },
  {
    id: 79,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Premium Box Set Prizms",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "99"
  },
  {
    id: 80,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Purple",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "149"
  },
  {
    id: 81,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Red",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "199"
  },
  {
    id: 82,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Ruby Wave",
    player: "mabrey",
    team: "Chicago Sky"
  },
  {
    id: 83,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Silver",
    player: "mabrey",
    team: "Chicago Sky"
  },
  {
    id: 84,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "Teal",
    player: "mabrey",
    team: "Chicago Sky",
    copies: "49"
  },
  {
    id: 85,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "124",
    cardSet: "White Sparkle Prizms",
    player: "mabrey",
    team: "Chicago Sky"
  },
  {
    id: 86,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "26",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 87,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "26",
    cardSet: "Blue Viper",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 88,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "26",
    cardSet: "Jaguar",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 89,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "26",
    cardSet: "Jungle",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 90,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "26",
    cardSet: "White Tiger",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "5"
  },
  {
    id: 91,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "177",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "65"
  },
  {
    id: 92,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "177",
    cardSet: "Blue Viper",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 93,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "177",
    cardSet: "Jaguar",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 94,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "177",
    cardSet: "Jungle",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 95,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "177",
    cardSet: "White Tiger",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "5"
  },
  {
    id: 96,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "208",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "64"
  },
  {
    id: 97,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "208",
    cardSet: "Blue Viper",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 98,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "208",
    cardSet: "Jaguar",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 99,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "208",
    cardSet: "Jungle",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 100,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "208",
    cardSet: "White Tiger",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "5"
  },
  {
    id: 101,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "231",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 102,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "231",
    cardSet: "Blue Viper",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 103,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "231",
    cardSet: "Jaguar",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 104,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "231",
    cardSet: "Jungle",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 105,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "231",
    cardSet: "White Tiger",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "5"
  },
  {
    id: 106,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "237",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "69"
  },
  {
    id: 107,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "237",
    cardSet: "Blue Viper",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 108,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "237",
    cardSet: "Jaguar",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 109,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "237",
    cardSet: "Jungle",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 110,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "237",
    cardSet: "White Tiger",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "5"
  },
  {
    id: 111,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "241",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "73"
  },
  {
    id: 112,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "241",
    cardSet: "Blue Viper",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 113,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "241",
    cardSet: "Jaguar",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 114,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "241",
    cardSet: "Jungle",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 115,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "241",
    cardSet: "White Tiger",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "5"
  },
  {
    id: 116,
    year: 2024,
    product: "Panini Instant WNBA The Logo",
    cardNumber: "TL-19",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "2832"
  },
  {
    id: 117,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "85",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 118,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "85",
    cardSet: "Black",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 119,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "85",
    cardSet: "Blue",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "75"
  },
  {
    id: 120,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "85",
    cardSet: "Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 121,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "85",
    cardSet: "Purple",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 122,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "85",
    cardSet: "Red",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 123,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "85",
    cardSet: "Swirl",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 124,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "85",
    cardSet: "Teal",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "49"
  },
  {
    id: 125,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 126,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Black Gold Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "5"
  },
  {
    id: 127,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Black Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 128,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Blue Millionaire Shimmer Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 129,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Boardwalk Blue Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "15"
  },
  {
    id: 130,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Brown Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "249"
  },
  {
    id: 131,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Classic Icons Red Prizm",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 132,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Deal Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 133,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Dice Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 134,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Free Parking Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 135,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Go Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 136,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Gold Millionaire Shimmer Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "500"
  },
  {
    id: 137,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Gold Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "49"
  },
  {
    id: 138,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Gold Wave Millionaire Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 139,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Green Millionaire Shimmer Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "20"
  },
  {
    id: 140,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Green Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "24"
  },
  {
    id: 141,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Light Blue Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "199"
  },
  {
    id: 142,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Monopoly Man Black and White Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 143,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Neon Green Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 144,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Orange Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "124"
  },
  {
    id: 145,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Pink Millionaire Shimmer Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "5"
  },
  {
    id: 146,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Pink Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "149"
  },
  {
    id: 147,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Purple Millionaire Shimmer Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "50"
  },
  {
    id: 148,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Purple Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 149,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Question Mark Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 150,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Red Millionaire Shimmer Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "100"
  },
  {
    id: 151,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Red Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 152,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Silver Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 153,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "Tiger Stripe Boardwalk Blue Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 154,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "29",
    cardSet: "White Millionaire Shimmer Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 155,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "8",
    cardSet: "Top Tier",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 156,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "8",
    cardSet: "Top Tier Prizms Blue",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "49"
  },
  {
    id: 157,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "8",
    cardSet: "Top Tier Prizms Blue Pulsar",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "199"
  },
  {
    id: 158,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "8",
    cardSet: "Top Tier Prizms Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 159,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "8",
    cardSet: "Top Tier Prizms Gold Vinyl",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 160,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "8",
    cardSet: "Top Tier Prizms Green",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 161,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "8",
    cardSet: "Top Tier Prizms Green Pulsar",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 162,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "8",
    cardSet: "Top Tier Prizms Mojo",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 163,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "8",
    cardSet: "Top Tier Prizms Orange Pulsar",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "75"
  },
  {
    id: 164,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "8",
    cardSet: "Top Tier Prizms Red",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 165,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Fearless",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 166,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Fearless Prizms Blue",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "49"
  },
  {
    id: 167,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Fearless Prizms Blue Pulsar",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "199"
  },
  {
    id: 168,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Fearless Prizms Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 169,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Fearless Prizms Gold Vinyl",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 170,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Fearless Prizms Green",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 171,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Fearless Prizms Green Pulsar",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "75"
  },
  {
    id: 172,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Fearless Prizms Mojo",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 173,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Fearless Prizms Orange Pulsar",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "75"
  },
  {
    id: 174,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Fearless Prizms Red",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 175,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 176,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Black Finite Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 177,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Black Gold Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "5"
  },
  {
    id: 178,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Black Velocity Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "39"
  },
  {
    id: 179,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Blue Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "199"
  },
  {
    id: 180,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Blue Pulsar Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "199"
  },
  {
    id: 181,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Blue Velocity Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 182,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Checkerboard Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 183,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Cherry Blossom FOTL Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "20"
  },
  {
    id: 184,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Gold Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 185,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Gold Vinyl Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 186,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Green Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 187,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Green Pulsar Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 188,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Ice Gold Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 189,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Ice Orange Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 190,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Ice Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 191,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Ice White Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "35"
  },
  {
    id: 192,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Lotus Flower FOTL Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "3"
  },
  {
    id: 193,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Mojo Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 194,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Mosaic Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "3"
  },
  {
    id: 195,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Orange Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 196,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Orange Velocity Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 197,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Pink Velocity Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "79"
  },
  {
    id: 198,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Premium Box Set Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 199,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Pulsar Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "499"
  },
  {
    id: 200,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Purple Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "149"
  },
  {
    id: 201,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Red Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "299"
  },
  {
    id: 202,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Red Pulsar Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "299"
  },
  {
    id: 203,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Silver Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 204,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Snakeskin Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 205,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "Teal Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "49"
  },
  {
    id: 206,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "WNBA Logo Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 207,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "132",
    cardSet: "White Sparkle Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 208,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-MM",
    cardSet: "Signatures",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true
  },
  {
    id: 209,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-MM",
    cardSet: "Signatures Prizms Blue",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true,
    copies: "75"
  },
  {
    id: 210,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-MM",
    cardSet: "Signatures Prizms Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true,
    copies: "10"
  },
  {
    id: 211,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-MM",
    cardSet: "Signatures Prizms Gold Vinyl",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true,
    copies: "1"
  },
  {
    id: 212,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-MM",
    cardSet: "Signatures Prizms Green",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true
  },
  {
    id: 213,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-MM",
    cardSet: "Signatures Prizms Green Pulsar",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true,
    copies: "25"
  },
  {
    id: 214,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-MM",
    cardSet: "Signatures Prizms Mojo",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true,
    copies: "25"
  },
  {
    id: 215,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-MM",
    cardSet: "Signatures Prizms Purple",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true,
    copies: "49"
  },
  {
    id: 216,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-MM",
    cardSet: "Signatures Prizms Red",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true,
    copies: "99"
  },
  {
    id: 217,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-MM",
    cardSet: "Signatures Prizms Teal",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true,
    copies: "35"
  },
  {
    id: 218,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-MM",
    cardSet: "Signatures Prizms White Sparkle",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true,
    copies: "1"
  },
  {
    id: 219,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "9",
    cardSet: "En Fuego",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 220,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "9",
    cardSet: "En Fuego Prizms Black Finite",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 221,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "9",
    cardSet: "En Fuego Prizms Black Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "5"
  },
  {
    id: 222,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "9",
    cardSet: "En Fuego Prizms Black Pandora",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "8"
  },
  {
    id: 223,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "9",
    cardSet: "En Fuego Prizms Blue",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "49"
  },
  {
    id: 224,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "9",
    cardSet: "En Fuego Prizms Blue Flash",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 225,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "9",
    cardSet: "En Fuego Prizms Flash",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 226,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "9",
    cardSet: "En Fuego Prizms Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 227,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "9",
    cardSet: "En Fuego Prizms Gold Flash",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 228,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "9",
    cardSet: "En Fuego Prizms Gold Vinyl",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 229,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "9",
    cardSet: "En Fuego Prizms Silver",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 230,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "9",
    cardSet: "En Fuego Prizms Tie-Dye",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 231,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "9",
    cardSet: "En Fuego Prizms White Disco",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "75"
  },
  {
    id: 232,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 233,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Black Finite",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 234,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Black Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "5"
  },
  {
    id: 235,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Bronze Checker",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "49"
  },
  {
    id: 236,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 237,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Gold Flash",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 238,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Gold Vinyl",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 239,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Green Ice",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 240,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Ice Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 241,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Light Blue Disco",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "125"
  },
  {
    id: 242,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Neon Green",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "75"
  },
  {
    id: 243,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Pink Ice",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 244,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Pink Shimmer FOTL",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "3"
  },
  {
    id: 245,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Pink and Purple",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 246,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Purple Ice",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "149"
  },
  {
    id: 247,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Red",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "149"
  },
  {
    id: 248,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Red Ice",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 249,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Red and Blue",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "399"
  },
  {
    id: 250,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Silver",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 251,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Silver Flash",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 252,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Tie-Dye",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 253,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Tiger",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 254,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms White",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 255,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "95",
    cardSet: "Prizms Zebra",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 256,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 257,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Black Finite",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 258,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Black Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "5"
  },
  {
    id: 259,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Bronze Checker",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "49"
  },
  {
    id: 260,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 261,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Gold Flash",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 262,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Gold Vinyl",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 263,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Green Ice",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 264,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Ice Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 265,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Neon Green",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "75"
  },
  {
    id: 266,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Orange",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "125"
  },
  {
    id: 267,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Pink Ice",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 268,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Pink Shimmer FOTL",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "3"
  },
  {
    id: 269,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Pink and Purple",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 270,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Purple",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "149"
  },
  {
    id: 271,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Purple Ice",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "149"
  },
  {
    id: 272,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Red Ice",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 273,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Red and Blue",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "399"
  },
  {
    id: 274,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Silver",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 275,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Silver Flash",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 276,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Tie-Dye",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 277,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Tiger",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 278,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms White",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 279,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "190",
    cardSet: "Prizms Zebra",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 280,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "229",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 281,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "229",
    cardSet: "Prizms Black Finite",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 282,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "229",
    cardSet: "Prizms Black Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "5"
  },
  {
    id: 283,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "229",
    cardSet: "Prizms Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 284,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "229",
    cardSet: "Prizms Gold Flash",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 285,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "229",
    cardSet: "Prizms Gold Vinyl",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 286,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "229",
    cardSet: "Prizms Green Ice",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 287,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "229",
    cardSet: "Prizms Ice Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 288,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "229",
    cardSet: "Prizms Pink Ice",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 289,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "229",
    cardSet: "Prizms Pink Shimmer FOTL",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "3"
  },
  {
    id: 290,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "229",
    cardSet: "Prizms Purple Ice",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "149"
  },
  {
    id: 291,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "229",
    cardSet: "Prizms Red Ice",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 292,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "229",
    cardSet: "Prizms Silver",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 293,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "229",
    cardSet: "Prizms Silver Flash",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 294,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "229",
    cardSet: "Prizms Tie-Dye",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 295,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "229",
    cardSet: "Prizms Tiger",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 296,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "229",
    cardSet: "Prizms Zebra",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 297,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "2",
    cardSet: "Road To The Finals Second Round",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "199"
  },
  {
    id: 298,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 299,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Artist Proof",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 300,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Black Gold Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "5"
  },
  {
    id: 301,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Black Holo Press Proof",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 302,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Black Shimmer",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 303,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Blue Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "49"
  },
  {
    id: 304,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Blue Shimmer",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "49"
  },
  {
    id: 305,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Crunch Time",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 306,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Crunch Time Diamond",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 307,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Crunch Time Green Fireworks",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "399"
  },
  {
    id: 308,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Crunch Time Holo",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 309,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Crunch Time Holo Black Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 310,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Crunch Time Holo Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 311,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Crunch Time Orange Fireworks",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "75"
  },
  {
    id: 312,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Crunch Time Orange Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "399"
  },
  {
    id: 313,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Crunch Time Pink Fireworks",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 314,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Crunch Time Press Proof",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 315,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Crunch Time Press Proof Blue",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 316,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Crunch Time Press Proof Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 317,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Crunch Time Press Proof Purple",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 318,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Crunch Time Purple Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "49"
  },
  {
    id: 319,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Crunch Time Red Holo Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 320,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Cubic",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 321,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Dragon",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 322,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Gold Shimmer",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 323,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Green Laser",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 324,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Green Shimmer",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 325,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Holo",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 326,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Holo Black Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 327,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Holo Gold Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 328,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Holo Team Logo",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "13"
  },
  {
    id: 329,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Holo WNBA Logo",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 330,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Lava",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 331,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Light Blue Lava",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "75"
  },
  {
    id: 332,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Orange Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "199"
  },
  {
    id: 333,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Orange Lava",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "199"
  },
  {
    id: 334,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Pink Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 335,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Pink Shimmer",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 336,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Purple Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 337,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Purple Lava",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 338,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Purple Shimmer",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 339,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Red Holo",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "299"
  },
  {
    id: 340,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Red Lava",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "399"
  },
  {
    id: 341,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Red Shimmer",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "399"
  },
  {
    id: 342,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Teal Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "125"
  },
  {
    id: 343,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "13",
    cardSet: "Yellow Lava",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "5"
  },
  {
    id: 344,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "70",
    cardSet: "Jersey Series",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 345,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "70",
    cardSet: "Jersey Series Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 346,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "70",
    cardSet: "Jersey Series Green",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "30"
  },
  {
    id: 347,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "70",
    cardSet: "Jersey Series Holo Platinum Blue",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 348,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "70",
    cardSet: "Jersey Series Prime",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 349,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "70",
    cardSet: "Jersey Series Red",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 350,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-MM",
    cardSet: "Signature Series",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true
  },
  {
    id: 351,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-MM",
    cardSet: "Signature Series Black Gold Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true,
    copies: "5"
  },
  {
    id: 352,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-MM",
    cardSet: "Signature Series Blue Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true,
    copies: "25"
  },
  {
    id: 353,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-MM",
    cardSet: "Signature Series Gold Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true,
    copies: "10"
  },
  {
    id: 354,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-MM",
    cardSet: "Signature Series Holo Black Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true,
    copies: "1"
  },
  {
    id: 355,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-MM",
    cardSet: "Signature Series Holo Frame",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true,
    copies: "49"
  },
  {
    id: 356,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-MM",
    cardSet: "Signature Series Holo Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true
  },
  {
    id: 357,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-MM",
    cardSet: "Signature Series Lava",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true
  },
  {
    id: 358,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-MM",
    cardSet: "Signature Series Orange Laser",
    player: "mabrey",
    team: "Connecticut Sun",
    isAuto: true,
    copies: "15"
  },
  {
    id: 359,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "44",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "75"
  },
  {
    id: 360,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "44",
    cardSet: "Amethyst",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "8"
  },
  {
    id: 361,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "44",
    cardSet: "Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 362,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "44",
    cardSet: "Holo Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 363,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "44",
    cardSet: "Holo Silver",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "15"
  },
  {
    id: 364,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "44",
    cardSet: "Platinum",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 365,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "44",
    cardSet: "Silver",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "40"
  },
  {
    id: 366,
    year: 2025,
    product: "Panini Instant WNBA",
    cardNumber: "49",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "54"
  },
  {
    id: 367,
    year: 2025,
    product: "Panini Instant WNBA",
    cardNumber: "193",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 368,
    year: 2025,
    product: "Panini Instant WNBA",
    cardNumber: "208",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 369,
    year: 2025,
    product: "Panini Instant WNBA",
    cardNumber: "277",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "69"
  },
  {
    id: 370,
    year: 2025,
    product: "Panini Instant WNBA Supernova",
    cardNumber: "SN-22",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "3655"
  },
  {
    id: 371,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "87",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 372,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "87",
    cardSet: "Holo Emerald",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "5"
  },
  {
    id: 373,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "87",
    cardSet: "Holo Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 374,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "87",
    cardSet: "Holo Platinum Blue",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 375,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "87",
    cardSet: "Pink",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "6"
  },
  {
    id: 376,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "87",
    cardSet: "Purple",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 377,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 378,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Black Finite Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 379,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Black Velocity Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "39"
  },
  {
    id: 380,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Blue Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "199"
  },
  {
    id: 381,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Blue Pulsar Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "199"
  },
  {
    id: 382,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Blue Velocity Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 383,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Carolina Blue Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "125"
  },
  {
    id: 384,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Checkerboard Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 385,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Cherry Blossoms Prizms FOTL",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "20"
  },
  {
    id: 386,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Gold Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 387,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Gold Vinyl Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 388,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Green Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 389,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Green Pulsar Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 390,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Ice Orange Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 391,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Ice Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 392,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Lime Green Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "225"
  },
  {
    id: 393,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Lotus Flower Prizms FOTL",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "3"
  },
  {
    id: 394,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Mojo Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 395,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Mosaic Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "3"
  },
  {
    id: 396,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Orange Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 397,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Pandora Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 398,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Pink Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "175"
  },
  {
    id: 399,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Pink Velocity Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "79"
  },
  {
    id: 400,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Purple Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "149"
  },
  {
    id: 401,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Purple Velocity Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "59"
  },
  {
    id: 402,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Red Pandora Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "199"
  },
  {
    id: 403,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Red Power Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "75"
  },
  {
    id: 404,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Red Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "299"
  },
  {
    id: 405,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Red Pulsar Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "299"
  },
  {
    id: 406,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Silver Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 407,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Snakeskin Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 408,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Swirl Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 409,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "Teal Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "49"
  },
  {
    id: 410,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "WNBA Logo Gold Prizms",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 411,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "WNBA Logo Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 412,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "18",
    cardSet: "White Seismic Prizms",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 413,
    year: 2025,
    product: "Panini WNBA Player of the Day",
    cardNumber: "38",
    cardSet: "Base",
    player: "mabrey",
    team: "Connecticut Sun"
  },
  {
    id: 414,
    year: 2025,
    product: "Panini WNBA Player of the Day",
    cardNumber: "38",
    cardSet: "Black",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "1"
  },
  {
    id: 415,
    year: 2025,
    product: "Panini WNBA Player of the Day",
    cardNumber: "38",
    cardSet: "Blue",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "50"
  },
  {
    id: 416,
    year: 2025,
    product: "Panini WNBA Player of the Day",
    cardNumber: "38",
    cardSet: "Gold",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "10"
  },
  {
    id: 417,
    year: 2025,
    product: "Panini WNBA Player of the Day",
    cardNumber: "38",
    cardSet: "Green",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "5"
  },
  {
    id: 418,
    year: 2025,
    product: "Panini WNBA Player of the Day",
    cardNumber: "38",
    cardSet: "Orange",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "199"
  },
  {
    id: 419,
    year: 2025,
    product: "Panini WNBA Player of the Day",
    cardNumber: "38",
    cardSet: "Purple",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "25"
  },
  {
    id: 420,
    year: 2025,
    product: "Panini WNBA Player of the Day",
    cardNumber: "38",
    cardSet: "Red",
    player: "mabrey",
    team: "Connecticut Sun",
    copies: "99"
  },
  {
    id: 421,
    year: 2017,
    product: "Rittenhouse WNBA",
    cardNumber: "2",
    cardSet: "Base",
    player: "sykes",
    team: "Atlanta Dream",
    isRookie: true,
    copies: "500"
  },
  {
    id: 422,
    year: 2018,
    product: "Rittenhouse WNBA",
    cardNumber: "2",
    cardSet: "Base",
    player: "sykes",
    team: "Atlanta Dream"
  },
  {
    id: 423,
    year: 2018,
    product: "Rittenhouse WNBA",
    cardNumber: "2",
    cardSet: "Platinum",
    player: "sykes",
    team: "Atlanta Dream",
    copies: "25"
  },
  {
    id: 424,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "11",
    cardSet: "Base",
    player: "sykes",
    team: "Atlanta Dream"
  },
  {
    id: 425,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "11",
    cardSet: "Black Laser Press Proof",
    player: "sykes",
    team: "Atlanta Dream",
    copies: "1"
  },
  {
    id: 426,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "11",
    cardSet: "Gold Laser Press Proof",
    player: "sykes",
    team: "Atlanta Dream",
    copies: "10"
  },
  {
    id: 427,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "11",
    cardSet: "Optic",
    player: "sykes",
    team: "Atlanta Dream"
  },
  {
    id: 428,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "11",
    cardSet: "Optic Gold",
    player: "sykes",
    team: "Atlanta Dream",
    copies: "10"
  },
  {
    id: 429,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "11",
    cardSet: "Optic Gold Vinyl",
    player: "sykes",
    team: "Atlanta Dream",
    copies: "1"
  },
  {
    id: 430,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "11",
    cardSet: "Optic Holo",
    player: "sykes",
    team: "Atlanta Dream"
  },
  {
    id: 431,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "11",
    cardSet: "Purple Press Proof",
    player: "sykes",
    team: "Atlanta Dream",
    copies: "99"
  },
  {
    id: 432,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "11",
    cardSet: "Silver Press Proof",
    player: "sykes",
    team: "Atlanta Dream",
    copies: "199"
  },
  {
    id: 433,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "42",
    cardSet: "Base",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 434,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "42",
    cardSet: "Black",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "1"
  },
  {
    id: 435,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "42",
    cardSet: "Black Gold",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "5"
  },
  {
    id: 436,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "42",
    cardSet: "Blue",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "149"
  },
  {
    id: 437,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "42",
    cardSet: "Gold",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "10"
  },
  {
    id: 438,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "42",
    cardSet: "Green",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 439,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "42",
    cardSet: "Green Ice",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 440,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "42",
    cardSet: "Green Pulsar",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "25"
  },
  {
    id: 441,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "42",
    cardSet: "Hyper",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 442,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "42",
    cardSet: "Ice",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 443,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "42",
    cardSet: "Mojo",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "25"
  },
  {
    id: 444,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "42",
    cardSet: "Orange",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "65"
  },
  {
    id: 445,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "42",
    cardSet: "Purple",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "125"
  },
  {
    id: 446,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "42",
    cardSet: "Red",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "275"
  },
  {
    id: 447,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "42",
    cardSet: "Ruby Wave",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 448,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "42",
    cardSet: "Scope",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "99"
  },
  {
    id: 449,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "42",
    cardSet: "Silver",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 450,
    year: 2020,
    product: "Panini Prizm WNBA Premium",
    cardNumber: "42",
    cardSet: "Base",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "99"
  },
  {
    id: 451,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Base",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 452,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms 25th Anniversary",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "25"
  },
  {
    id: 453,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms Black",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "1"
  },
  {
    id: 454,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms Black Gold",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "5"
  },
  {
    id: 455,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms Blue",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "149"
  },
  {
    id: 456,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms Gold",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "10"
  },
  {
    id: 457,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms Green",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 458,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms Green Ice",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 459,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms Green Pulsar",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "25"
  },
  {
    id: 460,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms Hyper",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 461,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms Ice",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 462,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms Mojo",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "25"
  },
  {
    id: 463,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms Mosaic",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "3"
  },
  {
    id: 464,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms Orange",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "50"
  },
  {
    id: 465,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms Purple",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "99"
  },
  {
    id: 466,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms Red",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "299"
  },
  {
    id: 467,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms Ruby Wave",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 468,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms Silver",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 469,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Prizms White Sparkle",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 470,
    year: 2021,
    product: "Panini Prizm WNBA Premium",
    cardNumber: "68",
    cardSet: "Base",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "99"
  },
  {
    id: 471,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Base",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 472,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Black Gold",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "5"
  },
  {
    id: 473,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Blue",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "149"
  },
  {
    id: 474,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Gold",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "10"
  },
  {
    id: 475,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Gold Vinyl",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "1"
  },
  {
    id: 476,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Green",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 477,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Green Ice",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 478,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Green Pulsar",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "25"
  },
  {
    id: 479,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Hyper",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 480,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Ice",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 481,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Mojo",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "25"
  },
  {
    id: 482,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Mosaic",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "3"
  },
  {
    id: 483,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Orange",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "49"
  },
  {
    id: 484,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Premium Box Set",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "99"
  },
  {
    id: 485,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Purple",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "99"
  },
  {
    id: 486,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Red",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "199"
  },
  {
    id: 487,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Ruby Wave",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 488,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "Silver",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 489,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "151",
    cardSet: "White Sparkle",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 490,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "26",
    cardSet: "Base",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 491,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "26",
    cardSet: "Astro",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 492,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "26",
    cardSet: "Cosmic",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "99"
  },
  {
    id: 493,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "26",
    cardSet: "Cubic",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "50"
  },
  {
    id: 494,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "26",
    cardSet: "Fractal",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 495,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "26",
    cardSet: "Galactic",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 496,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "26",
    cardSet: "Groove",
    player: "sykes",
    team: "Los Angeles Sparks"
  },
  {
    id: 497,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "26",
    cardSet: "Impact",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "149"
  },
  {
    id: 498,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "26",
    cardSet: "Lava",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "10"
  },
  {
    id: 499,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "26",
    cardSet: "Sunburst",
    player: "sykes",
    team: "Los Angeles Sparks",
    copies: "75"
  },
  {
    id: 500,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "30",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 501,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "30",
    cardSet: "Black",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 502,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "30",
    cardSet: "Blue",
    player: "sykes",
    team: "Washington Mystics",
    copies: "75"
  },
  {
    id: 503,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "30",
    cardSet: "Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 504,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "30",
    cardSet: "Rainbow",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 505,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "30",
    cardSet: "Red",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 506,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "30",
    cardSet: "Teal",
    player: "sykes",
    team: "Washington Mystics",
    copies: "35"
  },
  {
    id: 507,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 508,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Black Gold Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "5"
  },
  {
    id: 509,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Blue",
    player: "sykes",
    team: "Washington Mystics",
    copies: "175"
  },
  {
    id: 510,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Blue Wave",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 511,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 512,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Gold Vinyl",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 513,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Green",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 514,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Green Pulsar",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 515,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Hyper",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 516,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Ice",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 517,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Mojo",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 518,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Mosaic",
    player: "sykes",
    team: "Washington Mystics",
    copies: "3"
  },
  {
    id: 519,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Orange",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 520,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Premium Box Set Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 521,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Purple",
    player: "sykes",
    team: "Washington Mystics",
    copies: "149"
  },
  {
    id: 522,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Red",
    player: "sykes",
    team: "Washington Mystics",
    copies: "199"
  },
  {
    id: 523,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Ruby Wave",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 524,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Silver",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 525,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "Teal",
    player: "sykes",
    team: "Washington Mystics",
    copies: "49"
  },
  {
    id: 526,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "67",
    cardSet: "White Sparkle Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 527,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "60",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 528,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "60",
    cardSet: "Blue Viper",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 529,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "60",
    cardSet: "Jaguar",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 530,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "60",
    cardSet: "Jungle",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 531,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "60",
    cardSet: "White Tiger",
    player: "sykes",
    team: "Washington Mystics",
    copies: "5"
  },
  {
    id: 532,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "178",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics",
    copies: "59"
  },
  {
    id: 533,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "178",
    cardSet: "Blue Viper",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 534,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "178",
    cardSet: "Jaguar",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 535,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "178",
    cardSet: "Jungle",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 536,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "178",
    cardSet: "White Tiger",
    player: "sykes",
    team: "Washington Mystics",
    copies: "5"
  },
  {
    id: 537,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "212",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics",
    copies: "62"
  },
  {
    id: 538,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "212",
    cardSet: "Blue Viper",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 539,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "212",
    cardSet: "Jaguar",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 540,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "212",
    cardSet: "Jungle",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 541,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "212",
    cardSet: "White Tiger",
    player: "sykes",
    team: "Washington Mystics",
    copies: "5"
  },
  {
    id: 542,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "24",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 543,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "24",
    cardSet: "Black",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 544,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "24",
    cardSet: "Blue",
    player: "sykes",
    team: "Washington Mystics",
    copies: "75"
  },
  {
    id: 545,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "24",
    cardSet: "Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 546,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "24",
    cardSet: "Purple",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 547,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "24",
    cardSet: "Red",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 548,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "24",
    cardSet: "Swirl",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 549,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "24",
    cardSet: "Teal",
    player: "sykes",
    team: "Washington Mystics",
    copies: "49"
  },
  {
    id: 550,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 551,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Black Gold Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "5"
  },
  {
    id: 552,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Black Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 553,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Blue Millionaire Shimmer Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 554,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Boardwalk Blue Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "15"
  },
  {
    id: 555,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Brown Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "249"
  },
  {
    id: 556,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Classic Icons Red Prizm",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 557,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Deal Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 558,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Dice Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 559,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Free Parking Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 560,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Go Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 561,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Gold Millionaire Shimmer Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "500"
  },
  {
    id: 562,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Gold Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "49"
  },
  {
    id: 563,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Gold Wave Millionaire Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 564,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Green Millionaire Shimmer Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "20"
  },
  {
    id: 565,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Green Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "24"
  },
  {
    id: 566,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Light Blue Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "199"
  },
  {
    id: 567,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Monopoly Man Black and White Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 568,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Neon Green Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 569,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Orange Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "124"
  },
  {
    id: 570,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Pink Millionaire Shimmer Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "5"
  },
  {
    id: 571,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Pink Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "149"
  },
  {
    id: 572,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Purple Millionaire Shimmer Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "50"
  },
  {
    id: 573,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Purple Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 574,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Question Mark Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 575,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Red Millionaire Shimmer Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "100"
  },
  {
    id: 576,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Red Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 577,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Silver Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 578,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "Tiger Stripe Boardwalk Blue Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 579,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "38",
    cardSet: "White Millionaire Shimmer Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 580,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Fearless",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 581,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Fearless Prizms Blue",
    player: "sykes",
    team: "Washington Mystics",
    copies: "49"
  },
  {
    id: 582,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Fearless Prizms Blue Pulsar",
    player: "sykes",
    team: "Washington Mystics",
    copies: "199"
  },
  {
    id: 583,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Fearless Prizms Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 584,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Fearless Prizms Gold Vinyl",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 585,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Fearless Prizms Green",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 586,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Fearless Prizms Green Pulsar",
    player: "sykes",
    team: "Washington Mystics",
    copies: "75"
  },
  {
    id: 587,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Fearless Prizms Mojo",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 588,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Fearless Prizms Orange Pulsar",
    player: "sykes",
    team: "Washington Mystics",
    copies: "75"
  },
  {
    id: 589,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Fearless Prizms Red",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 590,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 591,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Black Finite Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 592,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Black Gold Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "5"
  },
  {
    id: 593,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Black Velocity Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "39"
  },
  {
    id: 594,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Blue Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "199"
  },
  {
    id: 595,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Blue Pulsar Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "199"
  },
  {
    id: 596,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Blue Velocity Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 597,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Checkerboard Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 598,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Cherry Blossom FOTL Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "20"
  },
  {
    id: 599,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Gold Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 600,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Gold Vinyl Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 601,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Green Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 602,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Green Pulsar Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 603,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Ice Gold Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 604,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Ice Orange Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 605,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Ice Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 606,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Ice White Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "35"
  },
  {
    id: 607,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Lotus Flower FOTL Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "3"
  },
  {
    id: 608,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Mojo Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 609,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Mosaic Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "3"
  },
  {
    id: 610,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Orange Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 611,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Orange Velocity Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 612,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Pink Velocity Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "79"
  },
  {
    id: 613,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Premium Box Set Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 614,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Pulsar Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "499"
  },
  {
    id: 615,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Purple Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "149"
  },
  {
    id: 616,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Red Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "299"
  },
  {
    id: 617,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Red Pulsar Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "299"
  },
  {
    id: 618,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Silver Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 619,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Snakeskin Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 620,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "Teal Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "49"
  },
  {
    id: 621,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "WNBA Logo Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 622,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "80",
    cardSet: "White Sparkle Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 623,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-BS",
    cardSet: "Signatures",
    player: "sykes",
    team: "Washington Mystics",
    isAuto: true
  },
  {
    id: 624,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-BS",
    cardSet: "Signatures Prizms Blue",
    player: "sykes",
    team: "Washington Mystics",
    isAuto: true,
    copies: "75"
  },
  {
    id: 625,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-BS",
    cardSet: "Signatures Prizms Gold",
    player: "sykes",
    team: "Washington Mystics",
    isAuto: true,
    copies: "10"
  },
  {
    id: 626,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-BS",
    cardSet: "Signatures Prizms Gold Vinyl",
    player: "sykes",
    team: "Washington Mystics",
    isAuto: true,
    copies: "1"
  },
  {
    id: 627,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-BS",
    cardSet: "Signatures Prizms Green",
    player: "sykes",
    team: "Washington Mystics",
    isAuto: true
  },
  {
    id: 628,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-BS",
    cardSet: "Signatures Prizms Green Pulsar",
    player: "sykes",
    team: "Washington Mystics",
    isAuto: true,
    copies: "25"
  },
  {
    id: 629,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-BS",
    cardSet: "Signatures Prizms Mojo",
    player: "sykes",
    team: "Washington Mystics",
    isAuto: true,
    copies: "25"
  },
  {
    id: 630,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-BS",
    cardSet: "Signatures Prizms Purple",
    player: "sykes",
    team: "Washington Mystics",
    isAuto: true,
    copies: "49"
  },
  {
    id: 631,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-BS",
    cardSet: "Signatures Prizms Red",
    player: "sykes",
    team: "Washington Mystics",
    isAuto: true,
    copies: "99"
  },
  {
    id: 632,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-BS",
    cardSet: "Signatures Prizms Teal",
    player: "sykes",
    team: "Washington Mystics",
    isAuto: true,
    copies: "35"
  },
  {
    id: 633,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-BS",
    cardSet: "Signatures Prizms White Sparkle",
    player: "sykes",
    team: "Washington Mystics",
    isAuto: true,
    copies: "1"
  },
  {
    id: 634,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 635,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Black Finite",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 636,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Black Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "5"
  },
  {
    id: 637,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Bronze Checker",
    player: "sykes",
    team: "Washington Mystics",
    copies: "49"
  },
  {
    id: 638,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 639,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Gold Flash",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 640,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Gold Vinyl",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 641,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Green Ice",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 642,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Ice Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 643,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Light Blue Disco",
    player: "sykes",
    team: "Washington Mystics",
    copies: "125"
  },
  {
    id: 644,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Neon Green",
    player: "sykes",
    team: "Washington Mystics",
    copies: "75"
  },
  {
    id: 645,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Pink Ice",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 646,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Pink Shimmer FOTL",
    player: "sykes",
    team: "Washington Mystics",
    copies: "3"
  },
  {
    id: 647,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Pink and Purple",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 648,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Purple Ice",
    player: "sykes",
    team: "Washington Mystics",
    copies: "149"
  },
  {
    id: 649,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Red",
    player: "sykes",
    team: "Washington Mystics",
    copies: "149"
  },
  {
    id: 650,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Red Ice",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 651,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Red and Blue",
    player: "sykes",
    team: "Washington Mystics",
    copies: "399"
  },
  {
    id: 652,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Silver",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 653,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Silver Flash",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 654,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Tie-Dye",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 655,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Tiger",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 656,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms White",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 657,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "3",
    cardSet: "Prizms Zebra",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 658,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "11",
    cardSet: "En Fuego",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 659,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "11",
    cardSet: "En Fuego Prizms Black Finite",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 660,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "11",
    cardSet: "En Fuego Prizms Black Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "5"
  },
  {
    id: 661,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "11",
    cardSet: "En Fuego Prizms Black Pandora",
    player: "sykes",
    team: "Washington Mystics",
    copies: "8"
  },
  {
    id: 662,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "11",
    cardSet: "En Fuego Prizms Blue",
    player: "sykes",
    team: "Washington Mystics",
    copies: "49"
  },
  {
    id: 663,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "11",
    cardSet: "En Fuego Prizms Blue Flash",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 664,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "11",
    cardSet: "En Fuego Prizms Flash",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 665,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "11",
    cardSet: "En Fuego Prizms Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 666,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "11",
    cardSet: "En Fuego Prizms Gold Flash",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 667,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "11",
    cardSet: "En Fuego Prizms Gold Vinyl",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 668,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "11",
    cardSet: "En Fuego Prizms Silver",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 669,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "11",
    cardSet: "En Fuego Prizms Tie-Dye",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 670,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "11",
    cardSet: "En Fuego Prizms White Disco",
    player: "sykes",
    team: "Washington Mystics",
    copies: "75"
  },
  {
    id: 671,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 672,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Black Finite",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 673,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Black Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "5"
  },
  {
    id: 674,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Bronze Checker",
    player: "sykes",
    team: "Washington Mystics",
    copies: "49"
  },
  {
    id: 675,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 676,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Gold Flash",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 677,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Gold Vinyl",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 678,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Green Ice",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 679,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Ice Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 680,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Neon Green",
    player: "sykes",
    team: "Washington Mystics",
    copies: "75"
  },
  {
    id: 681,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Orange",
    player: "sykes",
    team: "Washington Mystics",
    copies: "125"
  },
  {
    id: 682,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Pink Ice",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 683,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Pink Shimmer FOTL",
    player: "sykes",
    team: "Washington Mystics",
    copies: "3"
  },
  {
    id: 684,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Pink and Purple",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 685,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Purple",
    player: "sykes",
    team: "Washington Mystics",
    copies: "149"
  },
  {
    id: 686,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Purple Ice",
    player: "sykes",
    team: "Washington Mystics",
    copies: "149"
  },
  {
    id: 687,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Red Ice",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 688,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Red and Blue",
    player: "sykes",
    team: "Washington Mystics",
    copies: "399"
  },
  {
    id: 689,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Silver",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 690,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Silver Flash",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 691,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Tie-Dye",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 692,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Tiger",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 693,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms White",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 694,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "106",
    cardSet: "Prizms Zebra",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 695,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "15",
    cardSet: "Jersey Series",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 696,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "15",
    cardSet: "Jersey Series Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 697,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "15",
    cardSet: "Jersey Series Green",
    player: "sykes",
    team: "Washington Mystics",
    copies: "30"
  },
  {
    id: 698,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "15",
    cardSet: "Jersey Series Holo Platinum Blue",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 699,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "15",
    cardSet: "Jersey Series Red",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 700,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "18",
    cardSet: "My House",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 701,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "18",
    cardSet: "My House Diamond",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 702,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "18",
    cardSet: "My House Green Fireworks",
    player: "sykes",
    team: "Washington Mystics",
    copies: "399"
  },
  {
    id: 703,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "18",
    cardSet: "My House Holo",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 704,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "18",
    cardSet: "My House Holo Black Laser",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 705,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "18",
    cardSet: "My House Holo Laser",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 706,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "18",
    cardSet: "My House Orange Fireworks",
    player: "sykes",
    team: "Washington Mystics",
    copies: "75"
  },
  {
    id: 707,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "18",
    cardSet: "My House Orange Laser",
    player: "sykes",
    team: "Washington Mystics",
    copies: "399"
  },
  {
    id: 708,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "18",
    cardSet: "My House Pink Fireworks",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 709,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "18",
    cardSet: "My House Press Proof",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 710,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "18",
    cardSet: "My House Press Proof Blue",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 711,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "18",
    cardSet: "My House Press Proof Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 712,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "18",
    cardSet: "My House Press Proof Purple",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 713,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "18",
    cardSet: "My House Purple Laser",
    player: "sykes",
    team: "Washington Mystics",
    copies: "49"
  },
  {
    id: 714,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "18",
    cardSet: "My House Red Holo Laser",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 715,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 716,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Artist Proof",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 717,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Black Gold Laser",
    player: "sykes",
    team: "Washington Mystics",
    copies: "5"
  },
  {
    id: 718,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Black Holo Press Proof",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 719,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Black Shimmer",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 720,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Blue Laser",
    player: "sykes",
    team: "Washington Mystics",
    copies: "49"
  },
  {
    id: 721,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Blue Shimmer",
    player: "sykes",
    team: "Washington Mystics",
    copies: "49"
  },
  {
    id: 722,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Cubic",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 723,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Dragon",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 724,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Gold Shimmer",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 725,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Green Laser",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 726,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Green Shimmer",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 727,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Holo",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 728,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Holo Black Laser",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 729,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Holo Gold Laser",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 730,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Holo Team Logo",
    player: "sykes",
    team: "Washington Mystics",
    copies: "13"
  },
  {
    id: 731,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Holo WNBA Logo",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 732,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Lava",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 733,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Light Blue Lava",
    player: "sykes",
    team: "Washington Mystics",
    copies: "75"
  },
  {
    id: 734,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Orange Laser",
    player: "sykes",
    team: "Washington Mystics",
    copies: "199"
  },
  {
    id: 735,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Orange Lava",
    player: "sykes",
    team: "Washington Mystics",
    copies: "199"
  },
  {
    id: 736,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Pink Laser",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 737,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Pink Shimmer",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 738,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Purple Laser",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 739,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Purple Lava",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 740,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Purple Shimmer",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 741,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Red Holo",
    player: "sykes",
    team: "Washington Mystics",
    copies: "299"
  },
  {
    id: 742,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Red Lava",
    player: "sykes",
    team: "Washington Mystics",
    copies: "399"
  },
  {
    id: 743,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Red Shimmer",
    player: "sykes",
    team: "Washington Mystics",
    copies: "399"
  },
  {
    id: 744,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Teal Laser",
    player: "sykes",
    team: "Washington Mystics",
    copies: "125"
  },
  {
    id: 745,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "41",
    cardSet: "Yellow Lava",
    player: "sykes",
    team: "Washington Mystics",
    copies: "5"
  },
  {
    id: 746,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-BS",
    cardSet: "Signature Series",
    player: "sykes",
    team: "Washington Mystics",
    isAuto: true
  },
  {
    id: 747,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-BS",
    cardSet: "Signature Series Black Gold Laser",
    player: "sykes",
    team: "Washington Mystics",
    isAuto: true,
    copies: "5"
  },
  {
    id: 748,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-BS",
    cardSet: "Signature Series Gold Laser",
    player: "sykes",
    team: "Washington Mystics",
    isAuto: true,
    copies: "10"
  },
  {
    id: 749,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-BS",
    cardSet: "Signature Series Holo Black Laser",
    player: "sykes",
    team: "Washington Mystics",
    isAuto: true,
    copies: "1"
  },
  {
    id: 750,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-BS",
    cardSet: "Signature Series Holo Frame",
    player: "sykes",
    team: "Washington Mystics",
    isAuto: true,
    copies: "49"
  },
  {
    id: 751,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-BS",
    cardSet: "Signature Series Holo Laser",
    player: "sykes",
    team: "Washington Mystics",
    isAuto: true
  },
  {
    id: 752,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "7",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics",
    copies: "75"
  },
  {
    id: 753,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "7",
    cardSet: "Amethyst",
    player: "sykes",
    team: "Washington Mystics",
    copies: "8"
  },
  {
    id: 754,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "7",
    cardSet: "Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 755,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "7",
    cardSet: "Holo Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 756,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "7",
    cardSet: "Holo Silver",
    player: "sykes",
    team: "Washington Mystics",
    copies: "15"
  },
  {
    id: 757,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "7",
    cardSet: "Platinum",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 758,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "7",
    cardSet: "Silver",
    player: "sykes",
    team: "Washington Mystics",
    copies: "40"
  },
  {
    id: 759,
    year: 2025,
    product: "Panini Instant WNBA",
    cardNumber: "54",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics",
    copies: "58"
  },
  {
    id: 760,
    year: 2025,
    product: "Panini Instant WNBA",
    cardNumber: "72",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics",
    copies: "58"
  },
  {
    id: 761,
    year: 2025,
    product: "Panini Instant WNBA",
    cardNumber: "150",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics",
    copies: "82"
  },
  {
    id: 762,
    year: 2025,
    product: "Panini Instant WNBA The Logo",
    cardNumber: "18",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1447"
  },
  {
    id: 763,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "91",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 764,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "91",
    cardSet: "Holo Emerald",
    player: "sykes",
    team: "Washington Mystics",
    copies: "5"
  },
  {
    id: 765,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "91",
    cardSet: "Holo Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 766,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "91",
    cardSet: "Holo Platinum Blue",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 767,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "91",
    cardSet: "Pink",
    player: "sykes",
    team: "Washington Mystics",
    copies: "6"
  },
  {
    id: 768,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "91",
    cardSet: "Purple",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 769,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 770,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Black Finite Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 771,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Black Velocity Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "39"
  },
  {
    id: 772,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Blue Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "199"
  },
  {
    id: 773,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Blue Pulsar Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "199"
  },
  {
    id: 774,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Blue Velocity Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 775,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Carolina Blue Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "125"
  },
  {
    id: 776,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Checkerboard Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 777,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Cherry Blossoms Prizms FOTL",
    player: "sykes",
    team: "Washington Mystics",
    copies: "20"
  },
  {
    id: 778,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Gold Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 779,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Gold Vinyl Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 780,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Green Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 781,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Green Pulsar Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 782,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Ice Orange Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 783,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Ice Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 784,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Lime Green Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "225"
  },
  {
    id: 785,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Lotus Flower Prizms FOTL",
    player: "sykes",
    team: "Washington Mystics",
    copies: "3"
  },
  {
    id: 786,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Mojo Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 787,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Mosaic Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "3"
  },
  {
    id: 788,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Orange Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 789,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Pandora Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 790,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Pink Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "175"
  },
  {
    id: 791,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Pink Velocity Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "79"
  },
  {
    id: 792,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Purple Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "149"
  },
  {
    id: 793,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Purple Velocity Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "59"
  },
  {
    id: 794,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Red Pandora Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "199"
  },
  {
    id: 795,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Red Power Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "75"
  },
  {
    id: 796,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Red Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "299"
  },
  {
    id: 797,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Red Pulsar Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "299"
  },
  {
    id: 798,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Silver Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 799,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Snakeskin Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 800,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Swirl Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 801,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "Teal Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "49"
  },
  {
    id: 802,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "WNBA Logo Gold Prizms",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 803,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "WNBA Logo Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 804,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "121",
    cardSet: "White Seismic Prizms",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 805,
    year: 2025,
    product: "Panini WNBA Player of the Day",
    cardNumber: "36",
    cardSet: "Base",
    player: "sykes",
    team: "Washington Mystics"
  },
  {
    id: 806,
    year: 2025,
    product: "Panini WNBA Player of the Day",
    cardNumber: "36",
    cardSet: "Black",
    player: "sykes",
    team: "Washington Mystics",
    copies: "1"
  },
  {
    id: 807,
    year: 2025,
    product: "Panini WNBA Player of the Day",
    cardNumber: "36",
    cardSet: "Blue",
    player: "sykes",
    team: "Washington Mystics",
    copies: "50"
  },
  {
    id: 808,
    year: 2025,
    product: "Panini WNBA Player of the Day",
    cardNumber: "36",
    cardSet: "Gold",
    player: "sykes",
    team: "Washington Mystics",
    copies: "10"
  },
  {
    id: 809,
    year: 2025,
    product: "Panini WNBA Player of the Day",
    cardNumber: "36",
    cardSet: "Green",
    player: "sykes",
    team: "Washington Mystics",
    copies: "5"
  },
  {
    id: 810,
    year: 2025,
    product: "Panini WNBA Player of the Day",
    cardNumber: "36",
    cardSet: "Orange",
    player: "sykes",
    team: "Washington Mystics",
    copies: "199"
  },
  {
    id: 811,
    year: 2025,
    product: "Panini WNBA Player of the Day",
    cardNumber: "36",
    cardSet: "Purple",
    player: "sykes",
    team: "Washington Mystics",
    copies: "25"
  },
  {
    id: 812,
    year: 2025,
    product: "Panini WNBA Player of the Day",
    cardNumber: "36",
    cardSet: "Red",
    player: "sykes",
    team: "Washington Mystics",
    copies: "99"
  },
  {
    id: 813,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Base",
    player: "allemand",
    team: "Chicago Sky"
  },
  {
    id: 814,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Black Gold",
    player: "allemand",
    team: "Chicago Sky",
    copies: "5"
  },
  {
    id: 815,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Blue",
    player: "allemand",
    team: "Chicago Sky",
    copies: "149"
  },
  {
    id: 816,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Gold",
    player: "allemand",
    team: "Chicago Sky",
    copies: "10"
  },
  {
    id: 817,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Gold Vinyl",
    player: "allemand",
    team: "Chicago Sky",
    copies: "1"
  },
  {
    id: 818,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Green",
    player: "allemand",
    team: "Chicago Sky"
  },
  {
    id: 819,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Green Ice",
    player: "allemand",
    team: "Chicago Sky"
  },
  {
    id: 820,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Green Pulsar",
    player: "allemand",
    team: "Chicago Sky",
    copies: "25"
  },
  {
    id: 821,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Hyper",
    player: "allemand",
    team: "Chicago Sky"
  },
  {
    id: 822,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Ice",
    player: "allemand",
    team: "Chicago Sky"
  },
  {
    id: 823,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Mojo",
    player: "allemand",
    team: "Chicago Sky",
    copies: "25"
  },
  {
    id: 824,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Mosaic",
    player: "allemand",
    team: "Chicago Sky",
    copies: "3"
  },
  {
    id: 825,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Orange",
    player: "allemand",
    team: "Chicago Sky",
    copies: "49"
  },
  {
    id: 826,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Premium Box Set",
    player: "allemand",
    team: "Chicago Sky",
    copies: "99"
  },
  {
    id: 827,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Purple",
    player: "allemand",
    team: "Chicago Sky",
    copies: "99"
  },
  {
    id: 828,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Red",
    player: "allemand",
    team: "Chicago Sky",
    copies: "199"
  },
  {
    id: 829,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Ruby Wave",
    player: "allemand",
    team: "Chicago Sky"
  },
  {
    id: 830,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Silver",
    player: "allemand",
    team: "Chicago Sky"
  },
  {
    id: 831,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "White Sparkle",
    player: "allemand",
    team: "Chicago Sky"
  },
  {
    id: 832,
    year: 2025,
    product: "Panini Instant WNBA",
    cardNumber: "280",
    cardSet: "Base",
    player: "allemand",
    team: "Los Angeles Sparks"
  },
  {
    id: 833,
    year: 2015,
    product: "Panini Contenders Draft Picks",
    cardNumber: "186",
    cardSet: "Base",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true
  },
  {
    id: 834,
    year: 2015,
    product: "Panini Contenders Draft Picks",
    cardNumber: "186",
    cardSet: "Championship Ticket",
    player: "harrison",
    team: "Tennessee (NCAA)",
    copies: "1"
  },
  {
    id: 835,
    year: 2015,
    product: "Panini Contenders Draft Picks",
    cardNumber: "186",
    cardSet: "College Draft Ticket Autographs Blue Foil",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true
  },
  {
    id: 836,
    year: 2015,
    product: "Panini Contenders Draft Picks",
    cardNumber: "186",
    cardSet: "College Draft Ticket Autographs Red Foil",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true
  },
  {
    id: 837,
    year: 2015,
    product: "Panini Contenders Draft Picks",
    cardNumber: "186",
    cardSet: "College Playoff Ticket",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "15"
  },
  {
    id: 838,
    year: 2015,
    product: "Panini Contenders Draft Picks",
    cardNumber: "186",
    cardSet: "Draft Ticket",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "99"
  },
  {
    id: 839,
    year: 2015,
    product: "Panini Contenders Draft Picks",
    cardNumber: "186",
    cardSet: "Season Ticket Cracked Ice",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "23"
  },
  {
    id: 840,
    year: 2015,
    product: "Panini Contenders Draft Picks",
    cardNumber: "186",
    cardSet: "Season Ticket Printing Plates Black",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 841,
    year: 2015,
    product: "Panini Contenders Draft Picks",
    cardNumber: "186",
    cardSet: "Season Ticket Printing Plates Cyan",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 842,
    year: 2015,
    product: "Panini Contenders Draft Picks",
    cardNumber: "186",
    cardSet: "Season Ticket Printing Plates Magenta",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 843,
    year: 2015,
    product: "Panini Contenders Draft Picks",
    cardNumber: "186",
    cardSet: "Season Ticket Printing Plates Yellow",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 844,
    year: 2015,
    product: "Panini Immaculate Collection Collegiate",
    cardNumber: "259",
    cardSet: "Base",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "99"
  },
  {
    id: 845,
    year: 2015,
    product: "Panini Immaculate Collection Collegiate",
    cardNumber: "259",
    cardSet: "Blue",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "10"
  },
  {
    id: 846,
    year: 2015,
    product: "Panini Immaculate Collection Collegiate",
    cardNumber: "259",
    cardSet: "Gold",
    player: "harrison",
    team: "Tennessee (NCAA)",
    copies: "5"
  },
  {
    id: 847,
    year: 2015,
    product: "Panini Immaculate Collection Collegiate",
    cardNumber: "259",
    cardSet: "Platinum",
    player: "harrison",
    team: "Tennessee (NCAA)",
    copies: "1"
  },
  {
    id: 848,
    year: 2015,
    product: "Panini Immaculate Collection Collegiate",
    cardNumber: "259",
    cardSet: "Red",
    player: "harrison",
    team: "Tennessee (NCAA)",
    copies: "25"
  },
  {
    id: 849,
    year: 2015,
    product: "Panini National Treasures Collegiate",
    cardNumber: "259",
    cardSet: "Base",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "99"
  },
  {
    id: 850,
    year: 2015,
    product: "Panini National Treasures Collegiate",
    cardNumber: "259",
    cardSet: "Century Black",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "5"
  },
  {
    id: 851,
    year: 2015,
    product: "Panini National Treasures Collegiate",
    cardNumber: "259",
    cardSet: "Century Blue",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 852,
    year: 2015,
    product: "Panini National Treasures Collegiate",
    cardNumber: "259",
    cardSet: "Century Gold",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "10"
  },
  {
    id: 853,
    year: 2015,
    product: "Panini National Treasures Collegiate",
    cardNumber: "259",
    cardSet: "Century Silver",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "25"
  },
  {
    id: 854,
    year: 2015,
    product: "Panini National Treasures Collegiate",
    cardNumber: "259",
    cardSet: "Printing Plates Black",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 855,
    year: 2015,
    product: "Panini National Treasures Collegiate",
    cardNumber: "259",
    cardSet: "Printing Plates Cyan",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 856,
    year: 2015,
    product: "Panini National Treasures Collegiate",
    cardNumber: "259",
    cardSet: "Printing Plates Magenta",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 857,
    year: 2015,
    product: "Panini National Treasures Collegiate",
    cardNumber: "259",
    cardSet: "Printing Plates Yellow",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 858,
    year: 2016,
    product: "Panini Tennessee Volunteers",
    cardNumber: "36",
    cardSet: "Base",
    player: "harrison",
    team: "Tennessee (NCAA)"
  },
  {
    id: 859,
    year: 2016,
    product: "Panini Tennessee Volunteers",
    cardNumber: "36",
    cardSet: "Black",
    player: "harrison",
    team: "Tennessee (NCAA)",
    copies: "10"
  },
  {
    id: 860,
    year: 2016,
    product: "Panini Tennessee Volunteers",
    cardNumber: "36",
    cardSet: "Gold",
    player: "harrison",
    team: "Tennessee (NCAA)",
    copies: "25"
  },
  {
    id: 861,
    year: 2016,
    product: "Panini Tennessee Volunteers",
    cardNumber: "36",
    cardSet: "Silver",
    player: "harrison",
    team: "Tennessee (NCAA)"
  },
  {
    id: 862,
    year: 2016,
    product: "Rittenhouse WNBA",
    cardNumber: "80",
    cardSet: "Base",
    player: "harrison",
    team: "Tennessee (NCAA)",
    isRookie: true
  },
  {
    id: 863,
    year: 2017,
    product: "Rittenhouse WNBA",
    cardNumber: "84",
    cardSet: "Base",
    player: "harrison",
    team: "San Antonio Stars",
    copies: "500"
  },
  {
    id: 864,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "66",
    cardSet: "Base",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 865,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "66",
    cardSet: "Black",
    player: "harrison",
    team: "Dallas Wings",
    copies: "1"
  },
  {
    id: 866,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "66",
    cardSet: "Black Gold",
    player: "harrison",
    team: "Dallas Wings",
    copies: "5"
  },
  {
    id: 867,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "66",
    cardSet: "Blue",
    player: "harrison",
    team: "Dallas Wings",
    copies: "149"
  },
  {
    id: 868,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "66",
    cardSet: "Gold",
    player: "harrison",
    team: "Dallas Wings",
    copies: "10"
  },
  {
    id: 869,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "66",
    cardSet: "Green",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 870,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "66",
    cardSet: "Green Ice",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 871,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "66",
    cardSet: "Green Pulsar",
    player: "harrison",
    team: "Dallas Wings",
    copies: "25"
  },
  {
    id: 872,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "66",
    cardSet: "Hyper",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 873,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "66",
    cardSet: "Ice",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 874,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "66",
    cardSet: "Mojo",
    player: "harrison",
    team: "Dallas Wings",
    copies: "25"
  },
  {
    id: 875,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "66",
    cardSet: "Orange",
    player: "harrison",
    team: "Dallas Wings",
    copies: "65"
  },
  {
    id: 876,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "66",
    cardSet: "Purple",
    player: "harrison",
    team: "Dallas Wings",
    copies: "125"
  },
  {
    id: 877,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "66",
    cardSet: "Red",
    player: "harrison",
    team: "Dallas Wings",
    copies: "275"
  },
  {
    id: 878,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "66",
    cardSet: "Ruby Wave",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 879,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "66",
    cardSet: "Scope",
    player: "harrison",
    team: "Dallas Wings",
    copies: "99"
  },
  {
    id: 880,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "66",
    cardSet: "Silver",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 881,
    year: 2020,
    product: "Panini Prizm WNBA Premium",
    cardNumber: "66",
    cardSet: "Base",
    player: "harrison",
    team: "Dallas Wings",
    copies: "99"
  },
  {
    id: 882,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Base",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 883,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms 25th Anniversary",
    player: "harrison",
    team: "Dallas Wings",
    copies: "25"
  },
  {
    id: 884,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms Black",
    player: "harrison",
    team: "Dallas Wings",
    copies: "1"
  },
  {
    id: 885,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms Black Gold",
    player: "harrison",
    team: "Dallas Wings",
    copies: "5"
  },
  {
    id: 886,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms Blue",
    player: "harrison",
    team: "Dallas Wings",
    copies: "149"
  },
  {
    id: 887,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms Gold",
    player: "harrison",
    team: "Dallas Wings",
    copies: "10"
  },
  {
    id: 888,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms Green",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 889,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms Green Ice",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 890,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms Green Pulsar",
    player: "harrison",
    team: "Dallas Wings",
    copies: "25"
  },
  {
    id: 891,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms Hyper",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 892,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms Ice",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 893,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms Mojo",
    player: "harrison",
    team: "Dallas Wings",
    copies: "25"
  },
  {
    id: 894,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms Mosaic",
    player: "harrison",
    team: "Dallas Wings",
    copies: "3"
  },
  {
    id: 895,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms Orange",
    player: "harrison",
    team: "Dallas Wings",
    copies: "50"
  },
  {
    id: 896,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms Purple",
    player: "harrison",
    team: "Dallas Wings",
    copies: "99"
  },
  {
    id: 897,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms Red",
    player: "harrison",
    team: "Dallas Wings",
    copies: "299"
  },
  {
    id: 898,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms Ruby Wave",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 899,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms Silver",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 900,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "22",
    cardSet: "Prizms White Sparkle",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 901,
    year: 2021,
    product: "Panini Prizm WNBA Premium",
    cardNumber: "22",
    cardSet: "Base",
    player: "harrison",
    team: "Dallas Wings",
    copies: "99"
  },
  {
    id: 902,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Base",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 903,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Black Gold",
    player: "harrison",
    team: "Dallas Wings",
    copies: "5"
  },
  {
    id: 904,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Blue",
    player: "harrison",
    team: "Dallas Wings",
    copies: "149"
  },
  {
    id: 905,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Gold",
    player: "harrison",
    team: "Dallas Wings",
    copies: "10"
  },
  {
    id: 906,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Gold Vinyl",
    player: "harrison",
    team: "Dallas Wings",
    copies: "1"
  },
  {
    id: 907,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Green",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 908,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Green Ice",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 909,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Green Pulsar",
    player: "harrison",
    team: "Dallas Wings",
    copies: "25"
  },
  {
    id: 910,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Hyper",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 911,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Ice",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 912,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Mojo",
    player: "harrison",
    team: "Dallas Wings",
    copies: "25"
  },
  {
    id: 913,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Mosaic",
    player: "harrison",
    team: "Dallas Wings",
    copies: "3"
  },
  {
    id: 914,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Orange",
    player: "harrison",
    team: "Dallas Wings",
    copies: "49"
  },
  {
    id: 915,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Premium Box Set",
    player: "harrison",
    team: "Dallas Wings",
    copies: "99"
  },
  {
    id: 916,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Purple",
    player: "harrison",
    team: "Dallas Wings",
    copies: "99"
  },
  {
    id: 917,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Red",
    player: "harrison",
    team: "Dallas Wings",
    copies: "199"
  },
  {
    id: 918,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Ruby Wave",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 919,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "Silver",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 920,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "155",
    cardSet: "White Sparkle",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 921,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "6",
    cardSet: "Base",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 922,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "6",
    cardSet: "Astro",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 923,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "6",
    cardSet: "Cosmic",
    player: "harrison",
    team: "Dallas Wings",
    copies: "99"
  },
  {
    id: 924,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "6",
    cardSet: "Cubic",
    player: "harrison",
    team: "Dallas Wings",
    copies: "50"
  },
  {
    id: 925,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "6",
    cardSet: "Fractal",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 926,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "6",
    cardSet: "Galactic",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 927,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "6",
    cardSet: "Groove",
    player: "harrison",
    team: "Dallas Wings"
  },
  {
    id: 928,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "6",
    cardSet: "Impact",
    player: "harrison",
    team: "Dallas Wings",
    copies: "149"
  },
  {
    id: 929,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "6",
    cardSet: "Lava",
    player: "harrison",
    team: "Dallas Wings",
    copies: "10"
  },
  {
    id: 930,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "6",
    cardSet: "Sunburst",
    player: "harrison",
    team: "Dallas Wings",
    copies: "75"
  },
  {
    id: 931,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "2",
    cardSet: "Base",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 932,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "2",
    cardSet: "Black",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 933,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "2",
    cardSet: "Blue",
    player: "harrison",
    team: "New York Liberty",
    copies: "75"
  },
  {
    id: 934,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "2",
    cardSet: "Gold",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 935,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "2",
    cardSet: "Rainbow",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 936,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "2",
    cardSet: "Red",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 937,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "2",
    cardSet: "Teal",
    player: "harrison",
    team: "New York Liberty",
    copies: "35"
  },
  {
    id: 938,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "10",
    cardSet: "Drip",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 939,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "10",
    cardSet: "Drip Black",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 940,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "10",
    cardSet: "Drip Gold",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 941,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Base",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 942,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Black Gold Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 943,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Blue",
    player: "harrison",
    team: "New York Liberty",
    copies: "175"
  },
  {
    id: 944,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Blue Wave",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 945,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Gold",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 946,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Gold Vinyl",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 947,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Green",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 948,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Green Pulsar",
    player: "harrison",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 949,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Hyper",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 950,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Ice",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 951,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Mojo",
    player: "harrison",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 952,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Mosaic",
    player: "harrison",
    team: "New York Liberty",
    copies: "3"
  },
  {
    id: 953,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Orange",
    player: "harrison",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 954,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Premium Box Set Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 955,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Purple",
    player: "harrison",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 956,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Red",
    player: "harrison",
    team: "New York Liberty",
    copies: "199"
  },
  {
    id: 957,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Ruby Wave",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 958,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Silver",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 959,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "Teal",
    player: "harrison",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 960,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "101",
    cardSet: "White Sparkle Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 961,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "104",
    cardSet: "Base",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 962,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "104",
    cardSet: "FoilFractor",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 963,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "104",
    cardSet: "Gold Foilboard",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 964,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "104",
    cardSet: "Independence Day",
    player: "harrison",
    team: "New York Liberty",
    copies: "76"
  },
  {
    id: 965,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "104",
    cardSet: "Mother's Day Hot Pink",
    player: "harrison",
    team: "New York Liberty",
    copies: "50"
  },
  {
    id: 966,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "104",
    cardSet: "NGWSD",
    player: "harrison",
    team: "New York Liberty",
    copies: "22"
  },
  {
    id: 967,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "104",
    cardSet: "Printing Plate Black",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 968,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "104",
    cardSet: "Printing Plate Cyan",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 969,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "104",
    cardSet: "Printing Plate Magenta",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 970,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "104",
    cardSet: "Printing Plate Yellow",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 971,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "104",
    cardSet: "Rainbow Foil",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 972,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "104",
    cardSet: "Royal Blue",
    player: "harrison",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 973,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "193",
    cardSet: "Base",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 974,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "AUA-IH",
    cardSet: "AU Athlete Autographs",
    player: "harrison",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 975,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "AUA-IH",
    cardSet: "AU Athlete Autographs FoilFractor",
    player: "harrison",
    team: "New York Liberty",
    isAuto: true,
    copies: "1"
  },
  {
    id: 976,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "AUA-IH",
    cardSet: "AU Athlete Autographs Gold Foilboard",
    player: "harrison",
    team: "New York Liberty",
    isAuto: true,
    copies: "25"
  },
  {
    id: 977,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "AUA-IH",
    cardSet: "AU Athlete Autographs Rainbow Foilboard",
    player: "harrison",
    team: "New York Liberty",
    isAuto: true,
    copies: "50"
  },
  {
    id: 978,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "BU-9",
    cardSet: "Being Unlimited",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 979,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "BU-9",
    cardSet: "Being Unlimited Autographs",
    player: "harrison",
    team: "New York Liberty",
    isAuto: true,
    copies: "25"
  },
  {
    id: 980,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "BU-9",
    cardSet: "Being Unlimited FoilFractor",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 981,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "BU-9",
    cardSet: "Being Unlimited Gold Foilboard",
    player: "harrison",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 982,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "BU-9",
    cardSet: "Being Unlimited Rainbow Foilboard",
    player: "harrison",
    team: "New York Liberty",
    copies: "50"
  },
  {
    id: 983,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "QA-CCHB",
    cardSet: "AU Athlete Quad Autographs",
    player: "harrison",
    team: "New York Liberty",
    isAuto: true,
    copies: "10"
  },
  {
    id: 984,
    year: 2023,
    product: "Topps Athletes Unlimited All Sports",
    cardNumber: "QA-CHBB",
    cardSet: "AU Athlete Quad Autographs",
    player: "harrison",
    team: "New York Liberty",
    isAuto: true,
    copies: "10"
  },
  {
    id: 985,
    year: 2023,
    product: "Topps Athletes Unlimited International Trading Card Day",
    cardNumber: "3",
    cardSet: "Base",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 986,
    year: 2023,
    product: "Topps Athletes Unlimited International Trading Card Day",
    cardNumber: "AUA-IA",
    cardSet: "Autographs",
    player: "harrison",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 987,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "8",
    cardSet: "Drip",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 988,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "8",
    cardSet: "Drip Black",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 989,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "8",
    cardSet: "Drip Gold",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 990,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "8",
    cardSet: "Drip Teal",
    player: "harrison",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 991,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "59",
    cardSet: "Base",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 992,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "59",
    cardSet: "Black",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 993,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "59",
    cardSet: "Blue",
    player: "harrison",
    team: "New York Liberty",
    copies: "75"
  },
  {
    id: 994,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "59",
    cardSet: "Gold",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 995,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "59",
    cardSet: "Purple",
    player: "harrison",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 996,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "59",
    cardSet: "Red",
    player: "harrison",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 997,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "59",
    cardSet: "Swirl",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 998,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "59",
    cardSet: "Teal",
    player: "harrison",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 999,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Base",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1000,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Black Gold Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1001,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Black Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1002,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Blue Millionaire Shimmer Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1003,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Boardwalk Blue Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "15"
  },
  {
    id: 1004,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Brown Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "249"
  },
  {
    id: 1005,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Classic Icons Red Prizm",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1006,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Deal Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1007,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Dice Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1008,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Free Parking Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1009,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Go Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1010,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Gold Millionaire Shimmer Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "500"
  },
  {
    id: 1011,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Gold Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 1012,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Gold Wave Millionaire Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1013,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Green Millionaire Shimmer Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "20"
  },
  {
    id: 1014,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Green Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "24"
  },
  {
    id: 1015,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Light Blue Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "199"
  },
  {
    id: 1016,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Monopoly Man Black and White Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1017,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Neon Green Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1018,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Orange Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "124"
  },
  {
    id: 1019,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Pink Millionaire Shimmer Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1020,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Pink Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1021,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Purple Millionaire Shimmer Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "50"
  },
  {
    id: 1022,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Purple Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1023,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Question Mark Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1024,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Red Millionaire Shimmer Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "100"
  },
  {
    id: 1025,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Red Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1026,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Silver Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1027,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "Tiger Stripe Boardwalk Blue Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1028,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "36",
    cardSet: "White Millionaire Shimmer Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1029,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Base",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1030,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Black Finite Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1031,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Black Gold Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1032,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Black Velocity Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "39"
  },
  {
    id: 1033,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Blue Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "199"
  },
  {
    id: 1034,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Blue Pulsar Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "199"
  },
  {
    id: 1035,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Blue Velocity Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1036,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Checkerboard Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1037,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Cherry Blossom FOTL Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "20"
  },
  {
    id: 1038,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Gold Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1039,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Gold Vinyl Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1040,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Green Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1041,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Green Pulsar Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1042,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Ice Gold Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1043,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Ice Orange Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1044,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Ice Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1045,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Ice White Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "35"
  },
  {
    id: 1046,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Lotus Flower FOTL Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "3"
  },
  {
    id: 1047,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Mojo Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1048,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Mosaic Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "3"
  },
  {
    id: 1049,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Orange Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1050,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Orange Velocity Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1051,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Pink Velocity Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "79"
  },
  {
    id: 1052,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Premium Box Set Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1053,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Pulsar Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "499"
  },
  {
    id: 1054,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Purple Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1055,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Red Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "299"
  },
  {
    id: 1056,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Red Pulsar Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "299"
  },
  {
    id: 1057,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Silver Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1058,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Snakeskin Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1059,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "Teal Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 1060,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "WNBA Logo Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1061,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "6",
    cardSet: "White Sparkle Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1062,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Base",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1063,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Black Finite",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1064,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Black Gold",
    player: "harrison",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1065,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Bronze Checker",
    player: "harrison",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 1066,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Gold",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1067,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Gold Flash",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1068,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Gold Vinyl",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1069,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Green Ice",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1070,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Ice Gold",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1071,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Light Blue Disco",
    player: "harrison",
    team: "New York Liberty",
    copies: "125"
  },
  {
    id: 1072,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Neon Green",
    player: "harrison",
    team: "New York Liberty",
    copies: "75"
  },
  {
    id: 1073,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Pink Ice",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1074,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Pink Shimmer FOTL",
    player: "harrison",
    team: "New York Liberty",
    copies: "3"
  },
  {
    id: 1075,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Pink and Purple",
    player: "harrison",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1076,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Purple Ice",
    player: "harrison",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1077,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Red",
    player: "harrison",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1078,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Red Ice",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1079,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Red and Blue",
    player: "harrison",
    team: "New York Liberty",
    copies: "399"
  },
  {
    id: 1080,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Silver",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1081,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Silver Flash",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1082,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Tie-Dye",
    player: "harrison",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1083,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Tiger",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1084,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms White",
    player: "harrison",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1085,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "24",
    cardSet: "Prizms Zebra",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1086,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Base",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1087,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Black Finite",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1088,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Black Gold",
    player: "harrison",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1089,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Bronze Checker",
    player: "harrison",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 1090,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Gold",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1091,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Gold Flash",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1092,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Gold Vinyl",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1093,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Green Ice",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1094,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Ice Gold",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1095,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Neon Green",
    player: "harrison",
    team: "New York Liberty",
    copies: "75"
  },
  {
    id: 1096,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Orange",
    player: "harrison",
    team: "New York Liberty",
    copies: "125"
  },
  {
    id: 1097,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Pink Ice",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1098,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Pink Shimmer FOTL",
    player: "harrison",
    team: "New York Liberty",
    copies: "3"
  },
  {
    id: 1099,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Pink and Purple",
    player: "harrison",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1100,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Purple",
    player: "harrison",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1101,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Purple Ice",
    player: "harrison",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1102,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Red Ice",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1103,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Red and Blue",
    player: "harrison",
    team: "New York Liberty",
    copies: "399"
  },
  {
    id: 1104,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Silver",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1105,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Silver Flash",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1106,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Tie-Dye",
    player: "harrison",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1107,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Tiger",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1108,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms White",
    player: "harrison",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1109,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "182",
    cardSet: "Prizms Zebra",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1110,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Base",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1111,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Black Finite Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1112,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Black Velocity Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "39"
  },
  {
    id: 1113,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Blue Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "199"
  },
  {
    id: 1114,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Blue Pulsar Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "199"
  },
  {
    id: 1115,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Blue Velocity Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1116,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Carolina Blue Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "125"
  },
  {
    id: 1117,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Checkerboard Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1118,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Cherry Blossoms Prizms FOTL",
    player: "harrison",
    team: "New York Liberty",
    copies: "20"
  },
  {
    id: 1119,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Gold Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1120,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Gold Vinyl Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1121,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Green Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1122,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Green Pulsar Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1123,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Ice Orange Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1124,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Ice Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1125,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Lime Green Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "225"
  },
  {
    id: 1126,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Lotus Flower Prizms FOTL",
    player: "harrison",
    team: "New York Liberty",
    copies: "3"
  },
  {
    id: 1127,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Mojo Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1128,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Mosaic Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "3"
  },
  {
    id: 1129,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Orange Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1130,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Pandora Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1131,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Pink Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "175"
  },
  {
    id: 1132,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Pink Velocity Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "79"
  },
  {
    id: 1133,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Purple Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1134,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Purple Velocity Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "59"
  },
  {
    id: 1135,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Red Pandora Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "199"
  },
  {
    id: 1136,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Red Power Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "75"
  },
  {
    id: 1137,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Red Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "299"
  },
  {
    id: 1138,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Red Pulsar Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "299"
  },
  {
    id: 1139,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Silver Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1140,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Snakeskin Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1141,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Swirl Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1142,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "Teal Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 1143,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "WNBA Logo Gold Prizms",
    player: "harrison",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1144,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "WNBA Logo Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1145,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "12",
    cardSet: "White Seismic Prizms",
    player: "harrison",
    team: "New York Liberty"
  },
  {
    id: 1146,
    year: 2018,
    product: "Rittenhouse WNBA",
    cardNumber: "78",
    cardSet: "Base",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1147,
    year: 2018,
    product: "Rittenhouse WNBA",
    cardNumber: "78",
    cardSet: "Platinum",
    player: "nurse",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1148,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "73",
    cardSet: "Base",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1149,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "73",
    cardSet: "Black Laser Press Proof",
    player: "nurse",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1150,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "73",
    cardSet: "Gold Laser Press Proof",
    player: "nurse",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1151,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "73",
    cardSet: "Optic",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1152,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "73",
    cardSet: "Optic Gold",
    player: "nurse",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1153,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "73",
    cardSet: "Optic Gold Vinyl",
    player: "nurse",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1154,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "73",
    cardSet: "Optic Holo",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1155,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "73",
    cardSet: "Purple Press Proof",
    player: "nurse",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1156,
    year: 2019,
    product: "Donruss WNBA",
    cardNumber: "73",
    cardSet: "Silver Press Proof",
    player: "nurse",
    team: "New York Liberty",
    copies: "199"
  },
  {
    id: 1157,
    year: 2019,
    product: "Sports Illustrated for Kids",
    cardNumber: "863",
    cardSet: "Base",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1158,
    year: 2019,
    product: "Sports Illustrated for Kids",
    cardNumber: "863-871",
    cardSet: "Full Panels",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1159,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "19",
    cardSet: "Base",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1160,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "19",
    cardSet: "Black",
    player: "nurse",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1161,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "19",
    cardSet: "Black Gold",
    player: "nurse",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1162,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "19",
    cardSet: "Blue",
    player: "nurse",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1163,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "19",
    cardSet: "Gold",
    player: "nurse",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1164,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "19",
    cardSet: "Green",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1165,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "19",
    cardSet: "Green Ice",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1166,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "19",
    cardSet: "Green Pulsar",
    player: "nurse",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1167,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "19",
    cardSet: "Hyper",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1168,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "19",
    cardSet: "Ice",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1169,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "19",
    cardSet: "Mojo",
    player: "nurse",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1170,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "19",
    cardSet: "Orange",
    player: "nurse",
    team: "New York Liberty",
    copies: "65"
  },
  {
    id: 1171,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "19",
    cardSet: "Purple",
    player: "nurse",
    team: "New York Liberty",
    copies: "125"
  },
  {
    id: 1172,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "19",
    cardSet: "Red",
    player: "nurse",
    team: "New York Liberty",
    copies: "275"
  },
  {
    id: 1173,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "19",
    cardSet: "Ruby Wave",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1174,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "19",
    cardSet: "Scope",
    player: "nurse",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1175,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "19",
    cardSet: "Silver",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1176,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-KNS",
    cardSet: "Signatures",
    player: "nurse",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1177,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-KNS",
    cardSet: "Signatures Black",
    player: "nurse",
    team: "New York Liberty",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1178,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-KNS",
    cardSet: "Signatures Gold",
    player: "nurse",
    team: "New York Liberty",
    isAuto: true,
    copies: "10"
  },
  {
    id: 1179,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-KNS",
    cardSet: "Signatures Green",
    player: "nurse",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1180,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-KNS",
    cardSet: "Signatures Green Ice",
    player: "nurse",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1181,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-KNS",
    cardSet: "Signatures Mojo",
    player: "nurse",
    team: "New York Liberty",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1182,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-KNS",
    cardSet: "Signatures Silver",
    player: "nurse",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1183,
    year: 2020,
    product: "Panini Prizm WNBA Premium",
    cardNumber: "19",
    cardSet: "Base",
    player: "nurse",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1184,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Base",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1185,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms 25th Anniversary",
    player: "nurse",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1186,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms Black",
    player: "nurse",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1187,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms Black Gold",
    player: "nurse",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1188,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms Blue",
    player: "nurse",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1189,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms Gold",
    player: "nurse",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1190,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms Green",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1191,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms Green Ice",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1192,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms Green Pulsar",
    player: "nurse",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1193,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms Hyper",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1194,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms Ice",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1195,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms Mojo",
    player: "nurse",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1196,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms Mosaic",
    player: "nurse",
    team: "New York Liberty",
    copies: "3"
  },
  {
    id: 1197,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms Orange",
    player: "nurse",
    team: "New York Liberty",
    copies: "50"
  },
  {
    id: 1198,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms Purple",
    player: "nurse",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1199,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms Red",
    player: "nurse",
    team: "New York Liberty",
    copies: "299"
  },
  {
    id: 1200,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms Ruby Wave",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1201,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms Silver",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1202,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "11",
    cardSet: "Prizms White Sparkle",
    player: "nurse",
    team: "New York Liberty"
  },
  {
    id: 1203,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-KNS",
    cardSet: "Signatures",
    player: "nurse",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1204,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-KNS",
    cardSet: "Signatures Black",
    player: "nurse",
    team: "New York Liberty",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1205,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-KNS",
    cardSet: "Signatures Gold",
    player: "nurse",
    team: "New York Liberty",
    isAuto: true,
    copies: "10"
  },
  {
    id: 1206,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-KNS",
    cardSet: "Signatures Green",
    player: "nurse",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1207,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-KNS",
    cardSet: "Signatures Green Ice",
    player: "nurse",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1208,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-KNS",
    cardSet: "Signatures Green Pulsar",
    player: "nurse",
    team: "New York Liberty",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1209,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-KNS",
    cardSet: "Signatures Mojo",
    player: "nurse",
    team: "New York Liberty",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1210,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-KNS",
    cardSet: "Signatures Silver",
    player: "nurse",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1211,
    year: 2021,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-KNS",
    cardSet: "Signatures White Sparkle",
    player: "nurse",
    team: "New York Liberty",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1212,
    year: 2021,
    product: "Panini Prizm WNBA Premium",
    cardNumber: "11",
    cardSet: "Base",
    player: "nurse",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1213,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Base",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1214,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Black Gold",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "5"
  },
  {
    id: 1215,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Blue",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "149"
  },
  {
    id: 1216,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Gold",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "10"
  },
  {
    id: 1217,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Gold Vinyl",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "1"
  },
  {
    id: 1218,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Green",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1219,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Green Ice",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1220,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Green Pulsar",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "25"
  },
  {
    id: 1221,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Hyper",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1222,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Ice",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1223,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Mojo",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "25"
  },
  {
    id: 1224,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Mosaic",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "3"
  },
  {
    id: 1225,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Orange",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "49"
  },
  {
    id: 1226,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Premium Box Set",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "99"
  },
  {
    id: 1227,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Purple",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "99"
  },
  {
    id: 1228,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Red",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "199"
  },
  {
    id: 1229,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Ruby Wave",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1230,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "Silver",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1231,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "88",
    cardSet: "White Sparkle",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1232,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "56",
    cardSet: "Base",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1233,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "56",
    cardSet: "Black",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "1"
  },
  {
    id: 1234,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "56",
    cardSet: "Blue",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "75"
  },
  {
    id: 1235,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "56",
    cardSet: "Gold",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "10"
  },
  {
    id: 1236,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "56",
    cardSet: "Rainbow",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1237,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "56",
    cardSet: "Red",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1238,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "56",
    cardSet: "Teal",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "35"
  },
  {
    id: 1239,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Base",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1240,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Black Gold Prizms",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "5"
  },
  {
    id: 1241,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Blue",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "175"
  },
  {
    id: 1242,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Blue Wave",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1243,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Gold",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "10"
  },
  {
    id: 1244,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Gold Vinyl",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "1"
  },
  {
    id: 1245,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Green",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1246,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Green Pulsar",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "25"
  },
  {
    id: 1247,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Hyper",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1248,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Ice",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1249,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Mojo",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "25"
  },
  {
    id: 1250,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Mosaic",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "3"
  },
  {
    id: 1251,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Orange",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "99"
  },
  {
    id: 1252,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Premium Box Set Prizms",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "99"
  },
  {
    id: 1253,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Purple",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "149"
  },
  {
    id: 1254,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Red",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "199"
  },
  {
    id: 1255,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Ruby Wave",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1256,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Silver",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1257,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "Teal",
    player: "nurse",
    team: "Phoenix Mercury",
    copies: "49"
  },
  {
    id: 1258,
    year: 2023,
    product: "Panini Prizm WNBA",
    cardNumber: "14",
    cardSet: "White Sparkle Prizms",
    player: "nurse",
    team: "Phoenix Mercury"
  },
  {
    id: 1259,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "36",
    cardSet: "Base",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1260,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "36",
    cardSet: "Blue Viper",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "1"
  },
  {
    id: 1261,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "36",
    cardSet: "Jaguar",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "10"
  },
  {
    id: 1262,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "36",
    cardSet: "Jungle",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "25"
  },
  {
    id: 1263,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "36",
    cardSet: "White Tiger",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "5"
  },
  {
    id: 1264,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "46",
    cardSet: "Base",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1265,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "46",
    cardSet: "Black",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "1"
  },
  {
    id: 1266,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "46",
    cardSet: "Blue",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "75"
  },
  {
    id: 1267,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "46",
    cardSet: "Gold",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "10"
  },
  {
    id: 1268,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "46",
    cardSet: "Purple",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "25"
  },
  {
    id: 1269,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "46",
    cardSet: "Red",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "99"
  },
  {
    id: 1270,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "46",
    cardSet: "Swirl",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1271,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "46",
    cardSet: "Teal",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "49"
  },
  {
    id: 1272,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Base",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1273,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Black Gold Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "5"
  },
  {
    id: 1274,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Black Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "1"
  },
  {
    id: 1275,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Blue Millionaire Shimmer Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "10"
  },
  {
    id: 1276,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Boardwalk Blue Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "15"
  },
  {
    id: 1277,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Brown Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "249"
  },
  {
    id: 1278,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Classic Icons Red Prizm",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1279,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Deal Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1280,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Dice Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1281,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Free Parking Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1282,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Go Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1283,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Gold Millionaire Shimmer Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "500"
  },
  {
    id: 1284,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Gold Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "49"
  },
  {
    id: 1285,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Gold Wave Millionaire Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "10"
  },
  {
    id: 1286,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Green Millionaire Shimmer Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "20"
  },
  {
    id: 1287,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Green Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "24"
  },
  {
    id: 1288,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Light Blue Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "199"
  },
  {
    id: 1289,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Monopoly Man Black and White Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1290,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Neon Green Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "10"
  },
  {
    id: 1291,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Orange Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "124"
  },
  {
    id: 1292,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Pink Millionaire Shimmer Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "5"
  },
  {
    id: 1293,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Pink Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "149"
  },
  {
    id: 1294,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Purple Millionaire Shimmer Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "50"
  },
  {
    id: 1295,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Purple Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1296,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Question Mark Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "25"
  },
  {
    id: 1297,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Red Millionaire Shimmer Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "100"
  },
  {
    id: 1298,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Red Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "99"
  },
  {
    id: 1299,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Silver Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1300,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "Tiger Stripe Boardwalk Blue Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1301,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "16",
    cardSet: "White Millionaire Shimmer Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "1"
  },
  {
    id: 1302,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "10",
    cardSet: "Fractal",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1303,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "10",
    cardSet: "Fractal Prizms Blue",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "49"
  },
  {
    id: 1304,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "10",
    cardSet: "Fractal Prizms Blue Pulsar",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "199"
  },
  {
    id: 1305,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "10",
    cardSet: "Fractal Prizms Gold",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "10"
  },
  {
    id: 1306,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "10",
    cardSet: "Fractal Prizms Gold Vinyl",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "1"
  },
  {
    id: 1307,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "10",
    cardSet: "Fractal Prizms Green",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1308,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "10",
    cardSet: "Fractal Prizms Green Pulsar",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "25"
  },
  {
    id: 1309,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "10",
    cardSet: "Fractal Prizms Mojo",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "25"
  },
  {
    id: 1310,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "10",
    cardSet: "Fractal Prizms Orange Pulsar",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "75"
  },
  {
    id: 1311,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "10",
    cardSet: "Fractal Prizms Red",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "99"
  },
  {
    id: 1312,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Base",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1313,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Black Finite Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "1"
  },
  {
    id: 1314,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Black Gold Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "5"
  },
  {
    id: 1315,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Black Velocity Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "39"
  },
  {
    id: 1316,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Blue Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "199"
  },
  {
    id: 1317,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Blue Pulsar Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "199"
  },
  {
    id: 1318,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Blue Velocity Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1319,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Checkerboard Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1320,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Cherry Blossom FOTL Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "20"
  },
  {
    id: 1321,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Gold Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "10"
  },
  {
    id: 1322,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Gold Vinyl Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "1"
  },
  {
    id: 1323,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Green Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1324,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Green Pulsar Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "25"
  },
  {
    id: 1325,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Ice Gold Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "10"
  },
  {
    id: 1326,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Ice Orange Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1327,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Ice Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1328,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Ice White Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "35"
  },
  {
    id: 1329,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Lotus Flower FOTL Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "3"
  },
  {
    id: 1330,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Mojo Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "25"
  },
  {
    id: 1331,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Mosaic Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "3"
  },
  {
    id: 1332,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Orange Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "99"
  },
  {
    id: 1333,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Orange Velocity Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1334,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Pink Velocity Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "79"
  },
  {
    id: 1335,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Premium Box Set Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "99"
  },
  {
    id: 1336,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Pulsar Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "499"
  },
  {
    id: 1337,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Purple Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "149"
  },
  {
    id: 1338,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Red Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "299"
  },
  {
    id: 1339,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Red Pulsar Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "299"
  },
  {
    id: 1340,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Silver Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1341,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Snakeskin Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1342,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "Teal Prizms",
    player: "nurse",
    team: "Los Angeles Sparks",
    copies: "49"
  },
  {
    id: 1343,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "WNBA Logo Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1344,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "129",
    cardSet: "White Sparkle Prizms",
    player: "nurse",
    team: "Los Angeles Sparks"
  },
  {
    id: 1345,
    year: 2025,
    product: "Dick's Sporting Goods WNBA Chicago Sky SGA",
    cardNumber: "NNO",
    cardSet: "Base",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1346,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Base",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1347,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Artist Proof",
    player: "nurse",
    team: "Chicago Sky",
    copies: "25"
  },
  {
    id: 1348,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Black Gold Laser",
    player: "nurse",
    team: "Chicago Sky",
    copies: "5"
  },
  {
    id: 1349,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Black Holo Press Proof",
    player: "nurse",
    team: "Chicago Sky",
    copies: "1"
  },
  {
    id: 1350,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Black Shimmer",
    player: "nurse",
    team: "Chicago Sky",
    copies: "1"
  },
  {
    id: 1351,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Blue Laser",
    player: "nurse",
    team: "Chicago Sky",
    copies: "49"
  },
  {
    id: 1352,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Blue Shimmer",
    player: "nurse",
    team: "Chicago Sky",
    copies: "49"
  },
  {
    id: 1353,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Cubic",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1354,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Dragon",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1355,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Gold Shimmer",
    player: "nurse",
    team: "Chicago Sky",
    copies: "10"
  },
  {
    id: 1356,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Green Laser",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1357,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Green Shimmer",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1358,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Holo",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1359,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Holo Black Laser",
    player: "nurse",
    team: "Chicago Sky",
    copies: "1"
  },
  {
    id: 1360,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Holo Gold Laser",
    player: "nurse",
    team: "Chicago Sky",
    copies: "10"
  },
  {
    id: 1361,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Holo Team Logo",
    player: "nurse",
    team: "Chicago Sky",
    copies: "13"
  },
  {
    id: 1362,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Holo WNBA Logo",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1363,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Lava",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1364,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Light Blue Lava",
    player: "nurse",
    team: "Chicago Sky",
    copies: "75"
  },
  {
    id: 1365,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Orange Laser",
    player: "nurse",
    team: "Chicago Sky",
    copies: "199"
  },
  {
    id: 1366,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Orange Lava",
    player: "nurse",
    team: "Chicago Sky",
    copies: "199"
  },
  {
    id: 1367,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Pink Laser",
    player: "nurse",
    team: "Chicago Sky",
    copies: "25"
  },
  {
    id: 1368,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Pink Shimmer",
    player: "nurse",
    team: "Chicago Sky",
    copies: "25"
  },
  {
    id: 1369,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Purple Laser",
    player: "nurse",
    team: "Chicago Sky",
    copies: "99"
  },
  {
    id: 1370,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Purple Lava",
    player: "nurse",
    team: "Chicago Sky",
    copies: "99"
  },
  {
    id: 1371,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Purple Shimmer",
    player: "nurse",
    team: "Chicago Sky",
    copies: "99"
  },
  {
    id: 1372,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Red Holo",
    player: "nurse",
    team: "Chicago Sky",
    copies: "299"
  },
  {
    id: 1373,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Red Lava",
    player: "nurse",
    team: "Chicago Sky",
    copies: "399"
  },
  {
    id: 1374,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Red Shimmer",
    player: "nurse",
    team: "Chicago Sky",
    copies: "399"
  },
  {
    id: 1375,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Teal Laser",
    player: "nurse",
    team: "Chicago Sky",
    copies: "125"
  },
  {
    id: 1376,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "6",
    cardSet: "Yellow Lava",
    player: "nurse",
    team: "Chicago Sky",
    copies: "5"
  },
  {
    id: 1377,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "24",
    cardSet: "Jersey Series",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1378,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "24",
    cardSet: "Jersey Series Gold",
    player: "nurse",
    team: "Chicago Sky",
    copies: "10"
  },
  {
    id: 1379,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "24",
    cardSet: "Jersey Series Green",
    player: "nurse",
    team: "Chicago Sky",
    copies: "30"
  },
  {
    id: 1380,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "24",
    cardSet: "Jersey Series Holo Platinum Blue",
    player: "nurse",
    team: "Chicago Sky",
    copies: "1"
  },
  {
    id: 1381,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "24",
    cardSet: "Jersey Series Prime",
    player: "nurse",
    team: "Chicago Sky",
    copies: "25"
  },
  {
    id: 1382,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "24",
    cardSet: "Jersey Series Red",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1383,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "64",
    cardSet: "Base",
    player: "nurse",
    team: "Chicago Sky",
    copies: "75"
  },
  {
    id: 1384,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "64",
    cardSet: "Amethyst",
    player: "nurse",
    team: "Chicago Sky",
    copies: "8"
  },
  {
    id: 1385,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "64",
    cardSet: "Gold",
    player: "nurse",
    team: "Chicago Sky",
    copies: "25"
  },
  {
    id: 1386,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "64",
    cardSet: "Holo Gold",
    player: "nurse",
    team: "Chicago Sky",
    copies: "10"
  },
  {
    id: 1387,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "64",
    cardSet: "Holo Silver",
    player: "nurse",
    team: "Chicago Sky",
    copies: "15"
  },
  {
    id: 1388,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "64",
    cardSet: "Platinum",
    player: "nurse",
    team: "Chicago Sky",
    copies: "1"
  },
  {
    id: 1389,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "64",
    cardSet: "Silver",
    player: "nurse",
    team: "Chicago Sky",
    copies: "40"
  },
  {
    id: 1390,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "INK-KN",
    cardSet: "Indelible Ink Signatures",
    player: "nurse",
    team: "Chicago Sky",
    isAuto: true,
    copies: "99"
  },
  {
    id: 1391,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "INK-KN",
    cardSet: "Indelible Ink Signatures Gold",
    player: "nurse",
    team: "Chicago Sky",
    isAuto: true,
    copies: "49"
  },
  {
    id: 1392,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "INK-KN",
    cardSet: "Indelible Ink Signatures Holo Gold",
    player: "nurse",
    team: "Chicago Sky",
    copies: "10"
  },
  {
    id: 1393,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "INK-KN",
    cardSet: "Indelible Ink Signatures Holo Silver",
    player: "nurse",
    team: "Chicago Sky",
    copies: "25"
  },
  {
    id: 1394,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "INK-KN",
    cardSet: "Indelible Ink Signatures Platinum",
    player: "nurse",
    team: "Chicago Sky",
    copies: "1"
  },
  {
    id: 1395,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "22",
    cardSet: "Base",
    player: "nurse",
    team: "Chicago Sky",
    copies: "99"
  },
  {
    id: 1396,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "22",
    cardSet: "Holo Emerald",
    player: "nurse",
    team: "Chicago Sky",
    copies: "5"
  },
  {
    id: 1397,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "22",
    cardSet: "Holo Gold",
    player: "nurse",
    team: "Chicago Sky",
    copies: "10"
  },
  {
    id: 1398,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "22",
    cardSet: "Holo Platinum Blue",
    player: "nurse",
    team: "Chicago Sky",
    copies: "1"
  },
  {
    id: 1399,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "22",
    cardSet: "Pink",
    player: "nurse",
    team: "Chicago Sky",
    copies: "6"
  },
  {
    id: 1400,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "22",
    cardSet: "Purple",
    player: "nurse",
    team: "Chicago Sky",
    copies: "25"
  },
  {
    id: 1401,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Base",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1402,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Black Finite Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "1"
  },
  {
    id: 1403,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Black Velocity Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "39"
  },
  {
    id: 1404,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Blue Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "199"
  },
  {
    id: 1405,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Blue Pulsar Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "199"
  },
  {
    id: 1406,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Blue Velocity Prizms",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1407,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Carolina Blue Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "125"
  },
  {
    id: 1408,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Checkerboard Prizms",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1409,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Cherry Blossoms Prizms FOTL",
    player: "nurse",
    team: "Chicago Sky",
    copies: "20"
  },
  {
    id: 1410,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Gold Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "10"
  },
  {
    id: 1411,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Gold Vinyl Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "1"
  },
  {
    id: 1412,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Green Prizms",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1413,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Green Pulsar Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "25"
  },
  {
    id: 1414,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Ice Orange Prizms",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1415,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Ice Prizms",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1416,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Lime Green Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "225"
  },
  {
    id: 1417,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Lotus Flower Prizms FOTL",
    player: "nurse",
    team: "Chicago Sky",
    copies: "3"
  },
  {
    id: 1418,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Mojo Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "25"
  },
  {
    id: 1419,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Mosaic Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "3"
  },
  {
    id: 1420,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Orange Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "99"
  },
  {
    id: 1421,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Pandora Prizms",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1422,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Pink Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "175"
  },
  {
    id: 1423,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Pink Velocity Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "79"
  },
  {
    id: 1424,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Purple Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "149"
  },
  {
    id: 1425,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Purple Velocity Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "59"
  },
  {
    id: 1426,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Red Pandora Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "199"
  },
  {
    id: 1427,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Red Power Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "75"
  },
  {
    id: 1428,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Red Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "299"
  },
  {
    id: 1429,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Red Pulsar Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "299"
  },
  {
    id: 1430,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Silver Prizms",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1431,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Snakeskin Prizms",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1432,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Swirl Prizms",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1433,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "Teal Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "49"
  },
  {
    id: 1434,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "WNBA Logo Gold Prizms",
    player: "nurse",
    team: "Chicago Sky",
    copies: "10"
  },
  {
    id: 1435,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "WNBA Logo Prizms",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1436,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "White Seismic Prizms",
    player: "nurse",
    team: "Chicago Sky"
  },
  {
    id: 1437,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Base",
    player: "sabally",
    team: "New York Liberty",
    isRookie: true
  },
  {
    id: 1438,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Black Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1439,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Blue",
    player: "sabally",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1440,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1441,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Gold Vinyl",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1442,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Green",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1443,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Green Ice",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1444,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Green Pulsar",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1445,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Hyper",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1446,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Ice",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1447,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Mojo",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1448,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Mosaic",
    player: "sabally",
    team: "New York Liberty",
    copies: "3"
  },
  {
    id: 1449,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Orange",
    player: "sabally",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 1450,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Premium Box Set",
    player: "sabally",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1451,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Purple",
    player: "sabally",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1452,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Red",
    player: "sabally",
    team: "New York Liberty",
    copies: "199"
  },
  {
    id: 1453,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Ruby Wave",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1454,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "Silver",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1455,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "185",
    cardSet: "White Sparkle",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1456,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NSB",
    cardSet: "Signatures",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1457,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NSB",
    cardSet: "Signatures Prizms Gold",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "10"
  },
  {
    id: 1458,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NSB",
    cardSet: "Signatures Prizms Gold Vinyl",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1459,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NSB",
    cardSet: "Signatures Prizms Green",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1460,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NSB",
    cardSet: "Signatures Prizms Green Ice",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1461,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NSB",
    cardSet: "Signatures Prizms Green Pulsar",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1462,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NSB",
    cardSet: "Signatures Prizms Mojo",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1463,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NSB",
    cardSet: "Signatures Prizms Silver",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1464,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NSB",
    cardSet: "Signatures Prizms White Sparkle",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1465,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "2",
    cardSet: "Rookie Revolution",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1466,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "2",
    cardSet: "Rookie Revolution Cubic",
    player: "sabally",
    team: "New York Liberty",
    copies: "50"
  },
  {
    id: 1467,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "2",
    cardSet: "Rookie Revolution Fractal",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1468,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "2",
    cardSet: "Rookie Revolution Galactic",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1469,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "93",
    cardSet: "Base",
    player: "sabally",
    team: "New York Liberty",
    isRookie: true
  },
  {
    id: 1470,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "93",
    cardSet: "Astro",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1471,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "93",
    cardSet: "Cosmic",
    player: "sabally",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1472,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "93",
    cardSet: "Cubic",
    player: "sabally",
    team: "New York Liberty",
    copies: "50"
  },
  {
    id: 1473,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "93",
    cardSet: "Fractal",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1474,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "93",
    cardSet: "Galactic",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1475,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "93",
    cardSet: "Groove",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1476,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "93",
    cardSet: "Impact",
    player: "sabally",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1477,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "93",
    cardSet: "Lava",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1478,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "93",
    cardSet: "Sunburst",
    player: "sabally",
    team: "New York Liberty",
    copies: "75"
  },
  {
    id: 1479,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "AG-NSB",
    cardSet: "Autographs",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1480,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "AG-NSB",
    cardSet: "Autographs Cubic",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "50"
  },
  {
    id: 1481,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "AG-NSB",
    cardSet: "Autographs Fractal",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "99"
  },
  {
    id: 1482,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "AG-NSB",
    cardSet: "Autographs Infinite",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1483,
    year: 2022,
    product: "Panini Revolution WNBA",
    cardNumber: "AG-NSB",
    cardSet: "Autographs Kaleido",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1484,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "76",
    cardSet: "Base",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1485,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "76",
    cardSet: "Black",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1486,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "76",
    cardSet: "Blue",
    player: "sabally",
    team: "New York Liberty",
    copies: "75"
  },
  {
    id: 1487,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "76",
    cardSet: "Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1488,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "76",
    cardSet: "Rainbow",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1489,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "76",
    cardSet: "Red",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1490,
    year: 2023,
    product: "Panini Origins WNBA",
    cardNumber: "76",
    cardSet: "Teal",
    player: "sabally",
    team: "New York Liberty",
    copies: "35"
  },
  {
    id: 1491,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "280",
    cardSet: "Base",
    player: "sabally",
    team: "New York Liberty",
    copies: "85"
  },
  {
    id: 1492,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "280",
    cardSet: "Blue Viper",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1493,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "280",
    cardSet: "Jaguar",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1494,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "280",
    cardSet: "Jungle",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1495,
    year: 2024,
    product: "Panini Instant WNBA",
    cardNumber: "280",
    cardSet: "White Tiger",
    player: "sabally",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1496,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "AN-NS",
    cardSet: "Art Nouveau Memorabilia",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1497,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "AN-NS",
    cardSet: "Art Nouveau Memorabilia Black",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1498,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "AN-NS",
    cardSet: "Art Nouveau Memorabilia Blue",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1499,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "AN-NS",
    cardSet: "Art Nouveau Memorabilia Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1500,
    year: 2024,
    product: "Panini Origins WNBA",
    cardNumber: "AN-NS",
    cardSet: "Art Nouveau Memorabilia Red",
    player: "sabally",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 1501,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Base",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1502,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Black Gold Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1503,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Black Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1504,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Blue Millionaire Shimmer Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1505,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Boardwalk Blue Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "15"
  },
  {
    id: 1506,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Brown Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "249"
  },
  {
    id: 1507,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Classic Icons Red Prizm",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1508,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Deal Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1509,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Dice Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1510,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Free Parking Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1511,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Go Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1512,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Gold Millionaire Shimmer Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "500"
  },
  {
    id: 1513,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Gold Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 1514,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Gold Wave Millionaire Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1515,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Green Millionaire Shimmer Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "20"
  },
  {
    id: 1516,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Green Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "24"
  },
  {
    id: 1517,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Light Blue Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "199"
  },
  {
    id: 1518,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Monopoly Man Black and White Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1519,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Neon Green Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1520,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Orange Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "124"
  },
  {
    id: 1521,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Pink Millionaire Shimmer Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1522,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Pink Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1523,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Purple Millionaire Shimmer Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "50"
  },
  {
    id: 1524,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Purple Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1525,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Question Mark Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1526,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Red Millionaire Shimmer Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "100"
  },
  {
    id: 1527,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Red Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1528,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Silver Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1529,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "Tiger Stripe Boardwalk Blue Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1530,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "32",
    cardSet: "White Millionaire Shimmer Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1531,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Base",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1532,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Black Finite Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1533,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Black Gold Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1534,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Black Velocity Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "39"
  },
  {
    id: 1535,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Blue Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "199"
  },
  {
    id: 1536,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Blue Pulsar Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "199"
  },
  {
    id: 1537,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Blue Velocity Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1538,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Checkerboard Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1539,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Cherry Blossom FOTL Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "20"
  },
  {
    id: 1540,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Gold Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1541,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Gold Vinyl Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1542,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Green Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1543,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Green Pulsar Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1544,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Ice Gold Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1545,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Ice Orange Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1546,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Ice Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1547,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Ice White Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "35"
  },
  {
    id: 1548,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Lotus Flower FOTL Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "3"
  },
  {
    id: 1549,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Mojo Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1550,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Mosaic Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "3"
  },
  {
    id: 1551,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Orange Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1552,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Orange Velocity Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1553,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Pink Velocity Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "79"
  },
  {
    id: 1554,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Premium Box Set Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1555,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Pulsar Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "499"
  },
  {
    id: 1556,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Purple Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1557,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Red Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "299"
  },
  {
    id: 1558,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Red Pulsar Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "299"
  },
  {
    id: 1559,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Silver Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1560,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Snakeskin Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1561,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "Teal Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 1562,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "WNBA Logo Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1563,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "87",
    cardSet: "White Sparkle Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1564,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1565,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Blue",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "75"
  },
  {
    id: 1566,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Gold",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "10"
  },
  {
    id: 1567,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Gold Vinyl",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1568,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Green",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1569,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Green Pulsar",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1570,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Mojo",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1571,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Purple",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "49"
  },
  {
    id: 1572,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Red",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "99"
  },
  {
    id: 1573,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Teal",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "35"
  },
  {
    id: 1574,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms White Sparkle",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1575,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "14",
    cardSet: "Select Future",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1576,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "14",
    cardSet: "Select Future Prizms Black Finite",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1577,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "14",
    cardSet: "Select Future Prizms Black Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1578,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "14",
    cardSet: "Select Future Prizms Black Pandora",
    player: "sabally",
    team: "New York Liberty",
    copies: "8"
  },
  {
    id: 1579,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "14",
    cardSet: "Select Future Prizms Blue",
    player: "sabally",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 1580,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "14",
    cardSet: "Select Future Prizms Blue Flash",
    player: "sabally",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1581,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "14",
    cardSet: "Select Future Prizms Flash",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1582,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "14",
    cardSet: "Select Future Prizms Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1583,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "14",
    cardSet: "Select Future Prizms Gold Flash",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1584,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "14",
    cardSet: "Select Future Prizms Gold Vinyl",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1585,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "14",
    cardSet: "Select Future Prizms Silver",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1586,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "14",
    cardSet: "Select Future Prizms Tie-Dye",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1587,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "14",
    cardSet: "Select Future Prizms White Disco",
    player: "sabally",
    team: "New York Liberty",
    copies: "75"
  },
  {
    id: 1588,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Base",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1589,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Black Finite",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1590,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Black Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1591,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Bronze Checker",
    player: "sabally",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 1592,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1593,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Gold Flash",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1594,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Gold Vinyl",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1595,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Green Ice",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1596,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Ice Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1597,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Light Blue Disco",
    player: "sabally",
    team: "New York Liberty",
    copies: "125"
  },
  {
    id: 1598,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Neon Green",
    player: "sabally",
    team: "New York Liberty",
    copies: "75"
  },
  {
    id: 1599,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Pink Ice",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1600,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Pink Shimmer FOTL",
    player: "sabally",
    team: "New York Liberty",
    copies: "3"
  },
  {
    id: 1601,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Pink and Purple",
    player: "sabally",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1602,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Purple Ice",
    player: "sabally",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1603,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Red",
    player: "sabally",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1604,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Red Ice",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1605,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Red and Blue",
    player: "sabally",
    team: "New York Liberty",
    copies: "399"
  },
  {
    id: 1606,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Silver",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1607,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Silver Flash",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1608,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Tie-Dye",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1609,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Tiger",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1610,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms White",
    player: "sabally",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1611,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "66",
    cardSet: "Prizms Zebra",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1612,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Base",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1613,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Black Finite",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1614,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Black Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1615,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Bronze Checker",
    player: "sabally",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 1616,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1617,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Gold Flash",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1618,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Gold Vinyl",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1619,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Green Ice",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1620,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Ice Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1621,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Neon Green",
    player: "sabally",
    team: "New York Liberty",
    copies: "75"
  },
  {
    id: 1622,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Orange",
    player: "sabally",
    team: "New York Liberty",
    copies: "125"
  },
  {
    id: 1623,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Pink Ice",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1624,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Pink Shimmer FOTL",
    player: "sabally",
    team: "New York Liberty",
    copies: "3"
  },
  {
    id: 1625,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Pink and Purple",
    player: "sabally",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1626,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Purple",
    player: "sabally",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1627,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Purple Ice",
    player: "sabally",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1628,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Red Ice",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1629,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Red and Blue",
    player: "sabally",
    team: "New York Liberty",
    copies: "399"
  },
  {
    id: 1630,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Silver",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1631,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Silver Flash",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1632,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Tie-Dye",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1633,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Tiger",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1634,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms White",
    player: "sabally",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1635,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "111",
    cardSet: "Prizms Zebra",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1636,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "CSA-NS",
    cardSet: "Courtside Action Signatures",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1637,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "CSA-NS",
    cardSet: "Courtside Action Signatures Prizms Black Finite",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1638,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "CSA-NS",
    cardSet: "Courtside Action Signatures Prizms Black Gold",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "5"
  },
  {
    id: 1639,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "CSA-NS",
    cardSet: "Courtside Action Signatures Prizms Blue",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "49"
  },
  {
    id: 1640,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "CSA-NS",
    cardSet: "Courtside Action Signatures Prizms Gold",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "10"
  },
  {
    id: 1641,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "CSA-NS",
    cardSet: "Courtside Action Signatures Prizms Gold Ice",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "10"
  },
  {
    id: 1642,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "CSA-NS",
    cardSet: "Courtside Action Signatures Prizms Gold Vinyl",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1643,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "CSA-NS",
    cardSet: "Courtside Action Signatures Prizms Ice",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1644,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "CSA-NS",
    cardSet: "Courtside Action Signatures Prizms Pink Ice Shimmer FOTL",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "5"
  },
  {
    id: 1645,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "CSA-NS",
    cardSet: "Courtside Action Signatures Prizms Red",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "99"
  },
  {
    id: 1646,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "CSA-NS",
    cardSet: "Courtside Action Signatures Prizms Tie-Dye",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1647,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "CSA-NS",
    cardSet: "Courtside Action Signatures Prizms White Ice",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1648,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1649,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Black Finite",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1650,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Black Gold",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "5"
  },
  {
    id: 1651,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Blue",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "49"
  },
  {
    id: 1652,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Gold",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "10"
  },
  {
    id: 1653,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Gold Ice",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "10"
  },
  {
    id: 1654,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Gold Vinyl",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1655,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Ice",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1656,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Pink Ice Shimmer",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "5"
  },
  {
    id: 1657,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Red",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "99"
  },
  {
    id: 1658,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms Tie-Dye",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1659,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SG-NS",
    cardSet: "Signatures Prizms White Ice",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1660,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SW-NS",
    cardSet: "Selective Swatches",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1661,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SW-NS",
    cardSet: "Selective Swatches Prizms Black Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1662,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SW-NS",
    cardSet: "Selective Swatches Prizms Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1663,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SW-NS",
    cardSet: "Selective Swatches Prizms Gold Vinyl",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1664,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SW-NS",
    cardSet: "Selective Swatches Prizms Purple",
    player: "sabally",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 1665,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "SW-NS",
    cardSet: "Selective Swatches Prizms Tie-Dye",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1666,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "4",
    cardSet: "Jersey Series",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1667,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "4",
    cardSet: "Jersey Series Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1668,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "4",
    cardSet: "Jersey Series Green",
    player: "sabally",
    team: "New York Liberty",
    copies: "30"
  },
  {
    id: 1669,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "4",
    cardSet: "Jersey Series Holo Platinum Blue",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1670,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "4",
    cardSet: "Jersey Series Prime",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1671,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "4",
    cardSet: "Jersey Series Red",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1672,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "9",
    cardSet: "Championship Moments",
    player: "sabally",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1673,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Base",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1674,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Artist Proof",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1675,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Black Gold Laser",
    player: "sabally",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1676,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Black Holo Press Proof",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1677,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Black Shimmer",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1678,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Blue Laser",
    player: "sabally",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 1679,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Blue Shimmer",
    player: "sabally",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 1680,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Cubic",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1681,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Dragon",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1682,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Gold Shimmer",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1683,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Green Laser",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1684,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Green Shimmer",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1685,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Holo",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1686,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Holo Black Laser",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1687,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Holo Gold Laser",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1688,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Holo Team Logo",
    player: "sabally",
    team: "New York Liberty",
    copies: "13"
  },
  {
    id: 1689,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Holo WNBA Logo",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1690,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Lava",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1691,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Light Blue Lava",
    player: "sabally",
    team: "New York Liberty",
    copies: "75"
  },
  {
    id: 1692,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Orange Laser",
    player: "sabally",
    team: "New York Liberty",
    copies: "199"
  },
  {
    id: 1693,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Orange Lava",
    player: "sabally",
    team: "New York Liberty",
    copies: "199"
  },
  {
    id: 1694,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Pink Laser",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1695,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Pink Shimmer",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1696,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Purple Laser",
    player: "sabally",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1697,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Purple Lava",
    player: "sabally",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1698,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Purple Shimmer",
    player: "sabally",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1699,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Red Holo",
    player: "sabally",
    team: "New York Liberty",
    copies: "299"
  },
  {
    id: 1700,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Red Lava",
    player: "sabally",
    team: "New York Liberty",
    copies: "399"
  },
  {
    id: 1701,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Red Shimmer",
    player: "sabally",
    team: "New York Liberty",
    copies: "399"
  },
  {
    id: 1702,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Teal Laser",
    player: "sabally",
    team: "New York Liberty",
    copies: "125"
  },
  {
    id: 1703,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "67",
    cardSet: "Yellow Lava",
    player: "sabally",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1704,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-NS",
    cardSet: "Signature Series",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1705,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-NS",
    cardSet: "Signature Series Black Gold Laser",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "5"
  },
  {
    id: 1706,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-NS",
    cardSet: "Signature Series Blue Laser",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1707,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-NS",
    cardSet: "Signature Series Gold Laser",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "10"
  },
  {
    id: 1708,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-NS",
    cardSet: "Signature Series Holo Black Laser",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1709,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-NS",
    cardSet: "Signature Series Holo Frame",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "49"
  },
  {
    id: 1710,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-NS",
    cardSet: "Signature Series Holo Laser",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1711,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-NS",
    cardSet: "Signature Series Lava",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true
  },
  {
    id: 1712,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "SS-NS",
    cardSet: "Signature Series Orange Laser",
    player: "sabally",
    team: "New York Liberty",
    isAuto: true,
    copies: "15"
  },
  {
    id: 1713,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "85",
    cardSet: "Base",
    player: "sabally",
    team: "New York Liberty",
    copies: "75"
  },
  {
    id: 1714,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "85",
    cardSet: "Amethyst",
    player: "sabally",
    team: "New York Liberty",
    copies: "8"
  },
  {
    id: 1715,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "85",
    cardSet: "Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1716,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "85",
    cardSet: "Holo Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1717,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "85",
    cardSet: "Holo Silver",
    player: "sabally",
    team: "New York Liberty",
    copies: "15"
  },
  {
    id: 1718,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "85",
    cardSet: "Platinum",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1719,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "85",
    cardSet: "Silver",
    player: "sabally",
    team: "New York Liberty",
    copies: "40"
  },
  {
    id: 1720,
    year: 2025,
    product: "Panini Instant WNBA",
    cardNumber: "102",
    cardSet: "Base",
    player: "sabally",
    team: "New York Liberty",
    copies: "86"
  },
  {
    id: 1721,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "79",
    cardSet: "Base",
    player: "sabally",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1722,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "79",
    cardSet: "Holo Emerald",
    player: "sabally",
    team: "New York Liberty",
    copies: "5"
  },
  {
    id: 1723,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "79",
    cardSet: "Holo Gold",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1724,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "79",
    cardSet: "Holo Platinum Blue",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1725,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "79",
    cardSet: "Pink",
    player: "sabally",
    team: "New York Liberty",
    copies: "6"
  },
  {
    id: 1726,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "79",
    cardSet: "Purple",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1727,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Base",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1728,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Black Finite Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1729,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Black Velocity Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "39"
  },
  {
    id: 1730,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Blue Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "199"
  },
  {
    id: 1731,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Blue Pulsar Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "199"
  },
  {
    id: 1732,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Blue Velocity Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1733,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Carolina Blue Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "125"
  },
  {
    id: 1734,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Checkerboard Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1735,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Cherry Blossoms Prizms FOTL",
    player: "sabally",
    team: "New York Liberty",
    copies: "20"
  },
  {
    id: 1736,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Gold Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1737,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Gold Vinyl Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "1"
  },
  {
    id: 1738,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Green Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1739,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Green Pulsar Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1740,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Ice Orange Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1741,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Ice Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1742,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Lime Green Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "225"
  },
  {
    id: 1743,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Lotus Flower Prizms FOTL",
    player: "sabally",
    team: "New York Liberty",
    copies: "3"
  },
  {
    id: 1744,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Mojo Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "25"
  },
  {
    id: 1745,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Mosaic Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "3"
  },
  {
    id: 1746,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Orange Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "99"
  },
  {
    id: 1747,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Pandora Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1748,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Pink Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "175"
  },
  {
    id: 1749,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Pink Velocity Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "79"
  },
  {
    id: 1750,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Purple Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "149"
  },
  {
    id: 1751,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Purple Velocity Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "59"
  },
  {
    id: 1752,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Red Pandora Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "199"
  },
  {
    id: 1753,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Red Power Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "75"
  },
  {
    id: 1754,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Red Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "299"
  },
  {
    id: 1755,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Red Pulsar Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "299"
  },
  {
    id: 1756,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Silver Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1757,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Snakeskin Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1758,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Swirl Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1759,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "Teal Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "49"
  },
  {
    id: 1760,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "WNBA Logo Gold Prizms",
    player: "sabally",
    team: "New York Liberty",
    copies: "10"
  },
  {
    id: 1761,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "WNBA Logo Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1762,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "117",
    cardSet: "White Seismic Prizms",
    player: "sabally",
    team: "New York Liberty"
  },
  {
    id: 1763,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "1",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)"
  },
  {
    id: 1764,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "13",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)"
  },
  {
    id: 1765,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "23",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)"
  },
  {
    id: 1766,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "28",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)"
  },
  {
    id: 1767,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "33",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)"
  },
  {
    id: 1768,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "38",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)"
  },
  {
    id: 1769,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "43",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)"
  },
  {
    id: 1770,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "48",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)"
  },
  {
    id: 1771,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "53",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)"
  },
  {
    id: 1772,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "58",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)"
  },
  {
    id: 1773,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "63",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)"
  },
  {
    id: 1774,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "68",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)"
  },
  {
    id: 1775,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "73",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)",
    isAuto: true
  },
  {
    id: 1776,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "76",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)",
    isAuto: true
  },
  {
    id: 1777,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "79",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1778,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "82",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)",
    isAuto: true,
    copies: "9"
  },
  {
    id: 1779,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "85",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1780,
    year: 2023,
    product: "ONIT Athlete Alabama Crimson Tide Women",
    cardNumber: "88",
    cardSet: "Base",
    player: "nye",
    team: "Alabama (NCAA)",
    isAuto: true,
    copies: "9"
  },
  {
    id: 1781,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "78",
    cardSet: "Base",
    player: "nye",
    team: "Las Vegas Aces",
    isRookie: true,
    copies: "75"
  },
  {
    id: 1782,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "78",
    cardSet: "Amethyst",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "8"
  },
  {
    id: 1783,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "78",
    cardSet: "Gold",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "25"
  },
  {
    id: 1784,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "78",
    cardSet: "Holo Gold",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "10"
  },
  {
    id: 1785,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "78",
    cardSet: "Holo Silver",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "15"
  },
  {
    id: 1786,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "78",
    cardSet: "Platinum",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "1"
  },
  {
    id: 1787,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "78",
    cardSet: "Silver",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "40"
  },
  {
    id: 1788,
    year: 2025,
    product: "Panini Instant WNBA",
    cardNumber: "3",
    cardSet: "Base",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "196"
  },
  {
    id: 1789,
    year: 2025,
    product: "Panini Instant WNBA",
    cardNumber: "53",
    cardSet: "Base",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "59"
  },
  {
    id: 1790,
    year: 2025,
    product: "Panini Instant WNBA",
    cardNumber: "110",
    cardSet: "Base",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "90"
  },
  {
    id: 1791,
    year: 2025,
    product: "Panini Instant WNBA Retro Rated Rookies",
    cardNumber: "RRR-14",
    cardSet: "Base",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "2467"
  },
  {
    id: 1792,
    year: 2025,
    product: "Panini Instant WNBA The Incoming Class",
    cardNumber: "IC-10",
    cardSet: "Base",
    player: "nye",
    team: "Las Vegas Aces",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1793,
    year: 2025,
    product: "Panini Instant WNBA The Incoming Class",
    cardNumber: "IC-10",
    cardSet: "Autographs Water",
    player: "nye",
    team: "Las Vegas Aces",
    isAuto: true,
    copies: "10"
  },
  {
    id: 1794,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "69",
    cardSet: "Base",
    player: "nye",
    team: "Las Vegas Aces",
    isRookie: true,
    copies: "99"
  },
  {
    id: 1795,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "69",
    cardSet: "Holo Emerald",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "5"
  },
  {
    id: 1796,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "69",
    cardSet: "Holo Gold",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "10"
  },
  {
    id: 1797,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "69",
    cardSet: "Holo Platinum Blue",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "1"
  },
  {
    id: 1798,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "69",
    cardSet: "Pink",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "6"
  },
  {
    id: 1799,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "69",
    cardSet: "Purple",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "25"
  },
  {
    id: 1800,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Base",
    player: "nye",
    team: "Las Vegas Aces",
    isRookie: true
  },
  {
    id: 1801,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Black Finite Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "1"
  },
  {
    id: 1802,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Black Velocity Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "39"
  },
  {
    id: 1803,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Blue Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "199"
  },
  {
    id: 1804,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Blue Pulsar Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "199"
  },
  {
    id: 1805,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Blue Velocity Prizms",
    player: "nye",
    team: "Las Vegas Aces"
  },
  {
    id: 1806,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Carolina Blue Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "125"
  },
  {
    id: 1807,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Checkerboard Prizms",
    player: "nye",
    team: "Las Vegas Aces"
  },
  {
    id: 1808,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Cherry Blossoms Prizms FOTL",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "20"
  },
  {
    id: 1809,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Gold Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "10"
  },
  {
    id: 1810,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Gold Vinyl Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "1"
  },
  {
    id: 1811,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Green Prizms",
    player: "nye",
    team: "Las Vegas Aces"
  },
  {
    id: 1812,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Green Pulsar Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "25"
  },
  {
    id: 1813,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Ice Orange Prizms",
    player: "nye",
    team: "Las Vegas Aces"
  },
  {
    id: 1814,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Ice Prizms",
    player: "nye",
    team: "Las Vegas Aces"
  },
  {
    id: 1815,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Lime Green Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "225"
  },
  {
    id: 1816,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Lotus Flower Prizms FOTL",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "3"
  },
  {
    id: 1817,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Mojo Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "25"
  },
  {
    id: 1818,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Mosaic Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "3"
  },
  {
    id: 1819,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Orange Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "99"
  },
  {
    id: 1820,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Pandora Prizms",
    player: "nye",
    team: "Las Vegas Aces"
  },
  {
    id: 1821,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Pink Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "175"
  },
  {
    id: 1822,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Pink Velocity Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "79"
  },
  {
    id: 1823,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Purple Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "149"
  },
  {
    id: 1824,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Purple Velocity Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "59"
  },
  {
    id: 1825,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Red Pandora Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "199"
  },
  {
    id: 1826,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Red Power Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "75"
  },
  {
    id: 1827,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Red Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "299"
  },
  {
    id: 1828,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Red Pulsar Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "299"
  },
  {
    id: 1829,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Silver Prizms",
    player: "nye",
    team: "Las Vegas Aces"
  },
  {
    id: 1830,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Snakeskin Prizms",
    player: "nye",
    team: "Las Vegas Aces"
  },
  {
    id: 1831,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Swirl Prizms",
    player: "nye",
    team: "Las Vegas Aces"
  },
  {
    id: 1832,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "Teal Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "49"
  },
  {
    id: 1833,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "WNBA Logo Gold Prizms",
    player: "nye",
    team: "Las Vegas Aces",
    copies: "10"
  },
  {
    id: 1834,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "WNBA Logo Prizms",
    player: "nye",
    team: "Las Vegas Aces"
  },
  {
    id: 1835,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "15",
    cardSet: "White Seismic Prizms",
    player: "nye",
    team: "Las Vegas Aces"
  },
  {
    id: 1836,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "99",
    cardSet: "Base",
    player: "laksa",
    team: "Seattle Storm",
    isRookie: true
  },
  {
    id: 1837,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "99",
    cardSet: "Black",
    player: "laksa",
    team: "Seattle Storm",
    copies: "1"
  },
  {
    id: 1838,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "99",
    cardSet: "Black Gold",
    player: "laksa",
    team: "Seattle Storm",
    copies: "5"
  },
  {
    id: 1839,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "99",
    cardSet: "Blue",
    player: "laksa",
    team: "Seattle Storm",
    copies: "149"
  },
  {
    id: 1840,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "99",
    cardSet: "Gold",
    player: "laksa",
    team: "Seattle Storm",
    copies: "10"
  },
  {
    id: 1841,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "99",
    cardSet: "Green",
    player: "laksa",
    team: "Seattle Storm"
  },
  {
    id: 1842,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "99",
    cardSet: "Green Ice",
    player: "laksa",
    team: "Seattle Storm"
  },
  {
    id: 1843,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "99",
    cardSet: "Green Pulsar",
    player: "laksa",
    team: "Seattle Storm",
    copies: "25"
  },
  {
    id: 1844,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "99",
    cardSet: "Hyper",
    player: "laksa",
    team: "Seattle Storm"
  },
  {
    id: 1845,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "99",
    cardSet: "Ice",
    player: "laksa",
    team: "Seattle Storm"
  },
  {
    id: 1846,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "99",
    cardSet: "Mojo",
    player: "laksa",
    team: "Seattle Storm",
    copies: "25"
  },
  {
    id: 1847,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "99",
    cardSet: "Orange",
    player: "laksa",
    team: "Seattle Storm",
    copies: "65"
  },
  {
    id: 1848,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "99",
    cardSet: "Purple",
    player: "laksa",
    team: "Seattle Storm",
    copies: "125"
  },
  {
    id: 1849,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "99",
    cardSet: "Red",
    player: "laksa",
    team: "Seattle Storm",
    copies: "275"
  },
  {
    id: 1850,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "99",
    cardSet: "Ruby Wave",
    player: "laksa",
    team: "Seattle Storm"
  },
  {
    id: 1851,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "99",
    cardSet: "Scope",
    player: "laksa",
    team: "Seattle Storm",
    copies: "99"
  },
  {
    id: 1852,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "99",
    cardSet: "Silver",
    player: "laksa",
    team: "Seattle Storm"
  },
  {
    id: 1853,
    year: 2020,
    product: "Panini Prizm WNBA Premium",
    cardNumber: "99",
    cardSet: "Base",
    player: "laksa",
    team: "Seattle Storm",
    copies: "99"
  },
  {
    id: 1854,
    year: 2025,
    product: "Panini Instant WNBA",
    cardNumber: "35",
    cardSet: "Base",
    player: "laksa",
    team: "Phoenix Mercury",
    copies: "62"
  },
  {
    id: 1855,
    year: 2025,
    product: "Panini Instant WNBA",
    cardNumber: "48",
    cardSet: "Base",
    player: "held",
    team: "Indiana Fever",
    copies: "102"
  },
  {
    id: 1856,
    year: 2025,
    product: "Panini Instant WNBA Retro Rated Rookies",
    cardNumber: "RRR-5",
    cardSet: "Base",
    player: "held",
    team: "Indiana Fever",
    copies: "2467"
  },
  {
    id: 1857,
    year: 1994,
    product: "Futera Australian NBL",
    cardNumber: "206",
    cardSet: "Base",
    player: "brondello",
    team: "Australia (NBL)"
  },
  {
    id: 1858,
    year: 1996,
    product: "Futera NBL",
    cardNumber: "88",
    cardSet: "Base",
    player: "brondello",
    team: "Australia (NBL)"
  },
  {
    id: 1859,
    year: 1999,
    product: "Hoops WNBA",
    cardNumber: "11",
    cardSet: "Base",
    player: "brondello",
    team: "Detroit Shock"
  },
  {
    id: 1860,
    year: 1999,
    product: "Hoops WNBA",
    cardNumber: "41",
    cardSet: "Base",
    player: "brondello",
    team: "Detroit Shock",
    isRookie: true
  },
  {
    id: 1861,
    year: 1999,
    product: "Ultra WNBA",
    cardNumber: "52",
    cardSet: "Base",
    player: "brondello",
    team: "Detroit Shock",
    isRookie: true
  },
  {
    id: 1862,
    year: 1999,
    product: "Ultra WNBA",
    cardNumber: "52",
    cardSet: "Masterpieces",
    player: "brondello",
    team: "Detroit Shock",
    copies: "1"
  },
  {
    id: 1863,
    year: 1999,
    product: "Ultra WNBA",
    cardNumber: "52",
    cardSet: "Platinum Medallion",
    player: "brondello",
    team: "Detroit Shock",
    copies: "99"
  },
  {
    id: 1864,
    year: 1999,
    product: "Ultra WNBA",
    cardNumber: "52G",
    cardSet: "Gold Medallion",
    player: "brondello",
    team: "Detroit Shock"
  },
  {
    id: 1865,
    year: 2001,
    product: "Fleer Tradition WNBA",
    cardNumber: "6",
    cardSet: "Miami Sol",
    player: "brondello",
    team: "Miami Sol"
  },
  {
    id: 1866,
    year: 2001,
    product: "Fleer Tradition WNBA",
    cardNumber: "165",
    cardSet: "Base",
    player: "brondello",
    team: "Miami Sol"
  },
  {
    id: 1867,
    year: 2001,
    product: "Ultra WNBA",
    cardNumber: "106",
    cardSet: "Base",
    player: "brondello",
    team: "Miami Sol"
  },
  {
    id: 1868,
    year: 2002,
    product: "Fleer Authentix WNBA",
    cardNumber: "36",
    cardSet: "Base",
    player: "brondello",
    team: "Miami Sol"
  },
  {
    id: 1869,
    year: 2002,
    product: "Fleer Authentix WNBA",
    cardNumber: "36",
    cardSet: "Front Row",
    player: "brondello",
    team: "Miami Sol",
    copies: "100"
  },
  {
    id: 1870,
    year: 2002,
    product: "Ultra WNBA",
    cardNumber: "25",
    cardSet: "Base",
    player: "brondello",
    team: "Miami Sol"
  },
  {
    id: 1871,
    year: 2002,
    product: "Ultra WNBA",
    cardNumber: "25",
    cardSet: "Gold Medallion",
    player: "brondello",
    team: "Miami Sol"
  },
  {
    id: 1872,
    year: 2003,
    product: "Ultra WNBA",
    cardNumber: "71",
    cardSet: "Base",
    player: "brondello",
    team: "Seattle Storm"
  },
  {
    id: 1873,
    year: 2003,
    product: "Ultra WNBA",
    cardNumber: "71",
    cardSet: "Gold Medallion",
    player: "brondello",
    team: "Seattle Storm"
  },
  {
    id: 1874,
    year: 2006,
    product: "Topps McDonald's All-American Game",
    cardNumber: "G12",
    cardSet: "Base",
    player: "wright",
    team: "High School (USA)"
  },
  {
    id: 1875,
    year: 2006,
    product: "Topps McDonald's All-American Game",
    cardNumber: "G12",
    cardSet: "Game Day Autographs Aftermarket",
    player: "wright",
    team: "High School (USA)",
    isAuto: true
  },
  {
    id: 1876,
    year: 2010,
    product: "Rittenhouse WNBA",
    cardNumber: "NNO",
    cardSet: "Autographs",
    player: "wright",
    team: "Minnesota Lynx",
    isAuto: true
  },
  {
    id: 1877,
    year: 2010,
    product: "Rittenhouse WNBA",
    cardNumber: "R2",
    cardSet: "Rookies",
    player: "wright",
    team: "Minnesota Lynx",
    copies: "250"
  },
  {
    id: 1878,
    year: 2011,
    product: "Rittenhouse WNBA",
    cardNumber: "33",
    cardSet: "Base",
    player: "wright",
    team: "Minnesota Lynx",
    copies: "225"
  },
  {
    id: 1879,
    year: 2012,
    product: "Rittenhouse WNBA",
    cardNumber: "45",
    cardSet: "Base",
    player: "wright",
    team: "Minnesota Lynx"
  },
  {
    id: 1880,
    year: 2013,
    product: "Rittenhouse WNBA",
    cardNumber: "47",
    cardSet: "Base",
    player: "wright",
    team: "Minnesota Lynx"
  },
  {
    id: 1881,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "18",
    cardSet: "Base",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 1882,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "18",
    cardSet: "Aqua Lava Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "199"
  },
  {
    id: 1883,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "18",
    cardSet: "Blue Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "150"
  },
  {
    id: 1884,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "18",
    cardSet: "Gold Lava Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "75"
  },
  {
    id: 1885,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "18",
    cardSet: "Gold Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "50"
  },
  {
    id: 1886,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "18",
    cardSet: "Green Mini-Diamond Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "99"
  },
  {
    id: 1887,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "18",
    cardSet: "Green Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "99"
  },
  {
    id: 1888,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "18",
    cardSet: "Mini-Diamond Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "299"
  },
  {
    id: 1889,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "18",
    cardSet: "Orange Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "25"
  },
  {
    id: 1890,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "18",
    cardSet: "Pink Lava Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "100"
  },
  {
    id: 1891,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "18",
    cardSet: "Purple Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "250"
  },
  {
    id: 1892,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "18",
    cardSet: "Red Lava Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "5"
  },
  {
    id: 1893,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "18",
    cardSet: "Red Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "10"
  },
  {
    id: 1894,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "18",
    cardSet: "Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 1895,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "18",
    cardSet: "Speckle Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 1896,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "18",
    cardSet: "Superfractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 1897,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "BOA-KR",
    cardSet: "Best of 2022 Autographs",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true
  },
  {
    id: 1898,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "BOA-KR",
    cardSet: "Best of 2022 Autographs Blue Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "150"
  },
  {
    id: 1899,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "BOA-KR",
    cardSet: "Best of 2022 Autographs Gold Lava Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "75"
  },
  {
    id: 1900,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "BOA-KR",
    cardSet: "Best of 2022 Autographs Gold Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "50"
  },
  {
    id: 1901,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "BOA-KR",
    cardSet: "Best of 2022 Autographs Green Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "99"
  },
  {
    id: 1902,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "BOA-KR",
    cardSet: "Best of 2022 Autographs Printing Plates Black",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1903,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "BOA-KR",
    cardSet: "Best of 2022 Autographs Printing Plates Cyan",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1904,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "BOA-KR",
    cardSet: "Best of 2022 Autographs Printing Plates Magenta",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1905,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "BOA-KR",
    cardSet: "Best of 2022 Autographs Printing Plates Yellow",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1906,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "BOA-KR",
    cardSet: "Best of 2022 Autographs Red Lava Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "5"
  },
  {
    id: 1907,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "BOA-KR",
    cardSet: "Best of 2022 Autographs Red Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "10"
  },
  {
    id: 1908,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "BOA-KR",
    cardSet: "Best of 2022 Autographs Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true
  },
  {
    id: 1909,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "BOA-KR",
    cardSet: "Best of 2022 Autographs Speckle Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1910,
    year: 2022,
    product: "Bowman University Best",
    cardNumber: "BOA-KR",
    cardSet: "Best of 2022 Autographs Superfractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1911,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Base",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 1912,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Aqua",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "299"
  },
  {
    id: 1913,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Aqua Wave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "299"
  },
  {
    id: 1914,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Black Shimmer",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 1915,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Blue",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "199"
  },
  {
    id: 1916,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Blue RayWave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "199"
  },
  {
    id: 1917,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Chrome Prospect Autographs",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true
  },
  {
    id: 1918,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Chrome Prospect Autographs Gold",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "50"
  },
  {
    id: 1919,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Chrome Prospect Autographs Gold Lava",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "50"
  },
  {
    id: 1920,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Chrome Prospect Autographs Green",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "99"
  },
  {
    id: 1921,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Chrome Prospect Autographs Orange",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1922,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Chrome Prospect Autographs Orange Shimmer",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1923,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Chrome Prospect Autographs RayWave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "199"
  },
  {
    id: 1924,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Chrome Prospect Autographs Red",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "5"
  },
  {
    id: 1925,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Chrome Prospect Autographs Red Shimmer",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "5"
  },
  {
    id: 1926,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Chrome Prospect Autographs Refractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "499"
  },
  {
    id: 1927,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Chrome Prospect Autographs SuperFractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1928,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Chrome Prospect Autographs Yellow",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "75"
  },
  {
    id: 1929,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Fuchsia Mini-Diamond",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "150"
  },
  {
    id: 1930,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Gold",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "50"
  },
  {
    id: 1931,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Gold Shimmer",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "50"
  },
  {
    id: 1932,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Green",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "99"
  },
  {
    id: 1933,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Green Lava",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "99"
  },
  {
    id: 1934,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Green Shimmer",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "99"
  },
  {
    id: 1935,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Orange",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "25"
  },
  {
    id: 1936,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Orange Shimmer",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "25"
  },
  {
    id: 1937,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Pink",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 1938,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Pink Wave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "125"
  },
  {
    id: 1939,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Purple",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "399"
  },
  {
    id: 1940,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Purple Mini-Diamond",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "399"
  },
  {
    id: 1941,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Purple Shimmer",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 1942,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "RayWave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "100"
  },
  {
    id: 1943,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Red",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "5"
  },
  {
    id: 1944,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Red Shimmer",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "5"
  },
  {
    id: 1945,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Refractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 1946,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "SuperFractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 1947,
    year: 2022,
    product: "Bowman University Chrome",
    cardNumber: "24",
    cardSet: "Yellow",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "75"
  },
  {
    id: 1948,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Base",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 1949,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Aqua Foil V1",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "199"
  },
  {
    id: 1950,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Aqua Foil V2",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "199"
  },
  {
    id: 1951,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Black Foil",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "10"
  },
  {
    id: 1952,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Blue Foil V1",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "99"
  },
  {
    id: 1953,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Blue Foil V2",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "99"
  },
  {
    id: 1954,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Bowman U Top of the Class Autographs FoilFractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1955,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "FoilFractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 1956,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Fuschia Foil",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "75"
  },
  {
    id: 1957,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Gold Foil V1",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "50"
  },
  {
    id: 1958,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Gold Foil V2",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "50"
  },
  {
    id: 1959,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Green Foil",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "299"
  },
  {
    id: 1960,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Orange Foil",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "25"
  },
  {
    id: 1961,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Printing Plates Black",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 1962,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Printing Plates Cyan",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 1963,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Printing Plates Magenta",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 1964,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Printing Plates Yellow",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 1965,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Red Foil V1",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "5"
  },
  {
    id: 1966,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "52",
    cardSet: "Red Foil V2",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "5"
  },
  {
    id: 1967,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "BIA-KR",
    cardSet: "Base Autographs",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true
  },
  {
    id: 1968,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "BIA-KR",
    cardSet: "Base Autographs Blue Foil",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "99"
  },
  {
    id: 1969,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "BIA-KR",
    cardSet: "Base Autographs FoilFractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 1970,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "BIA-KR",
    cardSet: "Base Autographs Fuschia Foil",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "75"
  },
  {
    id: 1971,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "BIA-KR",
    cardSet: "Base Autographs Gold Foil V1",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "50"
  },
  {
    id: 1972,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "BIA-KR",
    cardSet: "Base Autographs Gold Foil V2",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "50"
  },
  {
    id: 1973,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "BIA-KR",
    cardSet: "Base Autographs Orange Foil",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "25"
  },
  {
    id: 1974,
    year: 2022,
    product: "Bowman University Inception",
    cardNumber: "BIA-KR",
    cardSet: "Base Autographs Red Foil",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "5"
  },
  {
    id: 1975,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Base",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 1976,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Aqua Wave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "199"
  },
  {
    id: 1977,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Black",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "10"
  },
  {
    id: 1978,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Blue",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "99"
  },
  {
    id: 1979,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Blue Mini-Diamond",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "99"
  },
  {
    id: 1980,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Fuchsia",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "150"
  },
  {
    id: 1981,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Gold",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "50"
  },
  {
    id: 1982,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Gold RayWave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "50"
  },
  {
    id: 1983,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Lava",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "399"
  },
  {
    id: 1984,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Logo",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 1985,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Orange",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "25"
  },
  {
    id: 1986,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Orange Basketball",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "25"
  },
  {
    id: 1987,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Printing Plates Black",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 1988,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Printing Plates Cyan",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 1989,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Printing Plates Magenta",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 1990,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Printing Plates Yellow",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 1991,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Purple",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "299"
  },
  {
    id: 1992,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "RayWave",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 1993,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Red",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "5"
  },
  {
    id: 1994,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Red RayWave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "5"
  },
  {
    id: 1995,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Refractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 1996,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "SuperFractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 1997,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "34",
    cardSet: "Yellow",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "75"
  },
  {
    id: 1998,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Base",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 1999,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Aqua Wave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "199"
  },
  {
    id: 2000,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Black",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "10"
  },
  {
    id: 2001,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Blue",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "99"
  },
  {
    id: 2002,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Blue Mini-Diamond",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "99"
  },
  {
    id: 2003,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Fuchsia",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "150"
  },
  {
    id: 2004,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Gold",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "50"
  },
  {
    id: 2005,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Gold RayWave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "50"
  },
  {
    id: 2006,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Lava",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "399"
  },
  {
    id: 2007,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Logo",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 2008,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Orange",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "25"
  },
  {
    id: 2009,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Orange Basketball",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "25"
  },
  {
    id: 2010,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Printing Plates Black",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 2011,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Printing Plates Cyan",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 2012,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Printing Plates Magenta",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 2013,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Printing Plates Yellow",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 2014,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Purple",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "299"
  },
  {
    id: 2015,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "RayWave",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 2016,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Red",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "5"
  },
  {
    id: 2017,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Red RayWave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "5"
  },
  {
    id: 2018,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Refractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 2019,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "SuperFractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 2020,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "82",
    cardSet: "Yellow",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "75"
  },
  {
    id: 2021,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "Base",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 2022,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "Aqua Wave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "199"
  },
  {
    id: 2023,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "Black",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "10"
  },
  {
    id: 2024,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "Blue",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "99"
  },
  {
    id: 2025,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "Blue Mini-Diamond",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "99"
  },
  {
    id: 2026,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "Fuchsia",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "150"
  },
  {
    id: 2027,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "Gold",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "50"
  },
  {
    id: 2028,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "Gold RayWave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "50"
  },
  {
    id: 2029,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "Logo",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 2030,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "Orange",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "25"
  },
  {
    id: 2031,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "Orange Basketball",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "25"
  },
  {
    id: 2032,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "Purple",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "299"
  },
  {
    id: 2033,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "RayWave",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 2034,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "Red",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "5"
  },
  {
    id: 2035,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "Red RayWave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "5"
  },
  {
    id: 2036,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "Refractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 2037,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "SuperFractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 2038,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "99",
    cardSet: "Yellow",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "75"
  },
  {
    id: 2039,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "Base",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 2040,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "Aqua Wave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "199"
  },
  {
    id: 2041,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "Black",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "10"
  },
  {
    id: 2042,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "Blue",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "99"
  },
  {
    id: 2043,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "Blue Mini-Diamond",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "99"
  },
  {
    id: 2044,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "Fuchsia",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "150"
  },
  {
    id: 2045,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "Gold",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "50"
  },
  {
    id: 2046,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "Gold RayWave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "50"
  },
  {
    id: 2047,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "Logo",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 2048,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "Orange",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "25"
  },
  {
    id: 2049,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "Orange Basketball",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "25"
  },
  {
    id: 2050,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "Purple",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "299"
  },
  {
    id: 2051,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "RayWave",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 2052,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "Red",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "5"
  },
  {
    id: 2053,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "Red RayWave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "5"
  },
  {
    id: 2054,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "Refractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 2055,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "SuperFractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 2056,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "100",
    cardSet: "Yellow",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "75"
  },
  {
    id: 2057,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "2K22-11",
    cardSet: "Red 'n' Gold Vibrations",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "10"
  },
  {
    id: 2058,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "2K6-19",
    cardSet: "2006 Topps McDonald's All American",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 2059,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "2K6-19",
    cardSet: "2006 Topps McDonald's All American Gold",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "50"
  },
  {
    id: 2060,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "2K6-19",
    cardSet: "2006 Topps McDonald's All American Orange Basketball",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "25"
  },
  {
    id: 2061,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "2K6-19",
    cardSet: "2006 Topps McDonald's All American Printing Plates Black",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 2062,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "2K6-19",
    cardSet: "2006 Topps McDonald's All American Printing Plates Cyan",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 2063,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "2K6-19",
    cardSet: "2006 Topps McDonald's All American Printing Plates Magenta",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 2064,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "2K6-19",
    cardSet: "2006 Topps McDonald's All American Printing Plates Yellow",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 2065,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "2K6-19",
    cardSet: "2006 Topps McDonald's All American Red",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "5"
  },
  {
    id: 2066,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "2K6-19",
    cardSet: "2006 Topps McDonald's All American Refractors",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 2067,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "2K6-19",
    cardSet: "2006 Topps McDonald's All American SuperFractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 2068,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "CA-KR",
    cardSet: "Autographs",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true
  },
  {
    id: 2069,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "CA-KR",
    cardSet: "Autographs Aqua",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "99"
  },
  {
    id: 2070,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "CA-KR",
    cardSet: "Autographs Gold RayWave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "50"
  },
  {
    id: 2071,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "CA-KR",
    cardSet: "Autographs Gold Wave",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "50"
  },
  {
    id: 2072,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "CA-KR",
    cardSet: "Autographs Orange Basketball",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "25"
  },
  {
    id: 2073,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "CA-KR",
    cardSet: "Autographs Printing Plates Black",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 2074,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "CA-KR",
    cardSet: "Autographs Printing Plates Cyan",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 2075,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "CA-KR",
    cardSet: "Autographs Printing Plates Magenta",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 2076,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "CA-KR",
    cardSet: "Autographs Printing Plates Yellow",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 2077,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "CA-KR",
    cardSet: "Autographs Red",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "5"
  },
  {
    id: 2078,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "CA-KR",
    cardSet: "Autographs SuperFractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "1"
  },
  {
    id: 2079,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "CA-KR",
    cardSet: "Autographs Yellow",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true,
    copies: "75"
  },
  {
    id: 2080,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "HS-2",
    cardSet: "Hoopers",
    player: "rice",
    team: "UCLA / McD All-American (HS)"
  },
  {
    id: 2081,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "HS-2",
    cardSet: "Hoopers Gold",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "50"
  },
  {
    id: 2082,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "HS-2",
    cardSet: "Hoopers Orange Basketball",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "25"
  },
  {
    id: 2083,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "HS-2",
    cardSet: "Hoopers Printing Plates Black",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 2084,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "HS-2",
    cardSet: "Hoopers Printing Plates Cyan",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 2085,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "HS-2",
    cardSet: "Hoopers Printing Plates Magenta",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 2086,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "HS-2",
    cardSet: "Hoopers Printing Plates Yellow",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 2087,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "HS-2",
    cardSet: "Hoopers Red",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "5"
  },
  {
    id: 2088,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "HS-2",
    cardSet: "Hoopers SuperFractor",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    copies: "1"
  },
  {
    id: 2089,
    year: 2022,
    product: "Topps Chrome McDonald's All American",
    cardNumber: "PA-KR",
    cardSet: "McDonald's All American Gameday Paper Autographs",
    player: "rice",
    team: "UCLA / McD All-American (HS)",
    isAuto: true
  },
  {
    id: 2090,
    year: 2022,
    product: "Panini Prizm WNBA",
    cardNumber: "71",
    cardSet: "Base",
    player: "wallace",
    team: "Atlanta Dream"
  },
  {
    id: 2091,
    year: 2026,
    product: "Panini Prizm WNBA",
    cardNumber: "TBD",
    cardSet: "Base",
    player: "key",
    team: "Toronto Tempo",
    isRookie: true
  },// ═══════════════════════════════════════════════════════════════════════
  // ── ADDED 2026-05-06: Temi Fagbenle (193 cards) + Nurse White Sparkle (1)
  // ── IDs 2092-2285 — APPENDED to preserve existing positional IDs
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 2092,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "28",
    cardSet: "Base",
    player: "fagbenle",
    team: "Minnesota Lynx",
    isRookie: true
  },
  {
    id: 2093,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "28",
    cardSet: "Black",
    player: "fagbenle",
    team: "Minnesota Lynx",
    copies: "1"
  },
  {
    id: 2094,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "28",
    cardSet: "Black Gold",
    player: "fagbenle",
    team: "Minnesota Lynx",
    copies: "5"
  },
  {
    id: 2095,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "28",
    cardSet: "Blue",
    player: "fagbenle",
    team: "Minnesota Lynx",
    copies: "149"
  },
  {
    id: 2096,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "28",
    cardSet: "Gold",
    player: "fagbenle",
    team: "Minnesota Lynx",
    copies: "10"
  },
  {
    id: 2097,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "28",
    cardSet: "Green",
    player: "fagbenle",
    team: "Minnesota Lynx"
  },
  {
    id: 2098,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "28",
    cardSet: "Green Ice",
    player: "fagbenle",
    team: "Minnesota Lynx"
  },
  {
    id: 2099,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "28",
    cardSet: "Green Pulsar",
    player: "fagbenle",
    team: "Minnesota Lynx",
    copies: "25"
  },
  {
    id: 2100,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "28",
    cardSet: "Hyper",
    player: "fagbenle",
    team: "Minnesota Lynx"
  },
  {
    id: 2101,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "28",
    cardSet: "Ice",
    player: "fagbenle",
    team: "Minnesota Lynx"
  },
  {
    id: 2102,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "28",
    cardSet: "Mojo",
    player: "fagbenle",
    team: "Minnesota Lynx",
    copies: "25"
  },
  {
    id: 2103,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "28",
    cardSet: "Orange",
    player: "fagbenle",
    team: "Minnesota Lynx",
    copies: "65"
  },
  {
    id: 2104,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "28",
    cardSet: "Purple",
    player: "fagbenle",
    team: "Minnesota Lynx",
    copies: "125"
  },
  {
    id: 2105,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "28",
    cardSet: "Red",
    player: "fagbenle",
    team: "Minnesota Lynx",
    copies: "275"
  },
  {
    id: 2106,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "28",
    cardSet: "Ruby Wave",
    player: "fagbenle",
    team: "Minnesota Lynx"
  },
  {
    id: 2107,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "28",
    cardSet: "Scope",
    player: "fagbenle",
    team: "Minnesota Lynx",
    copies: "99"
  },
  {
    id: 2108,
    year: 2020,
    product: "Panini Prizm WNBA",
    cardNumber: "28",
    cardSet: "Silver",
    player: "fagbenle",
    team: "Minnesota Lynx"
  },
  {
    id: 2109,
    year: 2020,
    product: "Panini Prizm WNBA Premium",
    cardNumber: "28",
    cardSet: "Base",
    player: "fagbenle",
    team: "Minnesota Lynx",
    copies: "99"
  },
  {
    id: 2110,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Base",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2111,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Black Gold Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "5"
  },
  {
    id: 2112,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Black Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "1"
  },
  {
    id: 2113,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Blue Millionaire Shimmer Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "10"
  },
  {
    id: 2114,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Boardwalk Blue Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "15"
  },
  {
    id: 2115,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Brown Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "249"
  },
  {
    id: 2116,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Classic Icons Red Prizm",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2117,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Deal Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2118,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Dice Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2119,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Free Parking Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2120,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Go Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2121,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Gold Millionaire Shimmer Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "500"
  },
  {
    id: 2122,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Gold Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "49"
  },
  {
    id: 2123,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Gold Wave Millionaire Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "10"
  },
  {
    id: 2124,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Green Millionaire Shimmer Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "20"
  },
  {
    id: 2125,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Green Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "24"
  },
  {
    id: 2126,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Light Blue Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "199"
  },
  {
    id: 2127,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Monopoly Man Black and White Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2128,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Neon Green Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "10"
  },
  {
    id: 2129,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Orange Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "124"
  },
  {
    id: 2130,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Pink Millionaire Shimmer Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "5"
  },
  {
    id: 2131,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Pink Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "149"
  },
  {
    id: 2132,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Purple Millionaire Shimmer Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "50"
  },
  {
    id: 2133,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Purple Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2134,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Question Mark Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "25"
  },
  {
    id: 2135,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Red Millionaire Shimmer Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "100"
  },
  {
    id: 2136,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Red Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "99"
  },
  {
    id: 2137,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Silver Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2138,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "Tiger Stripe Boardwalk Blue Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2139,
    year: 2024,
    product: "Panini Prizm Monopoly WNBA",
    cardNumber: "26",
    cardSet: "White Millionaire Shimmer Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "1"
  },
  {
    id: 2140,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Base",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2141,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Black Finite Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "1"
  },
  {
    id: 2142,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Black Gold Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "5"
  },
  {
    id: 2143,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Black Velocity Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "39"
  },
  {
    id: 2144,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Blue Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "199"
  },
  {
    id: 2145,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Blue Pulsar Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "199"
  },
  {
    id: 2146,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Blue Velocity Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2147,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Checkerboard Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2148,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Cherry Blossom FOTL Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "20"
  },
  {
    id: 2149,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Gold Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "10"
  },
  {
    id: 2150,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Gold Vinyl Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "1"
  },
  {
    id: 2151,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Green Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2152,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Green Pulsar Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "25"
  },
  {
    id: 2153,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Ice Gold Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "10"
  },
  {
    id: 2154,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Ice Orange Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2155,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Ice Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2156,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Ice White Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "35"
  },
  {
    id: 2157,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Lotus Flower FOTL Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "3"
  },
  {
    id: 2158,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Mojo Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "25"
  },
  {
    id: 2159,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Mosaic Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "3"
  },
  {
    id: 2160,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Orange Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "99"
  },
  {
    id: 2161,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Orange Velocity Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2162,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Pink Velocity Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "79"
  },
  {
    id: 2163,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Premium Box Set Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "99"
  },
  {
    id: 2164,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Pulsar Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "499"
  },
  {
    id: 2165,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Purple Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "149"
  },
  {
    id: 2166,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Red Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "299"
  },
  {
    id: 2167,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Red Pulsar Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "299"
  },
  {
    id: 2168,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Silver Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2169,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Snakeskin Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2170,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "Teal Prizms",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "49"
  },
  {
    id: 2171,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "White Sparkle Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2172,
    year: 2024,
    product: "Panini Prizm WNBA",
    cardNumber: "136",
    cardSet: "WNBA Logo Prizms",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2173,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Base",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2174,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Black Finite",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "1"
  },
  {
    id: 2175,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Black Gold",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "5"
  },
  {
    id: 2176,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Bronze Checker",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "49"
  },
  {
    id: 2177,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Gold",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "10"
  },
  {
    id: 2178,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Gold Flash",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "10"
  },
  {
    id: 2179,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Gold Vinyl",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "1"
  },
  {
    id: 2180,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Green Ice",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2181,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Ice Gold",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "10"
  },
  {
    id: 2182,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Neon Green",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "75"
  },
  {
    id: 2183,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Orange",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "125"
  },
  {
    id: 2184,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Pink and Purple",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "99"
  },
  {
    id: 2185,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Pink Ice",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2186,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Pink Shimmer FOTL",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "3"
  },
  {
    id: 2187,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Purple",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "149"
  },
  {
    id: 2188,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Purple Ice",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "149"
  },
  {
    id: 2189,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Red and Blue",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "399"
  },
  {
    id: 2190,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Red Ice",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2191,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Silver",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2192,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Silver Flash",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2193,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Tie-Dye",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "25"
  },
  {
    id: 2194,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Tiger",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2195,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms White",
    player: "fagbenle",
    team: "Indiana Fever",
    copies: "99"
  },
  {
    id: 2196,
    year: 2024,
    product: "Panini Select WNBA",
    cardNumber: "168",
    cardSet: "Prizms Zebra",
    player: "fagbenle",
    team: "Indiana Fever"
  },
  {
    id: 2197,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Base",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2198,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Artist Proof",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "25"
  },
  {
    id: 2199,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Black Gold Laser",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "5"
  },
  {
    id: 2200,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Black Holo Press Proof",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "1"
  },
  {
    id: 2201,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Black Shimmer",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "1"
  },
  {
    id: 2202,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Blue Laser",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "49"
  },
  {
    id: 2203,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Blue Shimmer",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "49"
  },
  {
    id: 2204,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Cubic",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2205,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Dragon",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2206,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Gold Shimmer",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "10"
  },
  {
    id: 2207,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Green Laser",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2208,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Green Shimmer",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2209,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Holo",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2210,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Holo Black Laser",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "1"
  },
  {
    id: 2211,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Holo Gold Laser",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "10"
  },
  {
    id: 2212,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Holo Team Logo",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "13"
  },
  {
    id: 2213,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Holo WNBA Logo",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2214,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Lava",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2215,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Light Blue Lava",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "75"
  },
  {
    id: 2216,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Orange Laser",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "199"
  },
  {
    id: 2217,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Orange Lava",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "199"
  },
  {
    id: 2218,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Pink Laser",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "25"
  },
  {
    id: 2219,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Pink Shimmer",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "25"
  },
  {
    id: 2220,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Purple Laser",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "99"
  },
  {
    id: 2221,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Purple Lava",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "99"
  },
  {
    id: 2222,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Purple Shimmer",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "99"
  },
  {
    id: 2223,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Red Holo",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "299"
  },
  {
    id: 2224,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Red Lava",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "399"
  },
  {
    id: 2225,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Red Shimmer",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "399"
  },
  {
    id: 2226,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Teal Laser",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "125"
  },
  {
    id: 2227,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "58",
    cardSet: "Yellow Lava",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "5"
  },
  {
    id: 2228,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "7",
    cardSet: "Jersey Series",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2229,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "7",
    cardSet: "Jersey Series Gold",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "10"
  },
  {
    id: 2230,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "7",
    cardSet: "Jersey Series Green",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "30"
  },
  {
    id: 2231,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "7",
    cardSet: "Jersey Series Holo Platinum Blue",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "1"
  },
  {
    id: 2232,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "7",
    cardSet: "Jersey Series Prime",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "25"
  },
  {
    id: 2233,
    year: 2025,
    product: "Donruss WNBA",
    cardNumber: "7",
    cardSet: "Jersey Series Red",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2234,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "25",
    cardSet: "Base",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "75"
  },
  {
    id: 2235,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "25",
    cardSet: "Amethyst",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "8"
  },
  {
    id: 2236,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "25",
    cardSet: "Gold",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "25"
  },
  {
    id: 2237,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "25",
    cardSet: "Holo Gold",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "10"
  },
  {
    id: 2238,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "25",
    cardSet: "Holo Silver",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "15"
  },
  {
    id: 2239,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "25",
    cardSet: "Platinum",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "1"
  },
  {
    id: 2240,
    year: 2025,
    product: "Panini Impeccable WNBA",
    cardNumber: "25",
    cardSet: "Silver",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "40"
  },
  {
    id: 2241,
    year: 2025,
    product: "Panini Instant WNBA",
    cardNumber: "266",
    cardSet: "Base",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2242,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "31",
    cardSet: "Base",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "99"
  },
  {
    id: 2243,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "31",
    cardSet: "Holo Emerald",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "5"
  },
  {
    id: 2244,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "31",
    cardSet: "Holo Gold",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "10"
  },
  {
    id: 2245,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "31",
    cardSet: "Holo Platinum Blue",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "1"
  },
  {
    id: 2246,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "31",
    cardSet: "Pink",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "6"
  },
  {
    id: 2247,
    year: 2025,
    product: "Panini One and One WNBA",
    cardNumber: "31",
    cardSet: "Purple",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "25"
  },
  {
    id: 2248,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Base",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2249,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Black Finite Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "1"
  },
  {
    id: 2250,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Black Velocity Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "39"
  },
  {
    id: 2251,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Blue Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "199"
  },
  {
    id: 2252,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Blue Pulsar Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "199"
  },
  {
    id: 2253,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Blue Velocity Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2254,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Carolina Blue Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "125"
  },
  {
    id: 2255,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Checkerboard Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2256,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Cherry Blossoms Prizms FOTL",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "20"
  },
  {
    id: 2257,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Gold Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "10"
  },
  {
    id: 2258,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Gold Vinyl Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "1"
  },
  {
    id: 2259,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Green Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2260,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Green Pulsar Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "25"
  },
  {
    id: 2261,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Ice Orange Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2262,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Ice Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2263,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Lime Green Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "225"
  },
  {
    id: 2264,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Lotus Flower Prizms FOTL",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "3"
  },
  {
    id: 2265,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Mojo Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "25"
  },
  {
    id: 2266,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Mosaic Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "3"
  },
  {
    id: 2267,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Orange Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "99"
  },
  {
    id: 2268,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Pandora Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2269,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Pink Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "175"
  },
  {
    id: 2270,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Pink Velocity Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "79"
  },
  {
    id: 2271,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Purple Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "149"
  },
  {
    id: 2272,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Purple Velocity Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "59"
  },
  {
    id: 2273,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Red Pandora Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "199"
  },
  {
    id: 2274,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Red Power Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "75"
  },
  {
    id: 2275,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Red Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "299"
  },
  {
    id: 2276,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Red Pulsar Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "299"
  },
  {
    id: 2277,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Silver Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2278,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Snakeskin Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2279,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Swirl Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2280,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "Teal Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "49"
  },
  {
    id: 2281,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "White Seismic Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2282,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "White Sparkle Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2283,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "WNBA Logo Gold Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries",
    copies: "10"
  },
  {
    id: 2284,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "68",
    cardSet: "WNBA Logo Prizms",
    player: "fagbenle",
    team: "Golden State Valkyries"
  },
  {
    id: 2285,
    year: 2025,
    product: "Panini Prizm WNBA",
    cardNumber: "24",
    cardSet: "White Sparkle Prizms",
    player: "nurse",
    team: "Chicago Sky"
  }
];

// ─── DERIVED LOOKUPS ───────────────────────────────────────────────────────
window.TEMPO_CARD_BY_ID = (function () {
  var m = {};
  window.TEMPO_ALL_CARDS.forEach(function (c) { m[c.id] = c; });
  return m;
})();

window.TEMPO_CARDS_BY_PLAYER = (function () {
  var m = {};
  window.TEMPO_ALL_CARDS.forEach(function (c) {
    if (c.isTestCard) return;
    if (!m[c.player]) m[c.player] = [];
    m[c.player].push(c);
  });
  return m;
})();

console.log("[tempo_data] Loaded " + window.TEMPO_ALL_CARDS.length + " cards across " +
  Object.keys(window.TEMPO_CARDS_BY_PLAYER).length + " players");
