// CommonFunc.js



//=======================================================================
function AutoLink(toPageURL)
{
	location.href=toPageURL;
}


//=======================================================================
function AlertAllProperty(data)
{
	var properties = '';
	for(var prop in data)
	{
		properties += prop + "=" + data[prop] + "\n";
	}
	alert(properties);
}


//=======================================================================
function GetCurrentTimestamp()
{
	//Dateオブジェクトを利用
	var d = new Date();
	this.year  = d.getFullYear();
	this.month = ( (d.getMonth() + 1) < 10 ) ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
	this.day   = ( d.getDate()        < 10 ) ? '0' + d.getDate()        : d.getDate();
	this.hour  = ( d.getHours()       < 10 ) ? '0' + d.getHours()       : d.getHours();
	this.min   = ( d.getMinutes()     < 10 ) ? '0' + d.getMinutes()     : d.getMinutes();
	this.sec   = ( d.getSeconds()     < 10 ) ? '0' + d.getSeconds()     : d.getSeconds();
//	print( year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec );
	//結果  2011-10-14 00:00:00

	this.string = this.year + '-' + this.month + '-' + this.day + ' ' + this.hour + ':' + this.min + ':' + this.sec;
	return this;
}


//=======================================================================
// ファイル名から拡張子を取得する ( .は含まない )
function GetExtFromFileName(fileName)
{
//	alert(fileName);
	var f = fileName.split('.');
	return f[f.length-1];
}


//=======================================================================
/* @brief		ランダムでパスワードを生成する
 * @param[in]	len    = 生成するパスワードの文字数
 * @param[in]	strSet = 生成するパスワードに含んでいい文字セット(半角英数字記号) (空文字を送ればデフォルトが適用される)
 * @retval		生成したパスワードの文字列
 ========================================================================*/
function PasswordGenerator(len, strSet)
{
	// 生成する文字列に含める文字セット
	if( strSet == '' )
	{
		strSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	}

	var cl = strSet.length;
	var password = "";
	for(var i=0; i<len; i++){
		password += strSet[Math.floor(Math.random()*cl)];
	}
	return password;
}


