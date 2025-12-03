// src/pages/Fees.jsx
import { useEffect, useState } from "react";

// ShadCN Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icons
import { FaMoneyBillWave, FaChartLine, FaEdit, FaTrash } from "react-icons/fa";

// Charts
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import ChartAreaInteractive from "@/components/admin/FeeChart";
import ChartLineInteractive from "@/components/admin/FeeChartLine";
import {
  Calendar,
  DollarSign,
  HomeIcon,
  MessageCircle,
  Settings,
  TimerIcon,
} from "lucide-react";

// Mock Data
const feeData = [
  { month: "Jan", amount: 1200 },
  { month: "Feb", amount: 1500 },
  { month: "Mar", amount: 1800 },
  { month: "Apr", amount: 2200 },
  { month: "May", amount: 2400 },
  { month: "Jun", amount: 3000 },
  { month: "Jul", amount: 2800 },
  { month: "Aug", amount: 3200 },
  { month: "Sep", amount: 3500 },
  { month: "Oct", amount: 3700 },
  { month: "Nov", amount: 3900 },
  { month: "Dec", amount: 4200 },
];

const studentFees = [
  {
    id: 1,
    name: "Sophia Wilson",
    class: "12-A",
    tuition: 80000,
    hostel: 15000,
    transport: 20000,
    dayBoarding: 20000,
    total: 115000,
    pending: 85000,
    status: "Pending",
    action: "edit",
  },
  {
    id: 2,
    name: "Oliver Smith",
    class: "11-B",
    tuition: 75000,
    hostel: 14000,
    transport: 18000,
    dayBoarding: 18000,
    total: 105000,
    pending: 75000,
    status: "Overdue",
    action: "delete",
  },
  {
    id: 3,
    name: "Emma Johnson",
    class: "12-A",
    tuition: 80000,
    hostel: 15000,
    transport: 20000,
    dayBoarding: 20000,
    total: 115000,
    pending: 0,
    status: "Paid",
    action: "edit",
  },
  {
    id: 4,
    name: "Liam Brown",
    class: "11-B",
    tuition: 75000,
    hostel: 14000,
    transport: 18000,
    dayBoarding: 18000,
    total: 105000,
    pending: 60000,
    status: "Pending",
    action: "edit",
  },
  {
    id: 5,
    name: "Mia Davis",
    class: "12-A",
    tuition: 80000,
    hostel: 15000,
    transport: 20000,
    dayBoarding: 20000,
    total: 115000,
    pending: 90000,
    status: "Overdue",
    action: "delete",
  },
];

const feeStatus = [
  { label: "Paid", count: 1335, status: "Paid", color: "bg-green-500" },
  { label: "Pending", count: 4366, status: "Pending", color: "bg-yellow-500" },
  { label: "Overdue", count: 208, status: "Overdue", color: "bg-red-500" },
];

const feeOverview = [
  { label: "Total Amount", value: "₹3,50,000", change: "+12%" },
  { label: "Total Hostel", value: "₹1,20,000", change: "+15%" },
  { label: "Total Tuition", value: "₹2,00,000", change: "+10%" },
  { label: "Total Day-Boarding", value: "₹30,000", change: "+8%" },
];

export default function Fees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // Filter students based on search and filters
  const filteredStudents = studentFees.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === "All Classes" || student.class === selectedClass;
    const matchesStatus =
      selectedStatus === "All Status" || student.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ========== SIDEBAR ========== */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col h-[calc(100vh-64px)] sticky">
        <nav className="flex-1 p-4 space-y-2">
          <Button
            onClick={() => (window.location.href = "/")}
            variant="ghost"
            className="w-full justify-start gap-2"
          >
            <HomeIcon /> Home
          </Button>
          <Button
            onClick={() => (window.location.href = "/fees")}
            variant="ghost"
            className="w-full justify-start gap-2"
          >
            <FaMoneyBillWave /> Fees Management
          </Button>
          <Button
            onClick={() => (window.location.href = "/school-expenses")}
            variant="ghost"
            className="w-full justify-start gap-2"
          >
            <DollarSign /> School Expenses
          </Button>
          <Button
            onClick={() => (window.location.href = "/calender")}
            variant="ghost"
            className="w-full justify-start gap-2"
          >
            <Calendar /> Calender
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <TimerIcon /> Time Table
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <MessageCircle /> Message
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings /> Settings
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
      <main className="flex-1 overflow-auto relative">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40">
          <h1 className="text-2xl font-bold">Fees Management</h1>
          <div className="flex gap-4">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </header>

        <section className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Fee Collection Chart */}
            <Card className="col-span-1 lg:col-span-2">
              <CardContent>
                {/* <ChartAreaInteractive /> */}
                <ChartLineInteractive />
              </CardContent>
            </Card>

            {/* Fee Status */}
            <Card>
              <CardHeader>
                <CardTitle>Fee Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {feeStatus.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <Badge
                        className={`${item.color} text-white px-2 py-1 rounded-full`}
                      >
                        {item.count}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Fee Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Fee Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {feeOverview.map((item) => (
                  <div
                    key={item.label}
                    className="p-4 bg-blue-50 rounded-lg border"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">{item.label}</p>
                        <p className="font-bold text-lg">{item.value}</p>
                      </div>
                      <div className="text-xs text-green-600">
                        {item.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fees Collection Table */}
          <Card>
            <CardHeader>
              <CardTitle>Fees Collection Table</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Classes">All Classes</SelectItem>
                    <SelectItem value="12-A">12-A</SelectItem>
                    <SelectItem value="11-B">11-B</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Status">All Status</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Tuition</TableHead>
                    <TableHead>Hostel</TableHead>
                    <TableHead>Transport</TableHead>
                    <TableHead>Day-Boarding</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://ui-avatars.com/api/?name=${student.name}&background=random`}
                            alt=""
                            className="w-6 h-6 rounded-full"
                          />
                          {student.name}
                        </div>
                      </TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>₹{student.tuition.toLocaleString()}</TableCell>
                      <TableCell>₹{student.hostel.toLocaleString()}</TableCell>
                      <TableCell>
                        ₹{student.transport.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ₹{student.dayBoarding.toLocaleString()}
                      </TableCell>
                      <TableCell>₹{student.total.toLocaleString()}</TableCell>
                      <TableCell>₹{student.pending.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            student.status === "Paid"
                              ? "bg-green-500"
                              : student.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                className="mr-1"
                              >
                                <FaEdit />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="outline">
                                <FaTrash />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
