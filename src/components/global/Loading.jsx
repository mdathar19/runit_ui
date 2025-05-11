
const LoadingComponent = () => {
  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col justify-center items-center">
      {/* Logo container with pulse animation */}
      <div className="mb-6 animate-pulse">
        <img 
          src="/favicon_io/android-chrome-512x512.png" 
          alt="Loading" 
          style={{ width: '64px', height: '64px' }}
        />
      </div>
      
      {/* Custom spinner */}
      <div className="mt-1">
        <div className="w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent animate-spin" />
      </div>
    </div>
  );
};

export default LoadingComponent;