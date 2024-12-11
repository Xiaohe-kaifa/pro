import { OverlayTemplate, utils } from 'klinecharts';
import { getRotateCoordinate} from './utils';
import { getKlineData,getKlineIndex } from '../ChartProComponent';
const white: OverlayTemplate = {
  name: 'white',
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
        // 对称矩形的文本标注
        symmetricTextContent = `对称 -9.72(%)  4根K线,4小时 `;
        symmetricTextWidth = getTextWidth(symmetricTextContent, 12);
        symmetricTextX = centerX - symmetricTextWidth / 2;
        [colorTop, colorBottom] = [colorBottom, colorTop];
        // 计算矩形底部的 y 坐标
        bottomY = Math.max(start.y, end.y);

      // 文本标注
        textContent = `-9.72(%)  4根K线,4小时 `;
        textWidth = getTextWidth(textContent, 12); // 假设getTextWidth是一个计算文本宽度的函数

      // 计算文本的起始x坐标，使其居中对齐
        textX = centerX - textWidth / 2;
      }else{
         // 对称矩形的文本标注
         symmetricTextContent = `对称 -9.72(%)  4根K线,4小时 `;
         symmetricTextWidth = getTextWidth(symmetricTextContent, 12);
         symmetricTextX = centerX - symmetricTextWidth / 2;
         symmetricTextY = end.y


         // 计算矩形底部的 y 坐标
         bottomY = end.y-2*(end.y-start.y);
 
         // 文本标注
         textContent = `-9.72(%)  4根K线,4小时 `;
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
    const middleTextContent = `-9.72(%)  4根K线,4小时`;
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

export default white;