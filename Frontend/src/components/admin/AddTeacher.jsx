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

const teacherSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  school: z.string().min(1, "School name is required"), //  now by name
  teachSclass: z.string().min(1, "Class name is required"), // now by name
  teachSubject: z.string().optional(), //  optional by name
});

export default function AddTeacher() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      school: "",
      teachSclass: "",
      teachSubject: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data, "teacher");
      // alert(" Teacher registered successfully!");
      toast("Teacher registered successfully");
      form.reset();
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Teacher registration failed:", error);
      alert(error.message || "Failed to register teacher");
      toast("Failed to registered Teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Teacher</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Teacher name" {...field} />
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
                  <Input placeholder="teacher@school.com" {...field} />
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

          {/*  Changed from ID to Name */}
          <FormField
            name="school"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter school name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="teachSclass"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter class (e.g., 10)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="teachSubject"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subject (e.g., Math)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Teacher"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
