// Initial supplier catalogue for the Prodomatix niche:
// Manufacturers, Distributors, and Wholesalers across industries.

const firstNames = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Drew', 'Quinn', 'Wei', 'Mateo', 'Aisha', 'Lukas'];
const lastNames = ['Carter', 'Nguyen', 'Patel', 'Schmidt', 'Rossi', 'Andersson', 'Garcia', 'Walsh', 'Kim', 'Dubois', 'Chen', 'Okafor', 'Silva', 'Haddad'];
const titlesByType: Record<string, string[]> = {
  Manufacturer: ['Plant Manager', 'Head of Production', 'Procurement Lead', 'Export Manager', 'Operations Director'],
  Distributor: ['Distribution Manager', 'Head of Logistics', 'Key Accounts Lead', 'Regional Sales Director', 'Supply Chain Manager'],
  Wholesaler: ['Wholesale Manager', 'Purchasing Director', 'Trade Sales Lead', 'Category Buyer', 'Branch Manager']
};

interface ContactSeed {
  name: string;
  title: string;
  email: string;
  phone: string;
}

function makeContacts(id: number, domain: string, type: string, n: number): ContactSeed[] {
  const titles = titlesByType[type] || titlesByType.Manufacturer!;
  const out: ContactSeed[] = [];
  for (let i = 0; i < n; i++) {
    const fn = firstNames[(id + i) % firstNames.length]!;
    const ln = lastNames[(id * 3 + i) % lastNames.length]!;
    out.push({
      name: `${fn} ${ln}`,
      title: titles[(id + i) % titles.length]!,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${domain}`,
      phone: `+1-555-${String(1000 + ((id * 17 + i * 7) % 8999)).padStart(4, '0')}`
    });
  }
  return out;
}

interface BaseRow {
  id: number;
  name: string;
  type: 'Manufacturer' | 'Distributor' | 'Wholesaler';
  industry: string;
  country: string;
  region: string;
  location: string;
  domain: string;
  emp: number;
  rev: number;
  contacts: number;
  verified: number;
  price: number;
  product: string;
}

const BASE: BaseRow[] = [
  { id: 1, name: 'Cedarline Foods', type: 'Manufacturer', industry: 'Food & Beverage', country: 'United States', region: 'North America', location: 'Columbus, OH, USA', domain: 'cedarlinefoods.com', emp: 540, rev: 96, contacts: 22, verified: 96, price: 89, product: 'Packaged sauces, condiments & dry mixes' },
  { id: 2, name: 'Andes Coffee Works', type: 'Manufacturer', industry: 'Food & Beverage', country: 'Colombia', region: 'South America', location: 'Medellín, Colombia', domain: 'andescoffeeworks.co', emp: 310, rev: 42, contacts: 16, verified: 93, price: 79, product: 'Roasted & green coffee beans, private label' },
  { id: 3, name: 'Nordwave Electronics', type: 'Manufacturer', industry: 'Electronics', country: 'Germany', region: 'Europe', location: 'Stuttgart, Germany', domain: 'nordwave.de', emp: 1200, rev: 240, contacts: 34, verified: 97, price: 129, product: 'PCB assemblies & industrial sensors' },
  { id: 4, name: 'Shenzhou Components', type: 'Manufacturer', industry: 'Electronics', country: 'China', region: 'Asia', location: 'Shenzhen, Guangdong, China', domain: 'shenzhoucomp.cn', emp: 4200, rev: 540, contacts: 41, verified: 91, price: 119, product: 'Connectors, cables & passive components' },
  { id: 5, name: 'Banyan Textiles', type: 'Manufacturer', industry: 'Apparel & Textiles', country: 'India', region: 'Asia', location: 'Tirupur, Tamil Nadu, India', domain: 'banyantextiles.in', emp: 2600, rev: 180, contacts: 28, verified: 92, product: 'Knit fabrics & finished garments', price: 99 },
  { id: 6, name: 'Atlas Steelworks', type: 'Manufacturer', industry: 'Construction & Materials', country: 'United States', region: 'North America', location: 'Pittsburgh, PA, USA', domain: 'atlassteelworks.com', emp: 1900, rev: 410, contacts: 30, verified: 90, price: 139, product: 'Structural steel & fabricated metal' },
  { id: 7, name: 'Helvetia Precision', type: 'Manufacturer', industry: 'Industrial Equipment', country: 'Switzerland', region: 'Europe', location: 'Winterthur, Switzerland', domain: 'helvetiaprecision.ch', emp: 760, rev: 160, contacts: 24, verified: 98, price: 149, product: 'CNC machined parts & assemblies' },
  { id: 8, name: 'PureGlow Cosmetics', type: 'Manufacturer', industry: 'Health & Beauty', country: 'South Korea', region: 'Asia', location: 'Seoul, South Korea', domain: 'pureglow.kr', emp: 430, rev: 88, contacts: 19, verified: 95, price: 99, product: 'Skincare & cosmetic formulations (OEM/ODM)' },
  { id: 9, name: 'TorqueLine Auto', type: 'Manufacturer', industry: 'Automotive', country: 'Mexico', region: 'North America', location: 'Monterrey, Mexico', domain: 'torquelineauto.mx', emp: 1500, rev: 300, contacts: 33, verified: 89, price: 129, product: 'Brake components & drivetrain parts' },
  { id: 10, name: 'GreenCrate Packaging', type: 'Manufacturer', industry: 'Packaging', country: 'Canada', region: 'North America', location: 'Mississauga, ON, Canada', domain: 'greencrate.ca', emp: 380, rev: 64, contacts: 18, verified: 94, price: 79, product: 'Corrugated & sustainable packaging' },

  { id: 11, name: 'Meridian Food Distribution', type: 'Distributor', industry: 'Food & Beverage', country: 'United States', region: 'North America', location: 'Chicago, IL, USA', domain: 'meridianfooddist.com', emp: 880, rev: 210, contacts: 26, verified: 93, price: 69, product: 'Foodservice & grocery distribution' },
  { id: 12, name: 'EuroFresh Logistics', type: 'Distributor', industry: 'Food & Beverage', country: 'Netherlands', region: 'Europe', location: 'Rotterdam, Netherlands', domain: 'eurofresh.nl', emp: 640, rev: 175, contacts: 21, verified: 90, price: 69, product: 'Chilled & ambient food distribution' },
  { id: 13, name: 'Voltway Distribution', type: 'Distributor', industry: 'Electronics', country: 'United States', region: 'North America', location: 'Austin, TX, USA', domain: 'voltway.com', emp: 410, rev: 120, contacts: 23, verified: 94, price: 79, product: 'Electronic components distribution' },
  { id: 14, name: 'Pacific Tech Supply', type: 'Distributor', industry: 'Electronics', country: 'Singapore', region: 'Asia', location: 'Singapore', domain: 'pacifictechsupply.sg', emp: 520, rev: 140, contacts: 25, verified: 92, price: 79, product: 'Semiconductors & IT hardware distribution' },
  { id: 15, name: 'Loom & Thread Co', type: 'Distributor', industry: 'Apparel & Textiles', country: 'United Kingdom', region: 'Europe', location: 'Manchester, UK', domain: 'loomthread.co.uk', emp: 230, rev: 48, contacts: 15, verified: 91, price: 59, product: 'Fashion & textile wholesale distribution' },
  { id: 16, name: 'BuildSource Distributors', type: 'Distributor', industry: 'Construction & Materials', country: 'Australia', region: 'Oceania', location: 'Sydney, Australia', domain: 'buildsource.com.au', emp: 700, rev: 190, contacts: 27, verified: 90, price: 89, product: 'Building materials distribution' },
  { id: 17, name: 'MachLine Industrial', type: 'Distributor', industry: 'Industrial Equipment', country: 'Germany', region: 'Europe', location: 'Düsseldorf, Germany', domain: 'machline.de', emp: 560, rev: 150, contacts: 22, verified: 95, price: 89, product: 'Industrial tools & equipment distribution' },
  { id: 18, name: 'VitaCare Distribution', type: 'Distributor', industry: 'Health & Beauty', country: 'United States', region: 'North America', location: 'Newark, NJ, USA', domain: 'vitacaredist.com', emp: 340, rev: 92, contacts: 20, verified: 93, price: 69, product: 'Health, wellness & beauty distribution' },

  { id: 19, name: 'Harborline Wholesale', type: 'Wholesaler', industry: 'Food & Beverage', country: 'United States', region: 'North America', location: 'Seattle, WA, USA', domain: 'harborlinewholesale.com', emp: 190, rev: 54, contacts: 14, verified: 92, price: 49, product: 'Bulk dry goods & beverages' },
  { id: 20, name: 'Mediterraneo Bulk', type: 'Wholesaler', industry: 'Food & Beverage', country: 'Italy', region: 'Europe', location: 'Naples, Italy', domain: 'mediterraneobulk.it', emp: 160, rev: 38, contacts: 12, verified: 90, price: 49, product: 'Wholesale olive oil, pasta & canned goods' },
  { id: 21, name: 'CircuitMart Wholesale', type: 'Wholesaler', industry: 'Electronics', country: 'China', region: 'Asia', location: 'Guangzhou, China', domain: 'circuitmart.cn', emp: 240, rev: 70, contacts: 17, verified: 89, price: 59, product: 'Consumer electronics & accessories (bulk)' },
  { id: 22, name: 'FiberHub Traders', type: 'Wholesaler', industry: 'Apparel & Textiles', country: 'Turkey', region: 'Europe', location: 'Istanbul, Türkiye', domain: 'fiberhub.com.tr', emp: 210, rev: 46, contacts: 16, verified: 91, price: 49, product: 'Wholesale fabrics & apparel lots' },
  { id: 23, name: 'StoneYard Supply', type: 'Wholesaler', industry: 'Construction & Materials', country: 'United States', region: 'North America', location: 'Denver, CO, USA', domain: 'stoneyardsupply.com', emp: 150, rev: 41, contacts: 13, verified: 90, price: 59, product: 'Wholesale tile, stone & aggregates' },
  { id: 24, name: 'ToolDepot Wholesale', type: 'Wholesaler', industry: 'Industrial Equipment', country: 'Canada', region: 'North America', location: 'Calgary, AB, Canada', domain: 'tooldepotwholesale.ca', emp: 180, rev: 49, contacts: 15, verified: 92, price: 59, product: 'Wholesale hand & power tools' },
  { id: 25, name: 'Bloom Beauty Wholesale', type: 'Wholesaler', industry: 'Health & Beauty', country: 'United Arab Emirates', region: 'Middle East', location: 'Dubai, UAE', domain: 'bloombeauty.ae', emp: 130, rev: 36, contacts: 12, verified: 93, price: 49, product: 'Wholesale cosmetics & personal care' },
  { id: 26, name: 'AutoParts Direct', type: 'Wholesaler', industry: 'Automotive', country: 'United States', region: 'North America', location: 'Detroit, MI, USA', domain: 'autopartsdirect.com', emp: 260, rev: 78, contacts: 18, verified: 88, price: 59, product: 'Wholesale aftermarket auto parts' },
  { id: 27, name: 'PackMart Traders', type: 'Wholesaler', industry: 'Packaging', country: 'India', region: 'Asia', location: 'Mumbai, India', domain: 'packmart.in', emp: 170, rev: 33, contacts: 13, verified: 90, price: 49, product: 'Wholesale packaging & disposables' },
  { id: 28, name: 'Solaris Energy Components', type: 'Manufacturer', industry: 'Industrial Equipment', country: 'Spain', region: 'Europe', location: 'Valencia, Spain', domain: 'solarisenergy.es', emp: 620, rev: 130, contacts: 24, verified: 95, price: 139, product: 'Solar inverters & mounting systems' }
];

export interface BusinessSeed {
  businessName: string;
  businessType: string;
  industry: string;
  country: string;
  location: string;
  region: string;
  website: string;
  email: string;
  phone: string;
  staffCapacity: number;
  revenue: number;
  productOrService: string;
  description: string;
  contacts: number;
  verified: number;
  price: number;
  contactPersons: ContactSeed[];
}

export const SEED_BUSINESSES: BusinessSeed[] = BASE.map((b) => ({
  businessName: b.name,
  businessType: b.type,
  industry: b.industry,
  country: b.country,
  location: b.location,
  region: b.region,
  website: `https://${b.domain}`,
  email: `sales@${b.domain}`,
  phone: `+1-555-${String(1000 + ((b.id * 23) % 8999)).padStart(4, '0')}`,
  staffCapacity: b.emp,
  revenue: b.rev,
  productOrService: b.product,
  description: `${b.name} is a ${b.country}-based ${b.type.toLowerCase()} in the ${b.industry} sector.`,
  contacts: b.contacts,
  verified: b.verified,
  price: b.price,
  contactPersons: makeContacts(b.id, b.domain, b.type, Math.min(3, Math.max(1, Math.round(b.contacts / 8))))
}));
