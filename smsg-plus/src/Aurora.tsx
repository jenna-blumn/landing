interface AuroraProps {
  colors?: string[];
  speed?: string;
  blur?: string;
}

export default function Aurora({
  colors = ['#3b82f6', '#7cf994', '#60a5fa'],
  speed = '6s',
  blur = '80px',
}: AuroraProps) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        filter: `blur(${blur})`,
      }}
    >
      {colors.map((color, i) => (
        <div
          key={i}
          className="absolute rounded-full mix-blend-soft-light"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            width: '50%',
            height: '70%',
            left: `${i * 25}%`,
            top: `${10 + i * 10}%`,
            animation: `aurora-${i} ${speed} ease-in-out infinite alternate`,
          }}
        />
      ))}

      <style>{`
        @keyframes aurora-0 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(60px, -40px) scale(1.15); }
        }
        @keyframes aurora-1 {
          0% { transform: translate(0, 0) scale(1.1); }
          100% { transform: translate(-50px, 30px) scale(0.9); }
        }
        @keyframes aurora-2 {
          0% { transform: translate(0, 0) scale(0.95); }
          100% { transform: translate(40px, -20px) scale(1.2); }
        }
      `}</style>
    </div>
  );
}
