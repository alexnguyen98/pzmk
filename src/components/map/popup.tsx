import { useDetail } from "@/hooks/use-detail";

export const Popup = (props: { activeItem: string; close: () => void }) => {
  const { data, isLoading } = useDetail(props.activeItem);

  return (
    <div className="fixed right-5 top-5 bottom-5 w-sm z-10 bg-white shadowl-xl p-5">
      <div className="text-xl font-black">Item detail</div>
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
