import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { StockStatus } from "@/lib/types/product";

export function StockBadge({ status }: { status: StockStatus }) {
  if (status === "ready") {
    return (
      <Badge variant="success">
        <CheckCircle2 className="size-3.5" strokeWidth={2} aria-hidden />
        Ready
      </Badge>
    );
  }
  return (
    <Badge variant="danger">
      <XCircle className="size-3.5" strokeWidth={2} aria-hidden />
      Sold Out
    </Badge>
  );
}
