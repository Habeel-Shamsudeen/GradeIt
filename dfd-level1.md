# DFD Level 1 - Main Processes (GradeIt System)

## Process Overview
This level breaks down the GradeIt system into major functional processes.

## Main Processes

### 1. User Management (P1)
- **Input**: User registration data, authentication credentials
- **Output**: User profiles, session management
- **Data Stores**: User accounts, authentication data

### 2. Classroom Management (P2)
- **Input**: Class creation requests, join codes
- **Output**: Classroom data, student enrollments
- **Data Stores**: Classroom information, student-class relationships

### 3. Assignment Management (P3)
- **Input**: Assignment details, questions, test cases
- **Output**: Assignment configurations, question sets
- **Data Stores**: Assignment data, question bank, test cases

### 4. Code Submission Processing (P4)
- **Input**: Student code submissions, language specifications
- **Output**: Submission records, evaluation triggers
- **Data Stores**: Code submissions, submission metadata

### 5. Code Execution & Testing (P5)
- **Input**: Code submissions, test cases
- **Output**: Execution results, test case outcomes
- **External**: Judge0 API for code execution

### 6. Automated Evaluation (P6)
- **Input**: Code submissions, evaluation metrics
- **Output**: Scores, feedback, evaluation results
- **External**: LLM service for code quality assessment

### 7. Grading & Reporting (P7)
- **Input**: Evaluation results, grading criteria
- **Output**: Final scores, grade reports, analytics
- **Data Stores**: Final grades, performance metrics

## Data Stores
- **D1**: User Database (users, accounts, roles)
- **D2**: Classroom Database (classrooms, enrollments)
- **D3**: Assignment Database (assignments, questions, test cases)
- **D4**: Submission Database (code submissions, results)
- **D5**: Evaluation Database (scores, metrics, feedback)

## External Entities
- **E1**: Faculty
- **E2**: Students
- **E3**: Judge0 API
- **E4**: LLM Service

## Data Flow Summary
1. Faculty create assignments (P3) using classroom data (D2)
2. Students submit code (P4) for assignments (D3)
3. Code gets executed and tested (P5) via Judge0
4. Automated evaluation occurs (P6) using LLM service
5. Final grading and reporting (P7) provides results to faculty and students