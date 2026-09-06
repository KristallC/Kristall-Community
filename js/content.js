// ==========================================
// 3. ЗАГРУЗКА НОВОСТЕЙ И КАТАЛОГА С ФИЛЬТРАМИ
// ==========================================
async function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) return;
    try {
        const response = await fetch('databases/news.json?v=' + new Date().getTime());
        const newsData = await response.json();
        
        container.innerHTML = ''; 

        newsData.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';

            // ГЕНЕРАЦИЯ УМНОЙ СЕТКИ ИЗОБРАЖЕНИЙ
            let imagesHTML = '';
            
            // Проверяем, есть ли массив картинок и не пустой ли он
            if (item.images && Array.isArray(item.images) && item.images.length > 0) {
                // Ограничиваем коллаж максимум 4 картинками, чтобы не ломать верстку
                const imgsToShow = item.images.slice(0, 4); 
                const imgCount = imgsToShow.length;

                imagesHTML = `<div class="news-images-grid count-${imgCount}">`;
                
                imgsToShow.forEach(src => {
                    imagesHTML += `
                        <div class="news-img-wrapper skeleton-shimmer">
                            <img src="${src}" class="news-img-item" alt="Событие" loading="lazy">
                        </div>`;
                });
                
                imagesHTML += `</div>`;
            }

            // Собираем новостную карточку воедино
            newsItem.innerHTML = `
                <div class="news-date" style="color: #6b7280; font-size: 11px; font-weight: bold; text-align: left; margin-bottom: 4px;">${item.date}</div>
                <div class="news-title" style="color: white; font-size: 18px; font-weight: bold; text-align: left; margin-bottom: 8px; line-height: 1.3;">${item.title}</div>
                <p class="news-text" style="color: #9ca3af; font-size: 13px; line-height: 1.6; text-align: left; margin: 0; white-space: pre-line;">${item.text}</p>
                ${imagesHTML}
            `;

            // Логика плавного проявления картинок и отключения скелетона мерцания
            const images = newsItem.querySelectorAll('.news-img-item');
            images.forEach(img => {
                img.onload = () => {
                    img.parentElement.classList.remove('skeleton-shimmer'); // Выключаем мерцание
                    img.style.opacity = '1'; // Плавно проявляем картинку
                };
                // Если кликнули на картинку — она красиво откроется в новой вкладке во весь размер
                img.addEventListener('click', () => { window.open(img.src, '_blank'); });
            });

            container.appendChild(newsItem);
        });
    } catch (e) {
        console.error(e);
        container.innerHTML = '<div class="news-item"><p style="color: #ef4444; margin: 0; font-size: 13px;">❌ Ошибка загрузки ленты событий.</p></div>';
    }
}

async function loadProjectsPage() {
    const gridContainer = document.getElementById('projects-grid');
    if (!gridContainer) return;
    try {
        if (allGamesData.length === 0) {
            const response = await fetch(GAMES_URL + '?v=' + new Date().getTime());
            allGamesData = await response.json();
        }
        const searchInput = document.getElementById('search-input');
        const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
        
        gridContainer.innerHTML = ''; 

        const filteredProjects = allGamesData.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchText);
            const matchesType = (currentTypeFilter === 'all' || project.type === currentTypeFilter);
            
            let matchesPlat = false;
            if (currentPlatFilter === 'all') {
                matchesPlat = true;
            } else if (project.platforms && Array.isArray(project.platforms)) {
                matchesPlat = project.platforms.some(p => p.toLowerCase() === currentPlatFilter.toLowerCase());
            }

            return matchesSearch && matchesType && matchesPlat;
        });

        if (filteredProjects.length === 0) {
            gridContainer.innerHTML = '<p style="color: #9ca3af; grid-column: 1/-1;">Ничего не найдено.</p>';
            return;
        }

        filteredProjects.forEach(project => {
            const card = document.createElement('a');
            card.href = `project-template.html?project=${project.id}`;
            card.className = 'game-card'; 
            
            let badgesHTML = '';
            if (project.platforms && Array.isArray(project.platforms)) {
                project.platforms.forEach(plat => {
                    const color = plat.toLowerCase() === 'windows' ? '#3b82f6' : (plat.toLowerCase() === 'android' ? '#10b981' : '#a855f7');
                    badgesHTML += `<span class="badge" style="background-color: ${color}; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; color: white; white-space: nowrap;">${plat}</span>`;
                });
            }

            const hasImages = project.screenshots && project.screenshots.length > 0;
            const coverSrc = hasImages ? project.screenshots[0].src : ''; 
            
            let coverHTML = '';
            if (hasImages) {
                coverHTML = `
                    <div class="cover-skeleton skeleton-shimmer" style="width: 100%; height: 130px; position: relative; background-color: #070a12;">
                        <img src="${coverSrc}" class="card-cover-img" style="width: 100%; height: 100%; object-fit: cover; display: block; opacity: 0; transition: transform 0.3s ease, opacity 0.3s ease-in-out;">
                    </div>`;
            } else {
                coverHTML = `
                    <div style="width: 100%; height: 130px; background: linear-gradient(135deg, #070a12, #0f172a); display: flex; align-items: center; justify-content: center; position: relative;">
                        <svg xmlns="http://w3.org" viewBox="0 0 24 24" width="48" height="48" style="filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.4));">
                            <circle cx="12" cy="12" r="9" fill="none" stroke="#22d3ee" stroke-width="1" stroke-dasharray="4 2" opacity="0.4" />
                            <path d="M12 2 L19 9 L12 22 L5 9 Z" fill="none" stroke="#22d3ee" stroke-width="1.5" />
                            <path d="M12 2 L12 22 M5 9 L19 9 M12 2 L5 9 L14 14 L19 9 L12 2" fill="none" stroke="#22d3ee" stroke-width="1" opacity="0.7" />
                        </svg>
                        <div style="position: absolute; bottom: 8px; font-size: 9px; color: #22d3ee; letter-spacing: 2px; font-weight: bold; opacity: 0.5; text-transform: uppercase;">Kristall Hub</div>
                    </div>`;
            }
            
            card.innerHTML = `
                <div class="cover-wrapper" style="width: 100%; height: 130px; overflow: hidden; position: relative; border-bottom: 1px solid #1f2937;">
                    ${coverHTML}
                </div>
                
                <div class="card-body-content" style="padding: 15px; display: flex; flex-direction: column; gap: 8px; flex-grow: 1;">
                    <div class="card-header" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; width: 100%; min-height: 42px;">
                        <h3 style="margin: 0; color: white; font-size: 16px; font-weight: bold; text-align: left; line-height: 1.3; word-break: break-word;">${project.title}</h3>
                        <div class="badges-wrapper" style="display: flex; gap: 4px; flex-wrap: wrap; justify-content: flex-end; padding-top: 2px;">${badgesHTML}</div>
                    </div>
                    
                    <p class="card-desc" style="margin: 0; text-align: left; color: #9ca3af; font-size: 12px; line-height: 1.5; min-height: 36px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${project.short_desc}
                    </p>
                    
                    <div class="card-footer" style="margin-top: auto; width: 100%; text-align: center; color: #22d3ee; font-weight: bold; font-size: 13px; padding-top: 10px; border-top: 1px solid rgba(31, 41, 55, 0.5);">
                        Подробнее →
                    </div>
                </div>
            `;

            // ЛОГИКА ОТКЛЮЧЕНИЯ МЕРЦАНИЯ ПОСЛЕ СКАЧИВАНИЯ КАРТИНКИ
            const img = card.querySelector('.card-cover-img');
            if (img) {
                img.onload = () => {
                    const skeleton = card.querySelector('.cover-skeleton');
                    if (skeleton) skeleton.classList.remove('skeleton-shimmer'); // Выключаем свет
                    img.style.opacity = "1"; // Плавно проявляем обложку
                };
                
                // Если картинка упала с ошибкой — оставляем аккуратный темный фон
                img.onerror = () => {
                    const skeleton = card.querySelector('.cover-skeleton');
                    if (skeleton) {
                        skeleton.classList.remove('skeleton-shimmer');
                        skeleton.innerHTML = '<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #4b5563; font-size: 11px;">⚠️ Ошибка</span>';
                    }
                };
            }

            gridContainer.appendChild(card);
        });
    } catch (e) { console.error(e); }
}

async function buildProjectTemplatePage() {
    if (!document.getElementById('game-title')) return; 

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project') || urlParams.get('game');
    if (!projectId) { window.location.href = 'projects.html'; return; }

    try {
        if (allGamesData.length === 0) {
            // Добавляем ?v=, чтобы обойти любой кэш папок
            const response = await fetch(GAMES_URL + '?v=' + new Date().getTime());
            allGamesData = await response.json();
        }
        const project = allGamesData.find(p => p.id === projectId);
        if (!project) return;

        // Заполнение текстов
        document.title = `${project.title} - KristallCommunity`;
        document.getElementById('game-title').innerText = project.title;
        document.getElementById('game-short-desc').innerText = project.short_desc;
        document.getElementById('game-full-desc').innerText = project.full_desc || "Описание проекта готовится к публикации.";
        
        document.getElementById('game-platform').innerText = project.platforms ? project.platforms.join(', ') : '-';
        document.getElementById('game-version').innerText = project.version;
        document.getElementById('game-developer').innerText = project.developer || "KristallCommunity";

        // ЧТО НОВОГО
        const whatsNewBlock = document.getElementById('whats-new-block');
        const whatsNewList = document.getElementById('game-whats-new-list');
        
        if (whatsNewBlock && whatsNewList) {
            if (project.whats_new && Array.isArray(project.whats_new) && project.whats_new.length > 0) {
                // Если обновления есть — включаем
                whatsNewBlock.style.display = "block";
                whatsNewList.innerHTML = ''; 
                
                project.screenshots = project.screenshots || []; // Защита от сбоев
                
                project.whats_new.forEach(item => {
                    const li = document.createElement('li');
                    li.style.display = "flex";          
                    li.style.alignItems = "flex-start";
                    li.style.gap = "8px";
                    li.style.marginBottom = "12px";
                    
                    li.innerHTML = `
                        <svg xmlns="http://w3.org" width="5" height="5" fill="#22d3ee" viewBox="0 0 16 16" style="margin-top: 6px; flex-shrink: 0; filter: drop-shadow(0 0 3px #22d3ee);">
                            <circle cx="8" cy="8" r="8"/>
                        </svg>
                        <span style="color: #d1d5db; line-height: 1.4;">${item}</span>
                    `;
                    whatsNewList.appendChild(li);
                });
            } else {
                // Если обновлений нет — блок полностью исчезает
                whatsNewBlock.style.display = "none";
            }
        }
        
        // ВЫВОД НЕСКОЛЬКИХ КНОПОК СКАЧИВАНИЯ
        const oldDownloadBtn = document.getElementById('game-download-btn');
        if (oldDownloadBtn) {
            const downloadContainer = oldDownloadBtn.parentElement;
            const nextSibling = oldDownloadBtn.nextSibling;
            oldDownloadBtn.remove(); 
            
            if (project.downloads && project.downloads.length > 0) {
                project.downloads.forEach(link => {
                    const btn = document.createElement('a');
                    btn.href = link.url;
                    btn.target = "_blank";
                    btn.className = "btn-download"; 
                    
                    // Стили с защитой от вылезания за края на мобилках
                    btn.style.display = "flex";          
                    btn.style.alignItems = "center";
                    btn.style.justifyContent = "center"; 
                    btn.style.gap = "12px";              
                    btn.style.padding = "15px 24px"; 
                    btn.style.marginBottom = "10px";
                    btn.style.textDecoration = "none";
                    btn.style.transition = "0.2s";
                    btn.style.borderRadius = "8px";      
                    btn.style.color = "#ffffff";
                    btn.style.boxSizing = "border-box";  // Гарантирует, что кнопка не станет шире карточки
                    btn.style.width = "100%";            // Кнопка адаптивно занимает всю доступную ширину
                    
                    let btnColor = '#10b981'; 
                    let btnHoverColor = '#059669';
                    let iconSVG = ''; 
                    
                    const osType = link.os?.toLowerCase();
                    
                    if (osType === 'windows') {
                        btnColor = '#3b82f6'; 
                        btnHoverColor = '#2563eb';
                        iconSVG = `
                            <svg xmlns="http://w3.org" width="28" height="28" fill="currentColor" viewBox="0 0 16 16" style="flex-shrink: 0;">
                                <path d="M6.555 1.375 0 2.237v5.45h6.555zM0 13.795l6.555.859v-5.406H0zm7.445.92 8.555 1.154V9.248H7.445zm8.555-7.037L7.445 1.18v6.488H16z"/>
                            </svg>`;
                    } else if (osType === 'android') {
                        btnColor = '#10b981'; 
                        btnHoverColor = '#059669';
                        iconSVG = `
                            <svg xmlns="http://w3.org" width="28" height="28" fill="currentColor" viewBox="0 0 16 16" style="flex-shrink: 0;">
                                <path d="M2.76 3.061a.5.5 0 0 1 .679.175l1.37 2.372A6.748 6.748 0 0 1 8 5c1.25 0 2.414.34 3.19.923l1.371-2.372a.5.5 0 1 1 .866.5l-1.34 2.32A6.74 6.74 0 0 1 14.5 11h-13a6.74 6.74 0 0 1 1.243-4.63l-1.34-2.32a.5.5 0 0 1 .177-.679zM1 12h14v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-1zm3-3a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm8 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                            </svg>`;
                    } else if (osType === 'site') {
                        btnColor = '#a855f7'; 
                        btnHoverColor = '#8b5cf6';
                        iconSVG = `
                            <svg xmlns="http://w3.org" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" style="flex-shrink: 0;">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="2" y1="12" x2="22" y2="12"/>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                            </svg>`;
                    }
                    
                    btn.style.backgroundColor = btnColor;
                    btn.addEventListener('mouseenter', () => btn.style.backgroundColor = btnHoverColor);
                    btn.addEventListener('mouseleave', () => btn.style.backgroundColor = btnColor);

                    const fileWeight = link.size ? ` | ${link.size}` : ''; 
                    
                    btn.innerHTML = `
                        ${iconSVG ? iconSVG : ''}
                        <span style="font-weight: bold; font-size: 15px; letter-spacing: 0.5px; text-align: center;">
                            ${link.label || 'Скачать'} (${project.price}${fileWeight})
                        </span>
                    `;
                    
                    downloadContainer.insertBefore(btn, nextSibling);
                });
            } else {
                const unavailableBlock = document.createElement('div');
                unavailableBlock.style.cssText = "text-align: left; padding: 15px; background-color: #1f2937; color: #9ca3af; border: 1px dashed #374151; border-radius: 8px; font-weight: bold; font-size: 14px; margin-bottom: 20px;";
                unavailableBlock.innerText = "⚠️ В данный момент проект недоступен для скачивания.";
                downloadContainer.insertBefore(unavailableBlock, nextSibling);
            }
        }

        // Блоки особенностей
        const featuresBlock = document.getElementById('features-block');
        const featuresContainer = document.getElementById('game-features');
        if (featuresContainer && project.features && project.features.length > 0) {
            if (featuresBlock) featuresBlock.style.display = 'block';
            featuresContainer.innerHTML = '';
            project.features.forEach(feat => {
                const li = document.createElement('li');
                li.innerHTML = `<span style="color: #10b981; font-weight: bold; margin-right: 5px;">✔</span> ${feat}`;
                featuresContainer.appendChild(li);
            });
        } else if (featuresBlock) { featuresBlock.style.display = 'none'; }

        // Блок скриншотов
        const scrBlock = document.getElementById('screenshots-block');
        const scrContainer = document.getElementById('screenshots-container');
        if (project.screenshots && project.screenshots.length > 0 && scrBlock && scrContainer) {
            scrBlock.style.display = 'block';
            scrContainer.innerHTML = ''; 

            scrContainer.style.display = "flex";
            scrContainer.style.alignItems = "center";
            scrContainer.style.gap = "15px";
            scrContainer.style.overflowX = "auto";
            scrContainer.style.overflowY = "hidden";

            scrContainer.style.padding = "10px 15px";
            scrContainer.style.margin = "-10px -15px 15px -15px";

            // Определяем ширину экрана устройства
            const deviceWidth = window.innerWidth;
            const isMobile = deviceWidth <= 768;

            project.screenshots.forEach(screenshot => {
                const isVertical = screenshot.orient?.toLowerCase() === 'ver';

                let widthVal, heightVal;
                
                if (isMobile) {
                    // Горизонтальный скриншот будет занимать ровно 75% от ширины экрана смартфона,
                    // а высота подстроится автоматически под стандартное соотношение сторон 16:9
                    if (isVertical) {
                        widthVal = Math.round(deviceWidth * 0.3).toString();  // Вертикальные (около 30% экрана)
                        heightVal = Math.round(widthVal * 1.77).toString();   // Пропорция 9:16
                    } else {
                        widthVal = Math.round(deviceWidth * 0.75).toString(); // Горизонтальные (75% экрана)
                        heightVal = Math.round(widthVal * 0.5625).toString(); // Пропорция 16:9
                    }
                } else {
                    // Идеальные размеры для ПК-версии
                    widthVal = isVertical ? "124" : "366";
                    heightVal = "220";
                }

                const skeleton = document.createElement('div');
                skeleton.className = 'skeleton-shimmer';
                skeleton.style.cssText = `width: ${widthVal}px; height: ${heightVal}px; border-radius: 8px; border: 1px solid #1f2937; display: block; flex-shrink: 0; position: relative; overflow: hidden; transition: transform 0.2s, border-color 0.2s;`;

                const img = document.createElement('img');
                img.src = screenshot.src;
                
                img.setAttribute('width', widthVal);
                img.setAttribute('height', heightVal);
                
                img.style.width = "100%";
                img.style.height = "100%";
                img.style.objectFit = "cover";
                img.style.cursor = "pointer";
                img.style.opacity = "0"; 
                img.style.transition = "opacity 0.3s ease-in-out"; 

                img.onload = () => {
                    skeleton.className = ''; 
                    skeleton.style.background = 'transparent';
                    img.style.opacity = "1"; 
                };

                img.onerror = () => {
                    skeleton.className = '';
                    skeleton.style.backgroundColor = '#070a12';
                    skeleton.innerHTML = '<span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #4b5563; font-size: 11px;">⚠️ Ошибка</span>';
                };
                
                img.addEventListener('mouseenter', () => { 
                    if (img.style.opacity === "1") {
                        skeleton.style.transform = "scale(1.04)"; 
                        skeleton.style.borderColor = "#22d3ee"; 
                    }
                });
                img.addEventListener('mouseleave', () => { 
                    skeleton.style.transform = "scale(1)"; 
                    skeleton.style.borderColor = "#1f2937"; 
                });
                img.addEventListener('click', () => { 
                    if (img.style.opacity === "1") window.open(screenshot.src, '_blank'); 
                });
                
                skeleton.appendChild(img);
                scrContainer.appendChild(skeleton);
            });
        } else if (scrBlock) { 
            scrBlock.style.display = 'none'; 
        }

        // Трейлер
        const trailerBlock = document.getElementById('trailer-block');
        const trailerContainer = document.getElementById('trailer-container');
        if (project.trailer_url && trailerBlock && trailerContainer) {
            trailerBlock.style.display = 'block';
            trailerContainer.innerHTML = `
                <div style="position: relative; width: 100%; padding-top: 56.25%; background: #000; border-radius: 8px; overflow: hidden; border: 1px solid #1f2937;">
                    <iframe src="${project.trailer_url}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
                </div>
            `;
        } else if (trailerBlock) { trailerBlock.style.display = 'none'; }

        // БЛОК СОЦИАЛЬНЫХ СЕТЕЙ
        const socialsBlock = document.getElementById('socials-block');
        const socialsList = document.getElementById('game-socials-list');

        if (socialsBlock && socialsList) {
            if (project.socials && Array.isArray(project.socials) && project.socials.length > 0) {
                socialsBlock.style.display = "block";
                socialsList.innerHTML = '';

                project.socials.forEach(social => {
                    const linkCard = document.createElement('a');
                    linkCard.href = social.url;
                    linkCard.target = "_blank";
                
                    // Красивые базовые стили плашек-ссылок в тон твоего сайта
                    linkCard.style.display = "inline-flex";
                    linkCard.style.alignItems = "center";
                    linkCard.style.gap = "8px";
                    linkCard.style.padding = "8px 14px";
                    linkCard.style.borderRadius = "6px";
                    linkCard.style.fontSize = "13px";
                    linkCard.style.fontWeight = "bold";
                    linkCard.style.textDecoration = "none";
                    linkCard.style.transition = "background-color 0.2s, transform 0.2s";
                    linkCard.style.boxSizing = "border-box";

                    let iconSVG = '';
                    let bgColor = '#1e293b';       // Базовый темный цвет
                    let hoverColor = '#334155';    // Цвет при наведении
                    let textColor = '#cbd5e1';     // Цвет текста

                    const type = social.type?.toLowerCase();

                    // Готовим SVG и брендовые цвета для каждого типа
                    if (type === 'telegram') {
                        bgColor = 'rgba(34, 158, 217, 0.1)';
                        hoverColor = 'rgba(34, 158, 217, 0.2)';
                        textColor = '#229ed9';
                        iconSVG = `<svg xmlns="http://w3.org" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.25.294.26.006.554-.1.882-.317 2.251-1.52 3.387-2.29 3.41-2.31.018-.015.044-.047.019-.025-.024.022-.618.574-1.39 1.293-.24.225-.43.431-.45.45-.044.04-.09.086-.134.13l-.127.128c-.314.314-.543.543-.01.894l.111.074c.42.275.83.55 1.25.823.475.308.851.552 1.345.507.288-.027.58-.3.732-1.117l.745-3.952c.03-.177-.04-.324-.23-.324a1.472 1.472 0 0 0-.254.026z"/></svg>`;
                    } else if (type === 'discord') {
                        bgColor = 'rgba(88, 101, 242, 0.1)';
                        hoverColor = 'rgba(88, 101, 242, 0.2)';
                        textColor = '#5865f2';
                        iconSVG = `<svg xmlns="http://w3.org" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.575-.407.837a12.256 12.256 0 0 0-3.658 0 8.284 8.284 0 0 0-.412-.837.052.052 0 0 0-.052-.025 13.228 13.228 0 0 0-3.258 1.011.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032a.054.054 0 0 0 .022.039c2.161 1.594 4.193 2.564 6.177 3.185a.054.054 0 0 0 .058-.019c.461-.63.868-1.31 1.216-2.021a.051.051 0 0 0-.028-.07 8.68 8.68 0 0 1-1.211-.578.051.051 0 0 1-.006-.084c.085-.063.17-.129.252-.197a.05.05 0 0 1 .052-.007c4.14 1.9 8.461 0 8.461 0a.05.05 0 0 1 .053.007c.083.068.168.134.253.197a.051.051 0 0 1-.006.084 7.67 7.67 0 0 1-1.211.578.05.05 0 0 0-.028.07c.35.711.755 1.391 1.216 2.021a.055.055 0 0 0 .058.019c1.985-.62 4.021-1.591 6.177-3.184a.054.054 0 0 0 .022-.039c.325-3.4-.444-6.393-1.843-9.106a.042.042 0 0 0-.02-.019zm-8.38 8.013c-.83 0-1.513-.757-1.513-1.693s.675-1.693 1.512-1.693c.838 0 1.514.764 1.514 1.693 0 .936-.676 1.693-1.513 1.693zm5.442 0c-.83 0-1.513-.757-1.513-1.693s.675-1.693 1.512-1.693c.839 0 1.514.764 1.514 1.693 0 .936-.676 1.693-1.513 1.693z"/></svg>`;
                    } else if (type === 'youtube') {
                        bgColor = 'rgba(255, 0, 0, 0.1)';
                        hoverColor = 'rgba(255, 0, 0, 0.2)';
                        textColor = '#ff0000';
                        iconSVG = `<svg xmlns="http://w3.org" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.3 1.12.3 3.48.3 3.48s0 2.36-.3 3.48a2.01 2.01 0 0 1-1.415 1.419c-1.122.299-5.288.329-6.11.329h-.089c-.822 0-4.987-.03-6.11-.329a2.01 2.01 0 0 1-1.415-1.419c-.3-1.12-.3-3.48-.3-3.48s0-2.36.3-3.48a2.01 2.01 0 0 1 1.415-1.42c1.123-.31 5.287-.33 6.11-.336h.09zM6.557 10.277 10.355 8 6.557 5.723v4.554z"/></svg>`;
                    } else if (type === 'rutube') {
                        bgColor = 'rgba(0, 180, 255, 0.1)';
                        hoverColor = 'rgba(0, 180, 255, 0.2)';
                        textColor = '#00b4ff';
                        iconSVG = `
                            <svg xmlns="http://w3.org" width="16" height="16" fill="currentColor" viewBox="0 0 512 512" style="transform: scale(1.05);">
                                <path d="M374.3 0H137.7C61.6 0 0 61.6 0 137.7v236.6C0 450.4 61.6 512 137.7 512h236.6c76.1 0 137.7-61.6 137.7-137.7V137.7C512 61.6 450.4 0 374.3 0zm19.8 386.4H236.3V261.2h120.1c42.8 0 57.6-26.6 57.6-59.5 0-33-14.8-59.5-57.6-59.5H161.4v244.2h-61.1V102.4h263.2c65.6 0 112.5 35 112.5 99.3 0 46.9-24.9 79.2-66.9 92.4l85.1 92.3z"/>
                            </svg>`;
                    } else if (type === 'vk') {
                        bgColor = 'rgba(0, 119, 255, 0.1)';
                        hoverColor = 'rgba(0, 119, 255, 0.2)';
                        textColor = '#0077ff';
                        iconSVG = `<svg xmlns="http://w3.org" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23.45 5.94c.18-.6.02-1.04-.84-1.04h-2.77c-.7 0-1.03.37-1.21.78 0 0-1.4 3.42-3.4 5.64-.64.64-.93.85-1.28.85-.18 0-.44-.21-.44-.81V5.94c0-.7-.2-1.04-.79-1.04H8.56c-.44 0-.7.33-.7.64 0 .67 1 1.22 1.1 2.71v4.1c0 .9-.16 1.06-.52 1.06-.95 0-3.26-3.43-4.63-7.37-.27-.77-.54-1.08-1.25-1.08H.82c-.8 0-.96.37-.96.79 0 .74.95 4.5 4.43 9.4 2.32 3.34 5.58 5.15 8.56 5.15 1.78 0 2-.4 2-1.1v-2.5c0-.8.17-.96.73-.96.4 0 1.1.2 2.73 1.77 1.86 1.86 2.16 2.73 3.2 2.73h2.78c.8 0 1.19-.4.96-1.2-.25-.79-1.16-1.94-1.58-2.45-.23-.28-.58-.59-.69-.74-.15-.2-.11-.28 0-.46 0 0 1.34-1.9 2.5-4.22z"/></svg>`;
                    } else if (type === 'github') {
                        bgColor = 'rgba(255, 255, 255, 0.08)';
                        hoverColor = 'rgba(255, 255, 255, 0.15)';
                        textColor = '#ffffff';
                        iconSVG = `<svg xmlns="http://w3.org" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`;
                    } else if (type === 'x') {
                        bgColor = 'rgba(255, 255, 255, 0.05)';
                        hoverColor = 'rgba(255, 255, 255, 0.1)';
                        textColor = '#e1e8ed';
                        iconSVG = `<svg xmlns="http://w3.org" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>`;
                    } else if (type === 'max') {
                        bgColor = 'rgba(168, 85, 247, 0.1)';   // Нежно-фиолетовая подложка под тон ховера футера
                        hoverColor = 'rgba(168, 85, 247, 0.2)';// Чуть ярче при наведении
                        textColor = '#a855f7';                 // Фирменный сиреневый цвет текста и линий
                        iconSVG = `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 2.3.78 4.42 2.1 6.1L3 21l2.9-.9c1.68 1.18 3.74 1.9 6.1 1.9z"/>
                                <path d="M12 15.5c1.933 0 3.5-1.567 3.5-3.5S13.933 8.5 12 8.5s-3.5 1.567-3.5 3.5.78 2.1 2.1 2.9l-1.1 1.1 2.5-1z"/>
                            </svg>`;
                    } else {
                        bgColor = 'rgba(34, 211, 238, 0.1)';
                        hoverColor = 'rgba(34, 211, 238, 0.2)';
                        textColor = '#22d3ee';
                        iconSVG = `<svg xmlns="http://w3.org" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
                    }

                    linkCard.style.backgroundColor = bgColor;
                    linkCard.style.color = textColor;

                    linkCard.addEventListener('mouseenter', () => {
                        linkCard.style.backgroundColor = hoverColor;
                        linkCard.style.transform = "translateY(-1px)";
                    });
                    linkCard.addEventListener('mouseleave', () => {
                        linkCard.style.backgroundColor = bgColor;
                        linkCard.style.transform = "translateY(0)";
                    });

                    // ЦЕНТРИРУЮЩИЙ FLEXBOX-КОНТЕЙНЕР ДЛЯ SVG
                    linkCard.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; flex-shrink: 0; line-height: 0;">
                            ${iconSVG}
                        </div>
                        <span>${social.label || 'Ссылка'}</span>
                    `;
                    socialsList.appendChild(linkCard);
                });

            } else {
                socialsBlock.style.display = "none";
            }
        }

        // Инструкция
        const instructionBlock = document.getElementById('instruction-block');
        const instructionList = document.getElementById('instruction-list');
        if (project.show_instruction && instructionBlock && instructionList) {
            instructionBlock.style.display = 'block'; 
            instructionList.innerHTML = ''; 
            if (project.instruction_type === 'android') {
                instructionList.innerHTML = `
                    <li>Нажмите зеленую кнопку скачивания выше.</li>
                    <li>Разрешите сохранение файла в системе, если браузер выдаст предупреждение.</li>
                    <li>Откройте скачанный APK на телефоне и в настройках безопасности разрешите <em>"Установку из неизвестных источников"</em>.</li>
                    <li>Завершите процесс установки и запустите игру/приложение!</li>
                `;
            } else if (project.instruction_type === 'windows') {
                instructionList.innerHTML = `
                    <li>Скачайте архив с проектом по кнопке выше.</li>
                    <li>Распакуйте скачанный ZIP/RAR архив в любую удобную папку на вашем компьютере.</li>
                    <li>Найдите файл запуска проекта с расширением <strong>.exe</strong> и дважды нажмите по нему.</li>
                    <li>Пользуйтесь! Рекомендуется создать ярлык на рабочем столе.</li>
                `;
            }
        } else if (instructionBlock) { instructionBlock.style.display = 'none'; }

    } catch (e) { console.error("Ошибка сборки страницы шаблона:", e); }
}

function initFiltersAndSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    searchInput.addEventListener('input', loadProjectsPage);
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const clickedBtn = e.target;
            
            // Фильтрация по типу (Игра / Приложение)
            if (clickedBtn.hasAttribute('data-filter-type')) {
                document.querySelectorAll('[data-filter-type]').forEach(b => b.classList.remove('active'));
                currentTypeFilter = clickedBtn.getAttribute('data-filter-type');
            }
            
            // Фильтрация по платформе (Windows / Android)
            if (clickedBtn.hasAttribute('data-filter-plat')) {
                document.querySelectorAll('[data-filter-plat]').forEach(b => b.classList.remove('active'));
                currentPlatFilter = clickedBtn.getAttribute('data-filter-plat');
            }
            
            clickedBtn.classList.add('active');
            loadProjectsPage();
        });
    });
}

// ==========================================
// 3.Б. ЗАГРУЗКА МАРКЕТПЛЕЙСА И КАТЕГОРИЙ
// ==========================================
const MARKET_URL = './databases/market.json';
let allMarketData = [];
let currentMarketFilter = 'all';

async function loadMarketplacePage() {
    const gridContainer = document.getElementById('marketplace-grid');
    const marketBalNum = document.getElementById('market-balance-num');
    if (!gridContainer) return;

    if (marketBalNum) {
        marketBalNum.innerText = currentUser ? currentUser.balance : 0;
    }

    try {
        if (allMarketData.length === 0) {
            const response = await fetch(MARKET_URL);
            allMarketData = await response.json();
        }
        const searchInput = document.getElementById('market-search-input');
        const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
        gridContainer.innerHTML = '';

        const filteredProducts = allMarketData.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchText) || item.desc.toLowerCase().includes(searchText);
            const matchesCategory = (currentMarketFilter === 'all' || item.category === currentMarketFilter);
            return matchesSearch && matchesCategory;
        });

        if (filteredProducts.length === 0) {
            gridContainer.innerHTML = '<p style="color: #9ca3af; grid-column: 1/-1; text-align:center;">Товары в данной категории не найдены.</p>';
            return;
        }

        filteredProducts.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            let previewClass = "";
            let previewStyle = "border: 2px solid #374151;"; 

            // Внутри функции loadMarketplacePage в js/content.js:
            if (item.id === 'decor-fire') previewClass = "decor-fire-animation";
            else if (item.id === 'decor-cyber') previewClass = "decor-cyber-animation";
            else if (item.id === 'decor-gold') previewClass = "decor-gold-animation";
            else if (item.id === 'decor-emerald') previewClass = "decor-emerald-animation";
            else if (item.id === 'decor-ruby') previewClass = "decor-ruby-animation";
            else if (item.id === 'decor-crown') previewClass = "decor-crown-animation";
            else if (item.id === 'decor-ghost') previewClass = "decor-ghost-animation";
            else if (item.id === 'decor-matter') previewClass = "decor-matter-animation";
            else if (item.id === 'decor-pulse') previewClass = "decor-pulse-animation";

            const isOwned = currentUser && currentUser.inventory.includes(item.title);
            const btnText = isOwned ? "Куплено" : "Купить";
            const btnStyle = isOwned ? "background-color: #27272a; color: #71717a; cursor: not-allowed;" : "";

            card.innerHTML = `
                <div>
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: #1f2937; margin: 0 auto 15px auto; display: flex; align-items: center; justify-content: center; overflow: hidden;" class="${previewClass}" style="${previewStyle}">
                        <span style="font-size: 18px; opacity: 0.3;">✨</span>
                    </div>
                    <div class="product-title">${item.title}</div>
                    <p class="product-desc">${item.desc}</p>
                </div>
                <div class="product-footer">
                    <div class="product-price">${item.price} <span class="coin-icon"></span></div>
                    <button class="auth-submit-btn" style="padding: 8px 16px; font-size: 13px; ${btnStyle}" ${isOwned ? 'disabled' : ''} onclick="buyMarketItem('${item.title}', ${item.price}, '${item.category}')">${btnText}</button>
                </div>
            `;
            gridContainer.appendChild(card);
        });
    } catch (e) {
        console.error("Ошибка маркетплейса:", e);
        gridContainer.innerHTML = '<p style="color: #ef4444;">Не удалось загрузить товары магазина.</p>';
    }
}

function initMarketplaceFilters() {
    const searchInput = document.getElementById('market-search-input');
    if (!searchInput) return;
    searchInput.addEventListener('input', loadMarketplacePage);
    document.querySelectorAll('[data-market-filter]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-market-filter]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentMarketFilter = e.target.getAttribute('data-market-filter');
            loadMarketplacePage();
        });
    });
}

let activePurchaseItem = null; // Запоминаем, какой товар хочет купить юзер

window.buyMarketItem = function(itemName, price, category) {
    if (!currentUser) { showKristallToast("Войдите в Kristall ID, чтобы совершать покупки!", "🔒"); return; }
    if (currentUser.balance < price) { showKristallToast("Недостаточно монет на балансе Kristall ID!", "⏳"); return; }
    if (currentUser.inventory.includes(itemName)) { showKristallToast("Этот предмет уже куплен!", "📦"); return; }

    const itemData = allMarketData.find(i => i.title === itemName);
    if (!itemData) return;

    activePurchaseItem = { itemName, price, category };

    // Заполняем тексты и строку цены
    document.getElementById('modal-product-title').innerText = itemData.title;
    document.getElementById('modal-product-desc').innerText = itemData.desc;
    document.getElementById('modal-product-price').innerHTML = `${itemData.price} <span class="coin-icon"></span>`;

    // ИСПРАВЛЕНО: Настройка манекена. Жестко вшиваем центрирование и круглую маску!
    const previewZone = document.getElementById('modal-preview-zone');
    if (previewZone) {
        previewZone.className = ''; 
        previewZone.style.boxShadow = 'none';
        previewZone.style.animation = 'none';
        previewZone.style.border = "none";
        
        // Манекен всегда остается идеально круглым и центрирует любую неоновую рамку
        previewZone.style.cssText = "width: 130px; height: 130px; border-radius: 50% !important; overflow: hidden !important; display: flex !important; align-items: center !important; justify-content: center !important; background: #1f2937; box-sizing: border-box;";

        // Внутри функции window.buyMarketItem в js/content.js:
        if (itemData.id === 'decor-fire') previewZone.classList.add('decor-fire-animation');
        else if (itemData.id === 'decor-cyber') previewZone.classList.add('decor-cyber-animation');
        else if (itemData.id === 'decor-gold') previewZone.classList.add('decor-gold-animation');
        else if (itemData.id === 'decor-emerald') previewZone.classList.add('decor-emerald-animation');
        else if (itemData.id === 'decor-ruby') previewZone.classList.add('decor-ruby-animation');
        else if (itemData.id === 'decor-crown') previewZone.classList.add('decor-crown-animation');
        else if (itemData.id === 'decor-ghost') previewZone.classList.add('decor-ghost-animation');
        else if (itemData.id === 'decor-matter') previewZone.classList.add('decor-matter-animation');
        else if (itemData.id === 'decor-pulse') previewZone.classList.add('decor-pulse-animation');
        else previewZone.style.border = "3px solid #374151";
    }

    document.getElementById('confirm-modal').style.display = 'flex';
};

// Функция финального списания средств (вызывается из app.js при клике на "Подтвердить")
function executeFinalPurchase() {
    if (!activePurchaseItem || !currentUser) return;
    const { itemName, price, category } = activePurchaseItem;

    currentUser.balance -= price;
    currentUser.inventory.push(itemName);

    if (category === 'role') {
        if (itemName.includes("Элита") && currentUser.clearance_level < 2) {
            currentUser.clearance_level = 2;
            showKristallToast("Ваш уровень допуска повышен до Элиты!", "👑");
        } else if (itemName.includes("Создатель") && currentUser.clearance_level < 3) {
            currentUser.clearance_level = 3;
            showKristallToast("Ваш уровень допуска повышен до Создателя!", "👑");
        }
    }

    localStorage.setItem('kristall_user', JSON.stringify(currentUser));
    showKristallToast(`Успешная покупка: ${itemName}!`, "🛒");
    
    // Закрываем окно и обновляем интерфейсы
    document.getElementById('confirm-modal').style.display = 'none';
    activePurchaseItem = null;
    
    if (typeof loadMarketplacePage === 'function') loadMarketplacePage();
    if (typeof updateHeaderProfile === 'function') updateHeaderProfile();
}

// ==========================================================================
// ФУНКЦИЯ ОТРИСОВКИ ВИДЖЕТА НА ГЛАВНОЙ СТРАНИЦЕ (ФИНАЛЬНЫЙ ЗАМЫКАЮЩИЙ БЛОК)
// ==========================================================================
function buildMainSideProfile() {
    const sideBox = document.getElementById('main-side-profile');
    if (!sideBox) return; 

    if (currentUser) {
        let roleName = "Пользователь";
        let nameColor = "white";
        if (currentUser.clearance_level === 2) { roleName = "Элита"; nameColor = "#f97316"; }
        else if (currentUser.clearance_level === 3) { roleName = "Создатель"; nameColor = "#10b981"; }
        else if (currentUser.clearance_level === 4) { roleName = "Модератор"; nameColor = "#a855f7"; }
        else if (currentUser.clearance_level === 5) { roleName = "Администратор"; nameColor = "#ef4444"; }
        else if (currentUser.clearance_level === 6) { roleName = "Владелец"; nameColor = "#22d3ee"; }

        const currentBorderColor = currentUser.avatar_color || "#22d3ee"; 
        
        const hasAuraShadow = currentUser.inventory.includes("💥 Неоновая Аура") 
            ? `box-shadow: 0 0 15px ${currentBorderColor}; border: 2px solid ${currentBorderColor};` 
            : `border: 2px solid ${currentBorderColor};`; 

        const sideAvatarHTML = (currentUser.avatar_url && currentUser.avatar_url.startsWith('http'))
            ? `<img src="${currentUser.avatar_url}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`
            : `<svg viewBox="0 0 24 24" style="width:60%; height:60%; fill:${currentBorderColor};"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>`;

        sideBox.innerHTML = `
            <div style="width: 55px; height: 55px; border-radius: 50%; ${hasAuraShadow} display: flex; align-items: center; justify-content: center; background: #1f2937; margin-bottom: 5px; overflow:hidden;">
                ${sideAvatarHTML}
            </div>
            <div style="color: ${nameColor}; font-weight: bold; font-size: 16px;">${currentUser.username}</div>
            <div style="color: ${nameColor}; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8;">${roleName}</div>
            
            <div style="width: 100%; margin-top: 10px; border-top: 1px solid #1f2937; padding-top: 10px; display: flex; justify-content: space-around; font-size: 13px;">
                <div style="color: #9ca3af;">Баланс: <strong style="color: #10b981;">${currentUser.balance} ❂</strong></div>
            </div>
            <a href="profile.html" style="width: 100%; margin-top: 12px; background: #1f2937; color: white; border: 1px solid #374151; padding: 8px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: bold; transition: 0.2s; text-align:center;" onmouseenter="this.style.borderColor='#22d3ee'" onmouseleave="this.style.borderColor='#374151'">Открыть личный кабинет</a>
        `;
    } else {
        sideBox.innerHTML = `
            <div style="width: 50px; height: 50px; border-radius: 50%; border: 2px dashed #374151; display: flex; align-items: center; justify-content: center; background: #111827; margin-bottom: 5px;">
                <svg viewBox="0 0 24 24" style="width:50%; height:50%; fill:#4b5563;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
            </div>
            <div style="color: white; font-weight: bold; font-size: 15px;">Kristall ID не найден</div>
            <div style="color: #6b7280; font-size: 12px; margin-bottom: 8px;">Войдите, чтобы копить монеты и открывать сундуки!</div>
            <button class="auth-submit-btn" style="width: 100%; padding: 8px; font-size: 12px;" onclick="document.querySelector('.pc-profile-block').click()">Войти в аккаунт</button>
        `;
    }
    if (typeof applyAvatarBorderColor === 'function') applyAvatarBorderColor();
}
