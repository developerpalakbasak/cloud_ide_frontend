

export default function LoaderLine() {
  return (
    <div className="w-full h-[9px] bg-slate-600 rounded overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 bg-[length:200%_100%] animate-[shimmer_1.2s_linear_infinite]" />
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
