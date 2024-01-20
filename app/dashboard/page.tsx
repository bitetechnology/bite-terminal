import DashboardHeading from "@/components/DashboardHeading";
import Last30DaysStats from "@/components/Last30DaysStats";
import RevenueStats from "@/components/RevenueStats";

export default function Dashboard() {
  return (
    <>
      <DashboardHeading title={`Welcome to your dashboard`} />
      <RevenueStats />
      <div className="mt-4" />
      <Last30DaysStats />
    </>
  );
}
