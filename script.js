/* ===== v2 (2026-10-07) =====
   通常スクロールに変更したので、ページ送り（idx * innerHeight）は廃止。
   現在地の表示だけを IntersectionObserver で行う。
   ホイール／タッチの preventDefault も撤去したので、内容が長くても読める。
*/
document.addEventListener('DOMContentLoaded', () => {
    /* --- 現在地ドット --- */
    const dots = [...document.querySelectorAll('.page-indicator .dot')];
    const sections = [...document.querySelectorAll('main > section')];
    const byId = new Map(dots.map(d => [d.dataset.target, d]));

    const setActive = (id) => {
        dots.forEach(d => d.classList.toggle('active', d.dataset.target === id));
    };

    if ('IntersectionObserver' in window && sections.length) {
        const visible = new Map();
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
            let best = null, bestR = 0;
            visible.forEach((r, id) => { if (r > bestR) { bestR = r; best = id; } });
            if (best) setActive(best);
        }, { threshold: [0, 0.15, 0.35, 0.6, 0.85, 1] });
        sections.forEach(s => io.observe(s));
        setActive(sections[0].id);
    }

    /* ドットをクリックしたらその節へ（href でも動くが、履歴を汚さないように任せる） */
    dots.forEach(d => {
        d.addEventListener('click', () => setActive(d.dataset.target));
    });

    /* --- スキルのアイコンにカーソルを載せたときのラベル --- */
    const skillTitle = document.querySelector('.skill-title');
    const resetSkillTitlePosition = (el) => {
        if (!el) return;
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
        el.style.position = '';
        el.style.left = '';
        el.style.top = '';
        el.style.transform = '';
    };
    const positionSkillTitle = (box, el) => {
        if (!el) return;
        const r = box.getBoundingClientRect();
        const name = [...box.classList].find(c => c.startsWith('skill-'));
        el.textContent = name ? name.replace('skill-', '') : '';
        el.style.position = 'fixed';
        el.style.left = `${r.left + r.width / 2}px`;
        el.style.top = `${r.top - el.offsetHeight - 10}px`;
        el.style.transform = 'translateX(-50%)';
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    };

    document.querySelectorAll('.glow-box').forEach(box => {
        box.addEventListener('mouseenter', () => { box.classList.add('glow'); positionSkillTitle(box, skillTitle); });
        box.addEventListener('mouseleave', () => { box.classList.remove('glow'); resetSkillTitlePosition(skillTitle); });
        box.addEventListener('touchstart', (e) => {
            box.classList.add('glow'); positionSkillTitle(box, skillTitle); e.preventDefault();
        }, { passive: false });
        box.addEventListener('touchend', () => { box.classList.remove('glow'); resetSkillTitlePosition(skillTitle); });
    });
    resetSkillTitlePosition(skillTitle);
});

/* 受賞カードをクリックしたときの詳細リンク */
function openAchievementDetail(achievementId) {
    const urls = {
        'webappcontest-winter-2025': 'https://progedu.github.io/webappcontest/2024/winter/entry/result.html',
        'atcoder-brown': 'https://atcoder.jp/users/tatuki912',
        'gakuryoku-2025': 'https://www.gakuryokuup.com/%E5%8F%97%E8%B3%9E%E4%BD%9C%E5%93%81',
        'webappcontest-summer-2025': 'https://progedu.github.io/webappcontest/2025/summer/result/index.html'
    };
    const url = urls[achievementId];
    if (url) window.open(url, '_blank', 'noopener');
}
