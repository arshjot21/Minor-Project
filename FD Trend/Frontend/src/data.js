export const editorialImages = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=82&w=1800',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=82&w=1800',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=82&w=1800',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=82&w=1800',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=82&w=1800',
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=82&w=1800',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=82&w=1800',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=82&w=1800',
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=82&w=1800',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=82&w=1800',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=82&w=1800',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=82&w=1800'
];

export const pickImage = (value, index = 0) => value || editorialImages[index % editorialImages.length];


export const localVisuals = {
  beauty: '/images/fd-trend-beauty-editorial.jpg',
  culture: '/images/fd-trend-summer-culture.jpg',
  collections: '/images/fd-trend-evening-edit.jpg'
};

export const categoryImage = (category, index = 0) => {
  const key = String(category || '').toLowerCase();
  if (key.includes('beauty')) return localVisuals.beauty;
  if (key.includes('culture')) return localVisuals.culture;
  if (key.includes('collection')) return localVisuals.collections;
  if (key.includes('street')) return '/images/fd-trend-street-style.jpeg';
  if (key.includes('trend')) return index % 2 ? localVisuals.culture : localVisuals.collections;
  if (key.includes('fashion')) return index % 2 ? localVisuals.collections : '/images/fd-trend-hero.png';
  return pickImage('', index);
};
