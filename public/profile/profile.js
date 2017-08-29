

// firebase Database
var firebaseDB = firebase.database();
// firebase Storage
var firebaseStrg = firebase.storage();


//=======================================================================
//ログアウト処理
$('#logout')[0].addEventListener('click', function()
{
//	alert("logoutしました。");
	firebase.auth().signOut();
});



//=======================================================================
// 編集反映
var profileUpdateState = 0;
$('#submit')[0].addEventListener('click', function(e)
{
	profileUpdateState = 0;						// 更新工程をクリア
	$('#resultNewUser').empty();				// メッセージを空にする

	var displayName = $('#displayName').val();
	var user = firebase.auth().currentUser;
	var userGUID = user.uid;
	var selfIntroStr = $('#selfIntro').val();
	var userImage = $('#userImage')[0].files[0];

	// 画像が選択されているならストレージにアップ
	var photoURL = user.photoURL;
	if( userImage != undefined )
	{
		// もとある画像フォルダを削除
		firebaseDB.ref('users/' + userGUID).once('value').then(function(snapshot) {
			if( snapshot.val() != null )
			{
				var userImagePath = snapshot.val().userImagePath;
				if( userImagePath != undefined )
				{
//					alert( userImagePath );
					firebaseStrg.ref().child( userImagePath ).delete();
				}
			}
		});

		// 画像をアップ
		var fileName = 'userImage.' + GetExtFromFileName(userImage.name);
		var uploadTask = firebaseStrg.ref().child('users/' + userGUID + '/' + fileName).put(userImage);
//		alert(fileName);
		
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
		function(snapshot) {
			// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			// var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		}, function(error) {
			// error
		}, function() {
			// Upload completed successfully, now we can get the download URL
			var downloadURL = uploadTask.snapshot.downloadURL;

			// アカウント情報更新
			user.updateProfile({
				displayName: displayName,
				photoURL: downloadURL,
			}).then(function() {
				// Update successful.
				CheckProfileUpdateState();
			}, function(error) {
				// An error happened.
			});

			// データベース内のプロフィール情報
			firebaseDB.ref('users/' + userGUID).update({
				userImagePath : 'users/' + userGUID + '/' + fileName,
				userImageURL : downloadURL,
				selfIntro : selfIntroStr,
				displayName: displayName,
			}).then(function() {
				// Update successful.
				CheckProfileUpdateState();
			}, function(error) {
				// An error happened.
			});
		});
	}else{
		// アカウント情報更新
		user.updateProfile({
			displayName: displayName,
		}).then(function() {
			// Update successful.
			CheckProfileUpdateState();
		}, function(error) {
			// An error happened.
		});

		// データベース内のプロフィール情報更新
		firebaseDB.ref('users/' + userGUID).update({
			selfIntro : selfIntroStr,
			displayName: displayName,
		}).then(function() {
			// Update successful.
			CheckProfileUpdateState();
		}, function(error) {
			// An error happened.
		});
	}
}, false);


//=======================================================================
//認証状態の確認
firebase.auth().onAuthStateChanged(function(user)
{
//	alert( 'onAuthStateChanged' );
	if( !user )
	{
		AutoLink("../index.html");
		return;
	}

	// ログイン中の処理
	RefreshProfile();
});

//=======================================================================
function CheckProfileUpdateState()
{
	profileUpdateState++;
	if( profileUpdateState == 2 )
	{
		// プロフィール更新, 全工程成功!!
		$('#resultNewUser').append('<li class="text-success form-control">プロフィールの更新に成功しました。</li>');
		RefreshProfileSnapshot(null);
	}
}

//=======================================================================
function RefreshProfileSnapshot(data)
{
//	alert( 'RefreshProfileSnapshot' );
	if( data != null && data.val() != null )
	{
		var val = data.val();
		$('#selfIntro').val( val.selfIntro );
	}

	// ユーザ画像
	var user = firebase.auth().currentUser;
	var userPhotoURL = user.photoURL;

	if( userPhotoURL != null && userPhotoURL != '' )
	{
		var $currentUserImage = $(".currentUserImage");
		$currentUserImage.empty();
		
		var img = new Image();
		img.src = userPhotoURL;
		var width = 150;
		var height = 150;
		if( img.width > img.height )
		{
			// 横長画像
			height = img.height * (width / img.width);
		}else{
			// 縦長画像
			width = img.width * (height / img.height);
		}
//		alert('width:' + width + '\nheight:' + height);
		// .prevewの領域の中にロードした画像を表示するimageタグを追加
		$currentUserImage.append($('<img>').attr({
			src: userPhotoURL,
			width: width + 'px',
			height: height + 'px',
			class: "userImagePreview",
		}));
	}

	$preview = $(".userImagePreview");
	$preview.empty();
	var file =$( '#userImage' )[0];
//	var file = document.getElementById( 'userImage' );
	file.parentNode.innerHTML = file.parentNode.innerHTML;

//	AlertAllProperty(val);
}

//=======================================================================
function RefreshProfile()
{
	var user = firebase.auth().currentUser;
	
	var displayName = user.displayName;
	$('#displayName').val( displayName );

	var userGUID = user.uid;
//	firebaseDB.ref('users/' + userGUID + '/').on('child_added', RefreshProfileSnapshot);
//	firebaseDB.ref('users/' + userGUID + '/').on('child_changed', RefreshProfileSnapshot);
	firebaseDB.ref('users/' + userGUID + '/').on('value', RefreshProfileSnapshot);
}



//=======================================================================
$(function(){
	//画像ファイルプレビュー表示のイベント追加 fileを選択時に発火するイベントを登録
	$('form').on('change', 'input[type="file"]', function(e) {

		var file = e.target.files[0],
		reader = new FileReader(),
		$preview = $(".userImagePreview");
		t = this;

		// 画像ファイル以外の場合は何もしない
		if(file == null || file.type.indexOf("image") < 0){
			$preview.empty();
			return false;
		}

		// ファイル読み込みが完了した際のイベント登録
		reader.onload = (function(file) {
			return function(e) {
				//既存のプレビューを削除
				$preview.empty();
				// .prevewの領域の中にロードした画像を表示するimageタグを追加
				$preview.append($('<img>').attr({
					src: e.target.result,
					width: "150px",
					class: "userImagePreview",
					title: file.name
				}));
			};
		})(file);
		reader.readAsDataURL(file);
	});
});


