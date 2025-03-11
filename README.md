# 🚀 GradeIT - Online Code Evaluation & Grading System

GradeIT is an automated online coding platform designed for college-level programming lab assignments. It simplifies grading by automatically executing student submissions, checking correctness against test cases, and providing instant feedback.

## 🎯 Features

- ✅ **Automated Code Execution & Grading** - Runs submissions and checks correctness.
- ✅ **Multiple Language Support** - Supports Python, Java, C++, and more.
- ✅ **Plagiarism Detection (Optional)** - Detects similar submissions within an assignment.
- ✅ **Secure Execution Environment** - Runs code in a sandboxed, isolated environment.
- ✅ **Custom Test Cases** - Teachers can define their own test cases for grading.
- ✅ **Instant Feedback** - Provides real-time feedback to students.
- ✅ **ML Code Execution (Future Scope)** - Supports executing ML models in a controlled environment.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Next.js, Node.js, Prisma ORM
- **Database:** PostgreSQL
- **Execution Engine:** Judge0 + Custom Execution Server
- **Security:** OAuth

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/habeel-shamsudeen/CodeGrade.git
cd CodeGrade
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root directory and configure the necessary environment variables.

### 4️⃣ Start the Development Server
```sh
npm run dev
```
---

## 📌 Project Overview

GradeIT is a classroom management and coding assignment platform with two primary roles:

1.  **Faculty (Teachers)**
2.  **Students**

### Faculty Flow

#### Home Page

- Displays all classrooms created by the faculty
- Option to create a new classroom

#### Classroom Page

- Shows a list of assignments (e.g., Week 1, Week 2) in card format
- "Create Assignment" button
- Option to view & manage students in the class

#### Assignment Page

- Displays questions & assignment configuration/settings
- Shows students’ progress (submission history, marks, etc.)
- Live monitoring of student activity
- Analytics & insights

### Student Flow

#### Home Page

- Displays all classrooms the student is enrolled in
- Option to join a new classroom using a join link or class code

#### Classroom Page

- Shows a list of assignments (e.g., Week 1, Week 2) in card format

#### Assignment Page

- Displays questions & instructions
- Integrated code editor (LeetCode-style)
- Option to run custom test cases or submit code for evaluation
- Submission history
- Analytics

---

## 💡 The Idea Behind the Project

In many colleges, computer labs rely on outdated manual systems that require constant faculty involvement at every stage of the lab program:

1.  Faculty need to review and approve student algorithms before allowing them to proceed.
2.  Students then write code in an outdated environment.
3.  Faculty manually test each student’s code, often missing boundary and edge cases.
4.  Copying among students is a significant issue.

### How GradeIT Solves These Issues

- **Automates the grading process**: From algorithm approval to final code evaluation.
- **Reduces faculty workload**: No need for constant manual supervision.
- **Provides instant feedback**: Ensures students get immediate insights into their performance.
- **Detects plagiarism**: Prevents copying and encourages genuine learning.

### Future Scope

- **Algorithm Evaluation**: Automating the algorithm review process.
- **Dynamic Viva Generation**: AI-based viva questions based on student submissions.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](https://chatgpt.com/c/LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! If you find any bugs or want to enhance the project, feel free to submit a pull request.

---

## 📧 Contact

For any inquiries or support, please reach out to [me](habeelshamsudeen9895@gmail.com).
