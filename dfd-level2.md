# DFD Level 2 - Detailed Processes (GradeIt System)

## Process Decomposition
This level provides detailed breakdown of the main processes from Level 1.

## 1. User Management (P1) - Detailed

### 1.1 Authentication (P1.1)
- **Input**: Login credentials, OAuth tokens
- **Output**: Session tokens, user roles
- **Data Stores**: User accounts, session data

### 1.2 Profile Management (P1.2)
- **Input**: Profile updates, preferences
- **Output**: Updated user profiles
- **Data Stores**: User profiles, settings

### 1.3 Role Management (P1.3)
- **Input**: Role assignments, permissions
- **Output**: Access control decisions
- **Data Stores**: User roles, permissions

## 2. Classroom Management (P2) - Detailed

### 2.1 Class Creation (P2.1)
- **Input**: Class details, faculty information
- **Output**: Classroom records, invite codes
- **Data Stores**: Classroom data, faculty assignments

### 2.2 Student Enrollment (P2.2)
- **Input**: Join codes, student information
- **Output**: Enrollment confirmations
- **Data Stores**: Student-class relationships

### 2.3 Class Administration (P2.3)
- **Input**: Class settings, student management
- **Output**: Updated class configurations
- **Data Stores**: Classroom settings, student lists

## 3. Assignment Management (P3) - Detailed

### 3.1 Assignment Creation (P3.1)
- **Input**: Assignment details, due dates, settings
- **Output**: Assignment records, configurations
- **Data Stores**: Assignment metadata, settings

### 3.2 Question Management (P3.2)
- **Input**: Question content, language specifications
- **Output**: Question records, templates
- **Data Stores**: Question bank, content

### 3.3 Test Case Generation (P3.3)
- **Input**: Question descriptions, sample I/O
- **Output**: Generated test cases
- **External**: LLM service for test case generation
- **Data Stores**: Test case database

### 3.4 Metric Configuration (P3.4)
- **Input**: Evaluation criteria, scoring weights
- **Output**: Metric definitions, weight configurations
- **Data Stores**: Evaluation metrics, scoring rules

## 4. Code Submission Processing (P4) - Detailed

### 4.1 Submission Validation (P4.1)
- **Input**: Code submissions, language validation
- **Output**: Validated submissions, error messages
- **Data Stores**: Submission validation logs

### 4.2 Submission Storage (P4.2)
- **Input**: Validated code, metadata
- **Output**: Stored submissions, submission IDs
- **Data Stores**: Code submission database

### 4.3 Submission Tracking (P4.3)
- **Input**: Submission events, status updates
- **Output**: Submission status, progress tracking
- **Data Stores**: Submission status, audit logs

## 5. Code Execution & Testing (P5) - Detailed

### 5.1 Code Compilation (P5.1)
- **Input**: Source code, language specifications
- **Output**: Compilation results, executable code
- **External**: Judge0 API for compilation

### 5.2 Test Case Execution (P5.2)
- **Input**: Compiled code, test case inputs
- **Output**: Execution results, output comparisons
- **External**: Judge0 API for execution

### 5.3 Result Processing (P5.3)
- **Input**: Execution outputs, expected results
- **Output**: Test case pass/fail status, performance metrics
- **Data Stores**: Test case results, execution logs

### 5.4 Webhook Processing (P5.4)
- **Input**: Judge0 webhook notifications
- **Output**: Updated submission status, result processing
- **Data Stores**: Webhook logs, status updates

## 6. Automated Evaluation (P6) - Detailed

### 6.1 Test Case Evaluation (P6.1)
- **Input**: Test case results, scoring criteria
- **Output**: Test case scores, pass/fail counts
- **Data Stores**: Test case evaluation results

### 6.2 LLM Code Analysis (P6.2)
- **Input**: Source code, evaluation metrics
- **Output**: Code quality scores, detailed feedback
- **External**: LLM service for code analysis
- **Data Stores**: LLM evaluation results

### 6.3 Metric Calculation (P6.3)
- **Input**: Test case scores, LLM evaluations, weights
- **Output**: Weighted scores, final evaluations
- **Data Stores**: Metric calculation results

### 6.4 Score Aggregation (P6.4)
- **Input**: Individual scores, question weights
- **Output**: Final submission scores, overall grades
- **Data Stores**: Final evaluation results

## 7. Grading & Reporting (P7) - Detailed

### 7.1 Grade Calculation (P7.1)
- **Input**: Evaluation results, grading criteria
- **Output**: Final grades, score breakdowns
- **Data Stores**: Grade calculations, score history

### 7.2 Progress Tracking (P7.2)
- **Input**: Submission data, completion status
- **Output**: Progress reports, completion metrics
- **Data Stores**: Progress tracking data

### 7.3 Analytics Generation (P7.3)
- **Input**: Grade data, performance metrics
- **Output**: Analytics reports, insights
- **Data Stores**: Analytics data, report cache

### 7.4 Feedback Generation (P7.4)
- **Input**: Evaluation results, student data
- **Output**: Personalized feedback, improvement suggestions
- **Data Stores**: Feedback templates, student responses

## Future Scope Modules (Included)

### 8. Exam Mode Management (P8)
- **8.1 Proctoring Setup**: Full-screen enforcement, copy-paste prevention
- **8.2 Time Management**: Exam timers, auto-submission
- **8.3 Security Monitoring**: Activity tracking, violation detection

### 9. Question Format Support (P9)
- **9.1 MCQ Management**: Multiple choice question creation and evaluation
- **9.2 Code Review**: Manual code review workflows
- **9.3 File Upload**: Support for file-based submissions

### 10. Advanced Analytics (P10)
- **10.1 Performance Analytics**: Detailed performance metrics
- **10.2 Plagiarism Detection**: Code similarity analysis
- **10.3 Learning Analytics**: Student learning pattern analysis

## Data Stores (Detailed)
- **D1**: User Database (users, accounts, roles, sessions)
- **D2**: Classroom Database (classrooms, enrollments, settings)
- **D3**: Assignment Database (assignments, questions, test cases, metrics)
- **D4**: Submission Database (code submissions, results, status)
- **D5**: Evaluation Database (scores, metrics, feedback, analytics)
- **D6**: Configuration Database (system settings, templates)
- **D7**: Audit Database (logs, tracking, security events)

## External Services
- **E1**: Faculty Users
- **E2**: Student Users
- **E3**: Judge0 API (Code execution service)
- **E4**: LLM Service (Groq AI for code evaluation)
- **E5**: Authentication Service (OAuth providers)
- **E6**: Notification Service (Email, push notifications)