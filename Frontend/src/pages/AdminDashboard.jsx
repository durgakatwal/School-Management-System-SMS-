// import { useEffect, useState } from "react";

// // ShadCN Components
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// //dropdown
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// // Icons
// import {
//   FaUsers,
//   FaChalkboardTeacher,
//   FaCalendarAlt,
//   FaChartLine,
//   FaComments,
// } from "react-icons/fa";

// // Custom Components
// import AddTeacher from "@/components/admin/AddTeacher";
// import AddStudent from "@/components/admin/AddStudent";

// // Auth & Routing
// import useAuth from "@/hooks/useAuth";
// import { useNavigate } from "react-router-dom";
// import ChartBarDefault from "@/components/admin/chart";
// // import DataTable from "@/components/admin/Data-Table";
// import useApi from "@/hooks/useApi";
// import { fetchAdminStats } from "@/api/admin";
// import { toast } from "sonner";
// import {
//   BookOpenText,
//   CircleDollarSign,
//   Landmark,
//   PlusIcon,
//   X,
// } from "lucide-react";
// import ChartAreaInteractive from "@/components/admin/FeeChart";
// import api from "@/api/axios";
// import DataTable from "@/components/admin/Data-Table";
// // import StudentTable from "@/components/students/StudentTable";

// export default function AdminDashboard() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   // Modal States
//   const [showTeacherForm, setShowTeacherForm] = useState(false);
//   const [showStudentForm, setShowStudentForm] = useState(false);

//   // Popup States
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);

//   //for fetching data from the backend
//   // const { stats, loading } = useApi("/stats");
//   // console.log(stats);

//   const [stats, setStats] = useState({
//     classes: 0,
//     students: 0,
//     teachers: 0,
//     subjects: 0,
//     fees: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [students, setStudents] = useState([]); //  state for student data
//   useEffect(() => {
//     const loadStats = async () => {
//       try {
//         const data = await fetchAdminStats();
//         setStats(data);
//         setLoading(false);
//       } catch (error) {
//         console.log("Error loading stats:", error);
//         toast("Failed to load stats");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadStats();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = () => {
//       setShowCalendar(false);
//       setShowNotifications(false);
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   //  Fetch students list
//   useEffect(() => {
//     const loadStudents = async () => {
//       try {
//         const res = await api.get("/students/Students");
//         setStudents(res.data); // assuming API returns array of students
//         console.log(res.data);
//       } catch (error) {
//         console.error("Error fetching students:", error);
//         toast.error("Failed to load students");
//       }
//     };
//     loadStudents();
//   }, []);
//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* ========== SIDEBAR ========== */}
//       <aside className="w-64 bg-gray-900 text-white flex flex-col h-[calc(100vh-64px)] sticky">
//         {/* <div className="p-6 border-b border-gray-700">
//           <h1 className="text-xl font-bold">WanderWise</h1>
//         </div> */}
//         <nav className="flex-1 p-4 space-y-2">
//           <Button
//             onClick={() => navigate("/teacher")}
//             variant="ghost"
//             className="w-full justify-start gap-2"
//           >
//             <FaChalkboardTeacher /> Teachers
//           </Button>
//           <Button
//             onClick={() => navigate("/student")}
//             variant="ghost"
//             className="w-full justify-start gap-2"
//           >
//             <FaUsers /> Students
//           </Button>
//           <Button
//             onClick={() => navigate("/calender")}
//             variant="ghost"
//             className="w-full justify-start gap-2"
//           >
//             <FaCalendarAlt /> Calendar
//           </Button>
//           <Button
//             onClick={() => navigate("/messages")}
//             variant="ghost"
//             className="w-full justify-start gap-2"
//           >
//             <FaComments /> Messages
//           </Button>

//           <Button
//             onClick={() => navigate("/notices")}
//             variant="ghost"
//             className="w-full justify-start gap-2"
//           >
//             <FaComments /> Notices
//           </Button>

//           <Button
//             onClick={() => navigate("/reports")}
//             variant="ghost"
//             className="w-full justify-start gap-2"
//           >
//             <FaChartLine /> Reports
//           </Button>
//           <DropdownMenu>
//             <DropdownMenuTrigger>
//               <Button variant="ghost" className="w-full justify-start gap-2">
//                 <CircleDollarSign /> Fees
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               <Button
//                 onClick={() => navigate("/fees")}
//                 variant="ghost"
//                 className="w-full justify-start gap-2"
//               >
//                 <DropdownMenuItem>Fees Management</DropdownMenuItem>
//               </Button>
//               <Button
//                 onClick={() => navigate("/school-expenses")}
//                 variant="ghost"
//                 className="w-full justify-start gap-2"
//               >
//                 <DropdownMenuItem>School Expenses</DropdownMenuItem>
//               </Button>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </nav>
//         <div className="p-4 border-t border-gray-700">
//           <Button
//             onClick={() => {
//               logout();
//               navigate("/login");
//             }}
//             variant="outline"
//             className="w-full justify-center text-black"
//           >
//             Log Out
//           </Button>
//         </div>
//       </aside>

//       {/* ========== MAIN CONTENT ========== */}
//       <main className="flex-1 overflow-auto relative justify-center items-center">
//         {/* Header */}
//         <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40">
//           <h1 className="text-2xl font-bold">
//             Welcome, {user?.firstName || "Admin"}
//           </h1>

//           <div className="flex gap-4">
//             {/* Calendar Button */}
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowCalendar((prev) => !prev);
//               }}
//               className="gap-1"
//             >
//               <FaCalendarAlt /> Today
//             </Button>

//             {/* Notifications Button */}
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowNotifications((prev) => !prev);
//               }}
//               className="relative gap-1"
//             >
//               <FaComments /> Notifications
//               {showNotifications && (
//                 <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
//               )}
//             </Button>
//           </div>
//         </header>

//         {/* Dashboard Content */}
//         <section className="p-6">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-lg font-semibold text-yellow-800">
//                   Students
//                 </CardTitle>
//                 <FaUsers className="text-yellow-700" />
//               </CardHeader>
//               <CardContent>
//                 <p className="text-3xl font-bold text-yellow-800">
//                   {loading ? "..." : stats?.students}
//                 </p>
//                 <p className="text-sm text-yellow-700">+12% from last month</p>
//               </CardContent>
//             </Card>

//             <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-lg font-semibold text-purple-800">
//                   Teachers
//                 </CardTitle>
//                 <FaChalkboardTeacher className="text-purple-700" />
//               </CardHeader>
//               <CardContent>
//                 <p className="text-3xl font-bold text-purple-800">
//                   {loading ? "..." : stats?.teachers}
//                 </p>
//                 <p className="text-sm text-purple-700">+8% from last month</p>
//               </CardContent>
//             </Card>

//             <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-lg font-semibold text-blue-800">
//                   Classes
//                 </CardTitle>
//                 {/* <FaUsers className="text-blue-700" /> */}
//                 <Landmark className="text-blue-700" />
//               </CardHeader>
//               <CardContent>
//                 <p className="text-3xl font-bold text-blue-800">
//                   {loading ? "..." : stats?.classes}
//                 </p>
//                 <p className="text-sm text-blue-700">No change</p>
//               </CardContent>
//             </Card>

//             <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-lg font-semibold text-green-800">
//                   Subjects
//                 </CardTitle>
//                 {/* <FaChalkboardTeacher className="text-green-700" /> */}
//                 <BookOpenText className="text-green-700" />
//               </CardHeader>
//               <CardContent>
//                 <p className="text-3xl font-bold text-green-800">
//                   {loading ? "..." : stats?.subjects}
//                 </p>
//                 <p className="text-sm text-green-700">+5% from last month</p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Two-Column Layout */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Earnings Chart */}
//             <card>
//               {/* <ChartBarDefault /> */}
//               <ChartAreaInteractive />
//             </card>
//             {/* Messages */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Messages</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-3">
//                   {[
//                     {
//                       name: "Jane Cooper",
//                       msg: "Don't forget the lab report...",
//                       time: "12:34 pm",
//                     },
//                     {
//                       name: "Kristin Watson",
//                       msg: "Do we have maths test?",
//                       time: "12:34 pm",
//                     },
//                     { name: "Jenny Wilson", msg: "Muted", time: "12:34 pm" },
//                     {
//                       name: "Brooklyn Sim",
//                       msg: "Can we go for a movie?",
//                       time: "12:34 pm",
//                     },
//                   ].map((msg, i) => (
//                     <li
//                       key={i}
//                       className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
//                     >
//                       <img
//                         src={`https://ui-avatars.com/api/?name=${msg.name}&background=random`}
//                         alt=""
//                         className="w-8 h-8 rounded-full"
//                       />
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium text-sm truncate">
//                           {msg.name}
//                         </p>
//                         <p className="text-xs text-gray-500 truncate">
//                           {msg.msg}
//                         </p>
//                       </div>
//                       <span className="text-xs text-gray-400 whitespace-nowrap">
//                         {msg.time}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </CardContent>
//             </Card>
//           </div>
//         </section>

//         {/* Action Buttons */}
//         <div className="flex gap-4 mb-8 justify-end mr-8">
//           <Button variant="outline" onClick={() => setShowTeacherForm(true)}>
//             <PlusIcon /> Add Teacher
//           </Button>
//           <Button variant="outline" onClick={() => setShowStudentForm(true)}>
//             <PlusIcon /> Add Student
//           </Button>
//         </div>

//         <section>
//           {/* <DataTable data={students} /> */}
//           <DataTable data={students} />
//         </section>

//         {/* ========== CALENDAR POPUP ========== */}
//         {showCalendar && (
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="absolute top-20 right-6 mt-2 bg-white border rounded-lg shadow-lg p-4 w-64 z-50 animate-in fade-in zoom-in-95"
//           >
//             <h3 className="font-semibold mb-2">Today's Date</h3>
//             <div className="text-sm font-medium">
//               {new Date().toLocaleDateString("en-US", {
//                 weekday: "long",
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//             </div>
//             <p className="text-gray-500 text-sm mt-2">No scheduled events.</p>
//             <button
//               className="mt-3 text-blue-600 text-sm underline hover:text-blue-800"
//               onClick={() => navigate("/calender")}
//             >
//               View Full Calendar
//             </button>
//           </div>
//         )}

//         {/* ========== NOTIFICATIONS POPUP ========== */}
//         {showNotifications && (
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="absolute top-20 right-32 mt-2 bg-white border rounded-lg shadow-lg p-4 w-80 z-50 max-h-96 overflow-auto animate-in fade-in slide-in-from-top-2"
//           >
//             <h3 className="font-semibold mb-3">Notifications</h3>
//             <ul className="space-y-3">
//               <li className="flex items-start gap-2 text-sm">
//                 <span className="text-yellow-500 mt-1">●</span>
//                 <div>
//                   <p>
//                     <strong>Class Reminder:</strong> Math test tomorrow
//                   </p>
//                   <span className="text-gray-500 text-xs">2 hours ago</span>
//                 </div>
//               </li>
//               <li className="flex items-start gap-2 text-sm">
//                 <span className="text-green-500 mt-1">●</span>
//                 <div>
//                   <p>
//                     <strong>New Student:</strong> John Doe joined Grade 10
//                   </p>
//                   <span className="text-gray-500 text-xs">1 day ago</span>
//                 </div>
//               </li>
//               <li className="flex items-start gap-2 text-sm">
//                 <span className="text-blue-500 mt-1">●</span>
//                 <div>
//                   <p>
//                     <strong>Payment Due:</strong> School fee pending
//                   </p>
//                   <span className="text-gray-500 text-xs">3 days ago</span>
//                 </div>
//               </li>
//             </ul>
//             <button
//               className="mt-3 text-blue-600 text-sm underline hover:text-blue-800"
//               onClick={() => {
//                 setShowNotifications(false);
//                 alert("All notifications marked as read.");
//               }}
//             >
//               Mark All as Read
//             </button>
//           </div>
//         )}
//       </main>

//       {/* ========== MODALS ========== */}

//       {/* Add Teacher Modal */}
//       {showTeacherForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] relative max-h-[90vh] overflow-auto">
//             <button
//               onClick={() => setShowTeacherForm(false)}
//               className="absolute top-2 right-3 text-gray-500 text-lg hover:text-gray-700"
//             >
//               ✖
//             </button>
//             <AddTeacher />
//           </div>
//         </div>
//       )}

//       {/* Add Student Modal */}
//       {showStudentForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] relative max-h-[90vh] overflow-auto">
//             <button
//               onClick={() => setShowStudentForm(false)}
//               className="absolute top-2 right-3 text-gray-500 text-lg hover:text-gray-700"
//             >
//               <X />
//             </button>
//             <AddStudent />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";

// ShadCN Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

//dropdown
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Icons
import {
  FaUsers,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaChartLine,
  FaComments,
} from "react-icons/fa";

// Custom Components
import AddTeacher from "@/components/admin/AddTeacher";
import AddStudent from "@/components/admin/AddStudent";

// Auth & Routing
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ChartBarDefault from "@/components/admin/chart";
// import DataTable from "@/components/admin/Data-Table";
import useApi from "@/hooks/useApi";
import { fetchAdminStats } from "@/api/admin";
import { toast } from "sonner";
import {
  BookOpenText,
  CircleDollarSign,
  Landmark,
  PlusIcon,
  X,
  MessageCircle,
} from "lucide-react";
import ChartAreaInteractive from "@/components/admin/FeeChart";
import api from "@/api/axios";
import DataTable from "@/components/admin/Data-Table";
// import StudentTable from "@/components/students/StudentTable";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Modal States
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);

  // Popup States
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  //for fetching data from the backend
  // const { stats, loading } = useApi("/stats");
  // console.log(stats);

  const [stats, setStats] = useState({
    classes: 0,
    students: 0,
    teachers: 0,
    subjects: 0,
    fees: 0,
  });
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]); //  state for student data
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchAdminStats();
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.log("Error loading stats:", error);
        toast("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowCalendar(false);
      setShowNotifications(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  //popout the messsage clicking the message icon
  const [isHovered, setIsHovered] = useState(false);

  //  Fetch students list
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await api.get("/students/Students");
        setStudents(res.data); // assuming API returns array of students
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to load students");
      }
    };
    loadStudents();
  }, []);
  return (
    <div className="flex h-screen bg-gray-50">
      {/*  SIDEBAR  */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col h-[calc(100vh-64px)] sticky">
        {/* <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">WanderWise</h1>
        </div> */}
        <nav className="flex-1 p-4 space-y-2">
          <Button
            onClick={() => navigate("/teacher")}
            variant="ghost"
            className="w-full justify-start gap-2"
          >
            <FaChalkboardTeacher /> Teachers
          </Button>
          <Button
            onClick={() => navigate("/student")}
            variant="ghost"
            className="w-full justify-start gap-2"
          >
            <FaUsers /> Students
          </Button>
          <Button
            onClick={() => navigate("/calender")}
            variant="ghost"
            className="w-full justify-start gap-2"
          >
            <FaCalendarAlt /> Calendar
          </Button>
          <Button
            onClick={() => navigate("/messages")}
            variant="ghost"
            className="w-full justify-start gap-2"
          >
            <FaComments /> Messages
          </Button>

          <Button
            onClick={() => navigate("/notices")}
            variant="ghost"
            className="w-full justify-start gap-2"
          >
            <FaComments /> Notices
          </Button>

          <Button
            onClick={() => navigate("/reports")}
            variant="ghost"
            className="w-full justify-start gap-2"
          >
            <FaChartLine /> Reports
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <CircleDollarSign /> Fees
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Button
                onClick={() => navigate("/fees")}
                variant="ghost"
                className="w-full justify-start gap-2"
              >
                <DropdownMenuItem>Fees Management</DropdownMenuItem>
              </Button>
              <Button
                onClick={() => navigate("/school-expenses")}
                variant="ghost"
                className="w-full justify-start gap-2"
              >
                <DropdownMenuItem>School Expenses</DropdownMenuItem>
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            variant="outline"
            className="w-full justify-center text-black"
          >
            Log Out
          </Button>
        </div>
      </aside>

      {/*  MAIN CONTENT  */}
      <main className="flex-1 overflow-auto relative justify-center items-center">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40">
          <h1 className="text-2xl font-bold">
            Welcome, {user?.firstName || "Admin"}
          </h1>

          <div className="flex gap-4">
            {/* Calendar Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowCalendar((prev) => !prev);
              }}
              className="gap-1"
            >
              <FaCalendarAlt /> Today
            </Button>

            {/* Notifications Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifications((prev) => !prev);
              }}
              className="relative gap-1"
            >
              <FaComments /> Notifications
              {showNotifications && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <section className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-yellow-800">
                  Students
                </CardTitle>
                <FaUsers className="text-yellow-700" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-800">
                  {loading ? "..." : stats?.students}
                </p>
                <p className="text-sm text-yellow-700">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-purple-800">
                  Teachers
                </CardTitle>
                <FaChalkboardTeacher className="text-purple-700" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-800">
                  {loading ? "..." : stats?.teachers}
                </p>
                <p className="text-sm text-purple-700">+8% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-blue-800">
                  Classes
                </CardTitle>
                {/* <FaUsers className="text-blue-700" /> */}
                <Landmark className="text-blue-700" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-800">
                  {loading ? "..." : stats?.classes}
                </p>
                <p className="text-sm text-blue-700">No change</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-green-800">
                  Subjects
                </CardTitle>
                {/* <FaChalkboardTeacher className="text-green-700" /> */}
                <BookOpenText className="text-green-700" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-800">
                  {loading ? "..." : stats?.subjects}
                </p>
                <p className="text-sm text-green-700">+5% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Earnings Chart */}
            <card>
              {/* <ChartBarDefault /> */}
              <ChartAreaInteractive />
            </card>

            {/* Recent Activities Card (Replaced Messages) */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[
                    {
                      activity: "New student registration",
                      time: "2 hours ago",
                      type: "student",
                    },
                    {
                      activity: "Math test scheduled",
                      time: "4 hours ago",
                      type: "academic",
                    },
                    {
                      activity: "Staff meeting completed",
                      time: "1 day ago",
                      type: "staff",
                    },
                    {
                      activity: "Fee collection report generated",
                      time: "2 days ago",
                      type: "finance",
                    },
                  ].map((activity, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <div
                        className={`w-2 h-2 mt-2 rounded-full ${
                          activity.type === "student"
                            ? "bg-blue-500"
                            : activity.type === "academic"
                            ? "bg-green-500"
                            : activity.type === "staff"
                            ? "bg-purple-500"
                            : "bg-orange-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {activity.activity}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 justify-end mr-8">
          <Button variant="outline" onClick={() => setShowTeacherForm(true)}>
            <PlusIcon /> Add Teacher
          </Button>
          <Button variant="outline" onClick={() => setShowStudentForm(true)}>
            <PlusIcon /> Add Student
          </Button>
        </div>

        <section>
          {/* <DataTable data={students} /> */}
          <DataTable data={students} />
        </section>

        {/* Floating Messenger Icon */}
        <div className="fixed bottom-6 right-6 z-40">
          <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              onClick={() => navigate("/messages")}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Open Messages"
            >
              <MessageCircle className="w-6 h-6" />
            </button>

            <div
              className={`
      absolute right-full top-1/2 transform -translate-y-1/2 mr-2
      bg-gray-200 text-black text-xs px-2 py-1 rounded 
      transition-all duration-200 ease-in-out
      ${
        isHovered
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }
    `}
            >
              Click to open Messages
              <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
            </div>
          </div>
        </div>

        {/*  CALENDAR POPUP  */}
        {showCalendar && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-20 right-6 mt-2 bg-white border rounded-lg shadow-lg p-4 w-64 z-50 animate-in fade-in zoom-in-95"
          >
            <h3 className="font-semibold mb-2">Today's Date</h3>
            <div className="text-sm font-medium">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <p className="text-gray-500 text-sm mt-2">No scheduled events.</p>
            <button
              className="mt-3 text-blue-600 text-sm underline hover:text-blue-800"
              onClick={() => navigate("/calender")}
            >
              View Full Calendar
            </button>
          </div>
        )}

        {/*  NOTIFICATIONS POPUP  */}
        {showNotifications && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-20 right-32 mt-2 bg-white border rounded-lg shadow-lg p-4 w-80 z-50 max-h-96 overflow-auto animate-in fade-in slide-in-from-top-2"
          >
            <h3 className="font-semibold mb-3">Notifications</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-yellow-500 mt-1">●</span>
                <div>
                  <p>
                    <strong>Class Reminder:</strong> Math test tomorrow
                  </p>
                  <span className="text-gray-500 text-xs">2 hours ago</span>
                </div>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-1">●</span>
                <div>
                  <p>
                    <strong>New Student:</strong> John Doe joined Grade 10
                  </p>
                  <span className="text-gray-500 text-xs">1 day ago</span>
                </div>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-blue-500 mt-1">●</span>
                <div>
                  <p>
                    <strong>Payment Due:</strong> School fee pending
                  </p>
                  <span className="text-gray-500 text-xs">3 days ago</span>
                </div>
              </li>
            </ul>
            <button
              className="mt-3 text-blue-600 text-sm underline hover:text-blue-800"
              onClick={() => {
                setShowNotifications(false);
                alert("All notifications marked as read.");
              }}
            >
              Mark All as Read
            </button>
          </div>
        )}
      </main>

      {/*  MODALS  */}

      {/* Add Teacher Modal */}
      {showTeacherForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] relative max-h-[90vh] overflow-auto">
            <button
              onClick={() => setShowTeacherForm(false)}
              className="absolute top-2 right-3 text-gray-500 text-lg hover:text-gray-700"
            >
              ✖
            </button>
            <AddTeacher />
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showStudentForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] relative max-h-[90vh] overflow-auto">
            <button
              onClick={() => setShowStudentForm(false)}
              className="absolute top-2 right-3 text-gray-500 text-lg hover:text-gray-700"
            >
              <X />
            </button>
            <AddStudent />
          </div>
        </div>
      )}
    </div>
  );
}
