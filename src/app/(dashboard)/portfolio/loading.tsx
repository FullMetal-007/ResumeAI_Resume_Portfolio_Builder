import { PortfolioSkeleton } from "@/components/ui/skeletons";

export default function PortfolioLoading() {
    return (
        <div className="p-6 md:p-8">
            <PortfolioSkeleton />
        </div>
    );
}
