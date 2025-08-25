const express = require('express');
const path = require('path');
const Menu = require(path.join(__dirname, '..', 'models', 'Menu'));
const router = express.Router();

const DEFAULT_IMAGES = {
  Starters:   '/images/default-starter.jpg',
  Vegetarian: '/images/default-veg.jpg',
  Chicken:    '/images/default-chicken.jpg',
  Lamb:       '/images/default-lamb.jpg',
  Biryani:    '/images/default-biryani.jpg',
  Bread:      '/images/default-bread.jpg',
  Dessert:    '/images/default-dessert.jpg',
  SoftDrinks: '/images/default-softdrink.jpg',
  Alkohol:    '/images/default-alcohol.jpg',
  _:          '/images/default-generic.jpg',
};

const toPublicUrl = (req, p) => {
  if (!p) return '';
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return `${req.protocol}://${req.get('host')}${p.startsWith('/') ? p : `/${p}`}`;
};

const mapWithFullUrl = (req, doc) => {
  const o = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  const relOrGiven = o.imageUrl && o.imageUrl.trim()
    ? o.imageUrl
    : (DEFAULT_IMAGES[o.category] || DEFAULT_IMAGES._);
  return { ...o, id: o._id, imageUrl: toPublicUrl(req, relOrGiven) };
};

const seedData = [
    // Starters / Vorspeisen
  { name: 'Samosa (2 Pcs)', category: 'Starters', price: 7.00, veg: true,  description: 'Teigtaschen mit Gemüsefüllung', imageUrl: '/images/samosa.jpg' },
  { name: 'Veg Manchuria',  category: 'Starters', price: 7.00, veg: true,  description: 'Frittierte Gemüsebällchen in brauner Soße', imageUrl: '/images/VegManchuria.jpg' },
  { name: 'Gobi Manchuria', category: 'Starters', price: 7.00, veg: true,  description: 'Frittierter Blumenkohl in aromatischer Sojasoße', imageUrl: '/images/gobimanchurian.webp' },
  { name: 'Chilli Chicken', category: 'Starters', price: 7.00, veg: false, description: 'Hühnerfleisch mit Soja-, Zwiebel-, Paprika- und Chillisauce', imageUrl: '/images/ChilliChicken.jpg' },
  { name: 'Chicken 65',     category: 'Starters', price: 5.00, veg: false, description: 'Würzig frittiertes Hähnchengericht', imageUrl: '/images/chicken65.webp' },

  // Vegetarian
  { name: 'Chana Masala', category: 'Vegetarian', price: 8.00, veg: true, description: 'Kichererbsen in pikanter Curry-Gewürzsauce', imageUrl: '/images/ChannaMasala.avif'  },
  { name: 'Dal Tadka', category: 'Vegetarian', price: 8.00, veg: true, description: 'Linsen mit Butter, Zwiebeln, Tomaten und Knoblauch' , imageUrl: '/images/DalTadka.jpg' },
  { name: 'Dal Makhani', category: 'Vegetarian', price: 8.00, veg: true, description: 'Schwarze Linsen und Kidneybohnen in Butter und Sahne', imageUrl: '/images/DalMakhani.jpg'  },
  { name: 'Veg Kofta', category: 'Vegetarian', price: 8.00, veg: true, description: 'Gemüse-Bällchen in würziger Sauce' , imageUrl: '/images/vegkofta.jpg' },
  { name: 'Paneer Butter Masala', category: 'Vegetarian', price: 8.00, veg: true, description: 'Hausgemachter Käse in Tomaten-Sahne-Sauce', imageUrl: '/images/PBM.webp'  },
  { name: 'Palak Paneer', category: 'Vegetarian', price: 8.00, veg: true, description: 'Spinat mit Paneer und Kräutern', imageUrl: '/images/PP.jpg'  },
  { name: 'Kadai Paneer', category: 'Vegetarian', price: 8.00, veg: true, description: 'Paneer mit Paprika, Zwiebeln, Gewürzsoße (scharf)', imageUrl: '/images/KP.jpg'  },
  { name: 'Babycorn Mushroom Masala', category: 'Vegetarian', price: 8.00, veg: true, description: 'Babymais und Champignons mit Garam Masala' , imageUrl: '/images/BbyCornMasala.webp' },
  { name: 'Mushroom Matar Masala', category: 'Vegetarian', price: 7.00, veg: true, description: 'Champignons und Erbsen in Tomaten-Currysoße' , imageUrl: '/images/MMasala.jpg' },

  // Chicken
  { name: 'Butter Chicken', category: 'Chicken', price: 9.00, veg: false, description: 'Gegrilltes Hühnerfilet in Tomaten-Cashew-Sahnesauce', imageUrl: '/images/ButterChicken.jpg' },
  { name: 'Chicken Hyderabadi', category: 'Chicken', price: 9.00, veg: false, description: 'Hühnerfilet mit Kokosmilch nach südindischer Art', imageUrl: '/images/ChickenHyderabadi.webp' },
  { name: 'Chicken Vindaloo', category: 'Chicken', price: 9.00, veg: false, description: 'Hühnerfilet mit Kartoffel-Tomaten-Curry (scharf)', imageUrl: '/images/ChickenVindaloo.jpg' },
  { name: 'Chicken Kadai', category: 'Chicken', price: 9.00, veg: false, description: 'Hähnchen mit Tomaten, Paprika, Gewürzen (scharf)' , imageUrl: '/images/Chicken-Karahi.jpg'},
  { name: 'Palak Chicken', category: 'Chicken', price: 9.00, veg: false, description: 'Hühnerfilet mit Spinat, Ingwer, Tomaten' , imageUrl: '/images/Palakchicken.jpg'},
  { name: 'Mango Chicken', category: 'Chicken', price: 9.00, veg: false, description: 'Hähnchen mit Mango, Ingwer und Gewürzen' , imageUrl: '/images/MANGO-CHICKEN.webp'},

  // Lamb
{ name: 'Lamm Vindaloo', category: 'Lamb', price: 10.00, veg: false, description: ' Lammfleisch mit Kartoffeln nach pikanter,westindischer Art mit Kokosraspeln (Scharf)', imageUrl: '/images/lambvindaloo.jpeg' },
{ name: 'Lamm Curry', category: 'Lamb', price: 10.00, veg: false, description: 'Lammfleisch gekocht mit Kokosmilch nach original südindischer Art ', imageUrl: '/images/lamm_curry.jpg' },
{ name: 'Palak Lamm', category: 'Lamb', price: 10.00, veg: false, description: ' Lammfleisch mit Blattspinat, frischem Ingwer,Tomaten und Zwiebeln ', imageUrl: '/images/Lamb-Palak.jpg' }, 
{ name: 'Lamm Rogan Josh', category: 'Lamb', price: 10.00, veg: false, description: ' Lammfleisch mit speziellen Gewürzen und Kräutern in Curry-Paprikasoße (scharf)', imageUrl: '/images/LammRoganJosh.jpg' },


  
  // Biryani & Rice
  { name: 'Chicken Biryani', category: 'Biryani', price: 10.00, veg: false, description: 'Basmati Reis mit Hähnchen, Gewürzen', imageUrl: '/images/Cknbiriyani.jpg' },
  { name: 'Lamm Biryani', category: 'Biryani', price: 12.00, veg: false, description: 'Basmati Reis mit Lamm, Gewürzen', imageUrl: '/images/LammBiriyani.avif' },
  { name: 'Veg Pulao', category: 'Biryani', price: 9.00, veg: true, description: 'Basmati Reis mit Gemüse, Kräutern', imageUrl: '/images/VegPulov.jpg' },

  // Breads
  { name: 'Roti', category: 'Bread', price: 2.00, veg: true, description: 'Fladenbrot aus Roggenmehl mit Ghee',imageUrl: '/images/Tandoori-Roti.jpg' },
  { name: 'Butter Naan', category: 'Bread', price: 3.00, veg: true, description: 'Hefeteigfladen aus dem Tandoor mit Butter', imageUrl: '/images/Naan.jpg' },
  { name: 'Garlic Butter Naan', category: 'Bread', price: 3.00, veg: true, description: 'Hefeteigfladen mit Knoblauchbutter', imageUrl: '/images/garlic-naan-3.jpg' },

  // Dessert
  { name: 'Gulab Jamun (2 Pcs)', category: 'Dessert', price: 2.00, veg: true, description: 'Frittierte Käsebällchen in Rosenwasser-Sirup', imageUrl: '/images/GulabJamoon.jpg' },
  { name: 'Gajar Ka Halwa', category: 'Dessert', price: 2.50, veg: true, description: 'Karottenpudding mit Milch, Zucker, Kardamom', imageUrl: '/images/GajarkaHalwa.webp' },

  // SoftDrinks
  { name: 'Mango Lassi', category: 'SoftDrinks', price: 3.00, description: 'Joghurtgetränk mit Mango', imageUrl: '/images/MangoLassi.jpg' },
  { name: 'Coca Cola / Sprite / Fanta', category: 'SoftDrinks', price: 3.00, description: 'Softdrinks 330ml', imageUrl: '/images/CocaCola.jpg' },
  { name: 'Red Bull', category: 'SoftDrinks', price: 1.50, description: 'Energy Drink 250ml', imageUrl: '/images/RedBull.jpeg' },
  { name: 'Durstlöscher', category: 'SoftDrinks', price: 2.00,  description: '500ml', imageUrl: '/images/IMG-20250808-WA0027.jpg' },

  // Alkohol
  { name: 'Pilsener', category: 'Alkohol', price: 2.50,  description: 'Bier 500ml', imageUrl: '/images/Pilsener.jpg' },
  { name: 'Hefeweizen', category: 'Alkohol', price: 3.00, description: 'Bier 500ml', imageUrl: '/images/Hefeweizen.jpg' },
  { name: 'Whisky', category: 'Alkohol', price: 5.00,  description: 'Whisky 3cl', imageUrl: '/images/whisky.jpg' }, 
];

router.post('/seed', async (req, res) => {
  try {
    await Menu.deleteMany({});
    const docs = await Menu.insertMany(
      seedData.map((d, idx) => ({ _id: idx + 1, available: true, ...d })),
      { ordered: true }
    );
    res.status(201).json(docs.map(d => mapWithFullUrl(req, d)));
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ message: 'Seeding failed', error: err.message });
  }
});

router.get('/', async (req, res) => {
  const items = await Menu.find({}).sort({ category: 1, name: 1 }).lean();
  res.json(items.map(i => mapWithFullUrl(req, i)));
});

router.post('/', async (req, res) => {
  const { name, category, price, description } = req.body || {};
  if (!name || !category || typeof price !== 'number' || !description) {
    return res.status(400).json({ message: 'name, category, price, description are required' });
  }
  const last = await Menu.findOne({}, {}, { sort: { _id: -1 } }).lean();
  const nextId = last ? Number(last._id) + 1 : 1;
  const created = await Menu.create({ _id: nextId, available: true, ...req.body });
  res.status(201).json(mapWithFullUrl(req, created));
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const updated = await Menu.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(mapWithFullUrl(req, updated));
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const del = await Menu.findByIdAndDelete(id);
  if (!del) return res.status(404).json({ message: 'Not found' });
  res.json({ deleted: true, id });
});

router.get('/categories', async (_req, res) => {
  const cats = await Menu.distinct('category');
  res.json(cats);
});

router.get('/category/:name', async (req, res) => {
  const items = await Menu.find({ category: req.params.name }).sort({ name: 1 }).lean();
  res.json(items.map(i => mapWithFullUrl(req, i)));
});

router.get('/search', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json([]);
  const items = await Menu.find({ name: new RegExp(q, 'i') }).lean();
  res.json(items.map(i => mapWithFullUrl(req, i)));
});

module.exports = router;
