# AbdulhamidDIGITAL - To'liq Full-Stack Veb-Ilova

SMM (Ijtimoiy tarmoq boshqaruvi) va Virtual Yordamchi xizmatlarini taqdim etuvchi to'liq Full-Stack (Frontend + Backend + Admin Panel) veb-ilovasi.

---

## 🛠 Texnologiyalar Steki

### Frontend
- **HTML5**: Semantik, toza va SEO-mos tuzilma.
- **CSS3**: Moslashuvchan dizayn (Mobile, Tablet, Desktop), zamonaviy IT-agentlik palitrasi, kartochkalar va animatsiyalar.
- **JavaScript (ES6+)**: Mobil menyu, FAQ akkordeoni, avtomatik tarif tanlash va real Backend REST API ga ulanish.
- **FontAwesome 6 & Google Fonts (Plus Jakarta Sans)**.

### Backend
- **Node.js & Express.js**: Tezkor va ishonchli REST API serveri.
- **Faylli Ma'lumotlar Bazasi (`data/bookings.json`)**: Hech qanday tashqi DB o'rnatmasdan arizalarni avtomatik va ishonchli saqlash.
- **Telegram Bot Integratsiyasi**: Yangi arizalar tushganda adminga Telegram orqali real-vaqtda bildirishnoma yuborish imkoniyati (`.env` orqali).
- **Admin Dashboard (`/admin`)**: Kelib tushgan barcha arizalarni ko'rish, qidirish, holatini o'zgartirish (*Yangi*, *Bog'lanildi*, *Bekor qilindi*) va o'chirish.

---

## 🚀 Loyihani Ishga Tushirish

1. **Kutubxonalarni o'rnatish** (agar o'rnatilmagan bo'lsa):
   ```bash
   npm install
   ```

2. **Serverni ishga tushirish**:
   ```bash
   npm start
   # yoki avtomatik qayta yuklash rejimi:
   npm run dev
   ```

3. **Brauzerda ochish**:
   - 🌐 **Asosiy sayt:** [http://localhost:3000](http://localhost:3000)
   - 📊 **Admin Dashboard:** [http://localhost:3000/admin](http://localhost:3000/admin)
   - 🔌 **Arizalar API:** [http://localhost:3000/api/bookings](http://localhost:3000/api/bookings)

---

## 📡 REST API Yo'nalishlari

| Metod | Endpoint | Vazifasi |
| :--- | :--- | :--- |
| `POST` | `/api/bookings` | Yangi ariza yuborish (Mijoz forma to'ldirganda) |
| `GET` | `/api/bookings` | Barcha arizalar ro'yxatini olish (Admin uchun) |
| `PATCH`| `/api/bookings/:id` | Ariza holatini yangilash (`yangi`, `boglanildi`, `bekor_qilindi`) |
| `DELETE` | `/api/bookings/:id` | Arizani o'chirish |
| `GET` | `/api/stats` | Umumiy va bugungi arizalar statistikasi |

---

## 🤖 Telegram Bot Bildirishnomalari (Ixtiyoriy)
Arizalarni to'g'ridan-to'g'ri Telegramga qabul qilish uchun [`.env`](file:///c:/Users/hamid/OneDrive/Desktop/CoddyCamp%20files/.env) fayliga quyidagilarni kiriting:
```env
TELEGRAM_BOT_TOKEN=sizning_bot_tokeningiz
TELEGRAM_CHAT_ID=sizning_telegram_id
```
