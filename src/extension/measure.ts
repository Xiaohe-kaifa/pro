// 测量工具

import { OverlayTemplate, utils } from 'klinecharts'
import { getRotateCoordinate } from './utils'
import { getKlineData } from '../ChartProComponent';

const measure: OverlayTemplate = {
  name: 'measure',
  totalStep: 3,
  needDefaultPointFigure: false,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  styles: {
    polygon: {
      
    }
  },
  createPointFigures: ({ coordinates  }) => {
    const klineData = getKlineData();
    if (coordinates.length > 1) {
      const start = coordinates[0];
      const end = coordinates[1];
      let color = 'rgba(255, 0, 0, 0.15)'; // 默认透明红色
      let lineColor = 'rgba(255, 0, 0, 0.8)'; // 默认透明红色
      if (end.y < start.y) {
        color = 'rgba(0, 0, 255, 0.15)'; // 鼠标往上拖动时变为透明蓝色
        lineColor = 'rgba(0, 0, 255, 0.8)';
      }
      // 计算矩形的中心位置
      const centerX = (start.x + end.x) / 2;        
      const centerY = (start.y + end.y) / 2;

      // 计算矩形底部的 y 坐标
      const bottomY = Math.max(start.y, end.y);

      // 计算横向箭头的起点和终点
      const horizontalStart = { x: start.x, y: centerY };
      const horizontalEnd = { x: end.x, y: centerY };

      // 计算竖向箭头的起点和终点
      const verticalStart = { x: centerX, y: start.y };
      const verticalEnd = { x: centerX, y: end.y };

      // 横向箭头
      const horizontalArrow = createArrow(horizontalStart, horizontalEnd, lineColor);
      // 竖向箭头
      const verticalArrow = createArrow(verticalStart, verticalEnd, lineColor);
      // 文本标注
      
      const textContent = `-9.72(%)  4根K线,4小时 `;
      const textWidth = getTextWidth(textContent, 12); // 假设getTextWidth是一个计算文本宽度的函数

      // 计算文本的起始x坐标，使其居中对齐
      const textX = centerX - textWidth / 2;
      const text = {
        type: 'text',
        attrs: {
          x: textX,
          y: bottomY + 10, // 设置文本在矩形底部下方10个单位的位置
          text: textContent,
        },
        styles: {
          color: 'white',
          fontSize: 12,
          backgroundColor: lineColor
        }
      };

      return [
        {
          type: 'polygon',
          attrs: {
            coordinates: [
              coordinates[0],
              { x: coordinates[1].x, y: coordinates[0].y },
              coordinates[1],
              { x: coordinates[0].x, y: coordinates[1].y }
            ]
          },
          styles: { style: 'fill', color: color }
        },
        ...horizontalArrow,
        ...verticalArrow,
        text
      ];
    }
    return [];
  }
}
// 创建箭头的辅助函数
function createArrow(start: any, end: any, color: any) {
  const flag = end.x > start.x ? 0 : 1;
  const kb = utils.getLinearSlopeIntercept(start, end);
  let offsetAngle;
  if (kb) {
    offsetAngle = Math.atan(kb[0]) + Math.PI * flag;
  } else {
    if (end.y > start.y) {
      offsetAngle = Math.PI / 2;
    } else {
      offsetAngle = Math.PI / 2 * 3;
    }
  }
  const rotateCoordinate1 = getRotateCoordinate({ x: end.x - 8, y: end.y + 4 }, end, offsetAngle);
  const rotateCoordinate2 = getRotateCoordinate({ x: end.x - 8, y: end.y - 4 }, end, offsetAngle);
  return [
    {
      type: 'line',
      attrs: { coordinates: [start, end] },
      styles: { style: 'stroke', color: color, size: 1 }
    },
    {
      type: 'line',
      ignoreEvent: true,
      attrs: { coordinates: [rotateCoordinate1, end, rotateCoordinate2] },
      styles: { style: 'stroke', color: color, size: 1 }
    }
  ];
}

// 计算两点之间的距离
function getDistance(point1: any, point2: any) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

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

export default measure;