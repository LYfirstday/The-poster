import * as React from 'react';
import './test.less';

export default () => {


  function drawImage() {
    let canvas = document.querySelector('#testCanvas') as HTMLCanvasElement;
    let context = canvas.getContext('2d') as CanvasRenderingContext2D;

    let img = new Image();
    img.onload = function() {
      // 设置画布旋转中心，设置为将要画的图片的中心
      context.translate(260 / 2 + 50, 100 / 2 + 150);

      // 将画布旋转，角度为：图片的角度 * Math.PI / 180
      context.rotate(45 * Math.PI / 180);

      // 将canvas坐标系0, 0点恢复
      context.translate(-1 * ((260 / 2) + 50), -1 * ((100 / 2) + 150));

      context.drawImage(img, 50, 150, 260, 100);

      // 重置当前坐标系
      context.setTransform(1, 0, 0, 1, 0, 0);
    }
    img.src = require('./../static/imgs/logo.jpg');
  }

  function drawText() {
    let canvas = document.querySelector('#testCanvas') as HTMLCanvasElement;
    let context = canvas.getContext('2d') as CanvasRenderingContext2D;
    
    // let content = '阿阿阿阿阿'.split('');
    let line = '请问阿萨德让它用润赶紧滚';
    let left = 80;
    let fontSize = 14;

    context.font = (`${fontSize}px sans-serif`);
    context.fillStyle = '#111111';
    context.textBaseline = 'top';

    context.translate(left, 250 + fontSize * 0.2142);


    // 设置画布旋转中心，设置为将要画的图片的中心
    // top、left = fontSize * lineheight
    // 将画布旋转，角度为：图片的角度 * Math.PI / 180
    context.rotate(0 * Math.PI / 180);

    let contentLine = '';
    let fontTop = 0;

    line.split('').map((val, i) => {
      let thisLine = contentLine + val;
      let metrics = context.measureText(thisLine);
      let contentWidth = metrics.width;
      console.log(contentWidth)
      if (contentWidth > 150 && i > 0) {
        console.log(contentWidth)
        console.log(thisLine)
        context.fillText(contentLine, 0, fontTop);
        fontTop = fontTop + fontSize * 1.2;
        contentLine = val;
      } else {
        contentLine = thisLine;
      }
    })
    
    // 位置 Y = fontSize * lineheight + 8; X = fontSize * lineheight
    context.fillText(contentLine, 0, fontTop);
    
    // 将canvas坐标系0, 0点恢复
    // 重置当前坐标系
    context.translate(-1 * 80, -1 * 250);
    context.setTransform(1, 0, 0, 1, 0, 0);



    // 换行无角度
    // let top = 250 + fontSize * 1.2;

    // context.fillText(line, 80, top);
  }

  return (
    <div className='test'>
      <button onClick={drawImage}>draw</button>
      <button onClick={drawText}>draw</button>
      <div className='text-dom'>
        <img src={require('./../static/imgs/logo.jpg')} />
        <p>请问阿萨德让它用润赶紧滚</p>
      </div>
      <canvas id='testCanvas' className='test-canvas' height='736' width='414'></canvas>
    </div>
  )
}

