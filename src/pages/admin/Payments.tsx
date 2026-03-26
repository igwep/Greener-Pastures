import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  useAdminContributionPaymentsQuery,
  useApproveContributionPaymentMutation,
  useRejectContributionPaymentMutation,
} from "../../services/admin/hooks";

export function Payments() {
  const { data: contributionPayments } = useAdminContributionPaymentsQuery({
    status: "PENDING",
  });

  const approveContributionPaymentMutation =
    useApproveContributionPaymentMutation();
  const rejectContributionPaymentMutation =
    useRejectContributionPaymentMutation();

  const rows = useMemo(() => {
    return (contributionPayments?.items ?? []).map((cp) => {
      const first = cp.user?.firstName ?? "";
      const last = cp.user?.lastName ?? "";
      const fullName = `${first} ${last}`.trim();
      const userLabel =
        fullName || cp.user?.email || cp.user?.phone || "Unknown user";

      const createdAt = cp.createdAt ? new Date(cp.createdAt) : null;
      const timeLabel =
        createdAt && Number.isFinite(createdAt.getTime())
          ? createdAt.toLocaleString()
          : "";

      const amountNumber = cp.amountNaira ? Number(cp.amountNaira) : NaN;

      const dateCount = Array.isArray(cp.dates) ? cp.dates.length : 0;
      const dayLabel = dateCount === 1 ? "1 day" : `${dateCount} days`;

      return {
        id: cp.id,
        user: userLabel,
        plan: cp.plan?.name ?? "Contribution Payment",
        day: dayLabel,
        amount: Number.isFinite(amountNumber) ? amountNumber : 0,
        time: timeLabel,
        proofUrl: cp.proofUrl ?? null,
      };
    });
  }, [contributionPayments]);

  const handleApprove = async (id: string) => {
    await approveContributionPaymentMutation.mutateAsync({
      contributionPaymentId: id,
    });
  };

  const handleReject = async (id: string) => {
    await rejectContributionPaymentMutation.mutateAsync({
      contributionPaymentId: id,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Days
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-6 py-4 whitespace-nowrap">{row.user}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.plan}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.day}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ₦{row.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{row.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {row.proofUrl && (
                    <a
                      href={row.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      View Proof
                    </a>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleApprove(row.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="ml-2"
                    onClick={() => handleReject(row.id)}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
}
