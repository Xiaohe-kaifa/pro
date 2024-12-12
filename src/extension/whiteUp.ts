import { OverlayTemplate, utils } from 'klinecharts';
import { getRotateCoordinate} from './utils';
import { getKlineData,getKlineIndex, setKlineIndex } from '../ChartProComponent';
const whiteUp: OverlayTemplate = {
  name: 'whiteUp',
  totalStep: 3,
  needDefaultPointFigure: false,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  styles: {
    polygon: {}
  },
  createPointFigures: ({ coordinates }) => {
    
    
    
    
    if (coordinates.length > 1) {
      const start = coordinates[0];
      const end = coordinates[1];
      // 获取起点和终点的数据索引
      const startDataResult = getKlineIndex(
        [{ x: start.x, y: start.y }],
        { paneId: 'candle_pane', absolute: false }
      );
      const endDataResult = getKlineIndex(
        [{ x: end.x, y: end.y }],
        { paneId: 'candle_pane', absolute: false }
      );
      // 确保 endDataResult 是一个数组且不为空
      const endDataIndex = Array.isArray(startDataResult) && startDataResult.length > 0 ? startDataResult[0] : undefined;
      // 确保 endDataResult 是一个数组且不为空
      const startDataIndex = Array.isArray(endDataResult) && endDataResult.length > 0 ? endDataResult[0] : undefined;

      const KLineData = getKlineData();
      if (KLineData && endDataIndex?.dataIndex !== undefined) {
        const trueIndex = setKlineIndex(
          {
            dataIndex: endDataIndex.dataIndex,
            timestamp: endDataIndex.timestamp,
            value: KLineData[endDataIndex.dataIndex].close
          },
          { paneId: 'candle_pane', absolute: false }
          )
          if (trueIndex && !Array.isArray(trueIndex)) {
            start.x=trueIndex.x ?? start.x;
            start.y=trueIndex.y ?? start.y;
          }
          
      } else {
        console.log('KLineData 或 startData.dataIndex 为 undefined');
      }


      const startDataResultTrue = getKlineIndex(
        [{ x: start.x, y: start.y }],
        { paneId: 'candle_pane', absolute: false }
      );
      const endDataResultTrue = getKlineIndex(
        [{ x: end.x, y: end.y }],
        { paneId: 'candle_pane', absolute: false }
      );
      // 确保 endDataResult 是一个数组且不为空
      const endData = Array.isArray(endDataResultTrue) && endDataResultTrue.length > 0 ? endDataResultTrue[0] : undefined;
      // 确保 endDataResult 是一个数组且不为空
      const startData = Array.isArray(startDataResultTrue) && startDataResultTrue.length > 0 ? startDataResultTrue[0] : undefined;
      const value = startData?.value?.toFixed(2)
      
      const percent = Math.abs((((Number(endData?.value) - Number(startData?.value))/Number(startData?.value))*100)).toFixed(2)
      // 根据起点和终点的y坐标决定颜色
      let colorTop = 'rgba(0, 255, 0, 0.15)'; // 青色透明
      let colorBottom = 'rgba(255, 0, 0, 0.15)'; // 红色透明
       // 计算矩形的中心位置
       const centerX = (start.x + end.x) / 2;
       const centerY = (start.y + end.y) / 2;
      // 如果起点的y坐标小于终点的y坐标，则交换颜色
      let symmetricTextContent = ''
      let symmetricTextWidth = 0
      let symmetricTextX = 0
      let bottomY=0
      let textContent=''
      let textWidth=0
      let textX = 0
      let symmetricTextY=0
      
      if (start.y < end.y) {
        //往下的
        const endValueUp = (Number(startData?.value)+(Number(startData?.value)-Number(endData?.value))).toFixed(2)
        const endValueDown =endData?.value?.toFixed(2)
        // 对称矩形的文本标注
        symmetricTextContent = `止盈目标价:${endValueUp}(止盈空间:${percent}%) `;
        symmetricTextWidth = getTextWidth(symmetricTextContent, 12);
        symmetricTextX = centerX - symmetricTextWidth / 2;
        [colorTop, colorBottom] = [colorBottom, colorTop];
        // 计算矩形底部的 y 坐标
        bottomY = Math.max(start.y, end.y);
        
      // 文本标注
        textContent = `止损价格:${endValueDown}(止损空间:-${percent}%) `;
        textWidth = getTextWidth(textContent, 12); // 假设getTextWidth是一个计算文本宽度的函数

      // 计算文本的起始x坐标，使其居中对齐
        textX = centerX - textWidth / 2;
      }else{
        //往上的
        const endValueUp = endData?.value?.toFixed(2) 
        const endValueDown =(Number(startData?.value)-(Number(endData?.value)-Number(startData?.value))).toFixed(2)
         // 对称矩形的文本标注
         symmetricTextContent = `止盈目标价:${endValueUp}(止盈空间:${percent}%) `;
         symmetricTextWidth = getTextWidth(symmetricTextContent, 12);
         symmetricTextX = centerX - symmetricTextWidth / 2;
         symmetricTextY = end.y


         // 计算矩形底部的 y 坐标
         bottomY = end.y-2*(end.y-start.y);
 
         // 文本标注
         textContent = `止损价格:${endValueDown}(止损空间:-${percent}%) `;
         textWidth = getTextWidth(textContent, 12); // 假设getTextWidth是一个计算文本宽度的函数
 
         // 计算文本的起始x坐标，使其居中对齐
         textX = centerX - textWidth / 2;
      }
      const text = {
        type: 'text',
        attrs: {
          x: textX,
          y: bottomY , // 设置文本在矩形底部下方10个单位的位置
          text: textContent,
        },
        styles: {
          color: 'white',
          fontSize: 12,
          backgroundColor: 'red' // 使用对应的colorBottom
        }
      };

      // 计算对称终点
      const symmetricEnd = {
        x: end.x,
        y: 2 * start.y - end.y
      };

      
      const symmetricText = {
        type: 'text',
        attrs: {
          x: symmetricTextX,
          y:  start.y < end.y? symmetricEnd.y-20:symmetricTextY-20 ,
          text: symmetricTextContent,
        },
        styles: {
          color: 'white',
          fontSize: 12,
          backgroundColor: 'green' // 使用对应的colorTop
        }
      };
    
      // 新增的中间文本
    const middleTextContent = `开多点位:${value}  盈亏比:1`;
    const middleTextWidth = getTextWidth(middleTextContent, 12);
    const middleTextX = centerX - middleTextWidth / 2;
    const middleText = {
      type: 'text',
      attrs: {
        x: middleTextX,
        y: start.y-10,
        text: middleTextContent,
      },
      styles: {
        color: 'white',
        fontSize: 12,
        backgroundColor: 'red' // 可以自定义背景颜色
      }
    };
      return [
        {
          type: 'polygon',
          attrs: {
            coordinates: [
              start,
              { x: end.x, y: start.y },
              end,
              { x: start.x, y: end.y }
            ]
          },
          styles: { style: 'fill', color: colorTop }
        },
        text,
        
        {
          type: 'polygon',
          attrs: {
            coordinates: [
              start,
              { x: symmetricEnd.x, y: start.y },
              symmetricEnd,
              { x: start.x, y: symmetricEnd.y }
            ]
          },
          styles: { style: 'fill', color: colorBottom }
        },
        symmetricText,
        {
          type: 'circle',
          attrs: {
            x: start.x,
            y: start.y,
            r: 6, 
          },
          styles: {
            style: 'stroke_fill',
            color: 'white', 
            borderStyle: 'solid',
            borderColor: '#036de8',
            // 边框尺寸
            borderSize: 2
          }
        },
        middleText
      ];
    }
    return [];
  }
};

// 计算文本宽度的辅助函数（假设使用Canvas API）
function getTextWidth(text: string, fontSize: number): number {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    context.font = `${fontSize}px Arial`;
    const metrics = context.measureText(text);
    return metrics.width;
  }
  return 0;
}

export default whiteUp;