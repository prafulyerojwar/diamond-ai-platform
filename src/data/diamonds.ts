export interface Diamond {
  id: string
  name: string
  cut: string
  shape: string
  carats: number
  color: string
  clarity: string
  pricePerCarat: number
  totalValue: number
  origin: string
  fluorescence: string
  polish: string
  symmetry: string
  depth: number
  table: number
  image: string
  description: string
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Legendary'
  category: string
  color_grade: string
}

// All images from Unsplash (free, no attribution required for product use)
export const DIAMONDS: Diamond[] = [
  {
    id: 'd1', name: 'Round Brilliant', cut: 'Excellent', shape: 'Round', carats: 1.0,
    color: 'D', clarity: 'FL', pricePerCarat: 15000, totalValue: 15000,
    origin: 'Botswana', fluorescence: 'None', polish: 'Excellent', symmetry: 'Excellent',
    depth: 61.5, table: 57,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
    description: 'The most popular diamond shape, renowned for its unparalleled brilliance and fire.',
    rarity: 'Common', category: 'Round', color_grade: 'Colorless',
  },
  {
    id: 'd2', name: 'Princess Cut', cut: 'Very Good', shape: 'Princess', carats: 1.5,
    color: 'E', clarity: 'VVS1', pricePerCarat: 12000, totalValue: 18000,
    origin: 'South Africa', fluorescence: 'Faint', polish: 'Very Good', symmetry: 'Very Good',
    depth: 70, table: 75,
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&q=80',
    description: 'Square cut with pointed corners; second most popular shape with strong brilliance.',
    rarity: 'Common', category: 'Fancy', color_grade: 'Colorless',
  },
  {
    id: 'd3', name: 'Emerald Cut', cut: 'Good', shape: 'Emerald', carats: 2.0,
    color: 'F', clarity: 'VS1', pricePerCarat: 8500, totalValue: 17000,
    origin: 'Russia', fluorescence: 'None', polish: 'Good', symmetry: 'Good',
    depth: 64, table: 66,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80',
    description: 'Step-cut rectangular shape with cropped corners; emphasizes clarity over brilliance.',
    rarity: 'Uncommon', category: 'Fancy', color_grade: 'Near Colorless',
  },
  {
    id: 'd4', name: 'Oval Diamond', cut: 'Excellent', shape: 'Oval', carats: 1.8,
    color: 'G', clarity: 'VS2', pricePerCarat: 7800, totalValue: 14040,
    origin: 'Angola', fluorescence: 'Medium', polish: 'Excellent', symmetry: 'Excellent',
    depth: 62, table: 59,
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400&q=80',
    description: 'Elongated round shape that creates an illusion of greater size and slender fingers.',
    rarity: 'Uncommon', category: 'Fancy', color_grade: 'Near Colorless',
  },
  {
    id: 'd5', name: 'Marquise Diamond', cut: 'Very Good', shape: 'Marquise', carats: 1.2,
    color: 'H', clarity: 'SI1', pricePerCarat: 5500, totalValue: 6600,
    origin: 'Canada', fluorescence: 'Strong', polish: 'Very Good', symmetry: 'Good',
    depth: 61, table: 56,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80',
    description: 'Elongated pointed ends maximize carat weight and make fingers appear long and slender.',
    rarity: 'Uncommon', category: 'Fancy', color_grade: 'Near Colorless',
  },
  {
    id: 'd6', name: 'Cushion Cut', cut: 'Very Good', shape: 'Cushion', carats: 2.5,
    color: 'I', clarity: 'VS1', pricePerCarat: 6200, totalValue: 15500,
    origin: 'Botswana', fluorescence: 'None', polish: 'Very Good', symmetry: 'Very Good',
    depth: 63, table: 61,
    image: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=400&q=80',
    description: 'Square or rectangular with rounded corners; romantic vintage look with strong fire.',
    rarity: 'Common', category: 'Fancy', color_grade: 'Near Colorless',
  },
  {
    id: 'd7', name: 'Pear Shape', cut: 'Excellent', shape: 'Pear', carats: 1.4,
    color: 'D', clarity: 'VVS2', pricePerCarat: 11000, totalValue: 15400,
    origin: 'Namibia', fluorescence: 'Faint', polish: 'Excellent', symmetry: 'Excellent',
    depth: 60, table: 58,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80',
    description: 'Teardrop shape combining round and marquise; sophisticated and elegant.',
    rarity: 'Rare', category: 'Fancy', color_grade: 'Colorless',
  },
  {
    id: 'd8', name: 'Heart Diamond', cut: 'Good', shape: 'Heart', carats: 1.0,
    color: 'E', clarity: 'VS1', pricePerCarat: 9000, totalValue: 9000,
    origin: 'Australia', fluorescence: 'None', polish: 'Good', symmetry: 'Good',
    depth: 62, table: 57,
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=80',
    description: 'Ultimate symbol of love; requires exceptional cutting skill to achieve perfect symmetry.',
    rarity: 'Rare', category: 'Fancy', color_grade: 'Colorless',
  },
  {
    id: 'd9', name: 'Asscher Cut', cut: 'Very Good', shape: 'Asscher', carats: 3.0,
    color: 'F', clarity: 'IF', pricePerCarat: 9500, totalValue: 28500,
    origin: 'South Africa', fluorescence: 'None', polish: 'Excellent', symmetry: 'Excellent',
    depth: 65, table: 64,
    image: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=400&q=80',
    description: 'Square step-cut with cropped corners; art deco style creating a hall of mirrors effect.',
    rarity: 'Very Rare', category: 'Fancy', color_grade: 'Colorless',
  },
  {
    id: 'd10', name: 'Radiant Cut', cut: 'Excellent', shape: 'Radiant', carats: 2.2,
    color: 'G', clarity: 'VVS1', pricePerCarat: 8800, totalValue: 19360,
    origin: 'Brazil', fluorescence: 'Faint', polish: 'Excellent', symmetry: 'Very Good',
    depth: 68, table: 65,
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80',
    description: 'Cropped corners with brilliant-cut facets; combines emerald and round brilliance.',
    rarity: 'Uncommon', category: 'Fancy', color_grade: 'Near Colorless',
  },
  {
    id: 'd11', name: 'Blue Diamond', cut: 'Excellent', shape: 'Round', carats: 0.5,
    color: 'Fancy Blue', clarity: 'VS1', pricePerCarat: 150000, totalValue: 75000,
    origin: 'South Africa', fluorescence: 'Strong', polish: 'Excellent', symmetry: 'Excellent',
    depth: 61, table: 58,
    image: 'https://images.unsplash.com/photo-1568822617270-2c1579f8dfe2?w=400&q=80',
    description: 'Extremely rare blue color from boron traces; most valuable colored diamonds.',
    rarity: 'Legendary', category: 'Colored', color_grade: 'Fancy Blue',
  },
  {
    id: 'd12', name: 'Pink Diamond', cut: 'Very Good', shape: 'Oval', carats: 0.8,
    color: 'Fancy Pink', clarity: 'VVS1', pricePerCarat: 120000, totalValue: 96000,
    origin: 'Australia', fluorescence: 'Faint', polish: 'Very Good', symmetry: 'Excellent',
    depth: 62, table: 60,
    image: 'https://images.unsplash.com/photo-1596516109370-29001ec8ec36?w=400&q=80',
    description: 'From Argyle mine; pink diamonds are among the rarest in the world.',
    rarity: 'Legendary', category: 'Colored', color_grade: 'Fancy Pink',
  },
  {
    id: 'd13', name: 'Yellow Diamond', cut: 'Good', shape: 'Cushion', carats: 1.5,
    color: 'Fancy Yellow', clarity: 'VS2', pricePerCarat: 8000, totalValue: 12000,
    origin: 'South Africa', fluorescence: 'Medium', polish: 'Good', symmetry: 'Good',
    depth: 64, table: 63,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80&sat=-20&hue=30',
    description: 'Vivid yellow from nitrogen; Cape series fancy yellow is highly sought.',
    rarity: 'Rare', category: 'Colored', color_grade: 'Fancy Yellow',
  },
  {
    id: 'd14', name: 'Black Diamond', cut: 'Good', shape: 'Round', carats: 3.0,
    color: 'Fancy Black', clarity: 'N/A', pricePerCarat: 3000, totalValue: 9000,
    origin: 'Brazil', fluorescence: 'None', polish: 'Good', symmetry: 'Good',
    depth: 62, table: 60,
    image: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=400&q=80',
    description: 'Opaque black from numerous inclusions; mysterious and striking in modern jewelry.',
    rarity: 'Uncommon', category: 'Colored', color_grade: 'Fancy Black',
  },
  {
    id: 'd15', name: 'Red Diamond', cut: 'Excellent', shape: 'Round', carats: 0.3,
    color: 'Fancy Red', clarity: 'I1', pricePerCarat: 1000000, totalValue: 300000,
    origin: 'Brazil', fluorescence: 'Strong', polish: 'Excellent', symmetry: 'Excellent',
    depth: 60, table: 57,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80',
    description: 'Rarest diamond color on Earth; only 20-30 true red diamonds exist globally.',
    rarity: 'Legendary', category: 'Colored', color_grade: 'Fancy Red',
  },
  {
    id: 'd16', name: 'Green Diamond', cut: 'Very Good', shape: 'Pear', carats: 0.6,
    color: 'Fancy Green', clarity: 'VS2', pricePerCarat: 50000, totalValue: 30000,
    origin: 'Congo', fluorescence: 'Faint', polish: 'Very Good', symmetry: 'Very Good',
    depth: 63, table: 61,
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400&q=80',
    description: 'Natural green from radiation exposure; Dresden Green is the most famous example.',
    rarity: 'Very Rare', category: 'Colored', color_grade: 'Fancy Green',
  },
  {
    id: 'd17', name: 'Koh-i-Noor Type', cut: 'Oval', shape: 'Oval', carats: 105,
    color: 'D', clarity: 'FL', pricePerCarat: 50000, totalValue: 5250000,
    origin: 'India', fluorescence: 'None', polish: 'Excellent', symmetry: 'Excellent',
    depth: 60, table: 58,
    image: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=400&q=80',
    description: 'Replica specs of the legendary Koh-i-Noor - "Mountain of Light" from India.',
    rarity: 'Legendary', category: 'Historical', color_grade: 'Colorless',
  },
  {
    id: 'd18', name: 'Hope Diamond Type', cut: 'Antique', shape: 'Cushion', carats: 45,
    color: 'Fancy Blue', clarity: 'VS1', pricePerCarat: 200000, totalValue: 9000000,
    origin: 'India', fluorescence: 'Red', polish: 'Good', symmetry: 'Good',
    depth: 65, table: 64,
    image: 'https://images.unsplash.com/photo-1568822617270-2c1579f8dfe2?w=400&q=80',
    description: 'Replica inspired by the legendary Hope Diamond with its distinctive blue color.',
    rarity: 'Legendary', category: 'Historical', color_grade: 'Fancy Blue',
  },
  {
    id: 'd19', name: 'Salt and Pepper', cut: 'Rose', shape: 'Hexagonal', carats: 1.8,
    color: 'Salt/Pepper', clarity: 'I3', pricePerCarat: 1500, totalValue: 2700,
    origin: 'Canada', fluorescence: 'None', polish: 'Good', symmetry: 'Good',
    depth: 3, table: 85,
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80',
    description: 'Unique inclusions create a speckled galaxy-like appearance; trending in modern jewelry.',
    rarity: 'Common', category: 'Specialty', color_grade: 'Included',
  },
  {
    id: 'd20', name: 'Rose Cut Diamond', cut: 'Rose', shape: 'Dome', carats: 1.2,
    color: 'G', clarity: 'SI2', pricePerCarat: 3500, totalValue: 4200,
    origin: 'India', fluorescence: 'Faint', polish: 'Good', symmetry: 'Good',
    depth: 3, table: 80,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80',
    description: 'Flat base with dome-shaped crown; vintage 16th century cut with romantic appearance.',
    rarity: 'Uncommon', category: 'Specialty', color_grade: 'Near Colorless',
  },
  {
    id: 'd21', name: 'Briolette Cut', cut: 'Briolette', shape: 'Teardrop', carats: 0.9,
    color: 'H', clarity: 'SI1', pricePerCarat: 4000, totalValue: 3600,
    origin: 'South Africa', fluorescence: 'None', polish: 'Good', symmetry: 'Good',
    depth: 100, table: 0,
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&q=80',
    description: 'Fully faceted 3D teardrop with no flat base; used as pendants in royal jewelry.',
    rarity: 'Rare', category: 'Specialty', color_grade: 'Near Colorless',
  },
  {
    id: 'd22', name: 'Trillion Cut', cut: 'Very Good', shape: 'Triangle', carats: 1.1,
    color: 'F', clarity: 'VS2', pricePerCarat: 7000, totalValue: 7700,
    origin: 'Botswana', fluorescence: 'Faint', polish: 'Very Good', symmetry: 'Very Good',
    depth: 45, table: 70,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
    description: 'Triangular brilliant cut; dramatic and geometric, often used as side stones.',
    rarity: 'Uncommon', category: 'Fancy', color_grade: 'Colorless',
  },
  {
    id: 'd23', name: 'Old Mine Cut', cut: 'Old Mine', shape: 'Square-Round', carats: 2.1,
    color: 'J', clarity: 'SI1', pricePerCarat: 4500, totalValue: 9450,
    origin: 'Brazil', fluorescence: 'Medium', polish: 'Good', symmetry: 'Good',
    depth: 68, table: 52,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80',
    description: 'Victorian-era cut with high crown and small table; romantic antique appeal.',
    rarity: 'Uncommon', category: 'Antique', color_grade: 'Near Colorless',
  },
  {
    id: 'd24', name: 'Old European Cut', cut: 'Old European', shape: 'Round', carats: 1.7,
    color: 'K', clarity: 'VS1', pricePerCarat: 5000, totalValue: 8500,
    origin: 'India', fluorescence: 'Strong', polish: 'Good', symmetry: 'Good',
    depth: 66, table: 50,
    image: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=400&q=80',
    description: 'Precursor to modern round brilliant; high crown and small circular table.',
    rarity: 'Uncommon', category: 'Antique', color_grade: 'Faint Yellow',
  },
  {
    id: 'd25', name: 'Butterfly Cut', cut: 'Fantasy', shape: 'Butterfly', carats: 0.7,
    color: 'E', clarity: 'VVS2', pricePerCarat: 18000, totalValue: 12600,
    origin: 'Belgium', fluorescence: 'None', polish: 'Excellent', symmetry: 'Excellent',
    depth: 40, table: 60,
    image: 'https://images.unsplash.com/photo-1596516109370-29001ec8ec36?w=400&q=80',
    description: 'Custom fantasy cut in butterfly shape; one-of-a-kind artisanal cutting.',
    rarity: 'Very Rare', category: 'Fantasy', color_grade: 'Colorless',
  },
]

export const DIAMOND_CUTS = ['All', 'Round', 'Fancy', 'Colored', 'Historical', 'Specialty', 'Antique', 'Fantasy']

export const CUT_GRADES = ['Ideal', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor']
export const COLOR_GRADES = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
export const CLARITY_GRADES = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3']

export const DIAMOND_HISTORY = [
  { year: '3000 BC', event: 'First diamonds discovered in India along the Krishna, Godavari and Penner rivers.' },
  { year: '400 BC',  event: 'Sanskrit text "Arthashastra" describes the trade and quality criteria of diamonds.' },
  { year: '1300s',   event: 'Diamond cutting begins in Europe; lapidaries develop early point cut techniques.' },
  { year: '1477',    event: 'Archduke Maximilian of Austria gives first recorded diamond engagement ring to Mary of Burgundy.' },
  { year: '1520',    event: 'Rose cut developed in Antwerp - flat back, dome top with triangular facets.' },
  { year: '1650s',   event: 'Cardinal Mazarin commissions 18 diamonds cut in new "double cut" style - 34 facets.' },
  { year: '1750',    event: 'Old Mine Cut popularized; becomes primary cut through Victorian era.' },
  { year: '1866',    event: 'Eureka Diamond discovered in South Africa, sparking the great diamond rush.' },
  { year: '1871',    event: 'Kimberley Big Hole opens; South Africa becomes world\'s top diamond producer.' },
  { year: '1888',    event: 'De Beers Consolidated Mines founded by Cecil Rhodes in South Africa.' },
  { year: '1919',    event: 'Marcel Tolkowsky publishes ideal proportions for the brilliant cut - the modern round brilliant is born.' },
  { year: '1947',    event: 'De Beers launches "A Diamond is Forever" campaign; changes engagement ring culture permanently.' },
  { year: '1955',    event: 'GE produces first synthetic diamond using high-pressure, high-temperature (HPHT) process.' },
  { year: '1970s',   event: 'Princess cut invented; becomes second most popular diamond shape.' },
  { year: '1998',    event: 'Argyle mine in Australia becomes dominant source of rare pink and red diamonds.' },
  { year: '2003',    event: 'Kimberley Process Certification Scheme launched to stop trade in conflict diamonds.' },
  { year: '2010s',   event: 'Lab-grown diamonds gain mainstream acceptance; CVD technology advances rapidly.' },
  { year: '2020',    event: 'Lab diamonds account for 10% of global diamond jewelry market.' },
  { year: '2023',    event: 'AI-powered diamond grading and valuation tools enter commercial use.' },
  { year: '2024',    event: 'Argyle mine closes; pink diamond prices surge 500% over decade.' },
]

export const VALUE_FACTORS = [
  { factor: 'Cut',          weight: 35, icon: '✂️', description: 'Most important factor - affects brilliance, fire, and scintillation. Excellent cut maximizes light return.' },
  { factor: 'Color',        weight: 25, icon: '🎨', description: 'D (colorless) to Z (yellow). Colorless diamonds (D-F) are most rare and valuable.' },
  { factor: 'Clarity',      weight: 20, icon: '🔍', description: 'Measures internal inclusions and external blemishes under 10x magnification.' },
  { factor: 'Carat Weight', weight: 20, icon: '⚖️', description: '1 carat = 0.2 grams. Price per carat increases exponentially at magic weights (0.5, 1.0, 1.5, 2.0 ct).' },
]

export const PRICING_GUIDE = [
  { carats: '0.25-0.49', dVs1: '$1,800-$3,500',    gVs2: '$900-$1,800',   jSi1: '$400-$800' },
  { carats: '0.50-0.69', dVs1: '$4,000-$8,000',    gVs2: '$2,000-$4,000', jSi1: '$900-$1,800' },
  { carats: '0.70-0.99', dVs1: '$6,000-$14,000',   gVs2: '$3,000-$7,000', jSi1: '$1,500-$3,500' },
  { carats: '1.00-1.49', dVs1: '$10,000-$22,000',  gVs2: '$5,000-$12,000',jSi1: '$2,500-$6,000' },
  { carats: '1.50-1.99', dVs1: '$18,000-$40,000',  gVs2: '$9,000-$20,000',jSi1: '$4,000-$10,000' },
  { carats: '2.00-2.99', dVs1: '$30,000-$70,000',  gVs2: '$15,000-$35,000',jSi1: '$7,000-$18,000' },
  { carats: '3.00+',     dVs1: '$60,000-$150,000+',gVs2: '$30,000-$80,000',jSi1: '$14,000-$40,000' },
]
