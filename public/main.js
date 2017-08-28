// main.js

// firebase Database
var firebaseDB = firebase.database();
var tweetDBRef = firebaseDB.ref('tweet');

//DOM取得
var elm_logout			= document.getElementById('logout');
var elm_loginUserInfo	= document.getElementById('loginUserInfo');
var elm_tweetSubmit		= document.getElementById('newTweetSubmit');


var UNKNOWN_USER_NAME_DEFAULT = '名無しのごんべえ';


//=======================================================================
//ログアウト処理
elm_logout.addEventListener('click', function()
{
//	alert("logoutしました。");
	firebase.auth().signOut();
});


//=======================================================================
// つぶやき新規登録
elm_tweetSubmit.addEventListener('click', function()
{
	var userGUID = firebase.auth().currentUser.uid;
	var currentTime = GetCurrentTimestamp();

	tweetDBRef.push({
		tweet : $('#newTweet').val(),
		timestamp : currentTime.string,
		guid : userGUID
	}).then(function() {
		// push 成功
		$('#newTweet').val("");
	}, function(error) {
		// push 失敗
	});

});



//=======================================================================
function Snapshot(data)
{
	var val = data.val();
	var userGUID = val.guid;

	var userDisplayName = '---';
	var userImageURL = '';
	firebaseDB.ref('users/' + userGUID).once('value').then(function(snapshot)
	{
		if( snapshot.val() )
		{
			// GUIDのユーザ情報がデータベースから取得できた場合
			userImageURL = snapshot.val().userImageURL;
			userDisplayName = snapshot.val().displayName;
			EditTweetContent(data.key, userDisplayName, userImageURL, val.tweet, val.timestamp);
		}else{
			// GUIDのユーザ情報がデータベースから取得できなかった場合
			EditTweetContent(data.key, '', '', val.tweet, val.timestamp);
		}
	});
	AddTweetContent(data.key);
//	alert( val.tweet + ', \n' + data.key );

//	AlertAllProperty(val);
}
//=======================================================================
function AddTweetContent(tweetGUID)
{
	var tableStr =	'<table class="tweetContent">';
	tableStr +=		'  <tr>';
	tableStr +=		'    <td width="50" rowspan="2" align="center" valign="top"><div class="tweetUserImageURL_' + tweetGUID + '" /></div></td>';
	tableStr +=		'    <td class="userName"><div id="tweetUserName_' + tweetGUID +  '" /></div></td><td align="right" valign="bottom"><div id="tweetTimestamp_' + tweetGUID + '"></div></td>';
	tableStr +=		'  </tr>';
	tableStr +=		'  <tr>';
	tableStr +=		'    <td colspan="2"><div id="tweetContent_' + tweetGUID + '" /></div></td>';
	tableStr +=		'  </tr>';
	tableStr +=		'</table>';
	tableStr +=		'';
	tableStr +=		'';

	// 指定したdiv要素に表を加える
	document.getElementById('tweetContentDiv').innerHTML = tableStr + document.getElementById('tweetContentDiv').innerHTML;
}
//=======================================================================
function EditTweetContent(tweetGUID, displayName, imageURL, tweetContent, timestamp)
{
	// 画像
	if( imageURL != '' )
	{
		var $userImage = $( '.tweetUserImageURL_' + tweetGUID );
		$userImage.empty();

		var img = new Image();
		img.src = imageURL;
		var width = 50;
		var height = 50;
		if( img.width > img.height )
		{
			// 横長画像
			height = img.height * (width / img.width);
		}else{
			// 縦長画像
			width = img.width * (height / img.height);
		}
//		alert('width:' + width + '\nheight:' + height);
		$userImage.append($('<img>').attr({
			src: imageURL,
			width: width + 'px',
			height: height + 'px',
		}));
	}

	if( displayName == '' ) displayName = UNKNOWN_USER_NAME_DEFAULT;
	// 名前
	$('#tweetUserName_' + tweetGUID).text( displayName );

	// タイムスタンプ
	$('#tweetTimestamp_' + tweetGUID).text( timestamp );

	// つぶやき内容
//	alert( tweetContent );
	tweetContent = tweetContent.replace(/\r?\n/g, "<br>");
	$('#tweetContent_' + tweetGUID).html( tweetContent );
}

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
	if( !userName ) userName = UNKNOWN_USER_NAME_DEFAULT;

	elm_loginUserInfo.textContent = "ようこそ「" + userName + "」さん";
//	alert(user.displayName);

	// 画像
	var $currentUserImage = $(".userImage");
	$currentUserImage.empty();
	var img = new Image();
	img.src = user.photoURL;
	var width = 100;
	var height = 100;
	if( img.width > img.height )
	{
		// 横長画像
		height = img.height * (width / img.width);
	}else{
		// 縦長画像
		width = img.width * (height / img.height);
	}
//	alert('width:' + width + '\nheight:' + height);
	$currentUserImage.append($('<img>').attr({
		src: user.photoURL,
		width: width + 'px',
		height: height + 'px',
		class: "userImage",
	}));


	// ツイート情報を取得
	tweetDBRef.limitToLast(12).on('child_added', Snapshot);
	tweetDBRef.limitToLast(12).on('child_changed', Snapshot);
//	tweetDBRef.limitToLast(12).on('value', Snapshot);
});


