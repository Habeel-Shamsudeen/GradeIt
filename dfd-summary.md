# GradeIt System - Data Flow Diagrams (Gane-Sarson Model)

## Overview
This document presents the complete Data Flow Diagrams (DFDs) for the GradeIt system - an online coding assessment and grading platform. The diagrams follow the Gane-Sarson notation and are structured in three levels of detail.

## System Description
GradeIt is a comprehensive coding assessment platform that enables:
- **Faculty** to create coding assignments, manage classrooms, and evaluate submissions
- **Students** to access assignments, submit code solutions, and receive feedback
- **Automated evaluation** through Judge0 API for code execution and LLM services for quality assessment
- **Comprehensive grading** with configurable metrics and scoring weights

## DFD Levels

### Level 0 - Context Diagram
- **Purpose**: Shows the system boundary and external interactions
- **Key External Entities**: Faculty, Students, Judge0 API, LLM Service
- **Main Data Flows**: Assignment management, code submission, evaluation, grading

### Level 1 - Main Processes
- **Purpose**: Breaks down the system into major functional areas
- **7 Main Processes**:
  1. User Management (P1)
  2. Classroom Management (P2)
  3. Assignment Management (P3)
  4. Code Submission Processing (P4)
  5. Code Execution & Testing (P5)
  6. Automated Evaluation (P6)
  7. Grading & Reporting (P7)

### Level 2 - Detailed Processes
- **Purpose**: Provides detailed breakdown of complex processes
- **Key Detailed Areas**:
  - Assignment Management (P3.1-P3.4)
  - Code Execution & Testing (P5.1-P5.4)
  - Automated Evaluation (P6.1-P6.4)
  - Future Scope Modules (P8-P10)

## Data Stores
- **D1**: User Database (authentication, profiles, roles)
- **D2**: Classroom Database (classes, enrollments, settings)
- **D3**: Assignment Database (assignments, questions, test cases)
- **D4**: Submission Database (code submissions, results)
- **D5**: Evaluation Database (scores, metrics, feedback)
- **D6**: Configuration Database (system settings, templates)
- **D7**: Audit Database (logs, tracking, security events)

## External Services
- **Judge0 API**: Code execution and testing service
- **LLM Service (Groq)**: AI-powered code quality evaluation
- **Authentication Service**: OAuth and session management
- **Notification Service**: Email and push notifications

## Future Scope Modules
The system is designed to support future enhancements including:
- **Exam Mode**: Proctoring, time management, security monitoring
- **Question Formats**: MCQ support, code review workflows, file uploads
- **Advanced Analytics**: Performance metrics, plagiarism detection, learning analytics

## Key Features Highlighted in DFDs
1. **Automated Test Case Generation** using LLM services
2. **Asynchronous Code Evaluation** with webhook processing
3. **Configurable Scoring Metrics** with weighted evaluation
4. **Comprehensive Audit Trail** for all system activities
5. **Scalable Architecture** supporting multiple question types and evaluation methods

## Technical Implementation
- **Backend**: Next.js with Prisma ORM
- **Database**: PostgreSQL
- **External APIs**: Judge0 for code execution, Groq for AI evaluation
- **Authentication**: NextAuth.js with OAuth support
- **Real-time Processing**: Webhook-based asynchronous evaluation

This DFD structure provides a clear understanding of the system's data flows, processes, and external interactions, making it valuable for system analysis, development planning, and stakeholder communication.