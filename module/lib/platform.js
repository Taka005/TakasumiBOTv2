module.exports = (presence)=>{
	if(presence?.clientStatus?.web){
		return "🌐ウェブ";
	}else if(presence?.clientStatus?.mobile){
		return "📱モバイル";
	}else if(presence?.clientStatus?.desktop){
		return "🖥️デスクトップ";
	}
}