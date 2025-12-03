import api from "@/api/axios";
import AddTeacher from "@/components/admin/AddTeacher";
import TeacherTable from "@/components/admin/Teacher-Data-Table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  //  Fetch teachers list
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const res = await api.get("/teachers");
        setTeachers(res.data); // assuming API returns array of students
        // console.log(res.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to load students");
      }
    };
    loadTeachers();
  }, []);
  return (
    <div>
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-2xl font-bold">Teacher Management</h1>
        <Button variant="outline" onClick={() => setShowTeacherForm(true)}>
          <PlusIcon /> Add Teacher
        </Button>
      </header>

      <TeacherTable data={teachers} />
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
    </div>
  );
};

export default Teacher;
