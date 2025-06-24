document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    const dots = document.querySelectorAll('.dot');
    const skillTitle = document.querySelector('.skill-title');
    const webgl = document.querySelector('#webgl');
    const total = dots.length;
    let currentIdx = 0;
    let isAutoScrolling = false;
    let touchStartY = 0;
    let overlay = false;
    
    const glowBoxes = document.querySelectorAll(".glow-box");
    const projectCards = document.querySelectorAll('.project-card');
    
    // 初期状態で全てのカードを折りたたみ状態に
    projectCards.forEach(card => {
        card.classList.add('collapsed');
    });
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // リンククリック時は展開/折りたたみを行わない
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            
            // 他のカードを折りたたむ
            projectCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                    otherCard.classList.add('collapsed');
                }
            });
            
            // クリックされたカードの状態を切り替え
            if (card.classList.contains('collapsed')) {
                card.classList.remove('collapsed');
                card.classList.add('expanded');
            } else {
                card.classList.remove('expanded');
                card.classList.add('collapsed');
            }
        });
    });
    glowBoxes.forEach(box => {
        box.addEventListener('mouseover', () => {
            if(box.classList.contains('glow')) return;
            box.classList.add('glow');
            positionSkillTitle(box, skillTitle);
        });

        box.addEventListener('touchstart', (e) => {
            box.classList.add('glow');
            positionSkillTitle(box, skillTitle);
            e.preventDefault();
        }, { passive: false });

        box.addEventListener('mouseleave', () => {
            box.classList.remove('glow');
            resetSkillTitlePosition(skillTitle);
        });

        box.addEventListener('touchend', () => {
            box.classList.remove('glow');
            resetSkillTitlePosition(skillTitle);
        });

        box.addEventListener('touchmove', () => {
            box.classList.remove('glow');
            resetSkillTitlePosition(skillTitle);
        });
    });

    const viewAllBtn = document.querySelector('.view-all-btn');
    const worksOverlay = document.getElementById('works-overlay');
    const closeBtn = document.querySelector('.close-btn');

    viewAllBtn.addEventListener('click', function (e) {
        e.preventDefault();
        worksOverlay.style.display = 'flex';
        overlay = true;
    });

    closeBtn.addEventListener('click', function () {
        worksOverlay.style.display = 'none';
        overlay = false;
    });

    worksOverlay.addEventListener('click', function (e) {
        if (e.target === worksOverlay) {
            worksOverlay.style.display = 'none';
            overlay = false;
        }
    });

    function positionSkillTitle(targetBox, skillTitleElement) {
        const boxRect = targetBox.getBoundingClientRect();
        skillTitleElement.textContent = Array.from(targetBox.classList).find(className => className.startsWith('skill-'))?.replace('skill-', '') || null;
        skillTitleElement.style.position = 'absolute';
        skillTitleElement.style.left = `${boxRect.left + boxRect.width / 2}px`;
        skillTitleElement.style.top = `${boxRect.top - skillTitleElement.offsetHeight - 10}px`;
        skillTitleElement.style.transform = 'translateX(-50%)';
        skillTitleElement.style.opacity = '1';
        skillTitleElement.style.visibility = 'visible';
    }

    function resetSkillTitlePosition(skillTitleElement) {
        skillTitleElement.style.opacity = '0';
        skillTitleElement.style.visibility = 'hidden';
        skillTitleElement.style.position = '';
        skillTitleElement.style.left = '';
        skillTitleElement.style.top = '';
        skillTitleElement.style.transform = '';
    }

    resetSkillTitlePosition(skillTitle);

    viewAllBtn.addEventListener('click', function (e) {
        e.preventDefault();
        worksOverlay.style.display = 'flex';
        overlay = true;
    });
    closeBtn.addEventListener('click', function () {
        worksOverlay.style.display = 'none';
        overlay = false;
    });

    worksOverlay.addEventListener('click', function (e) {
        if (e.target === worksOverlay) {
            worksOverlay.style.display = 'none';
            overlay = false;
        }
    });
    const updateActiveDot = () => {
        dots.forEach(dot =>
            dot.classList.toggle('active', parseInt(dot.dataset.index, 10) === currentIdx)
        );
    };

    const goTo = (idx) => {
        if (idx < 0 || idx >= total) return;
        isAutoScrolling = true;
        currentIdx = idx;
        updateActiveDot();
        main.scrollTo({ top: idx * window.innerHeight, behavior: 'smooth' });
        setTimeout(() => isAutoScrolling = false, 800);
    };
    main.addEventListener('wheel', e => {
        if (overlay) return;
        e.preventDefault();
        if (isAutoScrolling || Math.abs(e.deltaY) < 30) return;
        console.log('Wheel event detected:', e.deltaY);
        if (e.deltaY > 0) goTo(currentIdx + 1);
        else if (e.deltaY < 0) goTo(currentIdx - 1);
    }, { passive: false });

    main.addEventListener('touchstart', e => {
        touchStartY = e.touches[0].clientY;
    }, { passive: false });

    main.addEventListener('touchmove', e => {
        e.preventDefault();
        if (isAutoScrolling) return;
        const deltaY = touchStartY - e.touches[0].clientY;
        if (Math.abs(deltaY) < 10) return;
        if (deltaY > 0) {
            goTo(currentIdx + 1);
            touchStartY = e.touches[0].clientY;
        } else {
            goTo(currentIdx - 1);
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: false });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.dataset.index, 10);
            if (!isAutoScrolling) goTo(idx);
        });
    });

    updateActiveDot();
    main.scrollTo({ top: 0, behavior: 'instant' });
});
function openAchievementDetail(achievementId) {
    const achievementUrls = {
        'webappcontest-winter-2025': 'https://progedu.github.io/webappcontest/2024/winter/entry/result.html',
        'atcoder-brown': 'https://atcoder.jp/users/tatuki912',
    };

    event.currentTarget.style.transform = 'scale(0.98)';
    setTimeout(() => {
        event.currentTarget.style.transform = '';
    }, 150);

    // Navigate to detail page after animation
    setTimeout(() => {
        if (achievementUrls[achievementId]) {
            window.open(achievementUrls[achievementId], '_blank');
        } else {
            console.log('Achievement detail page not found for:', achievementId);
        }
    }, 200);
}