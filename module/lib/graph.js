const { createCanvas, registerFont } = require("canvas");
registerFont("./file/BIZUDPGothic-Regular.ttf",{ family: "JapaneseFont" });

module.exports = {
  "line":(data,title,x_label,y_label,option)=>{
    const canvas = createCanvas(600,400);
    const ctx = canvas.getContext("2d");

    //背景描画
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  
    // グラフ描画
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
  
    const chartArea = {
      x: 70,
      y: 50,
      width: canvas.width - 100,
      height: canvas.height - 100
    };
  
    //X軸の説明描画
    ctx.fillStyle = "black";
    ctx.font = "14px JapaneseFont";
    ctx.textAlign = "center";
    ctx.fillText(x_label,chartArea.x + chartArea.width / 2, chartArea.y + chartArea.height + 40);
  
    //メモリ線描画
    ctx.strokeStyle = "lightgray";
    ctx.lineWidth = 1;
  
    const minValue = Math.min(...data.map(i=>i.value));
    const maxValue = Math.max(...data.map(i=>i.value));
  
    for(let i = 0; i <= 5; i++){
      const y = chartArea.y + (i / 5) * chartArea.height;
      ctx.beginPath();
      ctx.moveTo(chartArea.x,y);
      ctx.lineTo(chartArea.x + chartArea.width, y);
      ctx.stroke();
  
      //Y軸の数値描画
      ctx.fillStyle = "black";
      ctx.font = `${option?.y_fontSize||"14"}px JapaneseFont`;
      ctx.textAlign = "left";
      ctx.fillText(Math.round((maxValue - (maxValue - minValue) * (i / 5))).toString(),chartArea.x - 45, y + 5);
    }
  
    //Y軸ラベル描画
    ctx.save();
    ctx.translate(chartArea.x - 20, chartArea.y + chartArea.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText(y_label,0,-35);
    ctx.restore();
  
    //ラベル描画
    ctx.fillStyle = "black";
    ctx.font = `${option?.x_fontSize||"14"}px JapaneseFont`; 
    ctx.textAlign = "center";
    data.forEach((item,i)=>{
      const x = chartArea.x + (i / (data.length - 1)) * chartArea.width;
      const y = chartArea.y + chartArea.height;
      ctx.fillText(item.label,x,y + 20);
    });
  
    //タイトル
    ctx.font = "20px JapaneseFont";
    ctx.fillText(title,canvas.width / 2, 30);
  
    //データの描画
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
  
    ctx.beginPath();
  
    data.forEach((item,i)=>{
      const x = chartArea.x + (i / (data.length - 1)) * chartArea.width;
      const y = chartArea.y + chartArea.height - ((item.value - minValue) / (maxValue - minValue)) * chartArea.height;
      if(i === 0){
        ctx.moveTo(x,y);
      }else{
        ctx.lineTo(x,y);
      }
    });
  
    ctx.stroke();
  
    return canvas.createPNGStream();
  },
  "pie":(data,title,option)=>{
    data.sort((a,b)=>b.value - a.value);

    const canvas = createCanvas(600,400);
    const ctx = canvas.getContext("2d");
    
    //背景描画
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    // タイトルの描画
    ctx.fillStyle = "#000000";
    ctx.font = "24px JapaneseFont";
    ctx.textAlign = "center";
    ctx.fillText(title,canvas.width / 2,30);
    
    const colors = ["#FF5733", "#33FF57", "#5733FF", "#FFFF33", "#33FFFF"];
    
    //円グラフの描画
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 1.9;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    let startAngle = -Math.PI / 2;
    
    //セクションの描画
    for(let i = 0; i < data.length; i++){
      const endAngle = startAngle + (data[i].value / 100 * 2 * Math.PI);
  
      ctx.beginPath();
      ctx.moveTo(centerX,centerY);
      ctx.arc(centerX,centerY,radius,startAngle,endAngle);
      ctx.closePath();
  
      ctx.fillStyle = colors[i];
      ctx.fill();

      startAngle = endAngle;
    }

    //ラベルの描画
    for(let i = 0; i < data.length; i++){
      const endAngle = startAngle + (data[i].value / 100 * 2 * Math.PI);

      const labelRadius = radius * 0.7;
      const labelAngle = startAngle + (endAngle - startAngle) / 2;
      const labelX = centerX + Math.cos(labelAngle) * labelRadius;
      const labelY = centerY + Math.sin(labelAngle) * labelRadius;
      const labelText = `${data[i].label} (${data[i].value})`;
  
      ctx.fillStyle = "#000000";
      ctx.font = `${option?.fontSize||"10"}px JapaneseFont`;
      ctx.textAlign = "center";
      ctx.fillText(labelText,labelX,labelY);
  
      startAngle = endAngle;
    }
    
    return canvas.createPNGStream();
  }
}