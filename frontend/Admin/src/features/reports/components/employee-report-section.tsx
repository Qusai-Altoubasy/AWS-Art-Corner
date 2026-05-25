import { useMemo } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { Users, DollarSign, TrendingUp, CheckCircle2 } from "lucide-react";
import { EmployeePerformanceReportResponse } from "../types/EmployeePerformanceReportResponse";
import { ReportStatCard } from "./reports-stat-card.tsx";
import { ReportChartCard } from "./reports-chart-card.tsx";

interface EmployeesReportSectionProps {
    report: EmployeePerformanceReportResponse;
}

const PIE_COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ec4899",
    "#3b82f6",
    "#a855f7",
];

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

export const EmployeesReportSection = ({ report }: EmployeesReportSectionProps) => {
    const totalRevenue = useMemo(
        () => report.employeeRevenues.reduce((acc, v) => acc + v, 0),
        [report.employeeRevenues],
    );

    const totalProfit = useMemo(
        () => report.employeeProfits.reduce((acc, v) => acc + v, 0),
        [report.employeeProfits],
    );

    const totalOrders = useMemo(
        () => report.employeeOrders.reduce((acc, v) => acc + v, 0),
        [report.employeeOrders],
    );

    const totalCompleted = useMemo(
        () => report.employeeCompletedOrders.reduce((acc, v) => acc + v, 0),
        [report.employeeCompletedOrders],
    );

    const barData = useMemo(() => {
        return report.employeeNames.map((name, i) => ({
            name: name.split(" ")[0],
            Revenue: parseFloat((report.employeeRevenues[i] ?? 0).toFixed(2)),
            Profit: parseFloat((report.employeeProfits[i] ?? 0).toFixed(2)),
        }));
    }, [report.employeeNames, report.employeeRevenues, report.employeeProfits]);

    const pieData = useMemo(() => {
        return report.employeeNames.map((name, i) => ({
            name: name.split(" ")[0],
            value: report.employeeRevenues[i] ?? 0,
            fill: PIE_COLORS[i % PIE_COLORS.length],
        }));
    }, [report.employeeNames, report.employeeRevenues]);

    return (
        <div className="flex flex-col gap-8 fade-in">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <ReportStatCard
                    icon={<Users size={16} />}
                    iconBg="bg-indigo-500/15"
                    iconColor="text-indigo-300"
                    label="Total Employees"
                    value={report.employeeNames.length.toLocaleString()}
                />
                <ReportStatCard
                    icon={<CheckCircle2 size={16} />}
                    iconBg="bg-cyan-500/15"
                    iconColor="text-cyan-300"
                    label="Total Orders"
                    value={totalOrders.toLocaleString()}
                />
                <ReportStatCard
                    icon={<DollarSign size={16} />}
                    iconBg="bg-emerald-500/15"
                    iconColor="text-emerald-300"
                    label="Total Revenue"
                    value={`$${totalRevenue.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`}
                />
                <ReportStatCard
                    icon={<TrendingUp size={16} />}
                    iconBg="bg-violet-500/15"
                    iconColor="text-violet-300"
                    label="Total Profit"
                    value={`$${totalProfit.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ReportChartCard
                    title="Revenue & Profit by Employee"
                    description="Comparison of revenue and profit per employee"
                    height={300}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                            <XAxis
                                dataKey="name"
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
                                cursor={TOOLTIP_STYLE.cursor}
                            />
                            <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }} />
                            <Bar dataKey="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
                            <Bar dataKey="Profit" fill="#8b5cf6" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
                        </BarChart>
                    </ResponsiveContainer>
                </ReportChartCard>

                <ReportChartCard
                    title="Revenue Share by Employee"
                    description="Distribution of revenue across employees"
                    height={300}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={110}
                                innerRadius={55}
                                dataKey="value"
                                paddingAngle={3}
                            />
                            <Tooltip
                                contentStyle={TOOLTIP_STYLE.contentStyle}
                                formatter={(value) => {
                                    const num = typeof value === "number" ? value : 0;
                                    return [`${num.toFixed(2)}`, "Revenue"];
                                }}
                            />
                            <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }} />
                        </PieChart>
                    </ResponsiveContainer>
                </ReportChartCard>
            </div>

            <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider text-white/60">
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Orders</th>
                        <th className="px-6 py-4">Completed</th>
                        <th className="px-6 py-4">Revenue</th>
                        <th className="px-6 py-4">Profit</th>
                        <th className="px-6 py-4 text-right">Margin</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {report.employeeNames.map((name, i) => {
                        const revenue = report.employeeRevenues[i] ?? 0;
                        const profit = report.employeeProfits[i] ?? 0;
                        const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : "0.0";

                        return (
                            <tr
                                key={report.employeeIds[i]}
                                className="group border-b border-white/5 bg-white/1 transition-colors duration-200 hover:bg-white/4"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300 text-xs font-bold">
                                            {name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold text-sm text-white truncate max-w-40">
                                                {name}
                                            </span>
                                            <span className="text-[10px] text-white/40 truncate max-w-40">
                                                {report.employeeEmails[i]}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                                    {(report.employeeOrders[i] ?? 0).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                                        {(report.employeeCompletedOrders[i] ?? 0).toLocaleString()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                                    ${revenue.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-violet-300">
                                    ${profit.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-indigo-300">
                                    {margin}%
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};