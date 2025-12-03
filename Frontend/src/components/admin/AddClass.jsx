// src/components/admin/AddClassForm.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/api/axios";

export default function AddClassForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    sclassName: "",
    school: "Aims College",
    // school: "688f96c5b11ea1d897070699", // ✅ Changed from schoolName to school
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/sclass", formData);
      console.log("Class creation response:", res.data); // Debug log
      toast.success("Class added successfully!");
      if (onSuccess) onSuccess(res.data); // ✅ Changed from res.data.class to res.data
      setFormData({ sclassName: "", school: "Aims College" });
    } catch (err) {
      console.error("Error adding class:", err.response?.data);
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.errors?.[0]?.msg ||
          "Failed to add class"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add New Class</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="sclassName">Class Name</Label>
            <Input
              id="sclassName"
              name="sclassName"
              value={formData.sclassName}
              onChange={handleChange}
              placeholder="e.g., Class 6, Grade 10"
              required
            />
          </div>

          <div>
            <Label htmlFor="school">School Name</Label>
            <Input
              id="school" // ✅ Changed from schoolName to school
              name="school" // ✅ Changed from schoolName to school
              value={formData.school}
              onChange={handleChange}
              placeholder="e.g., Aims College"
              required
            />
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
              {loading ? "Saving..." : "Save Class"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
