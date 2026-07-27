const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// تخزين أوتوماتيكي فـ الذاكرة
let users = [];
let orders = [];

// أثمنة مناسبة ورخيصة لـ BARBER ENLIGNE (15 - 35 درهم)
const SERVICES_PRICES = [
  { id: 1, name: 'حسانة عادية (Cheveux)', price: 15 },
  { id: 2, name: 'حسانة + لحية (Cheveux + Barbe)', price: 25 },
  { id: 3, name: 'حسانة VIP + سشوار + ماسك', price: 35 }
];

app.get('/', (req, res) => {
  res.send('💈 سيرفر BARBER ENLIGNE شغال بنجاح! 💈');
});

// 1. تسجيل الدخول الأوتوماتيكي بـ Gmail وحفظ بيانات الـ GPS
app.post('/api/auth/google', (req, res) => {
  const { email, name, role, latitude, longitude } = req.body;
  if (!email || !role) return res.status(400).json({ error: 'المرجو إدخال جميع البيانات' });

  let user = users.find(u => u.email === email);
  if (!user) {
    user = {
      id: users.length + 1,
      email,
      name,
      role, // 'client' أو 'barber'
      location: { latitude: latitude || 0, longitude: longitude || 0 },
      updatedAt: new Date()
    };
    users.push(user);
  } else {
    // تحديث موقع الـ GPS
    user.location = { latitude: latitude || 0, longitude: longitude || 0 };
    user.updatedAt = new Date();
  }

  res.json({ message: 'تم تسجل الدخول وحفظ الموقع بنجاح', user });
});

// 2. تحديث الموقع الحي (GPS Live Tracking)
app.post('/api/location/update', (req, res) => {
  const { email, latitude, longitude } = req.body;
  let user = users.find(u => u.email === email);
  if (user) {
    user.location = { latitude, longitude };
    user.updatedAt = new Date();
    return res.json({ message: 'تم تحديث الموقع الحقيقي', location: user.location });
  }
  res.status(404).json({ error: 'المستخدم غير موجود' });
});

// 3. قائمة الخدمات والأثمنة المخفضة
app.get('/api/services', (req, res) => res.json(SERVICES_PRICES));

// 4. إنشـاء طلب حسانة جديد بالـ GPS
app.post('/api/orders/create', (req, res) => {
  const { clientEmail, serviceId, latitude, longitude } = req.body;
  const service = SERVICES_PRICES.find(s => s.id === serviceId);
  if (!service) return res.status(400).json({ error: 'الخدمة غير موجودة' });

  const newOrder = {
    id: orders.length + 1,
    clientEmail,
    serviceName: service.name,
    price: service.price,
    clientLocation: { latitude, longitude },
    barberEmail: null,
    status: 'pending' // pending -> accepted -> completed
  };
  orders.push(newOrder);
  res.status(201).json({ message: 'تم إرسال الطلب للحلاقة القريبين', order: newOrder });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
