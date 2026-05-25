import { useMemo } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { TrendingUp, ShoppingCart, CheckCircle2, DollarSign } from "lucide-react";
import { SalesReportResponse } from "../types/SalesReportResponse";
import {ReportStatCard} from "./reports-stat-card.tsx";
import {ReportChartCard} from "./reports-chart-card.tsx";

interface SalesReportSectionProps {
    report: SalesReportResponse;
}

const CHART_COLORS = {
    revenue: "#6366f1",
    profit: "#8b5cf6",
    orders: "#06b6d4",
    completedOrders: "#10b981",
};

const TOOLTIP_STYLE = {
    contentStyle: {
        background: "rgba(15, 23, 42, 0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "12px",
        color: "#fff",
        fontSize: "12px",
    },
    labelStyle: { color: "rgba(255,255,255,0.6)", marginBottom: 4 },
    cursor: { fill: "rgba(255,255,255,0.04)" },
};

export const SalesReportSection = ({ report }: SalesReportSectionProps) => {
    const revenueData = useMemo(() => {
        return report.dailyRevenue.map((rev, i) => ({
            day: `Day ${i + 1}`,
            Revenue: parseFloat(rev.toFixed(2)),
            Profit: parseFloat((report.dailyProfit[i] ?? 0).toFixed(2)),
        }));
    }, [report.dailyRevenue, report.dailyProfit]);

    const ordersData = useMemo(() => {
        return report.dailyOrders.map((orders, i) => ({
            day: `Day ${i + 1}`,
            Orders: orders,
            "Completed Orders": report.dailyCompletedOrders[i] ?? 0,
        }));
    }, [report.dailyOrders, report.dailyCompletedOrders]);

    const completionRate = useMemo(() => {
        if (report.totalOrders === 0) return "0%";
        return `${((report.completedOrders / report.totalOrders) * 100).toFixed(1)}%`;
    }, [report.completedOrders, report.totalOrders]);

    return (
        <div className="flex flex-col gap-8 fade-in">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <ReportStatCard
                    icon={<ShoppingCart size={16} />}
                    iconBg="bg-cyan-500/15"
                    iconColor="text-cyan-300"
                    label="Total Orders"
                    value={report.totalOrders.toLocaleString()}
                    subLabel="completion rate"
                    subValue={completionRate}
                />
                <ReportStatCard
                    icon={<CheckCircle2 size={16} />}
                    iconBg="bg-emerald-500/15"
                    iconColor="text-emerald-300"
                    label="Completed Orders"
                    value={report.completedOrders.toLocaleString()}
                    subLabel="of total orders"
                    subValue={report.totalOrders.toLocaleString()}
                />
                <ReportStatCard
                    icon={<DollarSign size={16} />}
                    iconBg="bg-indigo-500/15"
                    iconColor="text-indigo-300"
                    label="Total Revenue"
                    value={`$${report.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                />
                <ReportStatCard
                    icon={<TrendingUp size={16} />}
                    iconBg="bg-violet-500/15"
                    iconColor="text-violet-300"
                    label="Total Profit"
                    value={`$${report.totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    subLabel="margin"
                    subValue={
                        report.totalRevenue > 0
                            ? `${((report.totalProfit / report.totalRevenue) * 100).toFixed(1)}%`
                            : "0%"
                    }
                />
            </div>


            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ReportChartCard
                    title="Revenue & Profit Over Time"
                    description="Daily revenue vs profit trend"
                    height={300}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                            <XAxis
                                dataKey="day"
                                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                                tickLine={false}
                                tickFormatter={(v) => `$${v}`}
                            />
                            <Tooltip
                                contentStyle={TOOLTIP_STYLE.contentStyle}
                                labelStyle={TOOLTIP_STYLE.labelStyle}
                                cursor={{ stroke: "rgba(255,255,255,0.1)" }}
                            />
                            <Legend
                                wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Revenue"
                                stroke={CHART_COLORS.revenue}
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5, fill: CHART_COLORS.revenue }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Profit"
                                stroke={CHART_COLORS.profit}
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5, fill: CHART_COLORS.profit }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ReportChartCard>

                <ReportChartCard
                    title="Orders Over Time"
                    description="Daily total vs completed orders"
                    height={300}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ordersData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                            <XAxis
                                dataKey="day"
                                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={TOOLTIP_STYLE.contentStyle}
                                labelStyle={TOOLTIP_STYLE.labelStyle}
                                cursor={TOOLTIP_STYLE.cursor}
                            />
                            <Legend
                                wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}
                            />
                            <Bar
                                dataKey="Orders"
                                fill={CHART_COLORS.orders}
                                radius={[4, 4, 0, 0]}
                                fillOpacity={0.85}
                            />
                            <Bar
                                dataKey="Completed Orders"
                                fill={CHART_COLORS.completedOrders}
                                radius={[4, 4, 0, 0]}
                                fillOpacity={0.85}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ReportChartCard>
            </div>
        </div>
    );
};