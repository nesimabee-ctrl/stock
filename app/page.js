'use client';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [selectedStock, setSelectedStock] = useState('BTC');
  const [stocks, setStocks] = useState([
    { symbol: 'BTC', price: 2450.50, supply: 120 },
    { symbol: 'ETH', price: 1120.00, supply: 85 },
    { symbol: 'SOL', price: 345.25, supply: 210 },
  ]);
  
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#fbfcfd';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#f0f3f6';
    ctx.lineWidth = 1;
    for (let i = 1; i < 10; i++) {
      let y = (height / 10) * i;
      ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(width - 50, y); ctx.stroke();
    }
    for (let i = 1; i < 16; i++) {
      let x = 50 + ((width - 100) / 16) * i;
      ctx.beginPath(); ctx.moveTo(x, 40); ctx.lineTo(x, height - 40); ctx.stroke();
    }

    const currentStock = stocks.find(s => s.symbol === selectedStock) || stocks[0];
    let candles = [];
    let runningVal = currentStock.price * 0.6;

    for (let i = 0; i < 40; i++) {
      let fluctuation = (Math.random() - 0.48) * (currentStock.price * 0.08);
      let open = runningVal;
      let close = open + fluctuation;
      if (i === 39) close = currentStock.price;

      let spread = Math.abs(open - close);
      let high = Math.max(open, close) + spread * (0.3 + Math.random() * 0.5);
      let low = Math.min(open, close) - spread * (0.3 + Math.random() * 0.5);
      candles.push({ open, high, low, close });
      runningVal = close;
    }

    const minPrice = Math.min(...candles.map(c => c.low)) * 0.90;
    const maxPrice = Math.max(...candles.map(c => c.high)) * 1.10 || minPrice + 10;

    const getX = (i) => 65 + (i / (candles.length - 1)) * (width - 130);
    const getY = (val) => height - 55 - ((val - minPrice) / (maxPrice - minPrice)) * (height - 100);

    const candleWidth = Math.max(4, Math.min(14, (width - 130) / candles.length - 3));
    candles.forEach((c, i) => {
      let x = getX(i);
      let isGreen = c.close >= c.open;
      let color = isGreen ? '#0e9f6e' : '#f05252';

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(x, getY(c.high)); ctx.lineTo(x, getY(c.low)); ctx.stroke();

      let bodyTop = Math.min(getY(c.open), getY(c.close));
      let bodyHeight = Math.max(2, Math.abs(getY(c.open) - getY(c.close)));
      ctx.fillStyle = color;
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    });

    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(width - 40, height - 35); ctx.lineTo(45, height - 35); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(52, height - 40); ctx.lineTo(45, height - 35); ctx.lineTo(52, height - 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(width - 35, height - 35); ctx.lineTo(width - 35, 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(width - 40, 37); ctx.lineTo(width - 35, 30); ctx.lineTo(width - 30, 37); ctx.stroke();

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`CANDLESTICK CHART — ${selectedStock}`, 60, 32);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#4b5563';
    ctx.fillText(`Price: ${currentStock.price.toFixed(2)} Coins`, width - 220, 32);

  }, [selectedStock, stocks]);

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold tracking-wider flex items-center gap-2">
          📈 <span className="text-emerald-400">Stocks.in</span> Dashboard
        </h1>
        <span className="text-sm bg-gray-800 px-3 py-1 rounded-full text-gray-300">Live Market Feed</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#181b22] border border-gray-800 p-5 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">Active Assets</h2>
          <div className="space-y-3">
            {stocks.map(s => (
              <div 
                key={s.symbol}
                onClick={() => setSelectedStock(s.symbol)}
                className={`p-4 rounded-lg cursor-pointer transition flex justify-between items-center ${selectedStock === s.symbol ? 'bg-emerald-950/40 border border-emerald-500/50' : 'bg-[#20242d] hover:bg-[#282c37]'}`}
              >
                <div>
                  <span className="font-bold text-lg">{s.symbol}</span>
                  <p className="text-xs text-gray-400">Supply: {s.supply} shares</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-emerald-400">{s.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-400 block">Coins</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#181b22] border border-gray-800 p-5 rounded-xl shadow-lg flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-200">Technical Analysis ({selectedStock})</h2>
            <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded">Realtime View</span>
          </div>
          
          <div className="w-full overflow-x-auto rounded-lg border border-gray-800">
            <canvas ref={canvasRef} width={850} height={420} className="w-full h-auto" />
          </div>
        </div>
      </div>
    </main>
  );
}
