/**
 * AbdulhamidDIGITAL - Backend Server
 * Node.js & Express REST API va Ma'lumotlarni saqlash tizimi
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik frontend fayllarni ulash (HTML, CSS, JS, rasmlar)
app.use(express.static(path.join(__dirname)));

// Ma'lumotlar bazasi (Faylli JSON baza)
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'bookings.json');

// data papkasi va bookings.json fayli mavjudligini tekshirish
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Yordamchi funksiyalar: Ma'lumotlarni o'qish va yozish
function readBookings() {
    try {
        const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(fileData || '[]');
    } catch (error) {
        console.error('Fayldan o\'qishda xatolik:', error);
        return [];
    }
}

function writeBookings(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error('Faylga yozishda xatolik:', error);
        return false;
    }
}

// Ixtiyoriy: Telegram bot orqali adminga xabar yuborish funksiyasi
async function sendTelegramNotification(booking) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return; // Token yoki ChatID kiritilmagan bo'lsa, o'tkazib yuboriladi
    }

    try {
        const text = `🚀 *Yangi Ariza! (AbdulhamidDIGITAL)*\n\n` +
            `🆔 *ID:* \`${booking.id}\`\n` +
            `👤 *Mijoz:* ${booking.name}\n` +
            `📞 *Telefon:* ${booking.phone}\n` +
            `💼 *Xizmat:* ${booking.service}\n` +
            `💬 *Xabar:* ${booking.message || 'Kiritilmagan'}\n` +
            `🕒 *Sana:* ${booking.createdAtFormatted}`;

        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown'
            })
        });
    } catch (err) {
        console.error('Telegramga xabar yuborishda xatolik:', err.message);
    }
}

// ==========================================
// API YO'NALISHLARI (ENDPOINTS)
// ==========================================

// 1. Yangi ariza yuborish (Mijoz forma to'ldirganda)
app.post('/api/bookings', async (req, res) => {
    try {
        const { name, phone, service, message } = req.body;

        // Validatsiya (Majburiy maydonlar)
        if (!name || !phone || !service) {
            return res.status(400).json({
                success: false,
                message: 'Iltimos, ismingiz, telefon raqamingiz va xizmat turini kiriting.'
            });
        }

        const bookings = readBookings();
        const now = new Date();

        // O'zbekcha formatdagi sana va vaqt
        const createdAtFormatted = now.toLocaleString('uz-UZ', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        const newBooking = {
            id: 'BK-' + Date.now().toString(36).toUpperCase(),
            name: name.trim(),
            phone: phone.trim(),
            service: service.trim(),
            message: (message || '').trim(),
            status: 'yangi', // yangi, boglanildi, bekor_qilindi
            createdAt: now.toISOString(),
            createdAtFormatted: createdAtFormatted
        };

        // Ro'yxat boshiga qo'shish
        bookings.unshift(newBooking);
        writeBookings(bookings);

        // Telegram bildirishnomasi
        sendTelegramNotification(newBooking);

        return res.status(201).json({
            success: true,
            message: 'Arizangiz muvaffaqiyatli qabul qilindi! Tez orada bog\'lanamiz.',
            data: newBooking
        });
    } catch (error) {
        console.error('Server xatoligi (POST /api/bookings):', error);
        return res.status(500).json({
            success: false,
            message: 'Serverda xatolik yuz berdi. Qayta urinib ko\'ring.'
        });
    }
});

// 2. Barcha arizalarni olish (Admin panel uchun)
app.get('/api/bookings', (req, res) => {
    try {
        const bookings = readBookings();
        return res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Ma\'lumotlarni olishda xatolik yuz berdi.'
        });
    }
});

// 3. Ariza holatini yangilash (Status: 'yangi' -> 'boglanildi' -> 'bekor_qilindi')
app.patch('/api/bookings/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['yangi', 'boglanildi', 'bekor_qilindi'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Noto\'g\'ri status formati.'
            });
        }

        const bookings = readBookings();
        const index = bookings.findIndex(b => b.id === id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Bunday ID ga ega ariza topilmadi.'
            });
        }

        bookings[index].status = status;
        bookings[index].updatedAt = new Date().toISOString();
        writeBookings(bookings);

        return res.json({
            success: true,
            message: 'Status muvaffaqiyatli yangilandi.',
            data: bookings[index]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Statusni yangilashda xatolik yuz berdi.'
        });
    }
});

// 4. Arizani o'chirish
app.delete('/api/bookings/:id', (req, res) => {
    try {
        const { id } = req.params;
        const bookings = readBookings();
        const filtered = bookings.filter(b => b.id !== id);

        if (bookings.length === filtered.length) {
            return res.status(404).json({
                success: false,
                message: 'Ariza topilmadi.'
            });
        }

        writeBookings(filtered);
        return res.json({
            success: true,
            message: 'Ariza muvaffaqiyatli o\'chirildi.'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Arizani o\'chirishda xatolik yuz berdi.'
        });
    }
});

// 5. Umumiy statistika (Dashboard uchun)
app.get('/api/stats', (req, res) => {
    try {
        const bookings = readBookings();
        const todayStr = new Date().toISOString().split('T')[0];

        const stats = {
            total: bookings.length,
            today: bookings.filter(b => b.createdAt.startsWith(todayStr)).length,
            yangi: bookings.filter(b => b.status === 'yangi').length,
            boglanildi: bookings.filter(b => b.status === 'boglanildi').length,
            bekor_qilindi: bookings.filter(b => b.status === 'bekor_qilindi').length
        };

        return res.json({ success: true, data: stats });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Statistikani olishda xatolik.' });
    }
});

// 6. Admin panel sahifasini ochish
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// 7. Asosiy sahifa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serverni ishga tushirish
app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 AbdulhamidDIGITAL Backend Serveri ishga tushdi!`);
    console.log(`🌐 Asosiy sayt:    http://localhost:${PORT}`);
    console.log(`📊 Admin panel:    http://localhost:${PORT}/admin`);
    console.log(`🔌 API endpoint:   http://localhost:${PORT}/api/bookings`);
    console.log(`======================================================\n`);
});

