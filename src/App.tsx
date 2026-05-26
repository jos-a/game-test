import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    &lt;div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a2e] text-white"&gt;
      &lt;h1 className="text-4xl mb-8"&gt;测试页面 - 小斗士&lt;/h1&gt;
      &lt;p className="text-xl mb-4"&gt;计数器: {count}&lt;/p&gt;
      &lt;button 
        onClick={() =&gt; setCount(count + 1)}
        className="px-8 py-4 bg-[#e94560] rounded-lg text-xl hover:scale-110 transition-transform"
      &gt;
        点击我测试
      &lt;/button&gt;
    &lt;/div&gt;
  );
}
