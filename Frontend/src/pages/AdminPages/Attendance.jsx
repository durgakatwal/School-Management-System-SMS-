import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Users, UserCheck, UserX, Clock } from "lucide-react";
import api from "@/api/axios";
import AttendanceChart from "@/components/admin/AttendanceChart";

export default function Attendance() {
  const [activeTab, setActiveTab] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Add this temporary function to your Attendance page
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const res = await api.get("/attendance-lists/debug/check-database");
        console.log("🔍 Database Check:", res.data);
      } catch (error) {
        console.error("Debug check failed:", error);
      }
    };
    checkDatabase();
  }, []);
  // Fetch attendance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/attendance-lists", {
          params: {
            date: selectedDate,
            type: activeTab,
          },
        });
        setAttendanceData(res.data || []);
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
        setAttendanceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey, selectedDate, activeTab]);

  // Update attendance status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/attendance-lists/${id}`, { status: newStatus });

      // Update local state optimistically
      setAttendanceData((prev) =>
        prev.map((rec) =>
          rec._id === id ? { ...rec, status: newStatus } : rec
        )
      );

      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to update status:", err.response?.data);
      alert("Failed to update attendance status");
    }
  };

  // Filter data based on search
  const filteredData = attendanceData.filter((rec) => {
    const name = rec.student?.name || rec.teacher?.name || rec.name || "";
    const className = rec.student?.sclassName || rec.class || "";

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      className.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate real-time stats
  const stats = {
    total: filteredData.length,
    present: filteredData.filter((rec) => rec.status === "Present").length,
    absent: filteredData.filter((rec) => rec.status === "Absent").length,
    late: filteredData.filter((rec) => rec.status === "Late").length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800 border-green-200";
      case "Absent":
        return "bg-red-100 text-red-800 border-red-200";
      case "Late":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Attendance Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Monitor and manage daily attendance records
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-10 w-full sm:w-48"
                  />
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name or class..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Users className="h-5 w-5" />}
              title="Total"
              value={stats.total}
              description={`${
                activeTab === "students" ? "Students" : "Teachers"
              } tracked`}
              color="blue"
            />

            <StatCard
              icon={<UserCheck className="h-5 w-5" />}
              title="Present"
              value={stats.present}
              percentage={
                stats.total > 0
                  ? Math.round((stats.present / stats.total) * 100)
                  : 0
              }
              color="green"
            />

            <StatCard
              icon={<UserX className="h-5 w-5" />}
              title="Absent"
              value={stats.absent}
              percentage={
                stats.total > 0
                  ? Math.round((stats.absent / stats.total) * 100)
                  : 0
              }
              color="red"
            />

            <StatCard
              icon={<Clock className="h-5 w-5" />}
              title="Late"
              value={stats.late}
              percentage={
                stats.total > 0
                  ? Math.round((stats.late / stats.total) * 100)
                  : 0
              }
              color="yellow"
            />
          </div>

          {/* Analytics Chart */}
          <AttendanceChart
            refreshKey={refreshKey}
            selectedDate={selectedDate}
          />

          {/* Attendance Records */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Attendance Records</CardTitle>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="students">
                      Students (
                      {
                        attendanceData.filter((r) => r.type === "student")
                          .length
                      }
                      )
                    </TabsTrigger>
                    <TabsTrigger value="teachers">
                      Teachers (
                      {
                        attendanceData.filter((r) => r.type === "teacher")
                          .length
                      }
                      )
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredData.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        {activeTab === "students" && (
                          <TableHead>Class</TableHead>
                        )}
                        {activeTab === "teachers" && (
                          <TableHead>Subject</TableHead>
                        )}
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((record) => (
                        <AttendanceRow
                          key={record._id}
                          record={record}
                          type={activeTab}
                          onStatusChange={handleStatusChange}
                          getStatusColor={getStatusColor}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No attendance records
                  </h3>
                  <p className="mt-2 text-gray-500">
                    No {activeTab} attendance found for{" "}
                    {new Date(selectedDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

// Stat Card Component
const StatCard = ({
  icon,
  title,
  value,
  percentage,
  description,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    green: "text-green-600 bg-green-50 border-green-200",
    red: "text-red-600 bg-red-50 border-red-200",
    yellow: "text-yellow-600 bg-yellow-50 border-yellow-200",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
        {percentage !== undefined && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Percentage</span>
              <span
                className={`font-medium ${colorClasses[color].split(" ")[0]}`}
              >
                {percentage}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Attendance Row Component
const AttendanceRow = ({ record, type, onStatusChange, getStatusColor }) => {
  const name = record.student?.name || record.teacher?.name || record.name;
  const additionalInfo =
    type === "students"
      ? record.student?.sclassName || record.class
      : record.teacher?.subject;

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div>
          <div className="font-semibold">{name}</div>
          {type === "students" && record.student?.rollNum && (
            <div className="text-sm text-gray-500">
              Roll: {record.student.rollNum}
            </div>
          )}
        </div>
      </TableCell>

      <TableCell>
        <span className="text-sm text-gray-600">{additionalInfo || "-"}</span>
      </TableCell>

      <TableCell>
        <div className="text-sm text-gray-500">
          {record.date
            ? new Date(record.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"}
        </div>
      </TableCell>

      <TableCell>
        <Badge variant="outline" className={getStatusColor(record.status)}>
          {record.status}
        </Badge>
      </TableCell>

      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant={record.status === "Present" ? "default" : "outline"}
            onClick={() => onStatusChange(record._id, "Present")}
            className="h-8 px-3 text-xs"
          >
            Present
          </Button>
          <Button
            size="sm"
            variant={record.status === "Absent" ? "destructive" : "outline"}
            onClick={() => onStatusChange(record._id, "Absent")}
            className="h-8 px-3 text-xs"
          >
            Absent
          </Button>
          <Button
            size="sm"
            variant={record.status === "Late" ? "secondary" : "outline"}
            onClick={() => onStatusChange(record._id, "Late")}
            className="h-8 px-3 text-xs"
          >
            Late
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
