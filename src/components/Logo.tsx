export default function Logo({ className = "h-12" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center justify-center bg-gradient-to-r from-primary to-warning rounded-lg px-4 py-2`}>
      <span className="text-2xl font-bold text-primary-foreground">SAA</span>
    </div>
  );
}
