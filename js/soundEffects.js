/**
 * えほんのくに - 効果音管理スクリプト
 */

// 効果音のプリロード
const soundEffects = {
    click: new Audio('assets/audio/click.mp3'),
    select: new Audio('assets/audio/select.mp3'),
    complete: new Audio('assets/audio/complete.mp3'),
    success: new Audio('assets/audio/success.mp3'),
    save: new Audio('assets/audio/save.mp3')
};

// ボリューム設定
Object.values(soundEffects).forEach(sound => {
    sound.volume = 0.5;
});

// 効果音を再生
function playSound(soundName) {
    // ミュートしているかチェック
    const muted = localStorage.getItem('sound-muted') === 'true';
    if (muted) return;
    
    const sound = soundEffects[soundName];
    if (sound) {
        try {
            // 現在再生中の場合は停止して初めから再生
            sound.pause();
            sound.currentTime = 0;
            sound.play();
        } catch (e) {
            console.log('効果音の再生に失敗しました:', e);
        }
    }
}