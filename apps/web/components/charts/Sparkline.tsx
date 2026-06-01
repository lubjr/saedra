export const Sparkline = ({ data }: { data: number[] }) => {
  if (data.length < 2) return null;
  const w = 110;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const step = w / (data.length - 1);
  const yFor = (v: number) => {
    return range === 0 ? h * 0.25 : h - ((v - min) / range) * (h - 6) - 3;
  };
  const pts = data
    .map((v, i) => {
      return `${i * step},${yFor(v)}`;
    })
    .join(" ");
  const lastX = (data.length - 1) * step;
  const lastVal = data[data.length - 1] ?? 0;
  const lastY = yFor(lastVal);
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="overflow-visible"
    >
      <polyline
        points={pts}
        fill="none"
        stroke="#2dd4bf"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={lastX} cy={lastY} r="2.5" fill="#2dd4bf" />
    </svg>
  );
};
