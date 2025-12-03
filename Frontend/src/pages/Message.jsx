import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Info,
  ArrowLeft,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

export default function MessagesPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([
    {
      id: "1",
      participant: {
        id: "101",
        name: "Sarah Johnson",
        role: "teacher",
        online: true,
      },
      lastMessage: "Don't forget the lab report due tomorrow",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      unreadCount: 2,
      muted: false,
    },
    {
      id: "2",
      participant: {
        id: "102",
        name: "Mike Chen",
        role: "student",
        online: false,
      },
      lastMessage: "Do we have maths test this week?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unreadCount: 0,
      muted: false,
    },
    {
      id: "3",
      participant: {
        id: "103",
        name: "Emily Davis",
        role: "parent",
        online: true,
      },
      lastMessage: "Thank you for the parent-teacher meeting",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unreadCount: 1,
      muted: true,
    },
    {
      id: "4",
      participant: {
        id: "104",
        name: "Dr. Robert Wilson",
        role: "teacher",
        online: false,
      },
      lastMessage: "Science fair project approval needed",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unreadCount: 0,
      muted: false,
    },
    {
      id: "5",
      participant: {
        id: "105",
        name: "John Smith",
        role: "student",
        online: true,
      },
      lastMessage: "Can I submit my assignment tomorrow?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      unreadCount: 0,
      muted: false,
    },
  ]);

  const [messages, setMessages] = useState([
    {
      id: "1",
      senderId: "101",
      receiverId: "admin",
      message: "Hello, I wanted to discuss the upcoming science fair.",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      read: true,
      type: "text",
    },
    {
      id: "2",
      senderId: "admin",
      receiverId: "101",
      message: "Hi Sarah! Yes, what would you like to know?",
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      read: true,
      type: "text",
    },
    {
      id: "3",
      senderId: "101",
      receiverId: "admin",
      message:
        "Don't forget the lab report due tomorrow for Grade 10 students.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      type: "text",
    },
    {
      id: "4",
      senderId: "101",
      receiverId: "admin",
      message: "Also, we need more materials for the chemistry lab.",
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
      read: false,
      type: "text",
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState("1");
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current conversation details
  const currentConversation = conversations.find(
    (conv) => conv.id === selectedConversation
  );
  const currentMessages = messages.filter(
    (msg) =>
      (msg.senderId === currentConversation?.participant.id &&
        msg.receiverId === "admin") ||
      (msg.senderId === "admin" &&
        msg.receiverId === currentConversation?.participant.id)
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      senderId: "admin",
      receiverId: currentConversation.participant.id,
      message: newMessage,
      timestamp: new Date(),
      read: false,
      type: "text",
    };

    setMessages((prev) => [...prev, newMsg]);

    // Update conversation last message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? {
              ...conv,
              lastMessage: newMessage,
              timestamp: new Date(),
              unreadCount: 0,
            }
          : conv
      )
    );

    setNewMessage("");
    toast.success("Message sent");
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      teacher: { label: "Teacher", variant: "default" },
      student: { label: "Student", variant: "secondary" },
      parent: { label: "Parent", variant: "outline" },
      admin: { label: "Admin", variant: "destructive" },
    };

    const config = roleConfig[role] || { label: role, variant: "default" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Messages</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin-dashboard")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedConversation === conversation.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={conversation.participant.avatar}
                        alt={conversation.participant.name}
                      />
                      <AvatarFallback>
                        {conversation.participant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.participant.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm truncate">
                        {conversation.participant.name}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatTime(conversation.timestamp)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      {getRoleBadge(conversation.participant.role)}
                      {conversation.muted && (
                        <Badge variant="outline" className="text-xs">
                          Muted
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>

                  {conversation.unreadCount > 0 && (
                    <Badge className="ml-2 bg-blue-500 text-white">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Chat Header */}
        {currentConversation && (
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={currentConversation.participant.avatar}
                    alt={currentConversation.participant.name}
                  />
                  <AvatarFallback>
                    {currentConversation.participant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-lg">
                    {currentConversation.participant.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    {getRoleBadge(currentConversation.participant.role)}
                    <span
                      className={`text-sm ${
                        currentConversation.participant.online
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {currentConversation.participant.online
                        ? "Online"
                        : "Offline"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Info className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === "admin" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.senderId === "admin"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderId === "admin"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        {currentConversation && (
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-end gap-3">
              <Button variant="outline" size="sm">
                <Paperclip className="w-4 h-4" />
              </Button>

              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 min-h-[60px] resize-none"
                rows={1}
              />

              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* No Conversation Selected */}
        {!currentConversation && (
          <div className="flex-1 flex items-center justify-center">
            <Card className="text-center p-8">
              <CardHeader>
                <CardTitle>No Conversation Selected</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Select a conversation from the sidebar to start messaging
                </p>
                <Button onClick={() => setSelectedConversation("1")}>
                  Start Chatting
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
