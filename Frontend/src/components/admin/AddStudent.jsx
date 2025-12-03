// src/components/admin/AddStudent.jsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/api/auth";
import { useState } from "react";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";

const studentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  dob: z.string().min(1, "Date of Birth is required"),
  rollNum: z.number().min(1, "Roll number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  school: z.string().min(1, "School ID is required"),
  sclassName: z.string().min(1, "Class ID is required"),
});

export default function AddStudent() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      dob: "",
      rollNum: "",
      password: "",
      school: "",
      sclassName: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Convert dob to Date
      const formatted = { ...data, dob: new Date(data.dob) };
      await registerUser(formatted, "student");
      // alert(" Student registered successfully!");
      toast("Student registered successfully");
      form.reset();
      navigate("/admin-dashboard");
      // return <Navigate to="/admin-dashboard" />;
    } catch (error) {
      console.error("Student registration failed:", error);
      toast(error.response?.data?.message || "Failed to register student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Student</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Student name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="student@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="dob"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="rollNum"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="school"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>School ID</FormLabel>
                <FormControl>
                  <Input placeholder="Admin/School ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="sclassName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class ID</FormLabel>
                <FormControl>
                  <Input placeholder="Class ObjectId" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Student"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
