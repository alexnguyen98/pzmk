import { useDetail } from "@/hooks/use-detail";
import { LucideX } from "lucide-react";

export const Popup = (props: { activeItem: string; close: () => void }) => {
  const { data, isLoading } = useDetail(props.activeItem);

  return (
    <div className="fixed right-5 top-5 bottom-5 w-sm z-10 bg-white shadowl-xl p-5">
      <div className="flex items-center justify-between">
        <div className="text-xl font-black">Item detail</div>
        <button
          onClick={props.close}
          disabled={isLoading}
          className="cursor-pointer text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <LucideX size={14} />
          Close
        </button>
      </div>
      <div className="mt-5">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-slate-100 overflow-x-scroll overflow-y-scroll max-h-80 p-3 shadow-inner">
            {JSON.stringify(data)}
          </div>
        )}
      </div>
    </div>
  );
};
