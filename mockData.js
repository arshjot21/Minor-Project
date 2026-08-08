// FD Trend Blog - Mock Data Repository

export const INITIAL_ARTICLES = [
  {
    id: 'art-1',
    title: 'The Evolution of Streetwear: From Underground Culture to High Fashion',
    slug: 'evolution-of-streetwear-high-fashion',
    excerpt: 'Explore how urban street style disrupted the traditional luxury fashion houses and redefined modern luxury aesthetics globally.',
    content: `
      <p class="lead">Streetwear has undergone one of the most radical transformations in fashion history. What began as a subculture rooted in skateboarding, hip-hop, and graffiti in Los Angeles and Tokyo has now seized control of the world's most prestigious fashion capitals.</p>
      
      <h3>The Golden Age of Casual Luxury</h3>
      <p>In the late 1990s and early 2000s, luxury fashion was characterized by rigid tailored suits, formal gowns, and exclusive couture houses. However, the rise of iconic streetwear pioneers changed everything. Hoodies, graphic tees, and limited-edition sneakers transformed from casual wardrobe staples into high-demand collectors' items.</p>
      
      <blockquote class="story-quote">
        "Streetwear is not just clothes; it's a movement, an attitude, and a global language connecting youth culture."
      </blockquote>
      
      <h3>Key Factors Driving the Shift</h3>
      <ul>
        <li><strong>Collaboration Culture:</strong> Landmark drops between skate brands and legacy French fashion houses blurred the line between luxury and casualwear.</li>
        <li><strong>Drop Culture & Scarcity:</strong> Limited production runs created unprecedented hype, turning clothes into high-value investments.</li>
        <li><strong>Influencer & Artist Synergy:</strong> Musicians, visual artists, and athletes became the new creative directors shaping global trends.</li>
      </ul>
      
      <h3>What to Expect in 2026</h3>
      <p>As we move further into 2026, streetwear is evolving into a more refined, eco-conscious aesthetic. Designers are combining technical utility fabrics with vintage tailoring, organic cottons, and modular silhouettes.</p>
    `,
    category: "Streetwear",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Sophia Vance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "Senior Fashion Editor",
      bio: "Fashion journalist based in Paris with 8+ years covering Paris and Milan Fashion Weeks."
    },
    publishedAt: "2026-07-28",
    readTime: "6 min read",
    featured: true,
    trending: true,
    likes: 342,
    views: 4520,
    tags: ["Streetwear", "Urban Style", "Luxury", "Trend Analysis"]
  },
  {
    id: 'art-2',
    title: 'Sustainable Luxury: How Ethical Fabrics are Shaping Haute Couture',
    slug: 'sustainable-luxury-ethical-fabrics',
    excerpt: 'Inside the sustainable revolution: how eco-friendly textiles and circular design principles are powering the next generation of high fashion.',
    content: `
      <p class="lead">Sustainability is no longer a niche buzzword in the fashion industry—it is the non-negotiable cornerstone of contemporary haute couture and luxury design.</p>
      
      <h3>Redefining Sustainable Textiles</h3>
      <p>From bio-fabricated mushroom leather (Mycelium) to lab-grown silk and ocean-recycled nylon, luxury ateliers are engineering groundbreaking materials that offer uncompromised elegance with minimal environmental impact.</p>
      
      <blockquote class="story-quote">
        "True luxury in 2026 means respecting both human craftsmanship and the natural ecosystem."
      </blockquote>
      
      <h3>The Rise of Circular Wardrobes</h3>
      <p>Garment longevity, repair programs, and certified vintage archives are becoming standard offerings among high-end fashion houses. Buyers are prioritizing quality over quantity, investing in timeless pieces designed to last generations.</p>
    `,
    category: "Sustainable Fashion",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Liam Thorne",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      role: "Eco-Fashion Strategist",
      bio: "Specialist in sustainable textile innovation and ethical production supply chains."
    },
    publishedAt: "2026-07-25",
    readTime: "5 min read",
    featured: true,
    trending: true,
    likes: 289,
    views: 3180,
    tags: ["Sustainable", "Eco-Friendly", "Luxury", "Couture"]
  },
  {
    id: 'art-3',
    title: 'Monochromatic Elegance: Masterful Color Coordination for Women',
    slug: 'monochromatic-elegance-color-coordination',
    excerpt: 'Unlock the secret to effortless sophistication with minimalist tonal layering, rich textures, and classic neutral palettes.',
    content: `
      <p class="lead">Monochromatic dressing is the ultimate styling shortcut to looking instantly polished, elevated, and statuesque.</p>
      
      <h3>The Art of Tonal Contrast</h3>
      <p>Dressing in a single color family doesn't mean looking flat. The key lies in mixing contrasting textures—pairing buttery soft leather with chunky cashmere, silk satin with structured wool blazers.</p>
      
      <h3>The Essential 2026 Tonal Palettes</h3>
      <ul>
        <li><strong>Oatmeal & Warm Linen:</strong> Soft beige hues ideal for spring daytime sophistication.</li>
        <li><strong>Midnight Obsidian:</strong> Deep charcoal and black layers for nocturnal allure.</li>
        <li><strong>Soft Rose Quartz:</strong> Subtle pastel pink tones for romantic modern tailoring.</li>
      </ul>
    `,
    category: "Women's Fashion",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      role: "Personal Style Director",
      bio: "Celebrity stylist and creative consultant for global luxury publications."
    },
    publishedAt: "2026-07-20",
    readTime: "4 min read",
    featured: false,
    trending: true,
    likes: 198,
    views: 2410,
    tags: ["Women Style", "Monochrome", "Elegance", "Styling Tips"]
  },
  {
    id: 'art-4',
    title: 'The Modern Gentleman: Redefining Tailored Suits for Daily Wear',
    slug: 'modern-gentleman-redefining-tailored-suits',
    excerpt: 'How modern menswear is relaxing rigid tailoring rules to blend sharp silhouettes with breathable, comfortable everyday wear.',
    content: `
      <p class="lead">The traditional suit is far from dead—it has simply evolved. Today's gentleman demands versatility, comfort, and quiet elegance.</p>
      
      <h3>Deconstructed Blazers & Fluid Fits</h3>
      <p>Heavy shoulder pads and stiff canvas interlinings have given way to unlined linen blazers, double-breasted jackets paired with tailored drawstring trousers, and minimal leather sneakers.</p>
    `,
    category: "Men's Fashion",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Julian Mercer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      role: "Menswear Curator",
      bio: "Fashion writer and bespoke menswear enthusiast living in London."
    },
    publishedAt: "2026-07-18",
    readTime: "5 min read",
    featured: false,
    trending: false,
    likes: 176,
    views: 1950,
    tags: ["Menswear", "Tailoring", "Suits", "Grooming"]
  },
  {
    id: 'art-5',
    title: '10 Essential Capsule Wardrobe Pieces Every Fashion Enthusiast Needs',
    slug: 'essential-capsule-wardrobe-pieces',
    excerpt: 'Streamline your closet and maximize your style index with these 10 versatile, high-quality foundational fashion staples.',
    content: `
      <p class="lead">A curated capsule wardrobe empowers you to create dozens of effortless outfits with minimal clutter and maximum sartorial impact.</p>
      
      <h3>The 10 Non-Negotiables</h3>
      <ol>
        <li>The Tailored Oversized Blazer</li>
        <li>The Crisp White Poplin Shirt</li>
        <li>Straight-Leg Selvedge Denim</li>
        <li>The Camel Wool Trench Coat</li>
        <li>Minimalist Leather Sneakers</li>
        <li>Black Cashmere Crewneck Sweater</li>
        <li>Structured Crossbody Leather Bag</li>
        <li>Slip Silk Midi Skirt</li>
        <li>Classic Gold Hoop Earrings</li>
        <li>Pointed Toe Ankle Boots</li>
      </ol>
    `,
    category: "Fashion Tips",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Sophia Vance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "Senior Fashion Editor",
      bio: "Fashion journalist based in Paris with 8+ years covering Paris and Milan Fashion Weeks."
    },
    publishedAt: "2026-07-12",
    readTime: "7 min read",
    featured: true,
    trending: true,
    likes: 412,
    views: 5890,
    tags: ["Capsule Wardrobe", "Fashion Tips", "Minimalism", "Style Guide"]
  },
  {
    id: 'art-6',
    title: 'Runway Highlights: Key Accessories Dominating Autumn/Winter Collections',
    slug: 'runway-highlights-autumn-winter-accessories',
    excerpt: 'From oversized gold metallic accents to sculpted leather handbags, discover the standout accessories ruling global runways.',
    content: `
      <p class="lead">Accessories are the defining accent of any ensemble. This season, designers pushed creative boundaries with sculptural statement items.</p>
      
      <h3>Sculptural Gold Jewelry</h3>
      <p>Chunky gold cuffs, molten metal drop earrings, and bold chain chokers added dramatic glamour to neutral minimalist silhouettes.</p>
    `,
    category: "Luxury Fashion",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      role: "Personal Style Director",
      bio: "Celebrity stylist and creative consultant for global luxury publications."
    },
    publishedAt: "2026-07-05",
    readTime: "4 min read",
    featured: false,
    trending: false,
    likes: 215,
    views: 2840,
    tags: ["Luxury", "Runway", "Accessories", "Jewelry"]
  }
];

export const CATEGORIES = [
  {
    id: "cat-1",
    name: "Women's Fashion",
    slug: "womens-fashion",
    icon: "sparkles",
    count: 142,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    description: "Chic dresses, tailored outerwear, contemporary silhouettes, and feminine styling trends."
  },
  {
    id: "cat-2",
    name: "Men's Fashion",
    slug: "mens-fashion",
    icon: "shirt",
    count: 98,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    description: "Modern menswear, relaxed suits, footwear guides, and refined grooming essentials."
  },
  {
    id: "cat-3",
    name: "Streetwear",
    slug: "streetwear",
    icon: "footprints",
    count: 115,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
    description: "Urban aesthetics, sneaker culture, hoodie drops, and global underground style movements."
  },
  {
    id: "cat-4",
    name: "Luxury Fashion",
    slug: "luxury-fashion",
    icon: "crown",
    count: 76,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
    description: "High couture runway breakdowns, designer showcases, and iconic luxury heritage brands."
  },
  {
    id: "cat-5",
    name: "Sustainable Fashion",
    slug: "sustainable-fashion",
    icon: "leaf",
    count: 64,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    description: "Ethical textiles, circular wardrobe tips, vintage thrift guides, and eco-friendly designers."
  },
  {
    id: "cat-6",
    name: "Fashion Tips",
    slug: "fashion-tips",
    icon: "lightbulb",
    count: 120,
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
    description: "Color theory styling, capsule wardrobe formulas, body type guides, and accessory pairing."
  }
];

export const WEEKLY_TRENDS = [
  {
    id: "wt-1",
    title: "Oversized Leather Trench Coats",
    category: "Outerwear",
    growth: "+148% search trend",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    description: "Deep espresso and black leather trenches paired with monochrome knitwear."
  },
  {
    id: "wt-2",
    title: "Champagne Gold Statement Cuffs",
    category: "Jewelry",
    growth: "+94% search trend",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
    description: "Bold metallic wrist wear giving minimalist outfits instant runway polish."
  },
  {
    id: "wt-3",
    title: "Minimalist Cream Loafers",
    category: "Footwear",
    growth: "+112% search trend",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
    description: "Soft beige leather loafers bridging the gap between formal and streetwear."
  }
];

export const FEATURED_INFLUENCERS = [
  {
    id: "inf-1",
    name: "Camille Dubois",
    handle: "@camille_parisian",
    followers: "1.2M",
    niche: "High Couture & Parisian Chic",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    quote: "Fashion is the silent armor we wear to navigate the modern world with grace."
  },
  {
    id: "inf-2",
    name: "Marcus Vance",
    handle: "@marcus.streetwear",
    followers: "850K",
    niche: "Urban & Sneaker Culture",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    quote: "Keep it authentic. True style comes from confidence, not price tags."
  },
  {
    id: "inf-3",
    name: "Aria Thorne",
    handle: "@aria_sustainable",
    followers: "620K",
    niche: "Eco Luxury & Thrift Styling",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    quote: "Rewearing, repurposing, and loving your clothes is the ultimate fashion statement."
  }
];

export const POPULAR_BRANDS = [
  { name: "MAISON AURA", tag: "Haute Couture", logo: "👑" },
  { name: "VELOUR & CO", tag: "Sustainable Luxury", logo: "🌿" },
  { name: "URBAN PULSE", tag: "Tokyo Streetwear", logo: "⚡" },
  { name: "SOLENE PARIS", tag: "French Minimalist", logo: "✨" },
  { name: "ATTIC VINTAGE", tag: "Curated Archives", logo: "🍷" }
];

export const TESTIMONIALS = [
  {
    id: "test-1",
    name: "Jessica Taylor",
    role: "Fashion Design Student",
    comment: "FD Trend Blog is my daily source of inspiration! The analysis of luxury trends and sustainable fabrics is top notch for my BCA & design projects.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "test-2",
    name: "David Sterling",
    role: "Style Consultant & Blogger",
    comment: "The UI design of FD Trend is so sleek, luxurious, and fast! The article quality beats many mainstream digital magazines.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "test-3",
    name: "Ananya Sharma",
    role: "Fashion Influencer",
    comment: "I love the bookmarking feature and category filters. As a blogger, FD Trend keeps me ahead of global street fashion trends!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  }
];

export const INSTAGRAM_POSTS = [
  { id: "ig-1", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80", likes: "12.4k" },
  { id: "ig-2", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80", likes: "8.9k" },
  { id: "ig-3", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80", likes: "15.1k" },
  { id: "ig-4", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80", likes: "9.3k" },
  { id: "ig-5", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80", likes: "18.2k" },
  { id: "ig-6", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80", likes: "11.7k" }
];

export const INITIAL_COMMENTS = [
  {
    id: "com-1",
    articleId: "art-1",
    userName: "Chloe Bennett",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    text: "Such a brilliant breakdown of how luxury houses embraced streetwear! Supreme x Louis Vuitton truly marked a historical shift.",
    createdAt: "2026-07-29 14:20"
  },
  {
    id: "com-2",
    articleId: "art-1",
    userName: "Rohan Patel",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    text: "Can't wait to see how tech fabrics and sustainable materials shape streetwear in 2026. Great article!",
    createdAt: "2026-07-30 09:15"
  }
];

export const DEVELOPER_PROFILE = {
  name: "Arshjot Kaur Deol",
  college: "Department of Computer Applications (BCA)",
  projectRole: "Lead Frontend Developer & UI Designer",
  bio: "Passionate BCA student developer combining modern web engineering skills with haute couture design aesthetics. Built FD Trend Blog as a capstone project to deliver high-performance, accessible, and stunning blogging experiences.",
  skills: ["JavaScript (ES6+)", "HTML5 & CSS3", "UI/UX Architecture", "SEO Optimization", "Responsive Web Design"],
  portfolioUrl: "#",
  email: "arshjot.deol@fdtrendblog.com",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com"
  }
};
