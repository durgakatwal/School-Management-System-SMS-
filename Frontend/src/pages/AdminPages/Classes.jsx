// // src/pages/Classes.jsx
// import { useEffect, useState } from "react";

// // ShadCN Components
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// // Icons
// import {
//   FaChalkboard,
//   FaUserTie,
//   FaUsers,
//   FaEdit,
//   FaTrash,
// } from "react-icons/fa";
// import { BookOpen, Clipboard, TimerIcon } from "lucide-react";

// // Form Component
// import AddClassForm from "@/components/admin/AddClass";
// import { toast } from "sonner";
// import { fetchAdminStats } from "@/api/admin";
// import api from "@/api/axios";

// export default function Classes() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedLevel, setSelectedLevel] = useState("All Levels");
//   const [showAddModal, setShowAddModal] = useState(false);

//   const [classesList, setClassesList] = useState([]);
//   const [loadingClasses, setLoadingClasses] = useState(true);

//   useEffect(() => {
//     const loadClasses = async () => {
//       try {
//         // Replace "schoolId" with actual logged-in school id from auth context/session
//         const res = await api.get("/sclass/school/Aims College");

//         setClassesList(res.data);
//         setLoadingClasses(false);
//         console.log(res.data);
//       } catch (err) {
//         console.error("Error fetching classes:", err);
//         setLoadingClasses(false);
//       }
//     };
//     loadClasses();
//   }, []);
//   // Filter logic
//   const filteredClasses = classesList.filter((cls) => {
//     const matchesSearch =
//       cls.sclassName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       cls.section?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       cls.teacher?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesLevel =
//       selectedLevel === "All Levels" ||
//       cls.sclassName?.includes(selectedLevel.replace("Grade ", ""));

//     return matchesSearch && matchesLevel;
//   });
//   // Handle delete action
//   // const handleDelete = (id) => {
//   //   if (window.confirm("Are you sure you want to delete this class?")) {
//   //     setClassesList(classesList.filter((cls) => cls.id !== id));
//   //   }
//   // };

//   // Handle successful class addition
//   const handleAddSuccess = async (newClassData) => {
//     try {
//       const res = await api.post("/sclass", newClassData);
//       const savedClass = res.data;
//       setClassesList((prev) => [...prev, savedClass]);
//       toast.success("Class added successfully!");
//     } catch (err) {
//       toast.error("Failed to add class");
//     } finally {
//       setShowAddModal(false);
//     }
//   };

//   const [stats, setStats] = useState({
//     classes: 0,
//     students: 0,
//     teachers: 0,
//     subjects: 0,
//     fees: 0,
//   });
//   const [loading, setLoading] = useState(true);
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
//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* SIDEBAR */}
//       <aside className="w-64 bg-gray-900 text-white flex flex-col h-[calc(100vh)] sticky top-0">
//         <nav className="flex-1 p-4 space-y-2">
//           <Button variant="ghost" className="w-full justify-start gap-2">
//             <FaChalkboard /> Classes
//           </Button>
//           <Button variant="ghost" className="w-full justify-start gap-2">
//             <FaUsers /> Students per Class
//           </Button>
//           <Button variant="ghost" className="w-full justify-start gap-2">
//             <FaUserTie /> Class Teachers
//           </Button>
//           <Button variant="ghost" className="w-full justify-start gap-2">
//             <TimerIcon /> Timetable
//           </Button>
//           <Button variant="ghost" className="w-full justify-start gap-2">
//             <Clipboard /> Reports
//           </Button>
//         </nav>
//         <div className="p-4 border-t border-gray-700">
//           <Button
//             variant="outline"
//             className="w-full justify-center text-black"
//           >
//             Log Out
//           </Button>
//         </div>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="flex-1 overflow-auto">
//         <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40">
//           <h1 className="text-2xl font-bold">Class Management</h1>
//           <Button
//             className="gap-2"
//             onClick={() => setShowAddModal(true)}
//             variant={"outline"}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="18"
//               height="18"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//               />
//             </svg>
//             Add Class
//           </Button>
//         </header>

//         <section className="p-6">
//           {/* Stats Overview */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Total Classes
//                 </CardTitle>
//                 <FaChalkboard className="text-blue-500" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {loading ? "..." : stats.classes}
//                 </div>
//                 <p className="text-xs text-gray-500">+2 this year</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Total Students
//                 </CardTitle>
//                 <FaUsers className="text-green-500" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {/* {classesList.reduce((acc, c) => acc + c.students, 0)} */}
//                   {loading ? "..." : stats.students}
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Class Teachers
//                 </CardTitle>
//                 <FaUserTie className="text-purple-500" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {/* {new Set(classesList.map((c) => c.teacher)).size} */}
//                   {loading ? "..." : stats.teachers}
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Avg Subjects
//                 </CardTitle>
//                 <span>
//                   <BookOpen />
//                 </span>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {/* {Math.round(
//                     classesList.reduce((acc, c) => acc + c.subjects, 0) /
//                       classesList.length
//                   )} */}
//                   {loading ? "..." : stats.subjects}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Search & Table */}
//           <section className="p-6">
//             <Card>
//               <CardHeader>
//                 <div className="flex flex-wrap justify-between items-center gap-4">
//                   <CardTitle>All Classes</CardTitle>
//                   <div className="flex flex-wrap gap-4">
//                     <Input
//                       placeholder="Search by class, section, or teacher..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="w-full sm:w-64"
//                     />
//                     <Select
//                       value={selectedLevel}
//                       onValueChange={setSelectedLevel}
//                     >
//                       <SelectTrigger className="w-40">
//                         <SelectValue placeholder="All Levels" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="All Levels">All Levels</SelectItem>
//                         <SelectItem value="Grade 6">Grade 6</SelectItem>
//                         <SelectItem value="Grade 7">Grade 7</SelectItem>
//                         <SelectItem value="Grade 8">Grade 8</SelectItem>
//                         <SelectItem value="Grade 9">Grade 9</SelectItem>
//                         <SelectItem value="Grade 10">Grade 10</SelectItem>
//                         <SelectItem value="Grade 11">Grade 11</SelectItem>
//                         <SelectItem value="Grade 12">Grade 12</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>ID</TableHead>
//                       <TableHead>Class</TableHead>
//                       <TableHead>Section</TableHead>
//                       <TableHead>Class Teacher</TableHead>
//                       <TableHead>Total Students</TableHead>
//                       <TableHead>Subjects</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Action</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {loadingClasses ? (
//                       <TableRow>
//                         <TableCell colSpan={8} className="text-center py-4">
//                           Loading...
//                         </TableCell>
//                       </TableRow>
//                     ) : filteredClasses.length > 0 ? (
//                       filteredClasses.map((cls, index) => (
//                         <TableRow key={cls._id || index}>
//                           <TableCell>{index + 1}</TableCell>
//                           <TableCell className="font-medium">
//                             {cls.sclassName}
//                           </TableCell>
//                           <TableCell>
//                             <Badge className="bg-gray-600">
//                               {cls.section || "N/A"}
//                             </Badge>
//                           </TableCell>
//                           <TableCell>{cls.teacher || "Not Assigned"}</TableCell>
//                           <TableCell>{cls.studentsCount || 0}</TableCell>
//                           <TableCell>{cls.subjectsCount || 0}</TableCell>
//                           <TableCell>
//                             <Badge className="bg-green-500">Active</Badge>
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex gap-2">
//                               <Button
//                                 variant="outline"
//                                 size="icon"
//                                 title="Edit"
//                               >
//                                 <FaEdit className="h-4 w-4" />
//                               </Button>
//                               <Button
//                                 variant="destructive"
//                                 size="icon"
//                                 title="Delete"
//                                 onClick={() => console.log("Delete", cls._id)}
//                               >
//                                 <FaTrash className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell
//                           colSpan={8}
//                           className="text-center py-4 text-gray-500"
//                         >
//                           No classes found matching "{searchTerm}"
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </section>
//         </section>
//       </main>

//       {/* ADD CLASS MODAL */}
//       {showAddModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-transparent p-4 rounded-lg shadow-lg max-h-[90vh] overflow-auto">
//             <AddClassForm
//               onSuccess={handleAddSuccess}
//               onCancel={() => setShowAddModal(false)}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // src/pages/Classes.jsx
// import { useEffect, useState } from "react";

// // ShadCN Components
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// // Icons
// import { FaChalkboard, FaUserTie, FaUsers } from "react-icons/fa";
// import { BookOpen, TimerIcon } from "lucide-react";

// // Form Component
// import AddClassForm from "@/components/admin/AddClass";
// import { toast } from "sonner";
// import { fetchAdminStats } from "@/api/admin";
// import api from "@/api/axios";

// // New Table Component
// import ClassTable from "@/components/admin/ClassTable";

// export default function Classes() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedLevel, setSelectedLevel] = useState("All Levels");
//   const [showAddModal, setShowAddModal] = useState(false);

//   const [classesList, setClassesList] = useState([]);
//   const [loadingClasses, setLoadingClasses] = useState(true);

//   useEffect(() => {
//     const loadClasses = async () => {
//       try {
//         // Replace with actual logged-in school id from auth context/session
//         const res = await api.get("/sclass/school/Aims College");

//         setClassesList(res.data);
//         setLoadingClasses(false);
//       } catch (err) {
//         console.error("Error fetching classes:", err);
//         setLoadingClasses(false);
//       }
//     };
//     loadClasses();
//   }, []);

//   // Filter logic
//   const filteredClasses = classesList.filter((cls) => {
//     const matchesSearch =
//       cls.sclassName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       cls.section?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       cls.teacher?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesLevel =
//       selectedLevel === "All Levels" ||
//       cls.sclassName?.includes(selectedLevel.replace("Grade ", ""));

//     return matchesSearch && matchesLevel;
//   });

//   // Handle successful class addition
//   const handleAddSuccess = async (newClassData) => {
//     try {
//       const res = await api.post("/sclass", newClassData);
//       const savedClass = res.data;
//       setClassesList((prev) => [...prev, savedClass]);
//       toast.success("Class added successfully!");
//     } catch (err) {
//       toast.error("Failed to add class");
//     } finally {
//       setShowAddModal(false);
//     }
//   };

//   const [stats, setStats] = useState({
//     classes: 0,
//     students: 0,
//     teachers: 0,
//     subjects: 0,
//     fees: 0,
//   });
//   const [loading, setLoading] = useState(true);

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

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* SIDEBAR */}
//       <aside className="w-64 bg-gray-900 text-white flex flex-col h-[calc(100vh)] sticky top-0">
//         <nav className="flex-1 p-4 space-y-2">
//           <Button variant="ghost" className="w-full justify-start gap-2">
//             <FaChalkboard /> Classes
//           </Button>
//           <Button variant="ghost" className="w-full justify-start gap-2">
//             <FaUsers /> Students per Class
//           </Button>
//           <Button variant="ghost" className="w-full justify-start gap-2">
//             <FaUserTie /> Class Teachers
//           </Button>
//           <Button variant="ghost" className="w-full justify-start gap-2">
//             <TimerIcon /> Timetable
//           </Button>
//           <Button variant="ghost" className="w-full justify-start gap-2">
//             <BookOpen /> Reports
//           </Button>
//         </nav>
//         <div className="p-4 border-t border-gray-700">
//           <Button
//             variant="outline"
//             className="w-full justify-center text-black"
//           >
//             Log Out
//           </Button>
//         </div>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="flex-1 overflow-auto">
//         <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40">
//           <h1 className="text-2xl font-bold">Class Management</h1>
//           <Button
//             className="gap-2"
//             onClick={() => setShowAddModal(true)}
//             variant={"outline"}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="18"
//               height="18"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//               />
//             </svg>
//             Add Class
//           </Button>
//         </header>

//         <section className="p-6">
//           {/* Stats Overview */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Total Classes
//                 </CardTitle>
//                 <FaChalkboard className="text-blue-500" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {loading ? "..." : stats.classes}
//                 </div>
//                 <p className="text-xs text-gray-500">+2 this year</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Total Students
//                 </CardTitle>
//                 <FaUsers className="text-green-500" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {loading ? "..." : stats.students}
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Class Teachers
//                 </CardTitle>
//                 <FaUserTie className="text-purple-500" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {loading ? "..." : stats.teachers}
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Avg Subjects
//                 </CardTitle>
//                 <span>
//                   <BookOpen />
//                 </span>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {loading ? "..." : stats.subjects}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Search & Table */}
//           <Card>
//             <CardHeader>
//               <div className="flex flex-wrap justify-between items-center gap-4">
//                 <CardTitle>All Classes</CardTitle>
//                 <div className="flex flex-wrap gap-4">
//                   <Input
//                     placeholder="Search by class, section, or teacher..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full sm:w-64"
//                   />
//                   <Select
//                     value={selectedLevel}
//                     onValueChange={setSelectedLevel}
//                   >
//                     <SelectTrigger className="w-40">
//                       <SelectValue placeholder="All Levels" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="All Levels">All Levels</SelectItem>
//                       <SelectItem value="Grade 6">Grade 6</SelectItem>
//                       <SelectItem value="Grade 7">Grade 7</SelectItem>
//                       <SelectItem value="Grade 8">Grade 8</SelectItem>
//                       <SelectItem value="Grade 9">Grade 9</SelectItem>
//                       <SelectItem value="Grade 10">Grade 10</SelectItem>
//                       <SelectItem value="Grade 11">Grade 11</SelectItem>
//                       <SelectItem value="Grade 12">Grade 12</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <ClassTable data={filteredClasses} />
//             </CardContent>
//           </Card>
//         </section>
//       </main>

//       {/* ADD CLASS MODAL */}
//       {showAddModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-transparent p-4 rounded-lg shadow-lg max-h-[90vh] overflow-auto">
//             <AddClassForm
//               onSuccess={handleAddSuccess}
//               onCancel={() => setShowAddModal(false)}
//             />
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
import {
  FaChalkboard,
  FaUserTie,
  FaUsers,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { BookOpen, Clipboard, TimerIcon } from "lucide-react";

// Form Component
import AddClassForm from "@/components/admin/AddClass";
import { toast } from "sonner";
import { fetchAdminStats } from "@/api/admin";
import api from "@/api/axios";

export default function Classes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [showAddModal, setShowAddModal] = useState(false);

  const [classesList, setClassesList] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // In Classes.jsx - Replace your useEffect with this SIMPLE version
  useEffect(() => {
    const loadClasses = async () => {
      try {
        // console.log(" Loading all classes...");

        // Use the simple route that gets ALL classes
        const res = await api.get("/sclass/all-classes");
        // console.log(" Got classes response:", res.data);

        if (res.data && res.data.length > 0) {
          // console.log(` Found ${res.data.length} classes!`);

          // Simple transformation - just use what we get
          const transformedClasses = res.data.map((cls, index) => ({
            id: cls._id,
            sclassName: cls.sclassName || "Unknown Class",
            section: "A", // Default
            teacher: "Not Assigned", // Default
            studentsCount: 0, // Default
            subjectsCount: 0, // Default
            school: "Aims College", // Default school name for display
          }));

          setClassesList(transformedClasses);
          // console.log(" Transformed classes:", transformedClasses);
        } else {
          // console.log(" No classes found in the database");
          setClassesList([]);
        }

        setLoadingClasses(false);
      } catch (err) {
        console.error(" Error loading classes:", err);
        console.error("Error details:", err.response?.data);
        toast.error("Failed to load classes");
        setClassesList([]);
        setLoadingClasses(false);
      }
    };

    loadClasses();
  }, []);

  // useEffect(() => {
  //   const debugAllClasses = async () => {
  //     try {
  //       const res = await api.get("/sclass/debug/all-classes");
  //       console.log("🔍 ALL CLASSES DEBUG:", res.data);
  //     } catch (error) {
  //       console.error("Error debugging classes:", error);
  //     }
  //   };
  //   debugAllClasses();
  // }, []);
  // Filter logic - UPDATED with safe checks
  const filteredClasses = classesList.filter((cls) => {
    if (!cls) return false;

    const className = cls.sclassName?.toLowerCase() || "";
    const section = cls.section?.toLowerCase() || "";
    const teacher = cls.teacher?.toLowerCase() || "";

    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      className.includes(searchLower) ||
      section.includes(searchLower) ||
      teacher.includes(searchLower);

    const matchesLevel =
      selectedLevel === "All Levels" ||
      cls.sclassName?.includes(selectedLevel.replace("Grade ", ""));

    return matchesSearch && matchesLevel;
  });

  // Handle successful class addition
  const handleAddSuccess = async (newClassData) => {
    try {
      const res = await api.post("/sclass", newClassData);
      const savedClass = res.data;

      // Transform the new class data to match our structure
      const transformedClass = {
        id: savedClass._id || savedClass.id,
        sclassName: savedClass.sclassName || savedClass.name,
        section: savedClass.section || "A",
        teacher: savedClass.teacher || "Not Assigned",
        studentsCount: savedClass.studentsCount || 0,
        subjectsCount: savedClass.subjectsCount || 0,
        school: savedClass.school || "Aims College",
      };

      setClassesList((prev) => [...prev, transformedClass]);
      setShowAddModal(false);
      toast.success("Class added successfully!");
    } catch (err) {
      console.error("Error adding class:", err);
      toast.error("Failed to add class");
    }
  };

  const [stats, setStats] = useState({
    classes: 0,
    students: 0,
    teachers: 0,
    subjects: 0,
    fees: 0,
  });
  const [loading, setLoading] = useState(true);

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

  // Update stats with actual class data when classes are loaded
  useEffect(() => {
    if (classesList.length > 0) {
      setStats((prev) => ({
        ...prev,
        classes: classesList.length,
        students: classesList.reduce(
          (acc, cls) => acc + (cls.studentsCount || 0),
          0
        ),
      }));
    }
  }, [classesList]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col h-[calc(100vh)] sticky top-0">
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <FaChalkboard /> Classes
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <FaUsers /> Students per Class
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <FaUserTie /> Class Teachers
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <TimerIcon /> Timetable
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Clipboard /> Reports
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

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40">
          <h1 className="text-2xl font-bold">Class Management</h1>
          <Button
            className="gap-2"
            onClick={() => setShowAddModal(true)}
            variant={"outline"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Class
          </Button>
        </header>

        <section className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Classes
                </CardTitle>
                <FaChalkboard className="text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classesList.length}</div>
                <p className="text-xs text-gray-500">Active classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
                <FaUsers className="text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {classesList.reduce(
                    (acc, cls) => acc + (cls.studentsCount || 0),
                    0
                  )}
                </div>
                <p className="text-xs text-gray-500">Across all classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Class Teachers
                </CardTitle>
                <FaUserTie className="text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    new Set(
                      classesList.map((cls) => cls.teacher).filter(Boolean)
                    ).size
                  }
                </div>
                <p className="text-xs text-gray-500">Assigned teachers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Subjects
                </CardTitle>
                <span>
                  <BookOpen />
                </span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {classesList.reduce(
                    (acc, cls) => acc + (cls.subjectsCount || 0),
                    0
                  )}
                </div>
                <p className="text-xs text-gray-500">Across all classes</p>
              </CardContent>
            </Card>
          </div>

          {/* Search & Table */}
          <section className="p-6">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <CardTitle>All Classes ({classesList.length})</CardTitle>
                  <div className="flex flex-wrap gap-4">
                    <Input
                      placeholder="Search by class, section, or teacher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64"
                    />
                    <Select
                      value={selectedLevel}
                      onValueChange={setSelectedLevel}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Levels">All Levels</SelectItem>
                        <SelectItem value="Grade 6">Grade 6</SelectItem>
                        <SelectItem value="Grade 7">Grade 7</SelectItem>
                        <SelectItem value="Grade 8">Grade 8</SelectItem>
                        <SelectItem value="Grade 9">Grade 9</SelectItem>
                        <SelectItem value="Grade 10">Grade 10</SelectItem>
                        <SelectItem value="Grade 11">Grade 11</SelectItem>
                        <SelectItem value="Grade 12">Grade 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Class Teacher</TableHead>
                      <TableHead>Total Students</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingClasses ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <span className="ml-2">Loading classes...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredClasses.length > 0 ? (
                      filteredClasses.map((cls, index) => (
                        <TableRow key={cls.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">
                            {cls.sclassName}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-gray-600">{cls.section}</Badge>
                          </TableCell>
                          <TableCell>
                            {cls.teacher === "Not Assigned" ? (
                              <Badge
                                variant="outline"
                                className="text-gray-500"
                              >
                                Not Assigned
                              </Badge>
                            ) : (
                              cls.teacher
                            )}
                          </TableCell>
                          <TableCell>{cls.studentsCount}</TableCell>
                          <TableCell>{cls.subjectsCount}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">Active</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                title="Edit"
                              >
                                <FaEdit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                title="Delete"
                                onClick={() => console.log("Delete", cls.id)}
                              >
                                <FaTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-8 text-gray-500"
                        >
                          <div className="flex flex-col items-center">
                            <FaChalkboard className="h-12 w-12 text-gray-300 mb-2" />
                            <p className="text-lg font-medium">
                              No classes found
                            </p>
                            <p className="text-sm">
                              {searchTerm || selectedLevel !== "All Levels"
                                ? `No classes match your search criteria`
                                : "No classes available. Add your first class!"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>
        </section>
      </main>

      {/* ADD CLASS MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-transparent p-4 rounded-lg shadow-lg max-h-[90vh] overflow-auto">
            <AddClassForm
              onSuccess={handleAddSuccess}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
