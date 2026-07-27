const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 1. عرض صفحة الواجهة index.html فـ الرابط الرئيسي
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. قائمة الخدمات
app.get('/api/services', (req, res) => {
    res.json([
        { id: 1, name: 'حلاقة شعر (Haircut)', price: 40 },
        { id: 2, name: 'تحديد اللحية (Beard Trim)', price: 20 },
        { id: 3, name: 'عناية بالبشرة (Facial)', price: 50 }
    ]);
});

// 3. تحديث الموقع
app.post('/api/location/update', (req, res) => {
    const { email, latitude, longitude } = req.body;
    console.log(`الموقع الجديد لـ ${email}: ${latitude}, ${longitude}`);
    res.json({ message: 'تم تحديث الموقع بنجاح' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
