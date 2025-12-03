import Subject from "../models/subject.js";

// Create Subject
const subjectCreate = async (req, res) => {
  try {
    const { subjects, school } = req.body;

    if (!subjects || subjects.length === 0) {
      return res.status(400).json({ message: "No subjects provided" });
    }

    // Check duplicate subCode (not code)
    const existing = await Subject.findOne({
      subCode: subjects[0].subCode, // Use subCode, not code
      school: school,
    });

    if (existing) {
      return res.status(409).json({
        message: "Sorry, this subCode already exists in this school",
      });
    }

    // Use OLD field names that match your model
    const newSubjects = subjects.map((subject) => ({
      subName: subject.subName, // Not name
      subCode: subject.subCode, // Not code
      sessions: subject.sessions, // Not classes
      sclassName: subject.sclassName, // Not className
      teacher: subject.teacher || null,
      school: school,
    }));

    const result = await Subject.insertMany(newSubjects);

    res.status(201).json({
      message: "Subjects created successfully",
      data: result,
    });
  } catch (err) {
    console.error("❌ Subject create error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get All Subjects
const getAllSubjects = async (req, res) => {
  try {
    const { school } = req.query;

    let query = {};
    if (school) {
      query.school = school;
    }

    const subjects = await Subject.find(query).sort({ createdAt: -1 });

    // Transform data to match frontend expectations
    const transformedSubjects = subjects.map((subject) => ({
      id: subject._id,
      name: subject.subName,
      code: subject.subCode,
      type: "Core", // Default value since your model doesn't have type
      classes: subject.sessions,
      teachers: subject.teacher ? 1 : 0,
      className: subject.sclassName,
      school: subject.school,
      teacherId: subject.teacher,
    }));

    res.status(200).json(transformedSubjects);
  } catch (err) {
    console.error("❌ Get all subjects error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get Subject by ID
const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Transform data
    const transformedSubject = {
      id: subject._id,
      name: subject.subName,
      code: subject.subCode,
      type: "Core",
      classes: subject.sessions,
      teachers: subject.teacher ? 1 : 0,
      className: subject.sclassName,
      school: subject.school,
      teacherId: subject.teacher,
    };

    res.status(200).json(transformedSubject);
  } catch (err) {
    console.error("❌ Get subject by ID error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update Subject
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subName, subCode, sessions, sclassName, teacher } = req.body;

    // Check if subject exists
    const existingSubject = await Subject.findById(id);
    if (!existingSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Check for duplicate subCode (excluding current subject)
    if (subCode && subCode !== existingSubject.subCode) {
      const duplicate = await Subject.findOne({
        subCode: subCode,
        school: existingSubject.school,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(409).json({
          message: "Subject code already exists in this school",
        });
      }
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      {
        subName: subName || existingSubject.subName,
        subCode: subCode || existingSubject.subCode,
        sessions: sessions || existingSubject.sessions,
        sclassName: sclassName || existingSubject.sclassName,
        teacher: teacher !== undefined ? teacher : existingSubject.teacher,
      },
      { new: true, runValidators: true }
    );

    // Transform response
    const transformedSubject = {
      id: updatedSubject._id,
      name: updatedSubject.subName,
      code: updatedSubject.subCode,
      type: "Core",
      classes: updatedSubject.sessions,
      teachers: updatedSubject.teacher ? 1 : 0,
      className: updatedSubject.sclassName,
      school: updatedSubject.school,
      teacherId: updatedSubject.teacher,
    };

    res.status(200).json({
      message: "Subject updated successfully",
      data: transformedSubject,
    });
  } catch (err) {
    console.error("❌ Update subject error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete Subject
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({
      message: "Subject deleted successfully",
      data: { id: subject._id },
    });
  } catch (err) {
    console.error("❌ Delete subject error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get Subjects by Class
const getSubjectsByClass = async (req, res) => {
  try {
    const { sclassName } = req.params;
    const { school } = req.query;

    let query = { sclassName };
    if (school) {
      query.school = school;
    }

    const subjects = await Subject.find(query).sort({ subName: 1 });

    const transformedSubjects = subjects.map((subject) => ({
      id: subject._id,
      name: subject.subName,
      code: subject.subCode,
      sessions: subject.sessions,
      teacher: subject.teacher,
      className: subject.sclassName,
    }));

    res.status(200).json(transformedSubjects);
  } catch (err) {
    console.error("❌ Get subjects by class error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get Subjects by Teacher
const getSubjectsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { school } = req.query;

    let query = { teacher: teacherId };
    if (school) {
      query.school = school;
    }

    const subjects = await Subject.find(query).sort({ subName: 1 });

    const transformedSubjects = subjects.map((subject) => ({
      id: subject._id,
      name: subject.subName,
      code: subject.subCode,
      sessions: subject.sessions,
      className: subject.sclassName,
      school: subject.school,
    }));

    res.status(200).json(transformedSubjects);
  } catch (err) {
    console.error("❌ Get subjects by teacher error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Assign Teacher to Subject
const assignTeacherToSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherId } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      id,
      { teacher: teacherId },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({
      message: "Teacher assigned successfully",
      data: {
        id: subject._id,
        teacher: subject.teacher,
      },
    });
  } catch (err) {
    console.error("❌ Assign teacher error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Remove Teacher from Subject
const removeTeacherFromSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findByIdAndUpdate(
      id,
      { teacher: null },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({
      message: "Teacher removed successfully",
      data: {
        id: subject._id,
        teacher: subject.teacher,
      },
    });
  } catch (err) {
    console.error("❌ Remove teacher error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get Subject Statistics
const getSubjectStats = async (req, res) => {
  try {
    const { school } = req.query;

    let query = {};
    if (school) {
      query.school = school;
    }

    const totalSubjects = await Subject.countDocuments(query);
    const subjectsWithTeachers = await Subject.countDocuments({
      ...query,
      teacher: { $ne: null },
    });
    const subjectsByClass = await Subject.aggregate([
      { $match: query },
      { $group: { _id: "$sclassName", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      totalSubjects,
      subjectsWithTeachers,
      subjectsWithoutTeachers: totalSubjects - subjectsWithTeachers,
      subjectsByClass,
    });
  } catch (err) {
    console.error("❌ Get subject stats error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export {
  subjectCreate,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  getSubjectsByClass,
  getSubjectsByTeacher,
  assignTeacherToSubject,
  removeTeacherFromSubject,
  getSubjectStats,
};
