document.addEventListener("DOMContentLoaded", () => {
    const listContainer = document.getElementById('clans-list-container');

    // Функция генерации шиммера загрузки
    function showTableShimmer() {
        if (!listContainer) return;
        listContainer.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const tr = document.createElement('tr');
            tr.style.borderBottom = "1px solid #334155";
            tr.innerHTML = `
                <td style="padding: 20px; text-align: center;"><div class="skeleton-shimmer" style="height: 20px; width: 45px; border-radius: 4px; margin: 0 auto;"></div></td>
                <td style="padding: 20px;"><div class="skeleton-shimmer" style="height: 20px; width: 220px; border-radius: 4px;"></div></td>
                <td style="padding: 20px; text-align: center;"><div class="skeleton-shimmer" style="height: 20px; width: 60px; border-radius: 4px; margin: 0 auto;"></div></td>
                <td style="padding: 20px; text-align: right;"><div class="skeleton-shimmer" style="height: 20px; width: 80px; border-radius: 4px; margin-left: auto;"></div></td>
                <td style="padding: 20px; text-align: center;"><div class="skeleton-shimmer" style="height: 32px; width: 120px; border-radius: 6px; margin: 0 auto;"></div></td>
            `;
            listContainer.appendChild(tr);
        }
    }

    // Загрузка и отрисовка данных кланов
    async function loadClansRanking() {
        showTableShimmer();

        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            const response = await fetch('databases/clans.json');
            if (!response.ok) throw new Error(`Сервер ответил кодом ${response.status}`);
            
            const data = await response.json();
            
            // Если в JSON остался старый формат с объектом "clans", читаем его, иначе читаем массив напрямую
            const clans = Array.isArray(data) ? data : (data.clans || []);

            clans.sort((a, b) => b.points - a.points);
            listContainer.innerHTML = '';

            if (clans.length === 0) {
                listContainer.innerHTML = `<tr><td colspan="5" style="padding: 40px; text-align: center; color: #94a3b8;">Рейтинг кланов пуст.</td></tr>`;
                return;
            }

            clans.forEach((clan, index) => {
                const rank = index + 1;
                const tr = document.createElement('tr');
                
                tr.style.borderBottom = "1px solid #334155";
                tr.style.transition = "background-color 0.2s";
                tr.addEventListener('mouseenter', () => tr.style.backgroundColor = "rgba(255, 255, 255, 0.02)");
                tr.addEventListener('mouseleave', () => tr.style.backgroundColor = "transparent");

                // 1. ЦВЕТА И СВЕЧЕНИЕ МЕСТ (УСИЛИЛИ ТОП-2, ДОБАВИЛИ ПЛОТНОСТЬ 4+ МЕСТАМ)
                let rankStyle = "color: #94a3b8; font-size: 14px; font-weight: bold;"; 
                if (rank === 1) {
                    rankStyle = "color: #fbbf24; font-size: 18px; font-weight: 900; text-shadow: 0 0 10px rgba(251, 191, 36, 0.4);";
                } else if (rank === 2) {
                    rankStyle = "color: #cbd5e1; font-size: 16px; font-weight: 800; text-shadow: 0 0 10px rgba(203, 213, 225, 0.5);";
                } else if (rank === 3) {
                    rankStyle = "color: #f97316; font-size: 15px; font-weight: 800; text-shadow: 0 0 10px rgba(249, 115, 22, 0.3);";
                }

                // КРУПНЫЕ СВГ СТРЕЛОЧКИ СЛЕВА ОТ ЦИФРЫ (Размер 12x12)
                let trendIcon = '';
                if (clan.trend === 'up') {
                    trendIcon = `
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#10b981" style="margin-right: 6px; flex-shrink: 0;">
                            <path d="M12 4l-10 12h20z"/>
                        </svg>`;
                } else if (clan.trend === 'down') {
                    trendIcon = `
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#ef4444" style="margin-right: 6px; flex-shrink: 0;">
                            <path d="M12 20l-10-12h20z"/>
                        </svg>`;
                } else {
                    // Чтобы цифра без стрелочки стояла ровно в ряд с остальными, делаем невидимый отступ
                    trendIcon = `<div style="width: 18px;"></div>`;
                }

                // 2. ГРАДИЕНТЫ НАЗВАНИЙ (Обычные кланы — строго белый цвет, Второе место — контрастная платина)
                let nameStyleHTML = `style="color: #ffffff;"`; // Все обычные кланы — чисто белые
                if (rank === 1) {
                    nameStyleHTML = `style="background: linear-gradient(to right, #ffe600, #ff9900); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;"`;
                } else if (rank === 2) {
                    nameStyleHTML = `style="background: linear-gradient(to right, #ffffff, #94a3b8); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;"`;
                } else if (rank === 3) {
                    nameStyleHTML = `style="background: linear-gradient(to right, #ff7b00, #ff4500); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;"`;
                }

                // 3. КНОПКА СВЯЗИ
                let actionBtnHTML = '';
                if (clan.leader_contact && clan.leader_contact.trim() !== '') {
                    actionBtnHTML = `
                        <a href="${clan.leader_contact}" target="_blank" style="display: inline-block; padding: 8px 16px; background-color: #22d3ee; color: #0f172a; text-decoration: none; font-weight: bold; font-size: 13px; border-radius: 6px; transition: background-color 0.2s; box-shadow: 0 2px 8px rgba(34, 211, 238, 0.2);">
                            Написать
                        </a>`;
                } else {
                    actionBtnHTML = `
                        <button disabled style="display: inline-block; padding: 8px 16px; background-color: #242f41; color: #475569; border: 1px solid #334155; font-weight: bold; font-size: 13px; border-radius: 6px; cursor: not-allowed;">
                            Закрыто
                        </button>`;
                }

                const formattedPoints = Number(clan.points).toLocaleString('ru-RU');

                tr.innerHTML = `
                    <td style="padding: 16px 20px; text-align: center;">
                        <!-- Идеальное горизонтальное выравнивание стрелочки и числа места -->
                        <div style="display: flex; align-items: center; justify-content: center; width: 100%; ${rankStyle}">
                            ${trendIcon}<span style="min-width: 14px; text-align: left;">${rank}</span>
                        </div>
                    </td>
                    <td style="padding: 16px 20px; font-weight: 700;">
                        <span style="color: ${clan.tag_color || '#94a3b8'}; font-family: monospace; font-size: 15px; margin-right: 8px; font-weight: bold;">[${clan.tag}]</span>
                        <span ${nameStyleHTML}>${clan.name}</span>
                    </td>
                    <td style="padding: 16px 20px; text-align: center; color: #94a3b8; font-weight: 500;">
                        ${clan.members_current} / ${clan.members_max}
                    </td>
                    <td style="padding: 16px 20px; text-align: right; font-weight: bold; color: #22d3ee; font-size: 15px; letter-spacing: 0.5px;">
                        ${formattedPoints}
                    </td>
                    <td style="padding: 16px 20px; text-align: center;">
                        ${actionBtnHTML}
                    </td>
                `;

                listContainer.appendChild(tr);
            });

        } catch (error) {
            console.error(error);
            listContainer.innerHTML = `<tr><td colspan="5" style="padding: 40px; text-align: center; color: #ef4444; font-weight: bold; font-size: 14px;">⚠️ Ошибка: ${error.message}</td></tr>`;
        }
    }

    loadClansRanking();
});
