import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#1a1a1a]">
      <Loader2 className="animate-spin text-white" size={48} />
    </div>
  );
};

export default LoadingScreen;
