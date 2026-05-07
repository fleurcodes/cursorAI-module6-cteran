import type { KPIData } from './types';
import KPICard from './KPICard';
import LoadingSkeleton from './LoadingSkeleton';

interface KPIGridProps {
  data: KPIData[];
  isLoading: boolean;
}

export default function KPIGrid({ data, isLoading }: KPIGridProps) {
  return (
    <section
      aria-label="Key Performance Indicators"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 transition-opacity duration-300"
      style={{ opacity: isLoading ? 0.6 : 1 }}
    >
      {isLoading ? (
        <LoadingSkeleton variant="kpi" count={4} />
      ) : (
        data.map((kpi) => <KPICard key={kpi.id} data={kpi} />)
      )}
    </section>
  );
}
