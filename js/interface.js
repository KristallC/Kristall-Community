// ==========================================
// 1. СИСТЕМА КРАСИВЫХ УВЕДОМЛЕНИЙ (КРИСТАЛЛ ТОСТЫ)
// ==========================================

// Заменяем системный alert на плавное выезжающее сверху неоновое окно
function showKristallToast(message, icon = "💎") {
    const toast = document.getElementById('kristall-toast');
    if (!toast) {
        alert(message); // Защита: если тега нет в HTML, сработает обычный алерт
        return;
    }
    
    // Вставляем иконку и текст сообщения
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toast.classList.add('show');

    // Через 3 секунды плавно прячем уведомление обратно вверх
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==========================================
// 2. СИСТЕМА КАСТОМИЗАЦИИ И АНИМАЦИЙ РАМОК (DISCORD STYLE)
// ==========================================
function applyAvatarBorderColor() {
    if (!currentUser) return;
    
    // Считываем выбор пользователя (или ставим дефолтный циановый неон)
    const selection = currentUser.avatar_color || "#22d3ee";
    const isAnimation = selection.startsWith("decor-");
    
    // 1. НАСТРОЙКА БЛОКОВ (Страница профиля и Шапка сайта)
    // Находим сами контейнеры (div), на которые правильно вешать CSS-анимации украшений
    const containers = document.querySelectorAll('#prof-avatar-box, #header-avatar-img-pc, #header-avatar-img-mobile');

    containers.forEach(box => {
        if (!box) return;
        
        // Сбрасываем старые анимации с контейнера
        box.className = ''; 
        box.style.boxShadow = 'none';
        box.style.border = 'none';
        box.style.position = 'relative'; // Чтобы анимация цеплялась за контейнер
        
        // Находим картинку или SVG внутри этого контейнера
        const innerEl = box.querySelector('img') || box.querySelector('svg');

        if (isAnimation) {
            // Если выбрана анимация — вешаем класс на ВНЕШНИЙ блок (div)
            if (selection === 'decor-fire') { box.classList.add('decor-fire-animation'); } 
            else if (selection === 'decor-cyber') { box.classList.add('decor-cyber-animation'); }
            else if (selection === 'decor-gold') { box.classList.add('decor-gold-animation'); }
            else if (selection === 'decor-emerald') { box.classList.add('decor-emerald-animation'); }
            else if (selection === 'decor-ruby') { box.classList.add('decor-ruby-animation'); }
            else if (selection === 'decor-crown') { box.classList.add('decor-crown-animation'); }
            else if (selection === 'decor-ghost') { box.classList.add('decor-ghost-animation'); }
            else if (selection === 'decor-matter') { box.classList.add('decor-matter-animation'); }
            else if (selection === 'decor-pulse') { box.classList.add('decor-pulse-animation'); }
            
            // Саму картинку внутри просто аккуратно скругляем без рамок
            if (innerEl) {
                innerEl.style.border = 'none';
                innerEl.style.boxShadow = 'none';
            }
        } else {
            // Если выбран обычный бесплатный цвет — красим рамку самого контейнера
            box.style.borderRadius = '50%';
            box.style.border = `3px solid ${selection}`;
            
            // Если у пользователя в инвентаре лежит Аура — добавляем неоновое свечение к контейнеру
            if (currentUser.inventory && currentUser.inventory.includes("💥 Неоновая Аура")) {
                box.style.boxShadow = `0 0 15px ${selection}`;
            }
            if (innerEl) {
                innerEl.style.border = 'none';
                innerEl.style.boxShadow = 'none';
            }
        }
    });

    // 2. НАСТРОЙКА БОКОВОГО ВИДЖЕТА Kristall ID НА ГЛАВНОЙ СТРАНИЦЕ
    const sideAvatarContainer = document.querySelector('#main-side-profile div');
    if (sideAvatarContainer) {
        // Очищаем старые классы и сбрасываем стили контейнера
        sideAvatarContainer.className = '';
        sideAvatarContainer.style.boxShadow = 'none';
        sideAvatarContainer.style.border = 'none';
        sideAvatarContainer.style.position = 'relative';
        sideAvatarContainer.style.backgroundColor = 'transparent'; // Убираем возможный черный фон блока

        // Вычисляем базовый цвет для SVG-силуэта (если у пользователя выбран неон, красим в него, иначе в белый)
        let svgFillColor = isAnimation ? "#22d3ee" : selection;
        const MID_SVG_AVATAR = `<svg xmlns="http://w3.org" viewBox="0 0 24 24" width="48" height="48" fill="${svgFillColor}" style="opacity: 0.9; display: block; margin: auto;"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z"/></svg>`;

        // Проверяем: если внутри блока НЕТ картинки с аватаркой (то есть там пусто или стоит старый SVG)
        const hasImg = sideAvatarContainer.querySelector('img');
        if (!hasImg) {
            // Принудительно вставляем красивую цветную заглушку, чтобы фон не был черным
            sideAvatarContainer.innerHTML = MID_SVG_AVATAR;
        }

        if (isAnimation) {
            // Включаем нужный CSS-класс анимации для Kristall ID
            if (selection === 'decor-fire') { sideAvatarContainer.classList.add('decor-fire-animation'); } 
            else if (selection === 'decor-cyber') { sideAvatarContainer.classList.add('decor-cyber-animation'); }
            else if (selection === 'decor-gold') { sideAvatarContainer.classList.add('decor-gold-animation'); }
            else if (selection === 'decor-emerald') { sideAvatarContainer.classList.add('decor-emerald-animation'); }
            else if (selection === 'decor-ruby') { sideAvatarContainer.classList.add('decor-ruby-animation'); }
            else if (selection === 'decor-crown') { sideAvatarContainer.classList.add('decor-crown-animation'); }
            else if (selection === 'decor-ghost') { sideAvatarContainer.classList.add('decor-ghost-animation'); }
            else if (selection === 'decor-matter') { sideAvatarContainer.classList.add('decor-matter-animation'); }
            else if (selection === 'decor-pulse') { sideAvatarContainer.classList.add('decor-pulse-animation'); }
        } else {
            // Если выбрана обычная обводка
            sideAvatarContainer.style.borderRadius = '50%';
            sideAvatarContainer.style.border = `3px solid ${selection}`;
            if (currentUser.inventory && currentUser.inventory.includes("💥 Неоновая Аура")) {
                sideAvatarContainer.style.boxShadow = `0 0 15px ${selection}`;
            }
        }
    }
}

// Функция обновления шапки и цветов никнеймов (ПК и Мобилки)
function updateHeaderProfile() {
    let neonColor = "#ffffff"; 

    // Берем текущий цвет неона из профиля пользователя
    if (currentUser && currentUser.avatar_color) {
        if (currentUser.avatar_color.startsWith('#')) {
            neonColor = currentUser.avatar_color;
        } else {
            neonColor = "#22d3ee"; // Цвет по умолчанию для анимаций
        }
    }

    const DEFAULT_SVG_AVATAR = `<svg xmlns="http://w3.org" viewBox="0 0 24 24" width="32" height="32" fill="${neonColor}" style="opacity: 0.9; display: block; margin: auto;"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z"/></svg>`;

    const avatarBox = document.getElementById('header-avatar-img-pc');
    const avatarBoxMobile = document.getElementById('header-avatar-img-mobile');
    const headerUsername = document.getElementById('header-username');
    const headerUsernameMobile = document.getElementById('header-username-mobile');

    if (!headerUsername) return;

    if (currentUser) {
        let nameColor = "white";
        if (currentUser.clearance_level === 2) { nameColor = "#f3a316"; }
        else if (currentUser.clearance_level === 3) { nameColor = "#0055ff"; }
        else if (currentUser.clearance_level === 4) { nameColor = "#b121ff"; }
        else if (currentUser.clearance_level === 5) { nameColor = "#ff213c"; }

        headerUsername.innerText = currentUser.username;
        headerUsername.style.color = nameColor;

        if (headerUsernameMobile) {
            headerUsernameMobile.innerText = currentUser.username;
            headerUsernameMobile.style.color = nameColor;
        }

        // Если у пользователя есть аватарка-картинка, мы СРАЗУ вшиваем ей рамку с его цветом неона!
        const hasCustomAvatar = currentUser.avatar_url && currentUser.avatar_url.startsWith("http");
        const imgStyle = hasCustomAvatar 
            ? `width:32px; height:32px; border-radius:50%; object-fit:cover; display:block; border: 2px solid ${neonColor}; box-shadow: 0 0 8px ${neonColor};`
            : "";

        const avatarHTML = hasCustomAvatar 
            ? `<img src="${currentUser.avatar_url}" style="${imgStyle}">`
            : DEFAULT_SVG_AVATAR;

        if (avatarBox) {
            avatarBox.innerHTML = avatarHTML;
            avatarBox.className = ''; 
            avatarBox.style.borderRadius = "50%";
            
            // Если надет декор (например, корона), вешаем класс анимации
            if (currentUser.avatar_color && currentUser.avatar_color.startsWith('decor-')) {
                avatarBox.classList.add(currentUser.avatar_color);
                // Для анимаций убираем стандартный неон
                const imgInside = avatarBox.querySelector('img');
                if (imgInside) {
                    imgInside.style.border = "none";
                    imgInside.style.boxShadow = "none";
                }
            }
        }
        
        if (avatarBoxMobile) {
            avatarBoxMobile.innerHTML = avatarHTML;
            avatarBoxMobile.className = '';
            avatarBoxMobile.style.borderRadius = "50%";
            
            if (currentUser.avatar_color && currentUser.avatar_color.startsWith('decor-')) {
                avatarBoxMobile.classList.add(currentUser.avatar_color);
                const imgInsideMobile = avatarBoxMobile.querySelector('img');
                if (imgInsideMobile) {
                    imgInsideMobile.style.border = "none";
                    imgInsideMobile.style.boxShadow = "none";
                }
            }
        }

        // Вызываем твою системную функцию обводки для подстраховки
        if (typeof applyAvatarBorderColor === 'function') {
            applyAvatarBorderColor();
        }

    } else {
        // Код для Гостя
        if (headerUsername) {
            headerUsername.innerText = "Гость";
            headerUsername.style.color = "white";
        }
        const GUEST_SVG = `<svg xmlns="http://w3.org" viewBox="0 0 24 24" width="32" height="32" fill="#ffffff" style="opacity: 0.8; display: block; margin: auto;"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z"/></svg>`;

        if (avatarBox) {
            avatarBox.innerHTML = GUEST_SVG;
            avatarBox.className = ''; 
            avatarBox.style.border = "none";
            avatarBox.style.boxShadow = "none";
        }
        if (avatarBoxMobile) {
            avatarBoxMobile.innerHTML = GUEST_SVG;
            avatarBoxMobile.className = '';
            avatarBoxMobile.style.border = "none";
            avatarBoxMobile.style.boxShadow = "none";
        }
    }
}

// Заполнение личного кабинета (profile.html)
function buildProfilePage() {
    const DEFAULT_SVG_LARGE = `<svg xmlns="http://w3.org" viewBox="0 0 24 24" width="128" height="128" fill="#ffffff" style="opacity: 0.8;"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z"/></svg>`;
    const profName = document.getElementById('prof-username');
    if (!profName) return; 

    if (!currentUser) { window.location.href = 'index.html'; return; }

    let roleName = "Пользователь";
    let nameColor = "white";
    if (currentUser.clearance_level === 2) { roleName = "Элита"; nameColor = "#f97316"; }
    else if (currentUser.clearance_level === 3) { roleName = "Создатель"; nameColor = "#10b981"; }
    else if (currentUser.clearance_level === 4) { roleName = "Модератор"; nameColor = "#a855f7"; }
    else if (currentUser.clearance_level === 5) { roleName = "Администратор"; nameColor = "#ef4444"; }
    else if (currentUser.clearance_level === 6) { roleName = "Владелец"; nameColor = "#22d3ee"; }

    profName.innerText = currentUser.username;
    profName.style.color = nameColor;
    
    const profRoleField = document.getElementById('prof-role');
    if (profRoleField) {
        profRoleField.innerText = roleName;
        profRoleField.style.color = nameColor;
    }
    
    const avatarBox = document.getElementById('prof-avatar-box');
    if (avatarBox) {
        avatarBox.className = ''; 
        
        // Задаем размеры и позиционирование, чтобы анимации не улетали
        avatarBox.style.width = "80px";
        avatarBox.style.height = "80px";
        avatarBox.style.borderRadius = "50%";
        avatarBox.style.margin = "0 auto 15px auto";
        avatarBox.style.display = "flex";
        avatarBox.style.alignItems = "center";
        avatarBox.style.justifyContent = "center";
        
        // ВАЖНО: relative позволяет украшениям цепляться прямо за этот круг!
        avatarBox.style.position = "relative"; 

        let currentColor = currentUser.avatar_color || "#22d3ee";
        let isAnimation = currentColor.startsWith("decor-");

        let svgFillColor = isAnimation ? "#22d3ee" : currentColor;
        const DYNAMIC_SVG_LARGE = `<svg xmlns="http://w3.org" viewBox="0 0 24 24" width="48" height="48" fill="${svgFillColor}" style="opacity: 0.9; display: block;"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z"/></svg>`;

        // Для картинок делаем overflow: hidden, чтобы края не вылезали за круг
        if (currentUser.avatar_url && currentUser.avatar_url.startsWith('http')) {
            avatarBox.innerHTML = `<img src="${currentUser.avatar_url}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block;">`;
        } else {
            avatarBox.innerHTML = DYNAMIC_SVG_LARGE;
        }

        if (!isAnimation) {
            avatarBox.style.border = `3px solid ${currentColor}`;
            avatarBox.style.boxShadow = `0 0 15px ${currentColor}`;
        } else {
            // Добавляем класс анимации (например, .decor-crown)
            avatarBox.classList.add(currentColor);
            avatarBox.style.border = "none";
            avatarBox.style.boxShadow = "none";
        }
    }

    document.getElementById('balance-num').innerText = currentUser.balance;
    document.getElementById('prof-desc-text').innerText = currentUser.description || "Новобранец KristallCommunity.";

    document.getElementById('edit-username').value = currentUser.username;
    document.getElementById('edit-avatar').value = currentUser.avatar_url || "";
    document.getElementById('edit-password').value = currentUser.password || "";
    document.getElementById('edit-desc').value = currentUser.description || "";

    // Динамический список украшений аватара
    const colorSelect = document.getElementById('edit-avatar-color');
    if (colorSelect) {
        colorSelect.innerHTML = `
            <option value="#22d3ee">Циановый неон (Бесплатно)</option>
            <option value="#f97316">Огненный оранжевый (Бесплатно)</option>
            <option value="#10b981">Изумрудный зелёный (Бесплатно)</option>
            <option value="#a855f7">Магический пурпурный (Бесплатно)</option>
            <option value="#ef4444">Критический красный (Бесплатно)</option>
        `;

        if (currentUser.inventory && currentUser.inventory.includes("✨ Украшение: Золотой Блеск")) {
            colorSelect.innerHTML += `<option value="decor-gold">✨ Анимация: Золотой Блеск</option>`;
        }
        if (currentUser.inventory && currentUser.inventory.includes("🟢 Украшение: Изумрудный Пульс")) {
            colorSelect.innerHTML += `<option value="decor-emerald">🟢 Анимация: Изумрудный Пульс</option>`;
        }
        if (currentUser.inventory && currentUser.inventory.includes("🔴 Украшение: Кровавый Рубин")) {
            colorSelect.innerHTML += `<option value="decor-ruby">🔴 Анимация: Кровавый Рубин</option>`;
        }
        if (currentUser.inventory && currentUser.inventory.includes("👑 Украшение: Корона Владыки")) {
            colorSelect.innerHTML += `<option value="decor-crown">👑 Анимация: Корона Владыки</option>`;
        }
        if (currentUser.inventory && currentUser.inventory.includes("👻 Украшение: Призрак")) {
            colorSelect.innerHTML += `<option value="decor-ghost">👻 Анимация: Призрак</option>`;
        }
        if (currentUser.inventory && currentUser.inventory.includes("🔮 Украшение: Тёмная Материя")) {
            colorSelect.innerHTML += `<option value="decor-matter">🔮 Анимация: Тёмная Материя</option>`;
        }
        if (currentUser.inventory && currentUser.inventory.includes("✨ Украшение: Кристальный Пульс")) {
            colorSelect.innerHTML += `<option value="decor-pulse">✨ Анимация: Кристальный Пульс</option>`;
        }

        colorSelect.value = currentUser.avatar_color || "#22d3ee";
    }

    const invContainer = document.getElementById('prof-inventory');
    if (invContainer) {
        if (currentUser.inventory && currentUser.inventory.length > 0) {
            invContainer.innerHTML = '';
            currentUser.inventory.forEach(item => {
                const span = document.createElement('span');
                span.className = 'inv-item';
                span.innerText = item;
                invContainer.appendChild(span);
            });
        } else { invContainer.innerHTML = '<span style="color: #4b5563;">В инвентаре пока пусто.</span>'; }
    }
    
    applyAvatarBorderColor();
}

// Функция сохранения настроек профиля
function saveProfileChanges(newName, newAv, newPass, newDesc, newColor) {
    if (!currentUser) return;
    currentUser.username = newName;
    currentUser.avatar_url = newAv;
    currentUser.password = newPass;
    currentUser.description = newDesc;
    currentUser.avatar_color = newColor;
    currentUser.inventory = currentUser.inventory || []; // Защита от стирания!

    localStorage.setItem('kristall_user', JSON.stringify(currentUser));
    showKristallToast("Данные профиля Kristall ID сохранены!", "⚙️");
    buildProfilePage();
    updateHeaderProfile();
}
