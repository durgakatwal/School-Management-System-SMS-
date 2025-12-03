import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/api/axios";

const COLORS = {
  Present: "#10B981",
  Absent: "#EF4444",
  Late: "#F59E0B",
};

export default function AttendanceChart({ refreshKey, selectedDate }) {
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("pie");

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);

        // Fetch chart data
        const chartRes = await api.get("/attendance-lists/stats/overview", {
          params: { date: selectedDate },
        });
        setChartData(chartRes.data);

        // Fetch detailed stats
        const statsRes = await api.get("/attendance-lists/stats/summary", {
          params: { date: selectedDate },
        });
        setStats(statsRes.data);
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
        setChartData([]);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [refreshKey, selectedDate]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80 flex items-center justify-center">
            <div className="animate-pulse text-gray-500">
              Loading analytics...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Attendance Analytics</CardTitle>
          <Tabs
            value={activeChart}
            onValueChange={setActiveChart}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pie">Distribution</TabsTrigger>
              <TabsTrigger value="bar">Breakdown</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Chart Section */}
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              {activeChart === "pie" ? (
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || COLORS[entry.name]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} attendees`, "Count"]}
                  />
                  <Legend />
                </PieChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} attendees`, "Count"]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || COLORS[entry.name]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Statistics Section */}
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Overall Stats */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-gray-700">
                  Overall Summary
                </h4>
                <div className="space-y-3">
                  <StatItem
                    label="Total Records"
                    value={stats.overall.total}
                    color="gray"
                  />
                  <StatItem
                    label="Present"
                    value={stats.overall.present}
                    percentage={stats.overall.presentPercentage}
                    color="green"
                  />
                  <StatItem
                    label="Absent"
                    value={stats.overall.absent}
                    percentage={stats.overall.absentPercentage}
                    color="red"
                  />
                  <StatItem
                    label="Late"
                    value={stats.overall.late}
                    percentage={stats.overall.latePercentage}
                    color="yellow"
                  />
                </div>
              </div>

              {/* Student Stats */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-gray-700">
                  Students
                </h4>
                <div className="space-y-3">
                  <StatItem
                    label="Total Students"
                    value={stats.students.total}
                    color="gray"
                  />
                  <StatItem
                    label="Present"
                    value={stats.students.present}
                    percentage={stats.students.presentPercentage}
                    color="green"
                  />
                  <StatItem
                    label="Absent"
                    value={stats.students.absent}
                    percentage={stats.students.absentPercentage}
                    color="red"
                  />
                </div>
              </div>

              {/* Teacher Stats */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-gray-700">
                  Teachers
                </h4>
                <div className="space-y-3">
                  <StatItem
                    label="Total Teachers"
                    value={stats.teachers.total}
                    color="gray"
                  />
                  <StatItem
                    label="Present"
                    value={stats.teachers.present}
                    percentage={stats.teachers.presentPercentage}
                    color="green"
                  />
                  <StatItem
                    label="Absent"
                    value={stats.teachers.absent}
                    percentage={stats.teachers.absentPercentage}
                    color="red"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Stat Item Component
const StatItem = ({ label, value, percentage, color = "gray" }) => {
  const colorClasses = {
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
    yellow: "text-yellow-600 bg-yellow-50",
    gray: "text-gray-600 bg-gray-50",
  };

  return (
    <div className="flex justify-between items-center p-3 rounded-lg border">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="text-right">
        <div className="font-semibold">{value}</div>
        {percentage !== undefined && (
          <div
            className={`text-xs px-2 py-1 rounded-full ${colorClasses[color]}`}
          >
            {percentage}%
          </div>
        )}
      </div>
    </div>
  );
};
