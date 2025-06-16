document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    const dots = document.querySelectorAll('.dot');
    const total = dots.length;
    let currentIdx = 0;
    let isAutoScrolling = false;
    let touchStartY = 0;
    document.querySelectorAll(".glow-box").forEach(box => {
        box.addEventListener('mouseover', () => {
            box.classList.add('glow');
        });
    })
    const viewAllBtn = document.querySelector('.view-all-btn');
    const worksOverlay = document.getElementById('works-overlay');
    const closeBtn = document.querySelector('.close-btn');

    // View All ボタンがクリックされたらオーバーレイを表示
    viewAllBtn.addEventListener('click', function(e) {
        e.preventDefault();
        worksOverlay.style.display = 'flex';
    });

    // 閉じるボタンがクリックされたらオーバーレイを非表示
    closeBtn.addEventListener('click', function() {
        worksOverlay.style.display = 'none';
    });

    // オーバーレイの外側をクリックしたら非表示（オプション）
    worksOverlay.addEventListener('click', function(e) {
        if (e.target === worksOverlay) {
            worksOverlay.style.display = 'none';
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
        setTimeout(() => isAutoScrolling = false, 400);
    };
    main.addEventListener('wheel', e => {
        e.preventDefault();
        if (isAutoScrolling) return;
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

    // ドットをクリックしたとき
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.dataset.index, 10);
            if (!isAutoScrolling) goTo(idx);
        });
    });

    updateActiveDot();
    main.scrollTo({ top: 0, behavior: 'instant' });
});
