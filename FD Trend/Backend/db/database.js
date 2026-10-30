const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'fdtrend.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

function initDatabase() {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      profile_image TEXT,
      bio TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      category_id INTEGER,
      category_name TEXT NOT NULL,
      author_id INTEGER,
      author_name TEXT NOT NULL,
      author_image TEXT,
      status TEXT DEFAULT 'published',
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      views INTEGER DEFAULT 0,
      read_time TEXT DEFAULT '5 min read',
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
      FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS trends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      popularity_score INTEGER DEFAULT 85,
      season TEXT DEFAULT 'Spring/Summer 2026',
      category_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS designers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      country TEXT NOT NULL,
      biography TEXT NOT NULL,
      design_style TEXT NOT NULL,
      profile_image TEXT NOT NULL,
      website TEXT,
      category_type TEXT DEFAULT 'Luxury',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      designer_id INTEGER,
      designer_name TEXT NOT NULL,
      name TEXT NOT NULL,
      season TEXT NOT NULL,
      year INTEGER NOT NULL,
      description TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      category_type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (designer_id) REFERENCES designers (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS street_style (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      image TEXT NOT NULL,
      outfit_category TEXT NOT NULL,
      style_tags TEXT NOT NULL,
      saved_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      item_type TEXT NOT NULL,
      item_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      UNIQUE(user_id, item_type, item_id)
    );

    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      article_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE,
      UNIQUE(user_id, article_id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      user_image TEXT,
      article_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_interests (
      user_id INTEGER NOT NULL,
      category_name TEXT NOT NULL,
      PRIMARY KEY (user_id, category_name),
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS followed_designers (
      user_id INTEGER NOT NULL,
      designer_id INTEGER NOT NULL,
      PRIMARY KEY (user_id, designer_id),
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (designer_id) REFERENCES designers (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reading_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      article_id INTEGER NOT NULL,
      viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) {
    return; // Already seeded
  }

  console.log('Seeding FD Trend relational database...');

  const passHash = bcrypt.hashSync('admin123', 10);
  const userHash = bcrypt.hashSync('user123', 10);

  // Insert Users
  const adminStmt = db.prepare(`
    INSERT INTO users (name, username, email, password_hash, profile_image, bio, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  adminStmt.run('Victoria Vance', 'victoria_editor', 'admin@fdtrend.com', passHash, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600', 'Senior Fashion Director & Editor-in-Chief at FD Trend.', 'admin');
  
  const userStmt = db.prepare(`
    INSERT INTO users (name, username, email, password_hash, profile_image, bio, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const demoUser = userStmt.run('Elena Rostova', 'elena_r', 'user@fdtrend.com', userHash, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600', 'Fashion Curator & Sustainable Textile Enthusiast.', 'user');

  // Insert Categories
  const categories = [
    { name: 'Fashion', slug: 'fashion', description: 'Runway analysis, silhouette movements, and couture craftsmanship.' },
    { name: 'Trends', slug: 'trends', description: 'Emerging micro and macro aesthetic shifts in global culture.' },
    { name: 'Designers', slug: 'designers', description: 'In-depth profiles on visionary creative directors and ateliers.' },
    { name: 'Collections', slug: 'collections', description: 'Seasonal capsule releases and international fashion week lookbooks.' },
    { name: 'Street Style', slug: 'street-style', description: 'Candid sartorial expressions from Tokyo, Paris, Milan, and New York.' },
    { name: 'Beauty', slug: 'beauty', description: 'Editorial hair, avant-garde cosmetics, and wellness philosophies.' },
    { name: 'Culture', slug: 'culture', description: 'The intersection of high art, cinema, music, and fashion history.' },
    { name: 'Editorial', slug: 'editorial', description: 'Thoughtful essays and investigative features on industry evolution.' }
  ];

  const catStmt = db.prepare('INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)');
  categories.forEach(c => catStmt.run(c.name, c.slug, c.description));

  // Insert Trends
  const trends = [
    {
      name: 'Quiet Luxury',
      slug: 'quiet-luxury',
      description: 'Understated elegance defined by hyper-luxurious cashmere, immaculate tailoring, logo-less coats, and muted neutral tones.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000',
      popularity_score: 96,
      season: 'Spring/Summer 2026',
      category_name: 'Luxury'
    },
    {
      name: 'Futuristic Fashion',
      slug: 'futuristic-fashion',
      description: '3D-printed bio-polymers, metallic chrome textiles, and architectural sci-fi silhouettes inspired by cybernetic aesthetics.',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000',
      popularity_score: 91,
      season: 'Autumn/Winter 2026',
      category_name: 'Fashion Technology'
    },
    {
      name: 'Sheer Layers',
      slug: 'sheer-layers',
      description: 'Translucent silk chiffon, delicate tulle layering, and sensual transparency subverting traditional eveningwear.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000',
      popularity_score: 88,
      season: 'Spring/Summer 2026',
      category_name: 'Haute Couture'
    },
    {
      name: 'Oversized Silhouettes',
      slug: 'oversized-silhouettes',
      description: 'Exaggerated shoulders, cocoon outerwear, and voluminous trousers offering dramatic spatial presence.',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000',
      popularity_score: 94,
      season: 'Autumn/Winter 2026',
      category_name: 'Streetwear'
    },
    {
      name: 'Metallic Details',
      slug: 'metallic-details',
      description: 'Liquid gold hues, molten silver accessories, and high-shine hardware elevating daytime minimalist tailoring.',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1000',
      popularity_score: 84,
      season: 'Resort 2026',
      category_name: 'Accessories'
    },
    {
      name: 'Sustainable Fashion',
      slug: 'sustainable-fashion',
      description: 'Regenerative organic cottons, upcycled deadstock silk, and mushroom-leather innovation championing circular loops.',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1000',
      popularity_score: 98,
      season: 'Permanent',
      category_name: 'Sustainable fashion'
    },
    {
      name: 'Neo-Minimalism',
      slug: 'neo-minimalism',
      description: 'Sharp monochrome lines, asymmetrical cuts, and hidden fastenings stripping garments to pure architectural geometry.',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000',
      popularity_score: 89,
      season: 'Spring/Summer 2026',
      category_name: 'Fashion'
    },
    {
      name: 'Textural Heritage',
      slug: 'textural-heritage',
      description: 'Hand-woven jacquards, raw linen slubs, and intricate embroidery honoring global artisanal craftsmanship.',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1000',
      popularity_score: 86,
      season: 'Autumn/Winter 2026',
      category_name: 'Textile design'
    },
    {
      name: 'Deconstructed Denim',
      slug: 'deconstructed-denim',
      description: 'Raw-edged indigo panelling, spliced outerwear, and utilitarian tailoring redefining classic denim codes.',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=1000',
      popularity_score: 87,
      season: 'Spring/Summer 2026',
      category_name: 'Streetwear'
    },
    {
      name: 'Sculptural Footwear',
      slug: 'sculptural-footwear',
      description: 'Geometric wooden heels, organic chrome soles, and architectural leather boots acting as wearable art objects.',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000',
      popularity_score: 92,
      season: 'Autumn/Winter 2026',
      category_name: 'Footwear'
    }
  ];

  const trendStmt = db.prepare(`
    INSERT INTO trends (name, slug, description, image, popularity_score, season, category_name)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  trends.forEach(t => trendStmt.run(t.name, t.slug, t.description, t.image, t.popularity_score, t.season, t.category_name));

  // Insert Designers
  const designers = [
    {
      name: 'Stella McCartney',
      slug: 'stella-mccartney',
      country: 'United Kingdom',
      biography: 'A pioneer of eco-conscious luxury fashion who has championed leather-free and cruelty-free innovation since founding her eponymous maison in 2001.',
      design_style: 'Savile Row precision tailoring infused with effortless femininity and zero-impact sustainable textiles.',
      profile_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
      website: 'https://stellamccartney.com',
      category_type: 'Sustainable Designers'
    },
    {
      name: 'Iris van Herpen',
      slug: 'iris-van-herpen',
      country: 'Netherlands',
      biography: 'Renowned for pioneering 3D printing and multidisciplinary science in Haute Couture, creating otherworldly fluid garments that merge technology and nature.',
      design_style: 'Avant-garde biomimicry, kinetic movement, laser-cut silk, and additive manufacturing.',
      profile_image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800',
      website: 'https://irisvanherpen.com',
      category_type: 'Emerging Designers'
    },
    {
      name: 'Simon Porte Jacquemus',
      slug: 'jacquemus',
      country: 'France',
      biography: 'Founded in Paris by Simon Porte Jacquemus at age 19, the brand is celebrated for its sun-drenched Provençal storytelling, viral micro-bags, and colossal runway spectacles.',
      design_style: 'Playful proportions, deconstructed shirting, earthy Mediterranean hues, and poetic minimalism.',
      profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
      website: 'https://jacquemus.com',
      category_type: 'Global Designers'
    },
    {
      name: 'Sabyasachi Mukherjee',
      slug: 'sabyasachi',
      country: 'India',
      biography: 'India’s foremost luxury couturier whose name is synonymous with regal heritage embroidery, hand-loomed textiles, and timeless antique jewelry craftsmanship.',
      design_style: 'Opulent Zardozi hand-embroidery, crushed silk velvets, heritage brocades, and nostalgic grandeur.',
      profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
      website: 'https://sabyasachi.com',
      category_type: 'Indian Designers'
    },
    {
      name: 'Pierpaolo Piccioli',
      slug: 'pierpaolo-piccioli',
      country: 'Italy',
      biography: 'Master of emotional color and voluminous silhouette, credited with modernizing Roman Haute Couture through inclusive storytelling and vivid monocromatic statements.',
      design_style: 'High-voltage color theory, dramatic opera capes, sculptural purity, and romantic humanism.',
      profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800',
      website: 'https://valentino.com',
      category_type: 'Luxury Designers'
    },
    {
      name: 'Nensi Dojaka',
      slug: 'nensi-dojaka',
      country: 'Albania / UK',
      biography: 'LVMH Prize winner whose delicate sheer lingerie-inspired dresses redefined modern sensual eveningwear for a new generation of women.',
      design_style: 'Intricate spaghetti strapping, tulle panelling, architectural cut-outs, and body-con silk chiffon.',
      profile_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
      website: 'https://nensidojaka.com',
      category_type: 'Emerging Designers'
    },
    {
      name: 'Marine Serre',
      slug: 'marine-serre',
      country: 'France',
      biography: 'Visionary Parisian designer renowned for her iconic crescent moon motif, upcycled technical garments, and eco-futuristic runway narratives.',
      design_style: 'Hybrid sportswear, second-skin printed catsuits, reclaimed carpet coats, and dystopian elegance.',
      profile_image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800',
      website: 'https://marineserre.com',
      category_type: 'Sustainable Designers'
    },
    {
      name: 'Rick Owens',
      slug: 'rick-owens',
      country: 'United States',
      biography: 'The dark lord of avant-garde fashion whose brutalist draped silhouettes and monolithic runway presentations have earned a cult global following.',
      design_style: 'Monochromatic gothic draping, platform footwear, brutalist leather jacket construction, and elongated proportions.',
      profile_image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
      website: 'https://rickowens.eu',
      category_type: 'Global Designers'
    }
  ];

  const desStmt = db.prepare(`
    INSERT INTO designers (name, slug, country, biography, design_style, profile_image, website, category_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  designers.forEach(d => desStmt.run(d.name, d.slug, d.country, d.biography, d.design_style, d.profile_image, d.website, d.category_type));

  // Insert Collections
  const collections = [
    {
      designer_id: 1,
      designer_name: 'Stella McCartney',
      name: 'Equestrian Eco Odyssey',
      season: 'Spring/Summer',
      year: 2026,
      description: 'Crafted from 95% eco-certified responsible materials, featuring mycelium leather equestrian boots, fluid tailoring, and un-dyed organic linen.',
      cover_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000',
      category_type: 'Ready-to-Wear'
    },
    {
      designer_id: 2,
      designer_name: 'Iris van Herpen',
      name: 'Symbiosis in Motion',
      season: 'Haute Couture',
      year: 2026,
      description: 'A ethereal fusion of 3D-printed glass organza and algae-based bioluminescent sequins exploring underwater neural networks.',
      cover_image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000',
      category_type: 'Haute Couture'
    },
    {
      designer_id: 3,
      designer_name: 'Simon Porte Jacquemus',
      name: 'Le Chapeau de Paille',
      season: 'Resort',
      year: 2026,
      description: 'Staged amidst the lavender fields of Valensole, showcasing oversized straw brims, terracotta poplin shirts, and linen column gowns.',
      cover_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000',
      category_type: 'Resort'
    },
    {
      designer_id: 4,
      designer_name: 'Sabyasachi Mukherjee',
      name: 'The Heritage Royal Atelier',
      season: 'Bridal',
      year: 2026,
      description: 'Intricate zardozi embroidery, uncut diamond jewelry, and hand-woven Benarasi brocade lehengas inspired by 19th-century royal portraiture.',
      cover_image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000',
      category_type: 'Bridal'
    },
    {
      designer_id: 5,
      designer_name: 'Pierpaolo Piccioli',
      name: 'Monochrome Monoliths',
      season: 'Autumn/Winter',
      year: 2026,
      description: 'A study in singular color saturation featuring opera coats, high-neck silk faille dresses, and architectural wool overcoats.',
      cover_image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000',
      category_type: 'Womenswear'
    },
    {
      designer_id: 6,
      designer_name: 'Nensi Dojaka',
      name: 'Linear Sensuality',
      season: 'Spring/Summer',
      year: 2026,
      description: 'Precision sheer tulle paneling, asymmetrical bra cups, and fluid floor-sweeping silk jersey skirts.',
      cover_image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1000',
      category_type: 'Ready-to-Wear'
    },
    {
      designer_id: 7,
      designer_name: 'Marine Serre',
      name: 'Future Renaissance',
      season: 'Autumn/Winter',
      year: 2026,
      description: 'Recycled denim patchwork trench coats, laser-etched crescent moon jacquards, and modular utility outerwear.',
      cover_image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=1000',
      category_type: 'Unisex'
    },
    {
      designer_id: 8,
      designer_name: 'Rick Owens',
      name: 'Monolithic Temple',
      season: 'Autumn/Winter',
      year: 2026,
      description: 'Brutalist leather outerwear, padded cocoon duffels, and grounding platform leather boots presented with smoke columns.',
      cover_image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000',
      category_type: 'Menswear'
    }
  ];

  const colStmt = db.prepare(`
    INSERT INTO collections (designer_id, designer_name, name, season, year, description, cover_image, category_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  collections.forEach(c => colStmt.run(c.designer_id, c.designer_name, c.name, c.season, c.year, c.description, c.cover_image, c.category_type));

  // Insert 15 Articles
  const articles = [
    {
      title: 'The New Language of Modern Fashion: Quiet Elegance in the Age of Noise',
      slug: 'future-of-sustainable-fashion',
      excerpt: 'As hyper-consumerism meets unprecedented digital saturation, modern fashion design is turning back toward clean tailoring, discreet luxury, and timeless materials.',
      content: `
        <p class="lead">In an era dominated by rapid algorithm trends and fleeting viral moments, a profound paradigm shift is taking root across global fashion capitals from Paris to Tokyo. Designers are stripping away noisy logos and unnecessary embellishments in favor of pure form, exquisite tactile textiles, and architectural precision.</p>

        <h2>The Philosophy of Understated Craftsmanship</h2>
        <p>Quiet Luxury is far more than a passing internet buzzword; it represents a philosophical return to the core principles of haute couture. Rather than demanding attention through loud branding, contemporary luxury commands respect through flawless draping, double-faced cashmere, and secret interior finishings known only to the wearer.</p>

        <blockquote class="my-8 pl-6 border-l-2 border-black italic text-xl font-serif text-gray-800">
          "True elegance does not demand to be noticed; it radiates through the quiet confidence of immaculate cut and uncompromising textile integrity."
        </blockquote>

        <h2>Material Innovation Meets Heritage Draping</h2>
        <p>Leading maisons are combining centuries-old weaving techniques with modern sustainable bio-fibers. We see organic silk blended with lotus root fibers, un-dyed alpaca wool coats, and recycled cashmere suits. The color palette focuses on grounding mineral tones: bone white, deep graphite, warm camel, and midnight navy.</p>

        <div class="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800" alt="Minimalist Tailoring" class="w-full h-64 object-cover" />
          <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800" alt="Neutrals Fashion" class="w-full h-64 object-cover" />
        </div>

        <h2>Looking Ahead to the Next Decade</h2>
        <p>As fashion consumers become increasingly conscious of textile longevity and personal identity, the future belongs to wardrobes built on intentionality. Modern fashion is no longer about buying more—it is about investing in garments that age gracefully alongside the human spirit.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200',
      category_id: 1,
      category_name: 'Fashion',
      author_id: 1,
      author_name: 'Victoria Vance',
      author_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      is_featured: 1,
      views: 1420,
      read_time: '6 min read'
    },
    {
      title: 'Architectural Silhouettes: How 3D Printing is Reshaping Couture',
      slug: 'architectural-silhouettes-3d-printing-couture',
      excerpt: 'Exploring how bio-polymers, parametric software, and additive manufacturing are creating organic wearable sculptures on the Paris runways.',
      content: `
        <p>The boundaries between computer science, marine biology, and haute couture are dissolving. Pioneer designers are using algorithms to map human bone structure and muscle movement, printing garments that ripple like sea anemones as models walk down the runway.</p>

        <h2>Algorithmic Patternmaking</h2>
        <p>Rather than cutting flat paper patterns, couturiers now manipulate 3D digital meshes. Garments are grown layer by layer using plant-based PLA and recycled ocean plastic filaments. This zero-waste process produces zero fabric scrap while achieving geometric complexities impossible through traditional sewing needles.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200',
      category_id: 2,
      category_name: 'Trends',
      author_id: 1,
      author_name: 'Victoria Vance',
      author_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      is_featured: 0,
      views: 890,
      read_time: '4 min read'
    },
    {
      title: 'The Art of Layering: Tokyo Street Style Report 2026',
      slug: 'tokyo-street-style-report-2026',
      excerpt: 'From Harajuku vintage denim to Ginza tailored monochrome, Tokyo continues to lead global street style with unmatched proportions.',
      content: `
        <p>In Tokyo, personal style is an art form of intricate spatial awareness. Youth subcultures seamlessly blend 1990s military surplus with avant-garde Japanese master tailors like Yohji Yamamoto and Comme des Garçons.</p>

        <h2>Mastering Asymmetrical Proportions</h2>
        <p>The key to Tokyo’s street aesthetic lies in juxtaposing opposing textures: heavyweight raw denim paired with translucent silk organza, topped with oversized cocoon outerwear.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
      category_id: 5,
      category_name: 'Street Style',
      author_id: 1,
      author_name: 'Victoria Vance',
      author_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      is_featured: 0,
      views: 1120,
      read_time: '5 min read'
    },
    {
      title: 'Subtle Geometry: The Rise of Neo-Minimalist Jewelry',
      slug: 'neo-minimalist-jewelry-trends',
      excerpt: 'Clean silver bands, architectural golden cuffs, and raw unpolished gemstones redefine modern luxury accessories.',
      content: `
        <p>Modern jewelry design is embracing pure form over excessive pave settings. Sculptural silver cuffs that mimic architectural cantilever beams are gracing both red carpets and everyday street style.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1200',
      category_id: 1,
      category_name: 'Fashion',
      author_id: 1,
      author_name: 'Victoria Vance',
      author_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      is_featured: 0,
      views: 650,
      read_time: '3 min read'
    },
    {
      title: 'Circular Fashion: Closed-Loop Textile Innovations in Milan',
      slug: 'circular-fashion-closed-loop-textiles',
      excerpt: 'Italian luxury mills are reinventing fashion waste by turning deadstock silk and post-consumer wool into pristine luxury yarns.',
      content: `
        <p>Circular economy principles are moving from niche artisanal experiments into the beating heart of European luxury manufacturing. Biorefinery technologies now break down worn garments into cellulose building blocks, spinning new fibers stronger than original virgin silk.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200',
      category_id: 8,
      category_name: 'Editorial',
      author_id: 1,
      author_name: 'Victoria Vance',
      author_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      is_featured: 0,
      views: 940,
      read_time: '7 min read'
    },
    {
      title: 'Monochromatic Magic: Why Black and White Never Lose Power',
      slug: 'monochromatic-black-and-white-fashion',
      excerpt: 'High contrast visual storytelling in runway history—from Coco Chanel to contemporary minimalist ateliers.',
      content: `
        <p>Black and white represent the ultimate aesthetic dichotomy. Stripped of hue distractions, monochromatic garments force the viewer to focus entirely on silhouette, line weight, shadow depth, and textile texture.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200',
      category_id: 7,
      category_name: 'Culture',
      author_id: 1,
      author_name: 'Victoria Vance',
      author_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      is_featured: 0,
      views: 1310,
      read_time: '4 min read'
    },
    {
      title: 'Natural Glow: Editorial Beauty Philosophies for 2026',
      slug: 'editorial-beauty-philosophies-2026',
      excerpt: 'Skincare-infused makeup formulations, luminous dew finishes, and minimalist editorial cosmetics taking over fashion week.',
      content: `
        <p>Heavy matte foundation is officially a relic of the past. Top runway makeup artists are prioritizing skin barrier hydration, light-reflecting botanical oils, and subtle glossy lids that enhance natural skin texture.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200',
      category_id: 6,
      category_name: 'Beauty',
      author_id: 1,
      author_name: 'Victoria Vance',
      author_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      is_featured: 0,
      views: 780,
      read_time: '4 min read'
    },
    {
      title: 'Indian Hand-Loom Craftsmanship: Royal Heritage for Global Runways',
      slug: 'indian-handloom-craftsmanship-global-fashion',
      excerpt: 'How centuries-old Khadi weaving, Zardozi embroidery, and natural indigo dyeing are captivating modern international couture.',
      content: `
        <p>Master weavers in Varanasi, Chanderi, and Bengal are preserving generational techniques that elevate textiles into heirloom art. International luxury houses are establishing direct artisan partnerships to integrate hand-loomed brocades into global collections.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1200',
      category_id: 3,
      category_name: 'Designers',
      author_id: 1,
      author_name: 'Victoria Vance',
      author_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      is_featured: 0,
      views: 1540,
      read_time: '6 min read'
    },
    {
      title: 'The Evolution of Deconstructed Denim: Workwear to Runway',
      slug: 'evolution-deconstructed-denim-workwear-runway',
      excerpt: 'Tracing the journey of utility denim from 19th century workwear to asymmetric runway coats and high-fashion eveningwear.',
      content: `
        <p>Denim is fashion’s most democratic canvas. Designers are now tearing down vintage jeans, re-stitching salvage selvedge into architectural floor-length trench coats, and combining denim with fine silk chiffon.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=1200',
      category_id: 1,
      category_name: 'Fashion',
      author_id: 1,
      author_name: 'Victoria Vance',
      author_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      is_featured: 0,
      views: 820,
      read_time: '5 min read'
    },
    {
      title: 'Paris Fashion Week Spotlight: The Return of Dramatic Capes',
      slug: 'paris-fashion-week-spotlight-dramatic-capes',
      excerpt: 'Floor-sweeping velvet cloaks and tailored wool capes brought theatrical elegance to the Autumn/Winter Paris runways.',
      content: `
        <p>Outerwear made a thunderous statement in Paris this season. Ditching traditional sleeves, creative directors sent dramatic cloaks and cocoon capes floating down marble runways, echoing 1920s opera glamour.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1200',
      category_id: 4,
      category_name: 'Collections',
      author_id: 1,
      author_name: 'Victoria Vance',
      author_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      is_featured: 0,
      views: 990,
      read_time: '4 min read'
    },
    {
      title: 'Sculptural Footwear as Wearable Art Objects',
      slug: 'sculptural-footwear-wearable-art-objects',
      excerpt: 'How shoe designers are turning heels into chrome spheres, carved mahogany pedestals, and kinetic art forms.',
      content: `
        <p>Footwear is transcending mere functionality. Contemporary shoe designers are collaborating with industrial sculptors and metallurgists to turn heels into museum-worthy structural wonders.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1200',
      category_id: 2,
      category_name: 'Trends',
      author_id: 1,
      author_name: 'Victoria Vance',
      author_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      is_featured: 0,
      views: 670,
      read_time: '3 min read'
    },
    {
      title: 'Milan Street Style: Oversized Blazers and Monochromatic Accessories',
      slug: 'milan-street-style-oversized-blazers',
      excerpt: 'Outside the Fondazione Prada, showgoers demonstrated how to style power shoulders with understated leather totes.',
      content: `
        <p>Milan street style retains its reputation for pristine tailoring. Double-breasted blazers with exaggerated box shoulders were paired with sleek tailored trousers and dark tinted aviator shades.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200',
      category_id: 5,
      category_name: 'Street Style',
      author_id: 1,
      author_name: 'Victoria Vance',
      author_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      is_featured: 0,
      views: 1040,
      read_time: '4 min read'
    },
    {
      title: 'The Cinema of Fashion: Costume Design in Modern Auteur Films',
      slug: 'cinema-of-fashion-costume-design-films',
      excerpt: 'Analyzing how visionary directors use wardrobe color symbolism and garment movement to craft cinematic masterpieces.',
      content: `
        <p>Costume design is the silent narrator of cinema. From period drama silk corsetry to dystopian leather dusters, garments build characters long before dialogue is uttered.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=1200',
      category_id: 7,
      category_name: 'Culture',
      author_id: 1,
      author_name: 'Victoria Vance',
      author_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      is_featured: 0,
      views: 860,
      read_time: '5 min read'
    },
    {
      title: 'Sustainable Leather Alternatives: Mushroom Mycelium to Pineapple Leaves',
      slug: 'sustainable-leather-alternatives-mushroom-mycelium',
      excerpt: 'Bio-materials are replacing animal hides with luxurious durability, soft hand-feel, and carbon-negative footprints.',
      content: `
        <p>Lab-grown mycelium roots can be cultivated into flexible leather sheets in under ten days. Major luxury groups are investing heavily in scaled bio-fabrication facilities across Europe and North America.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200',
      category_id: 8,
      category_name: 'Editorial',
      author_id: 1,
      author_name: 'Victoria Vance',
      author_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      is_featured: 0,
      views: 1250,
      read_time: '5 min read'
    },
    {
      title: 'Resort 2026: Sun-Drenched Linens and Mediterranean Terracotta',
      slug: 'resort-2026-sun-drenched-linens-mediterranean',
      excerpt: 'Vacation wardrobe essentials inspired by Amalfi coastal villas, warm terracotta pottery, and relaxed poplin shirting.',
      content: `
        <p>Resort collections prioritize effortless movement. Breathable flax linens, hand-crocheted raffia totes, and wide-leg trousers dominated the warm-weather capsules this season.</p>
      `,
      cover_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
      category_id: 4,
      category_name: 'Collections',
      author_id: 1,
      author_name: 'Victoria Vance',
      author_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      is_featured: 0,
      views: 910,
      read_time: '4 min read'
    }
  ];

  const artStmt = db.prepare(`
    INSERT INTO articles (title, slug, excerpt, content, cover_image, category_id, category_name, author_id, author_name, author_image, is_featured, views, read_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  articles.forEach(a => artStmt.run(a.title, a.slug, a.excerpt, a.content, a.cover_image, a.category_id, a.category_name, a.author_id, a.author_name, a.author_image, a.is_featured, a.views, a.read_time));

  // Insert 15 Street Style Entries
  const streetStyles = [
    { title: 'Tokyo Minimal Layering', location: 'Harajuku, Tokyo', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800', outfit_category: 'Layering', style_tags: '["#Minimal", "#Layering", "#TokyoStyle"]', saved_count: 342 },
    { title: 'Parisian Monochrome Trench', location: 'Le Marais, Paris', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800', outfit_category: 'Monochrome', style_tags: '["#Monochrome", "#Parisian", "#Trench"]', saved_count: 489 },
    { title: 'Deconstructed Oversized Denim', location: 'SoHo, New York', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800', outfit_category: 'Denim', style_tags: '["#Denim", "#Streetwear", "#Oversized"]', saved_count: 512 },
    { title: 'Vintage Tailored Wool Coat', location: 'Shoreditch, London', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800', outfit_category: 'Vintage', style_tags: '["#Vintage", "#LondonStyle", "#Tailoring"]', saved_count: 278 },
    { title: 'Milanese Leather Statement', location: 'Quadrilatero, Milan', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800', outfit_category: 'Luxury', style_tags: '["#Luxury", "#MilanStyle", "#Leather"]', saved_count: 620 },
    { title: 'Cyberpunk Metallic Accents', location: 'Shibuya, Tokyo', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800', outfit_category: 'Streetwear', style_tags: '["#Streetwear", "#Metallic", "#Futuristic"]', saved_count: 390 },
    { title: 'Earthy Linen & Straw Hat', location: 'Saint-Tropez', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800', outfit_category: 'Resort', style_tags: '["#Minimal", "#Resort", "#Linen"]', saved_count: 210 },
    { title: 'Architectural Black Draping', location: 'Ginza, Tokyo', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800', outfit_category: 'Monochrome', style_tags: '["#Monochrome", "#AvantGarde", "#Draping"]', saved_count: 430 },
    { title: 'High-Contrast Neon Outerwear', location: 'Brooklyn, NYC', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800', outfit_category: 'Streetwear', style_tags: '["#Streetwear", "#BoldColors", "#NYC"]', saved_count: 195 },
    { title: 'Hand-Woven Jacquard Blazer', location: 'Bandra, Mumbai', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800', outfit_category: 'Vintage', style_tags: '["#Textile", "#Handloom", "#Heritage"]', saved_count: 310 },
    { title: 'Asymmetric Sheer Layering', location: 'Marais, Paris', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800', outfit_category: 'Layering', style_tags: '["#Sheer", "#Layering", "#Paris"]', saved_count: 450 },
    { title: 'Platform Boot Utility Suit', location: 'Mitte, Berlin', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800', outfit_category: 'Streetwear', style_tags: '["#Utility", "#Berlin", "#PlatformBoots"]', saved_count: 380 },
    { title: 'Silk Printed Kimono Wrap', location: 'Kyoto, Japan', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', outfit_category: 'Vintage', style_tags: '["#Vintage", "#Kyoto", "#Silk"]', saved_count: 520 },
    { title: 'Double-Breasted Wool Oversize', location: 'Copenhagen', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800', outfit_category: 'Monochrome', style_tags: '["#ScandiStyle", "#Oversized", "#Minimal"]', saved_count: 410 },
    { title: 'Sculptural Gold Hardware Tote', location: 'Bond Street, London', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800', outfit_category: 'Luxury', style_tags: '["#Accessories", "#Luxury", "#London"]', saved_count: 290 }
  ];

  const streetStmt = db.prepare(`
    INSERT INTO street_style (title, location, image, outfit_category, style_tags, saved_count)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  streetStyles.forEach(s => streetStmt.run(s.title, s.location, s.image, s.outfit_category, s.style_tags, s.saved_count));

  // Seed demo user interests & bookmarks
  const demoUserId = demoUser.lastInsertRowid;
  db.prepare('INSERT INTO user_interests (user_id, category_name) VALUES (?, ?)').run(demoUserId, 'Fashion');
  db.prepare('INSERT INTO user_interests (user_id, category_name) VALUES (?, ?)').run(demoUserId, 'Sustainable fashion');
  db.prepare('INSERT INTO user_interests (user_id, category_name) VALUES (?, ?)').run(demoUserId, 'Luxury');
  
  db.prepare('INSERT INTO bookmarks (user_id, item_type, item_id) VALUES (?, ?, ?)').run(demoUserId, 'article', 1);
  db.prepare('INSERT INTO bookmarks (user_id, item_type, item_id) VALUES (?, ?, ?)').run(demoUserId, 'trend', 1);
  db.prepare('INSERT INTO likes (user_id, article_id) VALUES (?, ?)').run(demoUserId, 1);
  db.prepare('INSERT INTO comments (user_id, user_name, user_image, article_id, content) VALUES (?, ?, ?, ?, ?)').run(
    demoUserId, 'Elena Rostova', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600', 1, 'Incredible article. The shift toward sustainable luxury is long overdue.'
  );

  console.log('Database successfully seeded with realistic fashion editorial data!');
}

initDatabase();

module.exports = db;
