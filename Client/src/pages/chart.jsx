import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

export default function QuidditchForex() {
  const [data, setData] = useState([]);
  const [symbols, setSymbols] = useState(["EURUSD", "GBPUSD"]);
  const [ws, setWs] = useState(null);
  const [latestPrice, setLatestPrice] = useState(null);
  const [yAxisDomain, setYAxisDomain] = useState([0, 100]);
  const [snitchPosition, setSnitchPosition] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState({ gryffindor: 0, slytherin: 0 });

  useEffect(() => {
    if (ws) ws.close();
    const newWs = new WebSocket("ws://localhost:3001");

    newWs.onopen = () => {
      newWs.send(JSON.stringify({ symbols }));
    };

    newWs.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setLatestPrice(newData.bid);
      setData((prevData) => {
        const updatedData = [...prevData, { ...newData, time: new Date().toLocaleTimeString() }];
        if (updatedData.length > 50) updatedData.shift();
        
        // Update score based on price movement
        if (updatedData.length > 1) {
          const lastPrice = updatedData[updatedData.length - 2].bid;
          const diff = newData.bid - lastPrice;
          if (diff > 0) {
            setScore(prev => ({ ...prev, gryffindor: prev.gryffindor + 10 }));
          } else if (diff < 0) {
            setScore(prev => ({ ...prev, slytherin: prev.slytherin + 10 }));
          }
        }
        
        return updatedData;
      });
      
      // Move the snitch randomly
      setSnitchPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      });

      // Set Y-axis range dynamically
      setYAxisDomain((prevDomain) => {
        if (!latestPrice) {
          return [newData.bid - 5, newData.bid + 5];
        }
        if (newData.bid < prevDomain[0]) {
          return [newData.bid - 5, prevDomain[1]];
        }
        if (newData.bid > prevDomain[1]) {
          return [prevDomain[0], newData.bid + 5];
        }
        return prevDomain;
      });
    };

    newWs.onerror = (error) => console.error("WebSocket Error:", error);
    newWs.onclose = () => console.log("WebSocket Disconnected");
    setWs(newWs);

    return () => newWs.close();
  }, [symbols]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-gold-500 relative overflow-hidden">
      {/* Quidditch Pitch Background Elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full border-8 border-brown-800 rounded-full opacity-20"></div>
      </div>
      
      {/* Flying Golden Snitch */}
      <motion.div 
        className="absolute w-8 h-8 bg-yellow-400 rounded-full z-10"
        style={{
          left: `${snitchPosition.x}%`,
          top: `${snitchPosition.y}%`,
          boxShadow: '0 0 15px gold'
        }}
        animate={{
          x: [0, 10, -10, 0],
          y: [0, -10, 5, 0],
          transition: { duration: 3, repeat: Infinity }
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-1 bg-white rotate-45"></div>
          <div className="w-4 h-1 bg-white -rotate-45"></div>
        </div>
      </motion.div>

      {/* House Scoreboards */}
      <div className="absolute top-4 left-4 bg-red-900 bg-opacity-70 p-3 rounded-lg">
        <h3 className="font-bold">Gryffindor</h3>
        <p className="text-2xl font-bold text-gold-500">{score.gryffindor}</p>
      </div>
      <div className="absolute top-4 right-4 bg-green-900 bg-opacity-70 p-3 rounded-lg">
        <h3 className="font-bold">Slytherin</h3>
        <p className="text-2xl font-bold text-silver-500">{score.slytherin}</p>
      </div>

      {/* Main Content */}
      <div className="relative z-20 p-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-6 text-yellow-400"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-red-500">Q</span>
          <span className="text-yellow-400">U</span>
          <span className="text-blue-400">I</span>
          <span className="text-green-400">D</span>
          <span className="text-red-500">D</span>
          <span className="text-yellow-400">I</span>
          <span className="text-blue-400">T</span>
          <span className="text-green-400">C</span>
          <span className="text-red-500">H</span>
          <span> </span>
          <span className="text-yellow-400">F</span>
          <span className="text-blue-400">O</span>
          <span className="text-green-400">R</span>
          <span className="text-red-500">E</span>
          <span className="text-yellow-400">X</span>
        </motion.h2>

        <div className="text-center mt-4">
          <label className="mr-2 text-yellow-400">Choose Your Brooms:</label>
          <select
            multiple
            value={symbols}
            onChange={(e) =>
              setSymbols(Array.from(e.target.selectedOptions, (option) => option.value))
            }
            className="border-2 border-yellow-400 bg-gray-900 text-yellow-400 p-2 rounded-lg"
          >
            <option value="EURUSD" className="bg-gray-800">Nimbus 2000 (EUR/USD)</option>
            <option value="GBPUSD" className="bg-gray-800">Firebolt (GBP/USD)</option>
            <option value="BTCUSD" className="bg-gray-800">Thunderbolt VII (BTC/USD)</option>
            <option value="USDJPY" className="bg-gray-800">Cleansweep Eleven (USD/JPY)</option>
            <option value="AUDUSD" className="bg-gray-800">Comet 260 (AUD/USD)</option>
          </select>
        </div>

        <div className="mt-8 bg-gray-900 bg-opacity-70 p-4 rounded-lg border-2 border-yellow-400">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis 
                dataKey="time" 
                stroke="#f6ad55" 
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                stroke="#f6ad55" 
                domain={yAxisDomain} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1a202c", 
                  color: "#f6ad55",
                  border: "1px solid #f6ad55",
                  borderRadius: "0.5rem"
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="bid" 
                stroke="#f6e05e" 
                strokeWidth={3} 
                dot={false} 
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Latest Price Display as Golden Snitch */}
        <motion.div 
          className="absolute bottom-4 left-4 p-4 bg-yellow-600 bg-opacity-80 rounded-full shadow-lg text-center w-20 h-20 flex items-center justify-center"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
            transition: { duration: 2, repeat: Infinity } 
          }}
        >
          <div className="text-center">
            <div className="text-xs text-white">Current</div>
            <p className="text-xl font-bold text-white">
              {latestPrice ? `$${latestPrice.toFixed(2)}` : "..."}
            </p>
          </div>
        </motion.div>

        {/* Flying Broomstick Animation */}
        <motion.div 
          className="absolute bottom-8 right-8 text-4xl"
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -10, 5, 0],
            transition: { duration: 4, repeat: Infinity }
          }}
        >
          🧹
        </motion.div>
      </div>
    </div>
  );
}