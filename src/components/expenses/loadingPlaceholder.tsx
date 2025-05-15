export function LoadingPlaceholder() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="p-4 bg-gray-200 rounded-lg h-24" />
      ))}
    </div>
  );
}
