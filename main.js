import liff from '@line/liff';

// Netlifyの環境変数（VITE_から始まる必要がある）からLIFF IDを取得
// const MY_LIFF_ID = import.meta.env.VITE_LIFF_ID;
const MY_LIFF_ID = '2010577631-ygDmcL2g'; // ここにLIFF IDを直接記述することも可能です

async function initLiff() {
    try {
        // LIFFの初期化
        await liff.init({ liffId: MY_LIFF_ID });

        // ログインチェック
        if (!liff.isLoggedIn()) {
            liff.login();
            return;
        }

        // 初期化が完了したら画面を表示
        document.getElementById('loading').style.display = 'none';
        document.getElementById('app-content').style.display = 'block';

        // 各ボタンにクリックイベントを設定
        const buttons = document.querySelectorAll('.btn-condition');
        buttons.forEach(button => {
            button.addEventListener('click', async () => {
                const status = button.getAttribute('data-status');
                await sendLiffMessage(status);
            });
        });

    } catch (error) {
        console.error('LIFF初期化エラー:', error);
        document.getElementById('loading').innerText = '初期化に失敗しました。';
    }
}

// トーク画面へメッセージを送信する関数
async function sendLiffMessage(selectedText) {
    if (!liff.isInClient()) {
        alert('LINEアプリ内のトーク画面から開いてください。');
        return;
    }

    try {
        await liff.sendMessages([
            {
                type: 'text',
                text: `体調ステータス: ${selectedText}`
            }
        ]);
        // 送信したら自動でLIFFを閉じる
        liff.closeWindow();
    } catch (error) {
        console.error('送信失敗:', error);
        alert('メッセージ送信に失敗しました。');
    }
}

// 実行
initLiff();