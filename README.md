# Construction-Field-Mng-Application
# Rules ~

1. One active part at a time, No jumping ahead

2. One feature branch per part

3. No direct commits to main

4. Every merge requires both devs to review

5. If something is unclear → stop & align

## Architecture

### High-Level Architecture

Mobile App (Single App – Role Based)
        |
        | REST APIs (JSON)
        |
Backend (Node.js + Express)
        |
PostgreSQL Database
        |
Web Dashboard (Manager / Owner)
