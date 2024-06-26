import { LoaderPinwheel } from "lucide-react";

import React from "react";

const ResponseLoader = () => {
  return (
    <div className="w-full flex justify-end bg-[#202020]">
      <LoaderPinwheel className="animate-spin text-gray-200" size={28} />
    </div>
  );
};

export default ResponseLoader;
