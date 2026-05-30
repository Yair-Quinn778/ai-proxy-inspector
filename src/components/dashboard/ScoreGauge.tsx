import ReactECharts from "echarts-for-react";
import { gradeColor } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  grade: string;
}

export default function ScoreGauge({ score, grade }: ScoreGaugeProps) {
  const option = {
    series: [
      {
        type: "gauge",
        startAngle: 210,
        endAngle: -30,
        center: ["50%", "55%"],
        radius: "90%",
        min: 0,
        max: 100,
        splitNumber: 10,
        axisLine: {
          show: true,
          lineStyle: {
            width: 20,
            color: [
              [0.3, "#ef4444"],
              [0.5, "#f59e0b"],
              [0.7, "#3b82f6"],
              [0.85, "#22c55e"],
              [1, "#a855f7"],
            ],
          },
        },
        pointer: {
          icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
          length: "60%",
          width: 8,
          offsetCenter: [0, "-10%"],
          itemStyle: {
            color: "auto",
          },
        },
        axisTick: {
          length: 10,
          lineStyle: {
            color: "auto",
            width: 2,
          },
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: "auto",
            width: 4,
          },
        },
        axisLabel: {
          color: "#9ca3af",
          fontSize: 10,
          distance: 20,
          formatter: function (value: number) {
            return value.toString();
          },
        },
        title: {
          offsetCenter: [0, "75%"],
          fontSize: 14,
          color: "#9ca3af",
        },
        detail: {
          fontSize: 36,
          offsetCenter: [0, "45%"],
          valueAnimation: true,
          formatter: function (value: number) {
            return value.toString();
          },
          color: "#fff",
          fontWeight: "bold",
        },
        data: [
          {
            value: score,
            name: grade,
          },
        ],
      },
    ],
  };

  return (
    <div className="w-full max-w-[300px] mx-auto">
      <ReactECharts option={option} style={{ height: "260px" }} theme="dark" />
      <div className={`text-center text-xl font-bold ${gradeColor(grade)}`}>
        {grade}
      </div>
    </div>
  );
}
