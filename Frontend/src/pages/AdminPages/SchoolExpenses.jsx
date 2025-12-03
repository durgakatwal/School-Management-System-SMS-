// src/pages/SchoolExpenses.jsx
import { useEffect, useState } from "react";

// ShadCN Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import ChartAreaInteractive from "@/components/admin/FeeChart";
import {
  Calendar,
  Calendar1,
  DollarSignIcon,
  HomeIcon,
  MessageCircle,
  Settings,
  TimerIcon,
} from "lucide-react";

// Mock Data
const expenseData = [
  { month: "Jan", amount: 80000 },
  { month: "Feb", amount: 95000 },
  { month: "Mar", amount: 120000 },
  { month: "Apr", amount: 110000 },
  { month: "May", amount: 130000 },
  { month: "Jun", amount: 150000 },
  { month: "Jul", amount: 140000 },
  { month: "Aug", amount: 160000 },
  { month: "Sep", amount: 170000 },
  { month: "Oct", amount: 180000 },
  { month: "Nov", amount: 190000 },
  { month: "Dec", amount: 200000 },
];

const expensesList = [
  {
    id: 1,
    category: "Staff Salary",
    description: "Monthly teacher salaries",
    amount: 80000,
    date: "2025-01-05",
    status: "Paid",
  },
  {
    id: 2,
    category: "Maintenance",
    description: "Building repair & cleaning",
    amount: 25000,
    date: "2025-01-10",
    status: "Pending",
  },
  {
    id: 3,
    category: "Utilities",
    description: "Electricity & water bill",
    amount: 18000,
    date: "2025-01-12",
    status: "Paid",
  },
  {
    id: 4,
    category: "Stationery",
    description: "Books & supplies",
    amount: 12000,
    date: "2025-01-15",
    status: "Overdue",
  },
  {
    id: 5,
    category: "Transport",
    description: "Bus fuel & maintenance",
    amount: 30000,
    date: "2025-01-18",
    status: "Pending",
  },
  {
    id: 6,
    category: "Event",
    description: "Annual Day celebration",
    amount: 50000,
    date: "2025-01-20",
    status: "Paid",
  },
];

const expenseOverview = [
  { label: "Total Expenses", value: "₹18,50,000", change: "+10%" },
  { label: "Staff Salary", value: "₹9,60,000", change: "+12%" },
  { label: "Maintenance", value: "₹2,40,000", change: "+8%" },
  { label: "Utilities", value: "₹2,16,000", change: "+5%" },
];

export default function SchoolExpenses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [open, setOpen] = useState(false);
  // Filter expenses based on search and filters
  const filteredExpenses = expensesList.filter((expense) => {
    const matchesSearch = expense.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      expense.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "All Status" || expense.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
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

          <div className="relative">
            {/* Dropdown Trigger */}
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 flex items-center"
              onClick={() => setOpen(!open)}
            >
              <DollarSignIcon /> Fees & Expenses
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${
                  open ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>

            {/* Dropdown Content */}
            {open && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  onClick={() => (window.location.href = "/fees")}
                >
                  Fees Management
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  onClick={() => (window.location.href = "/school-expenses")}
                >
                  School Expenses
                </button>
              </div>
            )}
          </div>

          <Button
            onClick={() => (window.location.href = "/calender")}
            variant="ghost"
            className="w-full justify-start gap-2"
          >
            <Calendar1 /> Calender
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
          <h1 className="text-2xl font-bold">School Expenses</h1>
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
          {/* Expense Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="col-span-1 lg:col-span-2">
              <CardContent>
                <ChartAreaInteractive />
              </CardContent>
            </Card>

            {/* Expense Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {expenseOverview.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <Badge className="bg-red-500 text-white px-2 py-1 rounded-full">
                        {item.value}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Expenses Table */}
          <Card>
            <CardHeader>
              <CardTitle>Expenses List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Categories">
                      All Categories
                    </SelectItem>
                    <SelectItem value="Staff Salary">Staff Salary</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Stationery">Stationery</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-40">
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
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.id}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>₹{expense.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            expense.status === "Paid"
                              ? "bg-green-500"
                              : expense.status === "Pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }
                        >
                          {expense.status}
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
