// src/pages/NoticeBoard.jsx
import { useState, useEffect } from "react";

// ShadCN Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Icons
import { FaBell, FaTrash, FaCalendarAlt } from "react-icons/fa";
import { Calendar, File, FileUp, Speaker, Upload } from "lucide-react";
import { toast } from "sonner";

// API + Auth
import api from "@/api/axios";
import useAuth from "@/hooks/useAuth";

export default function NoticeBoard() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");
  const [school, setSchool] = useState(user?.schoolName || "");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  // Fetch existing notices
  useEffect(() => {
    const loadNotices = async () => {
      try {
        const res = await api.get("/notice/notices");

        // If API returns a single object, wrap it in an array
        const data = Array.isArray(res.data) ? res.data : [res.data];

        setNotices(data);
      } catch (err) {
        toast.error("Failed to load notices");
      }
    };
    loadNotices();
  }, []);
  // Handle image upload (local preview only, replace with Cloudinary later)
  const handleImageChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Post new notice
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create notice
      const res = await api.post("/notice/CreateNotices", {
        title,
        details,
        date,
        school,
      });

      const newNotice = res.data.notice || res.data;

      // Step 2: Upload image if file exists
      if (file) {
        const formData = new FormData();
        formData.append("images", file); // 👈 MUST match backend: upload.array("images")

        const imgRes = await api.post(
          `/notice/uploadNoticeImage/${newNotice._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // Merge updated notice with image
        const updatedNotice = imgRes.data.notice || imgRes.data;
        setNotices([updatedNotice, ...notices]);
      } else {
        setNotices([newNotice, ...notices]);
      }

      toast.success("Notice posted!");
      setTitle("");
      setDetails("");
      setDate("");
      setFile(null);
      setPreview("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post notice");
    } finally {
      setLoading(false);
    }
  };

  // Delete notice
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;

    try {
      await api.delete(`/notice/${id}`);
      setNotices(notices.filter((n) => n._id !== id));
      toast.success("Notice deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ========== SIDEBAR ========== */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col h-[calc(100vh)] sticky top-0">
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <FaBell /> Notice Board
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Speaker /> Announcements
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Calendar /> Upcoming Events
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <File /> Downloads
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
      <main className="flex-1 overflow-auto p-6">
        <header className="bg-white shadow-sm px-6 py-4 rounded-lg mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">📢 Notice Board</h1>
        </header>

        {/* === CREATE NOTICE FORM === */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileUp className="mr-2 h-5 w-5 text-blue-600" />
              Post a Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="Enter notice title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Enter notice details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <Input
                placeholder="Enter school name"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                required
              />
              <Input
                type="file"
                multiple
                onChange={(e) => handleImageChange(e)}
              />

              <Button type="submit" disabled={loading} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                {loading ? "Posting..." : "Post Notice"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* === NOTICES LIST === */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Notices</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              {notices.length === 0 ? (
                <p className="text-gray-500 text-center py-6">
                  No notices yet.
                </p>
              ) : (
                <ul className="space-y-6">
                  {notices.map((notice, index) => (
                    <li
                      key={notice._id || index}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">
                          {notice.title}
                        </h3>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(notice._id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                      <p className="text-gray-700 mb-3">{notice.details}</p>
                      {notice.imageUrl && (
                        <img
                          src={notice.imageUrl}
                          alt="Notice"
                          className="w-full h-40 object-cover rounded mb-3"
                        />
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          <FaCalendarAlt className="inline mr-1" />
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                          By: {notice.postedBy?.firstName}{" "}
                          {notice.postedBy?.lastName}
                        </span>
                        <Badge className="bg-blue-500">New</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
