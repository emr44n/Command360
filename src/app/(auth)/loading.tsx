export default function AuthLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" style={{ animationDuration: '1s' }} />
      </div>
    </div>
  )
}
