// import { useNavigate } from "react-router-dom";

// const roles = [
//   { name: "Admin", description: "Manage school, users, classes" },
//   { name: "Teacher", description: "Manage attendance, grades, classes" },
//   { name: "Student", description: "View timetable, attendance, grades" },
// ];

// export default function LandingPage() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       <h1 className="text-4xl font-bold mb-10">School Management System</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {roles.map((role) => (
//           <div
//             key={role.name}
//             className="bg-white p-8 rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transition"
//             onClick={() => navigate(`/login/${role.name.toLowerCase()}`)}
//           >
//             <h2 className="text-2xl font-semibold mb-2">{role.name}</h2>
//             <p>{role.description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React from "react";
import { Card, CardHeader } from "../ui/card";

const UserChoice = () => {
  return (
    <section>
      <div>
        <div>
          <h2>School Management System</h2>
          <p>Choose your role to continue </p>
        </div>
        <div>
          {roles.map((role) => {
            return (
              <Card>
                <CardHeader></CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UserChoice;
