import { LogoIcon } from "@/components/icons/logo-icon";
import { MapContainer } from "@/components/map/map-container";

const HomePage = () => (
  <>
    <div className="fixed left-3 top-3 bg-white shadow-lg p-2 z-10">
      <LogoIcon className="w-10 md:w-14" />
    </div>
    <MapContainer />
  </>
);

export default HomePage;
