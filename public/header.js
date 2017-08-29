// Header.js
// 参考　http://affiliate.ks-product.com/javascript-common-parts-external/

//=======================================================================
// ヘッダー読み込み処理
function SetHeader(rootDir)
{
	$.ajax({
		url: rootDir + "header.html", 							// 読み込むヘッダ
		cache: false,											// キャッシュ使用：なし
		async: false, 											// 非同期読み込み：なし
		success: function(html){
			html = html.replace(/\{\$root\}/g, rootDir);
			document.write(html);
		}
	});
}

//=======================================================================
// ヘッダー内のユーザ情報更新処理
function SetHeaderUserInfo(user)
{
	var userName = user.displayName;
	$('#loginUserInfo').text(userName);

	// 画像
	var $currentUserImage = $(".userImage");
	$currentUserImage.empty();
	var img = new Image();
	img.src = user.photoURL;
	var width = 32;
	var height = 32;
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
}


