/**
 * 自由入力モード機能
 */

// 自由入力モードの開始
function startFreeMode() {
    console.log('自由入力モードを開始');
    
    // 画面切り替え
    hideAllScreens();
    document.getElementById('free-input-screen').classList.add('active');
    
    // 入力フィールドをクリア
    document.getElementById('story-input').value = '';
    updateNextButton();
    
    // フォーカス
    document.getElementById('story-input').focus();
}

// ヒントを使用
function useHint(hintText) {
    const input = document.getElementById('story-input');
    input.value = hintText;
    updateNextButton();
    
    // 効果音
    playSound('select');
}

// 次へボタンの有効/無効を更新
function updateNextButton() {
    const input = document.getElementById('story-input').value.trim();
    const nextBtn = document.querySelector('#free-input-screen .next-btn');
    
    if (input.length > 0) {
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }
}

// 入力内容を確認
function confirmFreeInput() {
    const input = document.getElementById('story-input').value.trim();
    
    if (input.length === 0) {
        alert('おはなしを かいてね！');
        return;
    }
    
    // 入力内容を保存
    window.storyCreationData = {
        mode: 'free',
        userInput: input,
        createdAt: new Date().toISOString()
    };
    
    // 確認画面を表示
    showConfirmationScreen();
    
    playSound('select');
}

// 確認画面を表示（自由入力用）
function showConfirmationScreen() {
    hideAllScreens();
    document.getElementById('confirmation-screen').classList.add('active');
    
    // 自由入力の確認表示
    document.getElementById('free-input-confirmation').style.display = 'block';
    document.getElementById('select-mode-confirmation').style.display = 'none';
    
    // 入力内容を表示
    document.getElementById('input-text-display').textContent = 
        window.storyCreationData.userInput;
}

// 入力フィールドのイベントリスナー
document.addEventListener('DOMContentLoaded', () => {
    const storyInput = document.getElementById('story-input');
    if (storyInput) {
        storyInput.addEventListener('input', updateNextButton);
        storyInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                confirmFreeInput();
            }
        });
    }
});

// 音声入力の開始（voiceInput.jsで実装）
function startVoiceInput() {
    if (typeof startVoiceRecognition === 'function') {
        startVoiceRecognition();
    } else {
        alert('おんせいにゅうりょくは じゅんびちゅうです');
    }
}