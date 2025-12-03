import api from "@/api/axios";
import AddStudent from "@/components/admin/AddStudent";
import DataTable from "@/components/admin/Data-Table";
import { Button } from "@/components/ui/button";
import { PlusIcon, X } from "lucide-react";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";

const Student = () => {
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [students, setStudents] = useState([]);
  //  Fetch students list
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await api.get("/students/Students");
        setStudents(res.data); // assuming API returns array of students
        // console.log(res.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to load students");
      }
    };
    loadStudents();
  }, []);
  return (
    <div>
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <Button variant="outline" onClick={() => setShowStudentForm(true)}>
          <PlusIcon /> Add Student
        </Button>
      </header>
      <DataTable data={students} />

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
};

export default Student;
