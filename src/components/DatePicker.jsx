import { X, Minus, Plus } from 'lucide-react';
import React, { useState } from 'react';

// 根据今天 + 天数，计算 checkIn/checkOut 对象
function calcDates(days) {
  const today = new Date();
  const start = {
    date: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  };
  const endD = new Date(today);
  endD.setDate(today.getDate() + days - 1);
  const end = {
    date: endD.getDate(),
    month: endD.getMonth() + 1,
    year: endD.getFullYear(),
  };
  return { start, end };
}

function formatDate(d) {
  if (!d) return '';
  const weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][
    new Date(d.year, d.month - 1, d.date).getDay()
  ];
  return `${d.month}月${String(d.date).padStart(2, '0')}日 ${weekDay}`;
}

const PRESETS = [1, 2, 3, 4, 5, 7, 10, 14];

const DatePicker = ({ isOpen, onClose, onDateSelect }) => {
  const [days, setDays] = useState(3);

  const { start, end } = calcDates(days);

  const handleConfirm = () => {
    onDateSelect(start, end);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
      style={{ display: isOpen ? 'flex' : 'none' }}
    >
      <div className="bg-white w-full rounded-t-2xl flex flex-col">
        {/* 标题栏 */}
        <div className="flex justify-between items-center px-4 py-4 border-b flex-shrink-0">
          <h2 className="text-base font-bold text-[#333]">选择行程天数</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="px-5 pt-5 pb-24">
          {/* 天数大显示 + 加减 */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              onClick={() => setDays(d => Math.max(1, d - 1))}
              className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
            >
              <Minus className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-center">
              <span className="text-6xl font-bold text-[#333]">{days}</span>
              <span className="text-xl text-gray-400 ml-1">天</span>
            </div>
            <button
              onClick={() => setDays(d => Math.min(30, d + 1))}
              className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* 快捷天数 */}
          <div className="flex gap-2 flex-wrap justify-center mb-6">
            {PRESETS.map(n => (
              <button
                key={n}
                onClick={() => setDays(n)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  days === n
                    ? 'bg-[#FBE451] border-[#FBE451] text-[#333]'
                    : 'bg-white border-gray-200 text-gray-500'
                }`}
              >
                {n}天
              </button>
            ))}
          </div>

          {/* 日期预览 */}
          <div className="bg-gray-50 rounded-2xl px-4 py-3 mb-5 flex items-center justify-between">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-0.5">出发</p>
              <p className="text-sm font-semibold text-[#333]">{formatDate(start)}</p>
            </div>
            <div className="text-gray-300 text-lg font-light">→</div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-0.5">返回</p>
              <p className="text-sm font-semibold text-[#333]">{formatDate(end)}</p>
            </div>
          </div>

          {/* 确认按钮 */}
          <button
            onClick={handleConfirm}
            className="w-full py-3 rounded-2xl bg-[#FBE451] text-[#333] font-bold text-base"
          >
            确认 {days} 天行程
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
