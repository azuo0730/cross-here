// index_app.js


//=======================================================================
//ログイン処理
$('#login')[0].addEventListener('click', function(e)
{
	var email = $('#email').val();
	var password = $('#password').val();

	firebase.auth().signInWithEmailAndPassword(email, password)
	.catch(function(error){
		alert('ログインできません。\nメールアドレス・パスワードに間違いがないか、確認して下さい。\n\nErr Message:\n' + error.message);
	});
//	alert("[login.addEventListener]関数が呼ばれました。 mail[" + email + "], password[" + password + "]");
});

//=======================================================================
// エンターキー押下時
$('#email').keypress(function(e){ if(e.which == 13){ $("#login").click(); } });
$('#password').keypress(function(e){ if(e.which == 13){ $("#login").click(); } });





//=======================================================================
//認証状態の確認
firebase.auth().onAuthStateChanged(function(user)
{
	if(user) {
		loginDisplay();
	}
	else {
		logoutDisplay();
	}
});



//=======================================================================
function loginDisplay()
{
	AutoLink("./main.html");
}
//=======================================================================
function logoutDisplay()
{
}


