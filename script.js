/**
 * AbdulhamidDIGITAL - Interaktiv Skriptlar & Backend Integratsiyasi
 * Mobil menyu, FAQ akkordeon, Tarif tanlash va Real Backend API
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. MOBIL MENYU TOGGLE
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Havola bosilganda menyuni avtomatik yopish
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 2. FAQ AKKORDEON
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Boshqa barcha ochiq savollarni yopish
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Agar avval yopiq bo'lsa, ochish
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 3. TARIFNI TANLASH VA AVTOMATIK FORMAGA O'TKAZISH
    const selectPlanBtns = document.querySelectorAll('.select-plan-btn');
    const serviceSelect = document.getElementById('service');

    selectPlanBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const planName = btn.getAttribute('data-plan');
            if (serviceSelect && planName) {
                if (planName.includes('START')) {
                    serviceSelect.value = 'START Tarifi';
                } else if (planName.includes('PRO')) {
                    serviceSelect.value = 'PRO Kompleks Xizmat';
                } else if (planName.includes('ALL-IN-ONE') || planName.includes('VIP')) {
                    serviceSelect.value = 'VIP Xizmat';
                }
            }
        });
    });

    // 4. REAL BACKEND API BILAN ISHLOVCHI ALOQA FORMASI
    const bookingForm = document.getElementById('bookingForm');
    const formResponse = document.getElementById('formResponse');

    if (bookingForm && formResponse) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();

            const submitBtn = bookingForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;

            // Yuklanmoqda holati
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Yuborilmoqda...';

            try {
                // Backend API ga so'rov yuborish
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        phone: phone,
                        service: service,
                        message: message
                    })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Muvaffaqiyatli xabar
                    formResponse.style.display = 'block';
                    formResponse.className = 'form-feedback success';
                    formResponse.innerHTML = `
                        <div style="font-size: 1.05rem; margin-bottom: 4px;">
                            <i class="fa-solid fa-circle-check text-success me-2"></i>
                            <strong>Arizangiz muvaffaqiyatli qabul qilindi!</strong>
                        </div>
                        <div>Ariza raqami: <code>${result.data.id}</code></div>
                        <div style="font-size: 0.85rem; margin-top: 4px; color: #166534;">
                            Tez orada siz bilan <strong>${phone}</strong> raqami orqali bog'lanamiz.
                        </div>
                    `;

                    // Formani tozalash
                    bookingForm.reset();
                } else {
                    // Server qaytargan xatolik
                    throw new Error(result.message || 'Xatolik yuz berdi.');
                }
            } catch (error) {
                console.error('Ariza yuborishda xatolik:', error);
                formResponse.style.display = 'block';
                formResponse.className = 'form-feedback';
                formResponse.style.background = '#fee2e2';
                formResponse.style.color = '#991b1b';
                formResponse.style.border = '1px solid #fecaca';
                formResponse.innerHTML = `
                    <i class="fa-solid fa-triangle-exclamation me-2"></i>
                    ${error.message || 'Serverga ulanib bo\'lmadi. Backend server ishlab turganini tekshiring.'}
                `;
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // 10 soniyadan so'ng xabarni yashirish
                setTimeout(() => {
                    formResponse.style.display = 'none';
                }, 10000);
            }
        });
    }

    // 5. STICKY NAVBAR SHADOW ON SCROLL
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            } else {
                header.style.boxShadow = 'var(--shadow-sm)';
            }
        });
    }
});