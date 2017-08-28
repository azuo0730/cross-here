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
	//Date�I�u�W�F�N�g�𗘗p
	var d = new Date();
	this.year  = d.getFullYear();
	this.month = ( (d.getMonth() + 1) < 10 ) ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
	this.day   = ( d.getDate()        < 10 ) ? '0' + d.getDate()        : d.getDate();
	this.hour  = ( d.getHours()       < 10 ) ? '0' + d.getHours()       : d.getHours();
	this.min   = ( d.getMinutes()     < 10 ) ? '0' + d.getMinutes()     : d.getMinutes();
	this.sec   = ( d.getSeconds()     < 10 ) ? '0' + d.getSeconds()     : d.getSeconds();
//	print( year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec );
	//����  2011-10-14 00:00:00

	this.string = this.year + '-' + this.month + '-' + this.day + ' ' + this.hour + ':' + this.min + ':' + this.sec;
	return this;
}


//=======================================================================
// �t�@�C��������g���q���擾���� ( .�͊܂܂Ȃ� )
function GetExtFromFileName(fileName)
{
//	alert(fileName);
	var f = fileName.split('.');
	return f[f.length-1];
}


//=======================================================================
/* @brief		�����_���Ńp�X���[�h�𐶐�����
 * @param[in]	len    = ��������p�X���[�h�̕�����
 * @param[in]	strSet = ��������p�X���[�h�Ɋ܂�ł��������Z�b�g(���p�p�����L��) (�󕶎��𑗂�΃f�t�H���g���K�p�����)
 * @retval		���������p�X���[�h�̕�����
 ========================================================================*/
function PasswordGenerator(len, strSet)
{
	// �������镶����Ɋ܂߂镶���Z�b�g
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


