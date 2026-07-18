export default function NoteCardSkeleton() {
  return (
    <div className="script-card overflow-hidden animate-pulse">
      <div className="h-40 w-full bg-ruled/40" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 bg-ruled/50 rounded" />
        <div className="h-4 w-full bg-ruled/50 rounded" />
        <div className="h-4 w-2/3 bg-ruled/50 rounded" />
        <div className="h-3 w-full bg-ruled/40 rounded" />
        <div className="h-9 w-full bg-ruled/60 rounded-md mt-2" />
      </div>
    </div>
  );
}
