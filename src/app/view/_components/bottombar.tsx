import { PageNavigation } from "./page-navigation";
import { Zoom } from "./zoom";

export const BottomBar = () => {
  return (
    <div className="fixed bottom-0 grid w-full grid-cols-3 p-2">
      <div className="col-start-2 col-end-2 flex justify-center">
        <PageNavigation />
      </div>
      <div className="col-start-3 col-end-3 flex justify-end">
        <Zoom />
      </div>
    </div>
  );
};
