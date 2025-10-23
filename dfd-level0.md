# DFD Level 0 - Context Diagram (GradeIt System)

## System Overview
The GradeIt system is an online coding assessment and grading platform that facilitates automated evaluation of programming assignments.

## External Entities
- **Faculty**: Instructors who create assignments, manage classes, and grade submissions
- **Student**: Learners who access assignments and submit code solutions
- **Judge0 API**: External code execution service for running and testing code
- **LLM Service**: AI service (Groq) for code quality evaluation and metric analysis
- **Database**: PostgreSQL database storing all system data

## Main Data Flows

### Faculty Interactions
- Assignment creation and management
- Class management (create/join classrooms)
- Grading and evaluation oversight
- Student progress monitoring

### Student Interactions
- Assignment access and viewing
- Code submission and testing
- Results and feedback viewing
- Progress tracking

### External Service Interactions
- **Judge0 API**: Code execution, test case validation
- **LLM Service**: Code quality evaluation, metric scoring
- **Database**: Data persistence and retrieval

## System Boundary
The GradeIt system acts as the central hub coordinating between users and external services, managing the complete lifecycle of coding assessments from creation to evaluation.