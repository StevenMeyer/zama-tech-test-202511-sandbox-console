import { ApiKeyAnalytics } from "@/lib/key/analytics";
import { FC, memo, useCallback, useId, useMemo, useRef, useState } from "react";
import { LineChart, LineChartProps } from "@mui/x-charts";
import { getDateTimeUTC, getISODateUTC } from "@/lib/util/datetime";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";

interface Props {
    data: ApiKeyAnalytics['requestCounts'];
}

function useXAxisDaily(dataPoints: ApiKeyAnalytics['requestCounts']['daily']): NonNullable<LineChartProps['xAxis']> {
    return useMemo((): NonNullable<LineChartProps['xAxis']> => {
        const now = new Date();
        return [
            {
                data: Object.keys(dataPoints),
                reverse: true,
                tickInterval: Object.keys(dataPoints),
                valueFormatter(value: number): string {
                    const date = new Date(now);
                    // subtract days
                    date.setUTCDate(date.getUTCDate() - value);
                    return getISODateUTC(date);
                }
            }
        ];
    }, [dataPoints]);
}

function useXAxisWeekly(dataPoints: ApiKeyAnalytics['requestCounts']['weekly']): NonNullable<LineChartProps['xAxis']> {
    return useMemo((): NonNullable<LineChartProps['xAxis']> => {
        const now = new Date();
        return [
            {
                data: Object.keys(dataPoints),
                reverse: true,
                tickInterval: Object.keys(dataPoints),
                valueFormatter(value: number): string {
                    const date = new Date(now);
                    // subtract weeks
                    date.setUTCDate(date.getUTCDate() - 7 * value);
                    // go to start of week (Monday)
                    const dayOfWeek = date.getUTCDay();
                    if (dayOfWeek === 0) { // Sunday is the start of the week for some reason
                        date.setUTCDate(date.getUTCDate() - 6);
                    } else {
                        date.setUTCDate(date.getUTCDate() - dayOfWeek + 1);
                    }
                    return `Week starting ${getISODateUTC(date)} (Mon)`
                }
            }
        ];
    }, [dataPoints]);
}

function useXAxisMonthly(dataPoints: ApiKeyAnalytics['requestCounts']['monthly']): NonNullable<LineChartProps['xAxis']> {
    const months = useRef(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const);
    return useMemo((): NonNullable<LineChartProps['xAxis']> => {
        const now = new Date();
        return [
            {
                data: Object.keys(dataPoints),
                reverse: true,
                tickInterval: Object.keys(dataPoints),
                valueFormatter(value: number): string {
                    const date = new Date(now);
                    // subtract months
                    date.setUTCMonth(date.getUTCMonth() - value);
                    return months.current[date.getUTCMonth()];
                }
            }
        ];
    }, [dataPoints]);
}

function useXAxis(scale: keyof ApiKeyAnalytics['requestCounts'], data: ApiKeyAnalytics['requestCounts']): NonNullable<LineChartProps['xAxis']> {
    const xAxisDaily = useXAxisDaily(data.daily);
    const xAxisWeekly = useXAxisWeekly(data.weekly);
    const xAxisMonthly = useXAxisMonthly(data.monthly);

    if (scale === 'daily') {
        return xAxisDaily;
    }
    if (scale === 'weekly') {
        return xAxisWeekly;
    }
    return xAxisMonthly;
}

const ScaleSelector: FC<{ onChange(newScale: keyof ApiKeyAnalytics['requestCounts']): void; value: keyof ApiKeyAnalytics['requestCounts']}> = ({ onChange, value }) => {
    const labelId = useId();

    const handleChange = useCallback((event: SelectChangeEvent): void => {
        return onChange(event.target.value as keyof ApiKeyAnalytics['requestCounts']);
    }, [onChange]);

    return <FormControl fullWidth>
        <InputLabel id={labelId}>Timescale</InputLabel>
        <Select
            label="Timescale"
            labelId={labelId}
            value={value}
            onChange={handleChange}
        >
            <MenuItem value="daily">Days</MenuItem>
            <MenuItem value="weekly">Weeks</MenuItem>
            <MenuItem value="monthly">Months</MenuItem>
        </Select>
    </FormControl>;
};

export const RequestCountChart = memo<Props>(({ data }) => {
    const [scale, setScale] = useState<keyof ApiKeyAnalytics['requestCounts']>('daily');
    const xAxis = useXAxis(scale, data);
    const chartLabelId = useId();

    const series = useMemo((): LineChartProps['series'] => {
        return [
            {
                data: data[scale],
            },
        ];
    }, [data, scale]);

    return <Box>
        <Typography id={chartLabelId} variant="subtitle1">Requests made using this API key</Typography>
        <Box>
            <LineChart
                aria-labelledby={chartLabelId}
                height={500}
                series={series}
                xAxis={xAxis}
            />
        </Box>
        <Box>
            <ScaleSelector
                value={scale}
                onChange={setScale}
            />
        </Box>
    </Box>;
});
