// main.js

// firebase Database
var firebaseDB = firebase.database();
var tweetDBRef = firebaseDB.ref('tweet');


//=======================================================================
//認証状態の確認
firebase.auth().onAuthStateChanged(function(user)
{
	if( !user )
	{
		AutoLink("./index.html");
		return;
	}
	
	// 以下、ログインできている場合の処理。

	// ログイン情報取得
//	AlertAllProperty( user );
	var userName = user.displayName;
	if( !userName ){
		AutoLink("./profile/profile.html");
		return;
	}

	// ユーザ情報をヘッダに登録
	SetHeaderUserInfo(user);
});


