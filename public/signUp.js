// signUp.js


//=======================================================================
// 新規登録処理
$('#newuserSubmit')[0].addEventListener('click', function(e)
{
	$('#resultNewUser').empty();				// メッセージを空にする

	// メールアドレス・パスワードを取得
	var email = $('#newUserEmail').val();
	var displayName = $('#newUserDisplayName').val();

	// 適当なパスワードで新規ユーザーを登録
	var password = PasswordGenerator(32, '');
	firebase.auth().createUserWithEmailAndPassword(email, password).then(function()
	{
		// アカウント新規作成成功
		ResetPassword(email);					// パスワード設定メールを送る
	}, function(error) {
		// 登録に失敗した場合．．．
		if(error.code == 'auth/email-already-in-use') {
			// すでに登録済みなら, パスワード設定メールを送る
			ResetPassword(email);
		}else{
//			alert( error.code + "\n" + error.message );
			$('#resultNewUser').append('<li class="text-danger form-control">アカウントの作成に失敗しました。メールアドレスを確認して下さい。</li>');
		}
	});

}, false);

//=======================================================================
// エンターキー押下時
$('#newUserEmail').keypress(function(e){ if(e.which == 13){ $("#newuserSubmit").click(); } });

//=======================================================================
// パスワード設定処理
function ResetPassword(email)
{
	firebase.auth().signOut().then(function()
	{
		// ログアウト後にパスワードメールを送信
		firebase.auth().sendPasswordResetEmail(email).then(function()
		{
			// Email sent.
			$('#resultNewUser').append('<li class="text-success form-control">パスワードの設定メールを送りました。パスワードを設定してログインして下さい。</li>');
		}, function(error) {
			// An error happened.
//			alert( error.code + "\n" + error.message );
			$('#resultNewUser').append('<li class="text-danger form-control">アカウントの作成に失敗しました。メールアドレスを確認して下さい。</li>');
		});
	}).catch(function(error) {
		// エラー
	});
}


