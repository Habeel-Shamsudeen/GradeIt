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

That's a very clear and comprehensive setup guide\! To seamlessly integrate Docker Compose, we'll add a new section for it, making it an alternative (and often preferred) method for local setup.

Here's how you can include the Docker Compose setup:

---

## 🚀 Installation & Setup

### 1️⃣ Prerequisites

Before you begin, ensure you have **Node.js** installed locally on your machine. You can download it from [nodejs.org](https://nodejs.org/).

---

### 2️⃣ Clone the Repository

```sh
git clone https://github.com/Habeel-Shamsudeen/GradeIt.git
cd CodeGrade
```

---

### **3️⃣ Option A: Local Setup (without Docker Compose)**

If you prefer to run services directly on your machine:

#### 3.1 Install Dependencies

```sh
npm install
```

#### 3.2 Set Up Environment Variables

A template file, `.env.example`, is provided in the root directory of this project. It outlines all the necessary environment variables.

To set up your environment variables:

1.  **Duplicate the `.env.example` file** in the root directory.
2.  **Rename the duplicated file to `.env`**.
3.  **Open the new `.env` file** and replace the placeholder values with your actual credentials.

**Do not commit your `.env` file to Git**, as it contains sensitive information. It's usually already ignored by a `.gitignore` file, but it's good to be aware.

##### Where to get the API Keys:

- **`AUTH_SECRET`**: This is a random string used to sign session cookies. You can generate a strong, random string using an online tool or a command like `openssl rand -base64 32` in your terminal.
- **Google OAuth Credentials (`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`)**:
  1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
  2.  Create a new project (if you don't have one).
  3.  Navigate to **APIs & Services \> Credentials**.
  4.  Click **+ CREATE CREDENTIALS** and choose **OAuth client ID**.
  5.  Select "Web application" as the application type.
  6.  Set "Authorized JavaScript origins" to `http://localhost:3000` (for local development).
  7.  Set "Authorized redirect URIs" to `http://localhost:3000/api/auth/callback/google` (this is crucial for NextAuth.js).
  8.  After creation, your Client ID and Client Secret will be displayed. These are your `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` respectively.
- **Judge0 API (`JUDGE0_API_KEY`, `RAPID_API_HOST`)**:
  1.  Go to [RapidAPI Hub](https://www.google.com/search?q=https://rapidapi.com/judge0/api/judge0-ce).
  2.  Sign up or log in.
  3.  Subscribe to the Judge0 API (even the free tier will give you an API key).
  4.  On the API details page, you'll find your `X-RapidAPI-Key` (which is your `JUDGE0_API_KEY`) and `X-RapidAPI-Host` (which is your `RAPID_API_HOST`).

#### 3.3 Database Setup

For local development, you'll need a PostgreSQL database running. You can use Docker, set up PostgreSQL directly on your machine, or use a cloud provider for testing. Ensure your `DATABASE_URL` is correctly formatted to connect to your instance.

Example format: `postgresql://username:password@localhost:5432/mydatabase?sslmode=disable` (note `sslmode=disable` for local development, or `require` for production environments).

#### 3.4 Run Database Migrations

After setting up your `DATABASE_URL`, apply the database schema:

```sh
npx prisma migrate dev --name init
```

This command will create the necessary tables in your PostgreSQL database.

#### 3.5 Start the Development Server

```sh
npm run dev
```

Your application should now be running at `http://localhost:3000`.

---

### **3️⃣ Option B: Docker Compose Setup (Recommended)**

This method simplifies setup by running the application and its database inside Docker containers.

#### 3.1 Prerequisites for Docker Compose

Ensure you have **Docker Desktop** installed and running on your machine. You can download it from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/).

#### 3.2 Set Up Environment Variables

Follow the same steps as in Option A for creating and populating your **`.env`** file.
**Important:** When using Docker Compose for the database, your `DATABASE_URL` in `.env` should point to the Docker service name (e.g., `postgresql://gradeitDB:mypassword@db:5432/gradeit`) instead of `localhost`. The `db` hostname will be resolved by Docker Compose.

#### 3.3 Build and Run Services with Docker Compose

1.  **Build the Docker images and start all services:**

    ```sh
    docker-compose up --build
    ```

    This command will:

    - Build the application Docker image based on the `Dockerfile`.
    - Start a PostgreSQL database container.
    - Start the application container.
    - Automatically apply database migrations (as defined in `docker-compose.yml`).

2.  **Access the Application:**
    Your application should now be running at `http://localhost:3000`.

#### 3.4 Useful Docker Compose Commands

- **Stop services:** `docker-compose down`
- **Stop and remove containers, networks, and volumes:** `docker-compose down -v`
- **Run migrations manually (if needed, inside the app container):**
  ```sh
  docker-compose exec app npx prisma migrate dev --name your_migration_name
  ```
- **View logs for all services:** `docker-compose logs -f`
- **View logs for a specific service (e.g., `app`):** `docker-compose logs -f app`

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
