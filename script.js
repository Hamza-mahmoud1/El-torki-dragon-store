function processPurchase(selectId) {
    // التحقق مما إذا كان العميل قد قام بعملية شراء اليوم في المتصفح الحالي
    const lastPurchaseDate = localStorage.getItem('pubg_last_purchase_date');
    const todayStr = new Date().toDateString();

    if (lastPurchaseDate === todayStr) {
        alert("تنبيه صارم: لقد استنفدت حصتك اليومية بالفعل! مسموح بطلب كود واحد فقط كل 24 ساعة لضمان العدالة وسرعة تسليم الطلبات.");
        return;
    }

    // جلب بيانات الحزمة المختارة
    const selectElement = document.getElementById(selectId);
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const quantity = selectElement.value;
    const price = selectedOption.getAttribute('data-price');
    
    // جلب الوقت والتاريخ الحاليين بدقة
    const now = new Date();
    const currentDate = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    const currentTime = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    // إنشاء رقم عشوائي فريد لتأكيد الطلب
    const orderId = Math.floor(100000 + Math.random() * 900000);

    // صياغة نص الكود المطلوب
    const generatedCodeText = `ORDER-${orderId}\nالكمية المطلوبة: ${quantity} UC\nالسعر: ${price} جنيه\nالتاريخ: ${currentDate}\nالوقت: ${currentTime}`;

    // عرض البيانات في النافذة المنبثقة
    document.getElementById('generated-code').innerText = generatedCodeText;
    
    // حفظ تاريخ الشراء لقفل الحصة على العميل فوراً بمجرد ظهور النافذة
    localStorage.setItem('pubg_last_purchase_date', todayStr);

    // فتح النافذة المنبثقة للعميل
    openModal();
}

function openModal() {
    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}
