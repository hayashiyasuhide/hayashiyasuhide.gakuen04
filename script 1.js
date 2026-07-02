
// 共通ポップアップ要素
const popupWrapper = document.getElementById('popup-wrapper');
const closeBtn = document.getElementById('close');
const confirmBtn = document.getElementById('confirm');
const incBtn = document.getElementById('inc-btn');
const decBtn = document.getElementById('dec-btn');
const valueEl = document.getElementById('value');
const popupTitle = document.getElementById('popup-title');
// 現在操作中のコンテキスト
let current = {
  key: null,       // localStorageキー（例: stock_ink_black）
  targetEl: null,  // 対応する表示セル要素
  count: 0,        // 保存済みの本体値
  staging: 0       // ポップアップ内で編集中の一時値
};
// ユーティリティ：ローカルストレージ読み書き
function loadCount(key, fallback = 0) {
  const raw = localStorage.getItem(key);
  if (raw !== null) {
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}
function saveCount(key, n) {
  localStorage.setItem(key, String(n));
}
function updateTargetDisplay(targetEl, n) {
  if (targetEl) targetEl.textContent = String(n);
}
// ポップアップ表示用に current をセットして開く
function openPopupFor(button) {
  const key = button.dataset.key;
  const targetId = button.dataset.target;
  const targetEl = document.getElementById(targetId);
  current.key = key;
  current.targetEl = targetEl;
  // 本体の値はストレージ→fallbackは DOM に書かれた初期値
  current.count = loadCount(key, Number(targetEl?.textContent) || 0);
  current.staging = current.count;
  // ポップアップ見た目を更新
  popupTitle.textContent = button.textContent || '編集';
  valueEl.textContent = String(current.staging);
  popupWrapper.style.display = 'flex';
}
// ポップアップ内の表示更新（staging を表示）
function updatePopupDisplay() {
  valueEl.textContent = String(current.staging);
}
// 増減（staging を操作）
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
// 初期化：すべての .open-popup ボタンにイベント付与
document.querySelectorAll('.open-popup').forEach(btn => {
  btn.addEventListener('click', () => openPopupFor(btn));
});
// ポップアップ外クリック：キャンセルして閉じる（保存しない）
popupWrapper.addEventListener('click', e => {
  // popupWrapper が display:flex で、popup-inside が子要素
  if (e.target === popupWrapper) {
    popupWrapper.style.display = 'none';
    // staging は破棄（次回開くと再ロード）
  }
});
// × ボタン：キャンセルして閉じる（保存しない）
closeBtn.addEventListener('click', () => {
  popupWrapper.style.display = 'none';
});
// 決定ボタン：staging を本体に反映して保存、表示を更新
confirmBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (!current.key) return;
  current.count = current.staging;
  saveCount(current.key, current.count);
  updateTargetDisplay(current.targetEl, current.count);
  popupWrapper.style.display = 'none';
  // current を初期化しておく（任意）
  current.key = null;
  current.targetEl = null;
});
// カウンターボタン（ポップアップ内の staging を操作）
incBtn.addEventListener('click', increase);
decBtn.addEventListener('click', decrease);
// ページ読み込み時に、テーブルに localStorage の値があれば反映しておく
// （data-key を持つボタンを走査して各 target を更新）
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
