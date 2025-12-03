import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/api/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

export default function AddSubjectForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    subName: "",
    subCode: "",
    sessions: "",
    sclassName: "",
    schoolName: "Aims College",
    teacher: "not-assigned",
  });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teachersLoading, setTeachersLoading] = useState(true);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const response = await api.get("/teachers");
        setTeachers(response.data);
      } catch (error) {
        console.error("Error loading teachers:", error);
        toast.error("Failed to load teachers");
      } finally {
        setTeachersLoading(false);
      }
    };

    loadTeachers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTeacherChange = (teacherId) => {
    setFormData({
      ...formData,
      teacher: teacherId,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const teacherValue =
      formData.teacher === "not-assigned" ? null : formData.teacher;

    const payload = {
      school: formData.schoolName,
      subjects: [
        {
          subName: formData.subName,
          subCode: formData.subCode,
          sessions: formData.sessions,
          sclassName: formData.sclassName,
          teacher: teacherValue,
        },
      ],
    };

    console.log("Payload being sent:", payload);

    try {
      const res = await api.post("/subject/addsubject", payload);

      toast.success(res.data.message || "Subject added successfully!");

      if (onSuccess && res.data.data) {
        onSuccess(res.data.data[0]);
      }

      setFormData({
        subName: "",
        subCode: "",
        sessions: "",
        sclassName: "",
        schoolName: "Aims College",
        teacher: "not-assigned",
      });

      onCancel();
    } catch (err) {
      console.error("Error adding subject:", err.response?.data || err.message);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.map((e) => e.msg).join(", ") ||
        "Failed to add subject";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add New Subject</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subName">Subject Name</Label>
            <Input
              id="subName"
              name="subName"
              value={formData.subName}
              onChange={handleChange}
              placeholder="e.g., Mathematics"
              required
            />
          </div>

          <div>
            <Label htmlFor="subCode">Subject Code</Label>
            <Input
              id="subCode"
              name="subCode"
              value={formData.subCode}
              onChange={handleChange}
              placeholder="e.g., MATH101"
              required
            />
          </div>

          <div>
            <Label htmlFor="sessions">Sessions per Week</Label>
            <Input
              id="sessions"
              name="sessions"
              type="number"
              min="1"
              max="7"
              value={formData.sessions}
              onChange={handleChange}
              placeholder="e.g., 5"
              required
            />
          </div>

          <div>
            <Label htmlFor="sclassName">Class Name</Label>
            <Input
              id="sclassName"
              name="sclassName"
              value={formData.sclassName}
              onChange={handleChange}
              placeholder="e.g., Class 10"
              required
            />
          </div>

          <div>
            <Label htmlFor="schoolName">School Name</Label>
            <Input
              id="schoolName"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              placeholder="e.g., Aims College"
              required
            />
          </div>

          <div>
            <Label htmlFor="teacher">Assign Teacher (Optional)</Label>
            <Select
              value={formData.teacher}
              onValueChange={handleTeacherChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {/* Use a meaningful value instead of empty string */}
                <SelectItem value="not-assigned">Not Assigned</SelectItem>
                {teachersLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading teachers...
                  </SelectItem>
                ) : (
                  teachers.map((teacher) => (
                    <SelectItem
                      key={teacher._id || teacher.id}
                      value={teacher._id || teacher.id}
                    >
                      {teacher.firstName} {teacher.lastName}
                      {teacher.subject && ` - ${teacher.subject}`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Subject"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
