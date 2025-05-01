import CardDisplay from "@/components/UI/CardDisplay";
import { FaChartPie, FaDollarSign, FaMicrochip, FaUser } from "react-icons/fa";

export default function QuickStats() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7">
      <CardDisplay
        icon={FaUser}
        title="Total Users"
        value={2789107}
        valueDesc="This week"
        rateChange="up"
        rate="5.4%"
      />
      <CardDisplay
        icon={FaChartPie}
        title="Page Visits"
        value={17567}
        valueDesc="Last hour"
        rateChange="down"
        rate="5.4%"
      />
      <CardDisplay
        icon={FaDollarSign}
        title="Revenue Today"
        value={3567.89}
        prefix="$"
        valueDesc="Yesterday $2,345.67"
        rateChange="up"
        rate=" 5.4%"
      />
      <CardDisplay
        icon={FaMicrochip}
        title="Database CPU"
        value={56.2}
        suffix="%"
        rateChange="up"
        rate="1.56%"
      />
      {/* <CardDisplay title="Monkeys" /> */}
    </div>
  );
}
