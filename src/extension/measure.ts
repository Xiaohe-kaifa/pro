/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { OverlayTemplate } from 'klinecharts'

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
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length > 1) {
      const start = coordinates[0];
      const end = coordinates[1];
      let color = 'rgba(255, 0, 0, 0.15)'; // 默认透明红色
      let lineColor = 'rgba(255, 0, 0, 0.8)'; // 默认透明红色
      if (end.y < start.y) {
        color = 'rgba(0, 0, 255, 0.15)'; // 鼠标往上拖动时变为透明蓝色
        lineColor = 'rgba(0, 0, 255, 0.8)';
      }
      // 计算横向线的中心位置
      const centerY = (start.y + end.y) / 2;
      // 计算竖向线的中心位置
      const centerX = (start.x + end.x) / 2;
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
          styles: { style: 'fill',color: color }
        },
        {
          type: 'line',
          attrs: {
            coordinates: [
              { x: start.x, y: centerY },
              { x: end.x, y: centerY }
            ]
          },
          styles: { style: 'stroke', color: lineColor, size: 1 }
        },
        {
          type: 'line',
          attrs: {
            coordinates: [
              { x: centerX, y: start.y },
              { x: centerX, y: end.y }
            ]
          },
          styles: { style: 'stroke', color: lineColor, size: 1 } // 竖向线
        }
      ]
    }
    return []
  }
}

export default measure
