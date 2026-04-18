import { User } from "../models/user.model.js";
import { Bounty } from "../models/bounty.model.js";
import { Task } from "../models/task.model.js";

export const getBountyMatches = async (req, res) => {
    try {
        const { bountyId } = req.params;

        // 1. Fetch the bounty/task description
        let item = await Bounty.findById(bountyId);
        if (!item) {
            item = await Task.findById(bountyId);
        }

        if (!item) {
            return res.status(404).json({ message: "Bounty or Task not found" });
        }
        
        // 2. Fetch all student profiles that have at least some skills or description
        const students = await User.find({
            $or: [
                { skills: { $exists: true, $ne: "" } },
                { description: { $exists: true, $ne: "" } }
            ]
        });

        if (!students || students.length === 0) {
            return res.status(404).json({ message: "No students found in the database to match." });
        }

        // 3. Format students to match Python Schema
        const formattedStudents = students.map(student => ({
            id: student._id.toString(),
            skills: student.skills || "",
            description: student.description || "",
            pastExperiences: student.pastExperiences || "",
            work_ratings: student.profileScore ? student.profileScore / 20.0 : 0.0, // Scale 100 to 5.0
            experience_years: 1.0 // Arbitrary default or extracted from pastExp length
        }));

        const pyPayload = {
            bounty_description: item.description + " " + (item.skill || ""),
            students: formattedStudents
        };

        // 4. Send POST request to Python Microservice
        const response = await fetch("http://127.0.0.1:8000/api/match_internal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pyPayload)
        });

        if (!response.ok) {
            const errStr = await response.text();
            throw new Error(`Python AI Error: ${errStr}`);
        }

        const matchResults = await response.json();
        
        // 5. Enhance Match Results with Student Info (Name, etc.)
        const enhancedResults = matchResults.map(match => {
            const studentDoc = students.find(s => s._id.toString() === match.student_id);
            return {
                ...match,
                student_name: studentDoc ? studentDoc.name : "Unknown",
                student_email: studentDoc ? studentDoc.email : "",
                student_skills: studentDoc ? studentDoc.skills : ""
            };
        });

        return res.status(200).json({ matches: enhancedResults });

    } catch (error) {
        console.error("AI Matcher Error:", error);
        return res.status(500).json({ message: "Failed to run AI matching", error: error.message });
    }
};
