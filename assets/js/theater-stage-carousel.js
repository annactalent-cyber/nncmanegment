// theater-stage-carousel.js - High-Performance 4-Card Stage Carousel Controller

(function() {
  let allTalents = [];
  let filteredTalents = [];
  let currentGroupIndex = 0;
  let totalGroups = 1;
  let currentFilter = 'all';
  let controlsInitialized = false;

  const viewport = document.getElementById('stageViewport');
  const track = document.getElementById('stageTrack');
  const btnPrev = document.getElementById('stageBtnPrev');
  const btnNext = document.getElementById('stageBtnNext');
  const counterCurrent = document.getElementById('stageCurrentCounter');
  const counterTotal = document.getElementById('stageTotalCounter');
  const dotsContainer = document.getElementById('stageDotsContainer');

  // Extract initial static cards data from DOM if present
  function extractStaticTalents() {
    const rawCards = document.querySelectorAll('.stage-talent-card');
    const talents = [];
    rawCards.forEach((card) => {
      const name = card.dataset.name || card.querySelector('.card-name')?.textContent?.trim() || '';
      const slug = card.getAttribute('href')?.replace('.html', '') || '';
      const tag = card.querySelector('.card-badge')?.textContent?.trim() || 'Oyuncu / Talent';
      const cat = card.dataset.category || 'talent';
      const img = card.querySelector('img')?.getAttribute('src') || '';
      talents.push({ name, slug, tag, cat, img });
    });
    return talents;
  }

  function sortTalentsAlphabetically(list) {
    return list.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  }

  function renderStageGroups() {
    if (!track) return;

    // Filter talents
    if (currentFilter === 'all') {
      filteredTalents = [...allTalents];
    } else {
      filteredTalents = allTalents.filter(t => t.cat.toLowerCase().includes(currentFilter));
    }

    const cardsPerGroup = 4;
    totalGroups = Math.max(1, Math.ceil(filteredTalents.length / cardsPerGroup));
    if (currentGroupIndex >= totalGroups) {
      currentGroupIndex = 0;
    }

    // Build HTML for each group of 4
    let groupsHtml = '';
    for (let g = 0; g < totalGroups; g++) {
      const startIdx = g * cardsPerGroup;
      const groupCards = filteredTalents.slice(startIdx, startIdx + cardsPerGroup);
      
      let cardsHtml = '';
      groupCards.forEach(t => {
        const href = `${t.slug}.html`;
        cardsHtml += `
          <a href="${href}" class="stage-talent-card" data-category="${t.cat}" data-name="${t.name.toLowerCase()}">
            <div class="card-photo-box">
              <span class="card-badge">${t.tag}</span>
              <img src="${t.img}" onerror="this.src='upload/product_gallery/product_gallery_2024-05-17_16-10-38.jpg'" alt="${t.name}" loading="lazy">
              <div class="card-info-overlay">
                <h3 class="card-name">${t.name}</h3>
                <span class="card-btn"><span>Profili İncele</span> <i class="fa fa-arrow-right"></i></span>
              </div>
            </div>
          </a>
        `;
      });

      const isActive = g === currentGroupIndex ? 'active' : '';
      groupsHtml += `<div class="stage-card-group ${isActive}" data-group="${g}">${cardsHtml}</div>`;
    }

    track.innerHTML = groupsHtml;

    // Update pagination dots
    if (dotsContainer) {
      let dotsHtml = '';
      for (let i = 0; i < totalGroups; i++) {
        const activeClass = i === currentGroupIndex ? 'active' : '';
        dotsHtml += `<button class="stage-dot ${activeClass}" data-index="${i}" aria-label="Grup ${i+1}"></button>`;
      }
      dotsContainer.innerHTML = dotsHtml;

      dotsContainer.querySelectorAll('.stage-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
          const idx = parseInt(e.target.dataset.index, 10);
          goToGroup(idx);
        });
      });
    }

    updateTrackPosition();
    updateHUD();
  }

  function updateTrackPosition() {
    if (!track) return;
    track.style.transform = `translateX(-${currentGroupIndex * 100}%)`;

    const groups = track.querySelectorAll('.stage-card-group');
    groups.forEach((grp, idx) => {
      if (idx === currentGroupIndex) {
        grp.classList.add('active');
      } else {
        grp.classList.remove('active');
      }
    });

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.stage-dot');
      dots.forEach((dot, idx) => {
        if (idx === currentGroupIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  }

  function updateHUD() {
    if (counterCurrent) {
      counterCurrent.textContent = String(currentGroupIndex + 1).padStart(2, '0');
    }
    if (counterTotal) {
      counterTotal.textContent = String(totalGroups).padStart(2, '0');
    }
  }

  function goToGroup(index) {
    if (index < 0) {
      currentGroupIndex = totalGroups - 1;
    } else if (index >= totalGroups) {
      currentGroupIndex = 0;
    } else {
      currentGroupIndex = index;
    }
    updateTrackPosition();
    updateHUD();
  }

  function initControls() {
    if (controlsInitialized) return;
    controlsInitialized = true;

    if (btnPrev) {
      btnPrev.addEventListener('click', () => goToGroup(currentGroupIndex - 1));
    }
    if (btnNext) {
      btnNext.addEventListener('click', () => goToGroup(currentGroupIndex + 1));
    }

    // Keyboard Arrow Keys
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goToGroup(currentGroupIndex - 1);
      if (e.key === 'ArrowRight') goToGroup(currentGroupIndex + 1);
    });

    // Touch and Mouse Drag Support
    let startX = 0;
    let isDragging = false;

    if (viewport) {
      viewport.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        if (Math.abs(diffX) > 45) {
          if (diffX > 0) goToGroup(currentGroupIndex + 1);
          else goToGroup(currentGroupIndex - 1);
        }
        isDragging = false;
      }, { passive: true });

      viewport.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
      });

      viewport.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        const endX = e.clientX;
        const diffX = startX - endX;
        if (Math.abs(diffX) > 50) {
          if (diffX > 0) goToGroup(currentGroupIndex + 1);
          else goToGroup(currentGroupIndex - 1);
        }
        isDragging = false;
      });
    }

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.stage-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter || 'all';
        currentGroupIndex = 0;
        renderStageGroups();
      });
    });
  }

  window.initTheaterStageCarousel = function(customTalents = null) {
    if (customTalents && customTalents.length > 0) {
      allTalents = sortTalentsAlphabetically(customTalents);
    } else {
      const staticList = extractStaticTalents();
      allTalents = sortTalentsAlphabetically(staticList);
    }

    initControls();
    renderStageGroups();
  };
})();
