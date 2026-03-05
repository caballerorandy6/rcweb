import { getLeadsTrendAction } from "@/actions/stats/getLeadsTrendAction";
import LeadsTrendChart from "./LeadsTrendChart";

export default async function LeadsTrendChartWrapper() {
  const initialData = await getLeadsTrendAction("30d");

  return (
    <LeadsTrendChart
      initialData={initialData}
      fetchData={getLeadsTrendAction}
    />
  );
}
