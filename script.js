

    // 共通要素取得
    const popupWrapper = document.getElementById('popup-wrapper');
    const closeBtn = document.getElementById('close');
    const confirmBtn = document.getElementById('confirm');
    const incBtn = document.getElementById('inc-btn');
    const decBtn = document.getElementById('dec-btn');
    const valueEl = document.getElementById('value');
    const popupTitle = document.getElementById('popup-title');
    // 現在操作中のコンテキスト
    let current = {
      key: null,
      targetEl: null,
      count: 0,
      staging: 0
    };
    // localStorage ユーティリティ
    function loadCount(key, fallback = 0) {
      try {
        const raw = localStorage.getItem(key);
        if (raw !== null) {
          const n = Number(raw);
          return Number.isFinite(n) ? n : fallback;
        }
      } catch (e) {
        // private mode 等で失敗する可能性
      }
      return fallback;
    }
    function saveCount(key, n) {
      try {
        localStorage.setItem(key, String(n));
      } catch (e) { /* 無視 */ }
    }
    function updateTargetDisplay(targetEl, n) {
      if (targetEl) targetEl.textContent = String(n);
    }
    // ポップアップを開く（ボタン要素を渡す）
    function openPopupFor(button) {
      const key = button.dataset.key;
      const targetId = button.dataset.target;
      const targetEl = document.getElementById(targetId);
      current.key = key || null;
      current.targetEl = targetEl;
      const fallback = targetEl ? Number(targetEl.textContent) || 0 : 0;
      current.count = loadCount(current.key || '', fallback);
      current.staging = current.count;
      popupTitle.textContent = (button.closest('.card')?.querySelector('.item-name')?.textContent) || button.textContent || '編集';
      valueEl.textContent = String(current.staging);
      popupWrapper.style.display = 'flex';
    }
    // ポップアップの表示更新
    function updatePopupDisplay() {
      valueEl.textContent = String(current.staging);
    }
    function increase() {
      current.staging++;
      updatePopupDisplay();
    }
    function decrease() {
      if (current.staging > 0) {
        current.staging--;
        updatePopupDisplay();
      }
    }
    // 初期化：ボタンにイベント付与
    document.querySelectorAll('.open-popup').forEach(btn => {
      btn.addEventListener('click', () => openPopupFor(btn));
    });
    // ポップアップ外クリックで閉じる（キャンセル）
    popupWrapper.addEventListener('click', e => {
      if (e.target === popupWrapper) {
        popupWrapper.style.display = 'none';
      }
    });
    // × ボタン
    closeBtn.addEventListener('click', () => {
      popupWrapper.style.display = 'none';
    });
    // 決定ボタン
    confirmBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!current.key) {
        popupWrapper.style.display = 'none';
        return;
      }
      current.count = current.staging;
      saveCount(current.key, current.count);
      updateTargetDisplay(current.targetEl, current.count);
      popupWrapper.style.display = 'none';
      current.key = null;
      current.targetEl = null;
    });
    // カウント操作
    incBtn.addEventListener('click', increase);
    decBtn.addEventListener('click', decrease);
    // ページ読み込み時に localStorage を反映
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.open-popup').forEach(btn => {
        const key = btn.dataset.key;
        const targetId = btn.dataset.target;
        const targetEl = document.getElementById(targetId);
        if (!key || !targetEl) return;
        const n = loadCount(key, Number(targetEl.textContent) || 0);
        updateTargetDisplay(targetEl, n);
      });
    });