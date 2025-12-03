import { useEffect, useState } from "react";
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
  FaBook,
  FaChalkboard,
  FaChalkboardTeacher,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import {
  BookAIcon,
  BookOpenCheck,
  Clipboard,
  Plus,
  Search,
} from "lucide-react";
import AddSubjectForm from "@/components/admin/AddSubject";
import api from "@/api/axios";
import { toast } from "sonner";

export default function Subjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load subjects from API
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const response = await api.get("/subject/subjects");
        console.log("Subjects API response:", response.data);

        const transformedSubjects = response.data.map((subject) => {
          return {
            id: subject._id || subject.id,
            name: subject.name || subject.subName || "Unknown Subject",
            code: subject.code || subject.subCode || "N/A",
            type: subject.type || "Core",
            classes: subject.classes || subject.sessions || 0,
            teacherId: subject.teacherId,
            teacherName: subject.teacherId || "Not Assigned",
            className:
              subject.className || subject.sclassName || "Unknown Class",
            school: subject.school || "Unknown School",
          };
        });

        setSubjects(transformedSubjects);
      } catch (error) {
        console.error("Error loading subjects:", error);
        toast.error("Failed to load subjects");
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, []);

  // SAFE Filtered subjects based on search
  const filteredSubjects = subjects.filter((subject) => {
    if (!subject) return false;

    const name = subject.name || subject.subName || "";
    const code = subject.code || subject.subCode || "";
    const teacherName = subject.teacherName || "";

    const searchLower = searchTerm.toLowerCase();

    return (
      name.toLowerCase().includes(searchLower) ||
      code.toLowerCase().includes(searchLower) ||
      teacherName.toLowerCase().includes(searchLower)
    );
  });

  // Handle delete subject
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await api.delete(`/subject/subjects/${id}`);
        setSubjects((prev) => prev.filter((subj) => subj.id !== id));
        toast.success("Subject deleted successfully");
      } catch (error) {
        console.error("Error deleting subject:", error);
        toast.error("Failed to delete subject");
      }
    }
  };

  const handleAddSuccess = (newSubject) => {
    if (!newSubject) {
      toast.error("No subject data received");
      return;
    }

    const transformedSubject = {
      id: newSubject._id || newSubject.id || Date.now().toString(),
      name: newSubject.name || newSubject.subName || "Unknown Subject",
      code: newSubject.code || newSubject.subCode || "N/A",
      type: newSubject.type || "Core",
      classes: newSubject.classes || newSubject.sessions || 0,
      teacherId: newSubject.teacherId || newSubject.teacher,
      teacherName: newSubject.teacherId || newSubject.teacher || "Not Assigned",
      className:
        newSubject.className || newSubject.sclassName || "Unknown Class",
      school: newSubject.school || "Unknown School",
    };

    setSubjects((prev) => [...prev, transformedSubject]);
    setShowAddModal(false);
    toast.success("Subject added successfully!");
  };

  // Safe value getter for table display - UPDATED
  const getSafeValue = (subject, field) => {
    if (!subject) return "N/A";

    switch (field) {
      case "name":
        return subject.name || subject.subName || "Unknown Subject";
      case "code":
        return subject.code || subject.subCode || "N/A";
      case "type":
        return subject.type || "Core";
      case "classes":
        return subject.classes || subject.sessions || 0;
      case "teacherName":
        return subject.teacherName || "Not Assigned";
      default:
        return subject[field] || "N/A";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/*  SIDEBAR  */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col h-[calc(100vh)] sticky top-0">
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <FaBook /> Subjects
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <FaChalkboard /> Classes
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <BookAIcon /> Syllabus
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <BookOpenCheck /> Exams
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
          <h1 className="text-2xl font-bold">Subject Management</h1>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} /> Add Subject
          </Button>
        </header>

        <section className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Subjects
                </CardTitle>
                <FaBook className="text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subjects.length}</div>
                <p className="text-xs text-gray-500">All subjects</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Core Subjects
                </CardTitle>
                <Badge className="bg-green-500">Core</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {subjects.filter((s) => (s.type || "Core") === "Core").length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Electives</CardTitle>
                <Badge className="bg-purple-500">Elective</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    subjects.filter((s) => (s.type || "Core") === "Elective")
                      .length
                  }
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Assigned Teachers
                </CardTitle>
                <span>
                  <FaChalkboardTeacher />
                </span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    subjects.filter((s) => s.teacherName !== "Not Assigned")
                      .length
                  }
                </div>
                <p className="text-xs text-gray-500">With teachers assigned</p>
              </CardContent>
            </Card>
          </div>

          {/* Search & Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap justify-between items-center gap-4">
                <CardTitle>All Subjects</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search by name, code, or teacher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading subjects...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Sessions/Week</TableHead>
                      <TableHead>Assigned Teacher</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubjects.length > 0 ? (
                      filteredSubjects.map((subject) => (
                        <TableRow key={subject.id}>
                          <TableCell className="font-medium">
                            {getSafeValue(subject, "name")}
                          </TableCell>
                          <TableCell>
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {getSafeValue(subject, "code")}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                getSafeValue(subject, "type") === "Core"
                                  ? "bg-green-500"
                                  : getSafeValue(subject, "type") === "Elective"
                                  ? "bg-purple-500"
                                  : "bg-blue-500"
                              }
                            >
                              {getSafeValue(subject, "type")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getSafeValue(subject, "classes")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getSafeValue(subject, "teacherName") ===
                              "Not Assigned" ? (
                                <Badge
                                  variant="outline"
                                  className="text-gray-500"
                                >
                                  Not Assigned
                                </Badge>
                              ) : (
                                <span className="font-medium">
                                  {getSafeValue(subject, "teacherName")}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {subject.className || "Unknown Class"}
                            </Badge>
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
                                onClick={() => handleDelete(subject.id)}
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
                          colSpan={7}
                          className="text-center py-4 text-gray-500"
                        >
                          {searchTerm
                            ? `No subjects found matching "${searchTerm}"`
                            : "No subjects found"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      {/* ADD SUBJECT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-transparent p-4 rounded-lg shadow-lg max-h-[90vh] overflow-auto">
            <AddSubjectForm
              onSuccess={handleAddSuccess}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
