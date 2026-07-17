document.addEventListener('DOMContentLoaded', function() {
    const btn = document.querySelector('.btn-generate-setcard');
    if (!btn) return;

    // Kart geometrisi (indirilen PNG = CARD boyutu x2 = 2200x1600)
    const CARD_W = 1100;
    const CARD_H = 800;
    const FRAME_W = CARD_W * 0.6; // .setcard-left genişliği
    const FRAME_H = CARD_H;
    const ZOOM_MIN = 1;
    const ZOOM_MAX = 3;

    function slugify(name) {
        const map = { 'ç':'c','Ç':'c','ğ':'g','Ğ':'g','ı':'i','İ':'i','I':'i','ö':'o','Ö':'o','ş':'s','Ş':'s','ü':'u','Ü':'u' };
        return name.replace(/[çÇğĞıİIöÖşŞüÜ]/g, function(ch) { return map[ch] || ch; })
            .toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
    }

    function buildCard(actorName, imgSrc, detailsHtml) {
        const card = document.createElement('div');
        card.className = 'setcard-card';
        card.innerHTML =
            '<div class="setcard-left">' +
                '<img src="' + imgSrc + '" crossorigin="anonymous" alt="' + actorName + '" draggable="false">' +
                '<span class="setcard-drag-hint">Sürükleyerek konumlandırın</span>' +
            '</div>' +
            '<div class="setcard-right">' +
                '<img src="assets/images/logo.svg" alt="NNC Management" class="setcard-logo">' +
                '<div class="setcard-name">' + actorName + '</div>' +
                '<ul class="setcard-details">' + detailsHtml + '</ul>' +
                '<div class="setcard-footer">' +
                    '<p><strong>NNC Management</strong><br>' +
                    'Email: annactalent@gmail.com<br>' +
                    'Tel: +90 551 533 72 69<br>' +
                    'İzmir / Türkiye</p>' +
                '</div>' +
            '</div>';
        return card;
    }

    btn.addEventListener('click', function(e) {
        e.preventDefault();

        const nameElement = document.querySelector('.bt-authorimgname a');
        const imgElement = document.querySelector('.bt-featuredimg img');

        if (!nameElement || !imgElement) {
            alert('Oyuncu bilgileri bulunamadı.');
            return;
        }

        const actorName = nameElement.innerText.trim();

        const detailsItems = document.querySelectorAll('.bt-clientinfo li');
        let detailsHtml = '';
        detailsItems.forEach(function(item) {
            const label = item.querySelector('span') ? item.querySelector('span').innerText.replace(':', '').trim() : '';
            const value = item.querySelector('strong') ? item.querySelector('strong').innerText.trim() : '';
            if (label && value) {
                detailsHtml += '<li><span>' + label + '</span><strong>' + value + '</strong></li>';
            }
        });

        openEditor(actorName, imgElement.src, detailsHtml);
    });

    function openEditor(actorName, initialSrc, detailsHtml) {
        // Aynı anda tek modal
        const existing = document.querySelector('.setcard-modal');
        if (existing) existing.remove();

        const state = {
            imgSrc: initialSrc,
            naturalW: 0,
            naturalH: 0,
            zoom: 1,
            offX: 0,
            offY: 0,
            previewScale: 1,
            hintDismissed: false
        };

        const modal = document.createElement('div');
        modal.className = 'setcard-modal';
        modal.innerHTML =
            '<div class="setcard-modal-inner">' +
                '<div class="setcard-modal-head">' +
                    '<strong>Setcard Önizleme</strong>' +
                    '<span>Fotoğrafı sürükleyerek konumlandırın · kaydırıcı veya fare tekerleğiyle yakınlaştırın</span>' +
                '</div>' +
                '<div class="setcard-preview-wrap">' +
                    '<div class="setcard-scale-box"></div>' +
                '</div>' +
                '<div class="setcard-modal-controls">' +
                    '<label class="setcard-zoom-label">Yakınlaştırma' +
                        '<input type="range" class="setcard-zoom-range" min="100" max="300" step="1" value="100">' +
                        '<span class="setcard-zoom-value">100%</span>' +
                    '</label>' +
                    '<div class="setcard-modal-buttons">' +
                        '<button type="button" class="setcard-ctrl-btn" data-act="photo"><i class="fa fa-image"></i> Fotoğraf Değiştir</button>' +
                        '<button type="button" class="setcard-ctrl-btn" data-act="reset"><i class="fa fa-refresh"></i> Sıfırla</button>' +
                        '<button type="button" class="setcard-ctrl-btn setcard-ctrl-primary" data-act="download"><i class="fa fa-download"></i> İndir</button>' +
                        '<button type="button" class="setcard-ctrl-btn" data-act="close">Kapat</button>' +
                    '</div>' +
                    '<input type="file" class="setcard-file-input" accept="image/*" hidden>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        const scaleBox = modal.querySelector('.setcard-scale-box');
        const previewWrap = modal.querySelector('.setcard-preview-wrap');
        const slider = modal.querySelector('.setcard-zoom-range');
        const zoomValue = modal.querySelector('.setcard-zoom-value');
        const fileInput = modal.querySelector('.setcard-file-input');

        const card = buildCard(actorName, state.imgSrc, detailsHtml);
        scaleBox.appendChild(card);

        const frame = card.querySelector('.setcard-left');
        const photo = frame.querySelector('img');
        const hint = frame.querySelector('.setcard-drag-hint');

        function baseScale() {
            return Math.max(FRAME_W / state.naturalW, FRAME_H / state.naturalH);
        }

        function dispSize() {
            const s = baseScale() * state.zoom;
            return { w: state.naturalW * s, h: state.naturalH * s };
        }

        function clampOffsets() {
            const d = dispSize();
            state.offX = Math.min(0, Math.max(FRAME_W - d.w, state.offX));
            state.offY = Math.min(0, Math.max(FRAME_H - d.h, state.offY));
        }

        function applyImage() {
            const d = dispSize();
            photo.style.width = d.w + 'px';
            photo.style.left = state.offX + 'px';
            photo.style.top = state.offY + 'px';
        }

        function centerImage() {
            const d = dispSize();
            state.offX = (FRAME_W - d.w) / 2;
            state.offY = (FRAME_H - d.h) / 2;
            applyImage();
        }

        function setZoom(z, fromSlider) {
            z = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
            if (!state.naturalW) return;
            const oldScale = baseScale() * state.zoom;
            const newScale = baseScale() * z;
            const cx = FRAME_W / 2, cy = FRAME_H / 2;
            state.offX = cx - ((cx - state.offX) / oldScale) * newScale;
            state.offY = cy - ((cy - state.offY) / oldScale) * newScale;
            state.zoom = z;
            clampOffsets();
            applyImage();
            const pct = Math.round(z * 100);
            zoomValue.textContent = pct + '%';
            if (!fromSlider) slider.value = pct;
        }

        function layout() {
            const availW = previewWrap.clientWidth - 24;
            const availH = previewWrap.clientHeight - 24;
            const s = Math.max(0.1, Math.min(availW / CARD_W, availH / CARD_H, 1));
            state.previewScale = s;
            card.style.transform = 'scale(' + s + ')';
            scaleBox.style.width = (CARD_W * s) + 'px';
            scaleBox.style.height = (CARD_H * s) + 'px';
        }

        function dismissHint() {
            if (!state.hintDismissed && hint) {
                state.hintDismissed = true;
                hint.style.opacity = '0';
            }
        }

        function loadPhoto(src, onFail) {
            const probe = new Image();
            probe.onload = function() {
                state.imgSrc = src;
                state.naturalW = probe.naturalWidth;
                state.naturalH = probe.naturalHeight;
                state.zoom = 1;
                slider.value = 100;
                zoomValue.textContent = '100%';
                photo.src = src;
                centerImage();
            };
            probe.onerror = function() {
                if (onFail) onFail();
            };
            probe.src = src;
        }

        // --- Sürükleme ---
        let dragging = false, startX = 0, startY = 0, startOffX = 0, startOffY = 0;

        frame.addEventListener('pointerdown', function(ev) {
            if (!state.naturalW) return;
            ev.preventDefault();
            dragging = true;
            frame.setPointerCapture(ev.pointerId);
            startX = ev.clientX;
            startY = ev.clientY;
            startOffX = state.offX;
            startOffY = state.offY;
            frame.classList.add('setcard-dragging');
            dismissHint();
        });

        frame.addEventListener('pointermove', function(ev) {
            if (!dragging) return;
            state.offX = startOffX + (ev.clientX - startX) / state.previewScale;
            state.offY = startOffY + (ev.clientY - startY) / state.previewScale;
            clampOffsets();
            applyImage();
        });

        function endDrag(ev) {
            if (!dragging) return;
            dragging = false;
            frame.classList.remove('setcard-dragging');
            try { frame.releasePointerCapture(ev.pointerId); } catch (err) {}
        }
        frame.addEventListener('pointerup', endDrag);
        frame.addEventListener('pointercancel', endDrag);

        frame.addEventListener('wheel', function(ev) {
            ev.preventDefault();
            dismissHint();
            setZoom(state.zoom * (ev.deltaY < 0 ? 1.06 : 1 / 1.06));
        }, { passive: false });

        slider.addEventListener('input', function() {
            dismissHint();
            setZoom(parseInt(slider.value, 10) / 100, true);
        });

        // --- Butonlar ---
        modal.addEventListener('click', function(ev) {
            const actBtn = ev.target.closest('[data-act]');
            if (!actBtn) return;
            const act = actBtn.getAttribute('data-act');
            if (act === 'close') closeModal();
            else if (act === 'reset') { state.zoom = 1; slider.value = 100; zoomValue.textContent = '100%'; centerImage(); }
            else if (act === 'photo') fileInput.click();
            else if (act === 'download') download(actBtn);
        });

        fileInput.addEventListener('change', function() {
            const file = fileInput.files && fileInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function() {
                loadPhoto(reader.result, function() {
                    alert('Seçilen dosya açılamadı.');
                });
            };
            reader.readAsDataURL(file);
            fileInput.value = '';
        });

        function onKeyDown(ev) {
            if (ev.key === 'Escape') closeModal();
        }
        document.addEventListener('keydown', onKeyDown);
        window.addEventListener('resize', layout);

        function closeModal() {
            document.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('resize', layout);
            document.body.style.overflow = '';
            modal.remove();
        }

        // --- İndir ---
        function download(dlBtn) {
            if (typeof html2canvas === 'undefined') {
                alert('Gerekli kütüphane yüklenemedi (html2canvas). Lütfen sayfayı yenileyip tekrar deneyin.');
                return;
            }
            const originalHtml = dlBtn.innerHTML;
            dlBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Oluşturuluyor...';
            dlBtn.disabled = true;

            const holder = document.createElement('div');
            holder.id = 'setcard-template-container';
            const clone = card.cloneNode(true);
            clone.style.transform = 'none';
            const cloneHint = clone.querySelector('.setcard-drag-hint');
            if (cloneHint) cloneHint.remove();
            holder.appendChild(clone);
            document.body.appendChild(holder);

            const imgs = Array.prototype.slice.call(clone.querySelectorAll('img'));
            Promise.all(imgs.map(function(im) {
                return im.complete ? Promise.resolve() : new Promise(function(res) {
                    im.onload = res;
                    im.onerror = res;
                });
            })).then(function() {
                return new Promise(function(res) { setTimeout(res, 100); });
            }).then(function() {
                return html2canvas(clone, {
                    useCORS: true,
                    allowTaint: false,
                    scale: 2,
                    backgroundColor: '#000000',
                    logging: false
                });
            }).then(function(canvas) {
                const link = document.createElement('a');
                link.download = slugify(actorName) + '-setcard.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch(function(err) {
                console.error('Error generating setcard:', err);
                alert('Setcard oluşturulurken bir hata oluştu.');
            }).then(function() {
                holder.remove();
                dlBtn.innerHTML = originalHtml;
                dlBtn.disabled = false;
            });
        }

        // --- Başlat ---
        layout();
        loadPhoto(state.imgSrc, function() {
            closeModal();
            alert('Fotoğraf yüklenemedi, bu nedenle setcard oluşturulamıyor.');
        });
    }
});
