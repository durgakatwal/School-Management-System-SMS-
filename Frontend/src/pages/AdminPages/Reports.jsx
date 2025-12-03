// src/pages/Reports.jsx
import { useEffect, useState } from "react";

// ShadCN Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
import { FaChartBar, FaFilePdf, FaFileCsv, FaPrint } from "react-icons/fa";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function Reports() {
  const [reportType, setReportType] = useState("attendance");
  const [dateRange, setDateRange] = useState("this-month");
  const [classFilter, setClassFilter] = useState("All Classes");

  // Mock Data
  const attendanceData = [
    { name: "Class 6", present: 94, absent: 6 },
    { name: "Class 7", present: 96, absent: 4 },
    { name: "Class 8", present: 92, absent: 8 },
    { name: "Class 9", present: 95, absent: 5 },
    { name: "Class 10", present: 90, absent: 10 },
  ];

  const feeData = [
    { name: "Class 6", collected: 2.4, total: 2.8 },
    { name: "Class 7", collected: 2.6, total: 2.8 },
    { name: "Class 8", collected: 2.3, total: 2.8 },
    { name: "Class 9", collected: 2.7, total: 3.0 },
    { name: "Class 10", collected: 2.5, total: 3.0 },
  ];

  const examResults = [
    {
      id: 1,
      student: "Sophia Wilson",
      class: "12-A",
      subject: "Math",
      marks: 94,
      max: 100,
    },
    {
      id: 2,
      student: "Oliver Smith",
      class: "11-B",
      subject: "Science",
      marks: 87,
      max: 100,
    },
    {
      id: 3,
      student: "Emma Johnson",
      class: "12-A",
      subject: "English",
      marks: 91,
      max: 100,
    },
    {
      id: 4,
      student: "Liam Brown",
      class: "11-B",
      subject: "Math",
      marks: 76,
      max: 100,
    },
    {
      id: 5,
      student: "Mia Davis",
      class: "12-A",
      subject: "Science",
      marks: 83,
      max: 100,
    },
  ];

  const financialSummary = [
    { label: "Total Fees Collected", value: "₹3,200,000", change: "+12%" },
    { label: "Total Expenses", value: "₹1,850,000", change: "+8%" },
    { label: "Net Profit", value: "₹1,350,000", change: "+18%" },
    { label: "Pending Fees", value: "₹436,000", change: "-5%" },
  ];

  // Simulate export actions
  const handleExport = (format) => {
    alert(`Exporting report as ${format.toUpperCase()}...`);
    // In real app: trigger API call or download blob
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ========== SIDEBAR ========== */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col h-[calc(100vh-64px)] sticky">
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <FaChartBar /> Reports
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            📊 Analytics
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            📄 Student Reports
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            💰 Fee Reports
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            🧑‍🎓 Exam Results
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            📉 Attendance Trends
          </Button>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Button
            variant="outline"
            className="w-full justify-center text-black"
          >
            Log Out
          </Button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40">
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.print()}
            >
              <FaPrint />
            </Button>
            <Button variant="outline" onClick={() => handleExport("pdf")}>
              <FaFilePdf className="mr-2" /> PDF
            </Button>
            <Button onClick={() => handleExport("csv")}>
              <FaFileCsv className="mr-2" /> CSV
            </Button>
          </div>
        </header>

        <section className="p-6 space-y-8">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Report" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attendance">Attendance Report</SelectItem>
                <SelectItem value="fees">Fee Collection Report</SelectItem>
                <SelectItem value="exam">Exam Results</SelectItem>
                <SelectItem value="financial">Financial Summary</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
              </SelectContent>
            </Select>

            {(reportType === "attendance" || reportType === "fees") && (
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Classes">All Classes</SelectItem>
                  <SelectItem value="6-A">Class 6-A</SelectItem>
                  <SelectItem value="7-B">Class 7-B</SelectItem>
                  <SelectItem value="8-A">Class 8-A</SelectItem>
                  <SelectItem value="9-C">Class 9-C</SelectItem>
                  <SelectItem value="10-A">Class 10-A</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {financialSummary.map((item) => (
              <Card key={item.label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {item.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <p className="text-xs text-green-600 mt-1">{item.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                {reportType === "attendance"
                  ? "Attendance Trends"
                  : reportType === "fees"
                  ? "Fee Collection Over Time"
                  : "Performance Overview"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                {reportType === "attendance" ? (
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey="present" fill="#10B981" name="Present" />
                    <Bar dataKey="absent" fill="#EF4444" name="Absent" />
                  </BarChart>
                ) : reportType === "fees" ? (
                  <BarChart data={feeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey="collected" fill="#3B82F6" name="Collected" />
                    <Bar dataKey="total" fill="#D1D5DB" name="Target" />
                  </BarChart>
                ) : (
                  <BarChart data={examResults.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="student" />
                    <YAxis />
                    <Bar dataKey="marks" fill="#8B5CF6" name="Marks" />
                  </BarChart>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Marks / Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>{result.id}</TableCell>
                      <TableCell className="font-medium">
                        {result.student}
                      </TableCell>
                      <TableCell>{result.class}</TableCell>
                      <TableCell>{result.subject}</TableCell>
                      <TableCell>
                        {result.marks} / {result.max}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            result.marks >= 90
                              ? "bg-green-500"
                              : result.marks >= 75
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }
                        >
                          {result.marks >= 90
                            ? "Excellent"
                            : result.marks >= 75
                            ? "Good"
                            : "Needs Improvement"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
