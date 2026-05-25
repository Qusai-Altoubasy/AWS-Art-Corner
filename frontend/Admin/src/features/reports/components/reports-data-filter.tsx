import { Calendar } from "lucide-react";
import {Input} from "@aws-amplify/ui-react";

interface ReportDateFilterProps {
    from: string;
    to: string;
    onFromChange: (value: string) => void;
    onToChange: (value: string) => void;
    disabled?: boolean;
}

export const ReportDateFilter = ({
                                     from,
                                     to,
                                     onFromChange,
                                     onToChange,
                                     disabled = false,
                                 }: ReportDateFilterProps) => {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                    From
                </label>
                <div className="relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                        <Calendar size={15} />
                    </div>
                    <Input
                        type="date"
                        value={from}
                        disabled={disabled}
                        onChange={(e) => onFromChange(e.target.value)}
                        className="
                            w-full
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/5
                            py-3.5
                            pl-10
                            pr-4
                            text-sm
                            text-white
                            outline-none
                            transition-all
                            duration-200
                            placeholder:text-white/30
                            focus:border-indigo-500/50
                            focus:bg-white/8
                            focus:ring-2
                            focus:ring-indigo-500/20
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            scheme-dark
                        "
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                    To
                </label>
                <div className="relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                        <Calendar size={15} />
                    </div>
                    <Input
                        type="date"
                        value={to}
                        disabled={disabled}
                        onChange={(e) => onToChange(e.target.value)}
                        className="
                            w-full
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/5
                            py-3.5
                            pl-10
                            pr-4
                            text-sm
                            text-white
                            outline-none
                            transition-all
                            duration-200
                            placeholder:text-white/30
                            focus:border-indigo-500/50
                            focus:bg-white/8
                            focus:ring-2
                            focus:ring-indigo-500/20
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            scheme-dark
                        "
                    />
                </div>
            </div>
        </div>
    );
};