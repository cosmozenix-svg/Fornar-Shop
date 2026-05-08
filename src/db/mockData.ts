export let categories = [
  { id: '1', name: 'Electronics', imageUrl: 'https://placehold.co/400x300/E63946/FFF?text=Electronics' },
  { id: '2', name: 'Fashion', imageUrl: 'https://placehold.co/400x300/E63946/FFF?text=Fashion' },
  { id: '3', name: 'Groceries', imageUrl: 'https://placehold.co/400x300/E63946/FFF?text=Groceries' },
  { id: '4', name: 'Home & Lifestyle', imageUrl: 'https://placehold.co/400x300/E63946/FFF?text=Home' },
  { id: '5', name: 'Health & Beauty', imageUrl: 'https://placehold.co/400x300/E63946/FFF?text=Beauty' },
];

export let products = [
  { id: 'p1', name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', price: 145000, categoryId: '1', stock: 15, imageUrl: 'https://placehold.co/400x400?text=S24+Ultra', description: 'Flagship smartphone with AI features.' },
  { id: 'p2', name: 'MacBook Air M3', brand: 'Apple', price: 135000, categoryId: '1', stock: 5, imageUrl: 'https://placehold.co/400x400?text=MacBook+Air', description: 'Thin and light laptop with M3 chip.' },
  { id: 'p3', name: 'Sony WH-1000XM5', brand: 'Sony', price: 35000, categoryId: '1', stock: 20, imageUrl: 'https://placehold.co/400x400?text=Sony+Headphones', description: 'Noise cancelling overhead headphones.' },
  { id: 'p4', name: 'Men\'s Panjabi', brand: 'Aarong', price: 2500, categoryId: '2', stock: 50, imageUrl: 'https://placehold.co/400x400?text=Men+Panjabi', description: 'Traditional cotton Panjabi for men.' },
  { id: 'p5', name: 'Women\'s Saree', brand: 'Aarong', price: 4500, categoryId: '2', stock: 30, imageUrl: 'https://placehold.co/400x400?text=Women+Saree', description: 'Elegant silk Saree suitable for occasions.' },
  { id: 'p6', name: 'Running Sneakers', brand: 'Nike', price: 12000, categoryId: '2', stock: 10, imageUrl: 'https://placehold.co/400x400?text=Nike+Sneakers', description: 'Comfortable footwear for running.' },
  { id: 'p7', name: 'Radhuni Roast Masala', brand: 'Radhuni', price: 65, categoryId: '3', stock: 200, imageUrl: 'https://placehold.co/400x400?text=Roast+Masala', description: 'Spice mix for chicken roast.' },
  { id: 'p8', name: 'Kazi Farms Eggs (1 Dozen)', brand: 'Kazi Farms', price: 150, categoryId: '3', stock: 100, imageUrl: 'https://placehold.co/400x400?text=Eggs', description: 'Fresh farm eggs.' },
  { id: 'p9', name: 'Rupchanda Soybean Oil (5L)', brand: 'Rupchanda', price: 820, categoryId: '3', stock: 40, imageUrl: 'https://placehold.co/400x400?text=Soybean+Oil', description: 'Refined cooking oil.' },
  { id: 'p10', name: 'Walton Refrigerator', brand: 'Walton', price: 32000, categoryId: '4', stock: 8, imageUrl: 'https://placehold.co/400x400?text=Refrigerator', description: 'Energy efficient frost-free refrigerator.' },
  { id: 'p11', name: 'Vision Blender', brand: 'Vision', price: 2500, categoryId: '4', stock: 15, imageUrl: 'https://placehold.co/400x400?text=Blender', description: 'Multipurpose powerful blender.' },
  { id: 'p12', name: 'Cotton Bedsheet', brand: 'HomeTex', price: 1200, categoryId: '4', stock: 60, imageUrl: 'https://placehold.co/400x400?text=Bedsheet', description: 'Double size printed bedsheet with 2 pillow covers.' },
  { id: 'p13', name: 'Parachute Coconut Oil', brand: 'Parachute', price: 220, categoryId: '5', stock: 150, imageUrl: 'https://placehold.co/400x400?text=Coconut+Oil', description: '100% pure coconut hair oil.' },
  { id: 'p14', name: 'Nivea Men Face Wash', brand: 'Nivea', price: 350, categoryId: '5', stock: 80, imageUrl: 'https://placehold.co/400x400?text=Face+Wash', description: 'Oil control face wash for men.' },
  { id: 'p15', name: 'Sunsilk Shampoo (340ml)', brand: 'Sunsilk', price: 420, categoryId: '5', stock: 100, imageUrl: 'https://placehold.co/400x400?text=Sunsilk+Shampoo', description: 'Black shine shampoo.' },
  { id: 'p16', name: 'Loreal Hair Color', brand: 'Loreal', price: 650, categoryId: '5', stock: 25, imageUrl: 'https://placehold.co/400x400?text=Hair+Color', description: 'Excellence Creme natural dark brown.' },
  { id: 'p17', name: 'Xiaomi Mi Band 8', brand: 'Xiaomi', price: 3800, categoryId: '1', stock: 45, imageUrl: 'https://placehold.co/400x400?text=Mi+Band', description: 'Fitness tracker with AMOLED display.' },
  { id: 'p18', name: 'Fogg Body Spray', brand: 'Fogg', price: 300, categoryId: '5', stock: 90, imageUrl: 'https://placehold.co/400x400?text=Body+Spray', description: 'No gas perfumed body spray.' },
  { id: 'p19', name: 'Pran Frooto Mango Juice (1L)', brand: 'Pran', price: 120, categoryId: '3', stock: 300, imageUrl: 'https://placehold.co/400x400?text=Mango+Juice', description: 'Refreshing mango fruit drink.' },
  { id: 'p20', name: 'Non-stick Fry Pan', brand: 'Kiam', price: 850, categoryId: '4', stock: 30, imageUrl: 'https://placehold.co/400x400?text=Fry+Pan', description: '24cm non-stick cooking pan.' }
];

export const admins = [
  { id: 'a1', email: 'admin@fornar.com', password: 'Admin@123' }
];

export let orders: any[] = [];
export let users: any[] = [];
