document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    const dots = document.querySelectorAll('.dot');
    const skillTitle = document.querySelector('.skill-title');
    const total = dots.length;
    let currentIdx = 0;
    let isAutoScrolling = false;
    let touchStartY = 0;

    const glowBoxes = document.querySelectorAll(".glow-box");
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
        window.scrollTo({ top: idx * window.innerHeight, behavior: 'smooth' });
        setTimeout(() => isAutoScrolling = false, 300);
    };
    main.addEventListener('wheel', e => {
        const timeline = e.target.closest('.timeline-container');
        if (timeline) {
            const maxScrollTop = timeline.scrollHeight - timeline.clientHeight;
            if ((e.deltaY < 0 && timeline.scrollTop > 0) ||
                (e.deltaY > 0 && timeline.scrollTop < maxScrollTop)) {
                return;
            }
        }
        e.preventDefault();
        if (isAutoScrolling || Math.abs(e.deltaY) < 30) return;
        if (e.deltaY > 0) goTo(currentIdx + 1);
        else if (e.deltaY < 0) goTo(currentIdx - 1);
    }, { passive: false });

    main.addEventListener('touchstart', e => {
        touchStartY = e.touches[0].clientY;
    }, { passive: false });

    main.addEventListener('touchmove', e => {
        const timeline = e.target.closest('.timeline-container');
        if (timeline) {
            const maxScrollTop = timeline.scrollHeight - timeline.clientHeight;
            if ((e.deltaY < 0 && timeline.scrollTop > 0) ||
                (e.deltaY > 0 && timeline.scrollTop < maxScrollTop)) {
                return;
            }
        }

        e.preventDefault();
        if (isAutoScrolling) return;
        const deltaY = touchStartY - e.touches[0].clientY;
        if (Math.abs(deltaY) < 30) return;
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