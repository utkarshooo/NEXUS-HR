import os
import json
import sqlite3
import datetime
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "nexushr.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Employees Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS employees (
        id TEXT PRIMARY KEY,
        employee_code TEXT UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        avatar TEXT,
        department TEXT NOT NULL,
        designation TEXT NOT NULL,
        manager_name TEXT,
        work_mode TEXT NOT NULL,
        location TEXT NOT NULL,
        salary_base INTEGER NOT NULL,
        performance_rating REAL NOT NULL,
        flight_risk_score INTEGER NOT NULL,
        flight_risk_level TEXT NOT NULL,
        flight_risk_recommendation TEXT,
        skills TEXT,
        is_demo INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
    )
    """)

    # Leaves Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS leaves (
        id TEXT PRIMARY KEY,
        employee_id TEXT NOT NULL,
        employee_name TEXT NOT NULL,
        employee_avatar TEXT,
        department TEXT NOT NULL,
        leave_type TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        days INTEGER NOT NULL,
        reason TEXT,
        status TEXT NOT NULL,
        applied_at TEXT NOT NULL,
        approved_by TEXT,
        is_demo INTEGER NOT NULL DEFAULT 0
    )
    """)

    # Attendance Punch Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS attendance (
        id TEXT PRIMARY KEY,
        employee_id TEXT NOT NULL,
        employee_name TEXT NOT NULL,
        punch_type TEXT NOT NULL,
        work_mode TEXT NOT NULL,
        ip_address TEXT,
        timestamp TEXT NOT NULL
    )
    """)

    # Audit Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        action TEXT NOT NULL,
        entity TEXT NOT NULL,
        actor TEXT NOT NULL,
        details TEXT,
        timestamp TEXT NOT NULL
    )
    """)

    # Pre-seed if empty
    cursor.execute("SELECT COUNT(*) FROM employees")
    if cursor.fetchone()[0] == 0:
        print("Seeding initial database records...")
        now = datetime.datetime.now().isoformat()
        
        # 1. Two Verified REAL API Records (is_demo = 0)
        real_employees = [
            (
                "emp-live-001", "NEX-LIVE-001", "Dr. Aaron", "Vance", "aaron.vance@nexushr.enterprise",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
                "Core Engineering", "Chief Systems Architect", "Board of Directors",
                "HYBRID", "San Francisco, CA (HQ)", 210000, 4.95, 16, "LOW",
                "Core infrastructure custody; lead distributed runtime resilience.",
                "Java 21, Distributed Systems, Spring Boot 3, Linux Kernel, High-Throughput DBs",
                0, now
            ),
            (
                "emp-live-002", "NEX-LIVE-002", "Sarah", "Jenkins", "sarah.jenkins@nexushr.enterprise",
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
                "Artificial Intelligence & Data", "Staff ML & Vector Systems Engineer", "Dr. Aaron Vance",
                "REMOTE", "Austin, TX", 178000, 4.85, 24, "LOW",
                "Lead real-time pgvector RAG indexing pipelines.",
                "Python 3, Spring AI, Vector DBs, PyTorch, Kubernetes",
                0, now
            ),
        ]

        # 2. Eight Calibration Demo Benchmark Records (is_demo = 1)
        demo_employees = [
            (
                "emp-001", "NEX-0001", "Elena", "Rostova", "elena.rostova@nexushr.enterprise",
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
                "Executive Leadership", "VP of People & Enterprise Systems", "Board of Directors",
                "HYBRID", "San Francisco, CA (HQ)", 245000, 4.9, 12, "LOW",
                "Maintain strategic executive check-ins; succession pipeline.",
                "Strategic Workforce, Org Architecture, M&A People, Labor Law", 1, now
            ),
            (
                "emp-002", "NEX-0014", "Marcus", "Vance", "marcus.vance@nexushr.enterprise",
                "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256",
                "Human Resources", "Director of People Operations", "Elena Rostova",
                "IN_OFFICE", "San Francisco, CA (HQ)", 175000, 4.7, 24, "LOW",
                "Lead workforce transformation rollouts across Americas.",
                "People Ops, Labor Compliance, Talent Mobility, Compensation Modeling", 1, now
            ),
            (
                "emp-003", "NEX-0042", "Sophia", "Chen", "sophia.chen@nexushr.enterprise",
                "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256",
                "Core Engineering", "Principal Engineering Manager", "Elena Rostova",
                "HYBRID", "Seattle, WA", 195000, 4.8, 38, "MEDIUM",
                "Offload routine operational overhead; schedule mid-cycle equity refresh.",
                "Distributed Systems, Java 21, Spring Boot 3, Kubernetes", 1, now
            ),
            (
                "emp-004", "NEX-0189", "Alex", "Rivera", "alex.rivera@nexushr.enterprise",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
                "Platform Architecture", "Senior Full-Stack Engineer", "Sophia Chen",
                "REMOTE", "Austin, TX", 148000, 4.6, 72, "HIGH",
                "IMMEDIATE RETENTION: Adjust salary +12%, fast-track Lead promotion.",
                "React 19, TypeScript, PostgreSQL, Docker, GraphQL", 1, now
            ),
            (
                "emp-005", "NEX-0205", "Priya", "Sharma", "priya.sharma@nexushr.enterprise",
                "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=256",
                "Artificial Intelligence & Data", "Staff AI Research Scientist", "Sophia Chen",
                "HYBRID", "San Francisco, CA", 215000, 4.95, 41, "MEDIUM",
                "Grant conference travel budget; lead Spring AI integration.",
                "Spring AI, Vector DBs (pgvector), LLM Orchestration, PyTorch", 1, now
            ),
            (
                "emp-006", "NEX-0220", "David", "Kim", "david.kim@nexushr.enterprise",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
                "Product & UX", "Lead Product Designer", "Elena Rostova",
                "HYBRID", "New York, NY", 160000, 4.5, 22, "LOW",
                "Promote to Design System Custodian across enterprise web/mobile.",
                "Design Systems, Figma, UX Research, Micro-interactions", 1, now
            ),
            (
                "emp-007", "NEX-0235", "Amara", "Okafor", "amara.okafor@nexushr.enterprise",
                "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=256",
                "Core Engineering", "Senior DevOps / SRE Engineer", "Sophia Chen",
                "REMOTE", "Chicago, IL", 152000, 4.7, 64, "HIGH",
                "Alleviate on-call rotation load; add secondary escalation engineer.",
                "Kubernetes, Terraform, Prometheus, CI/CD Pipelines", 1, now
            ),
            (
                "emp-008", "NEX-0250", "Lucas", "Dubois", "lucas.dubois@nexushr.enterprise",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
                "Enterprise Sales", "Enterprise Account Executive", "Elena Rostova",
                "HYBRID", "New York, NY", 130000, 4.3, 18, "LOW",
                "Maintain strategic enterprise account pairing.",
                "B2B Enterprise SaaS, Contract Negotiation, Executive Presentations", 1, now
            ),
        ]

        cursor.executemany("""
            INSERT INTO employees VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, real_employees + demo_employees)

        # Pre-seed Leaves
        initial_leaves = [
            ("leave-101", "emp-004", "Alex Rivera", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256", "Platform Architecture", "ANNUAL", "2026-11-12", "2026-11-16", 3, "Family reunion and planned vacation.", "PENDING", "2026-10-28", None, 1),
            ("leave-102", "emp-007", "Amara Okafor", "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=256", "Core Engineering", "SICK", "2026-11-02", "2026-11-04", 2, "Recovery post minor procedure.", "APPROVED", "2026-10-25", "Sophia Chen", 1),
            ("leave-103", "emp-live-002", "Sarah Jenkins", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256", "Artificial Intelligence & Data", "CASUAL", "2026-11-20", "2026-11-20", 1, "Personal appointment.", "PENDING", "2026-10-31", None, 0),
        ]
        cursor.executemany("INSERT INTO leaves VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", initial_leaves)

        # Initial Audit Log
        cursor.execute("INSERT INTO audit_logs VALUES (?,?,?,?,?,?)", (
            "audit-001", "SYSTEM_INIT", "DATABASE", "SYSTEM_DAEMON", "NexusHR SQLite database initialized with real & benchmark records.", now
        ))

        conn.commit()

    conn.close()

class NexusHRHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def _send_json(self, data, status=200):
        body = json.dumps(data, indent=2).encode('utf-8')
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # API: Health Check
        if path == "/api/v1/health":
            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()
            c.execute("SELECT COUNT(*), SUM(CASE WHEN is_demo = 0 THEN 1 ELSE 0 END) FROM employees")
            total, real = c.fetchone()
            conn.close()
            return self._send_json({
                "status": "UP",
                "service": "NexusHR Enterprise REST API",
                "timestamp": datetime.datetime.now().isoformat(),
                "database": {
                    "connected": True,
                    "engine": "SQLite 3 Relational Engine",
                    "file": "nexushr.db"
                },
                "records": {
                    "total_employees": total,
                    "real_verified_records": real,
                    "demo_benchmark_records": total - real
                }
            })

        # API: Get Employees
        if path == "/api/v1/employees":
            source = query.get("source", ["all"])[0] # 'real', 'demo', 'all'
            search = query.get("search", [""])[0].lower()
            dept = query.get("department", ["ALL"])[0]
            sort_by = query.get("sort", ["id_asc"])[0]

            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            c = conn.cursor()

            sql = "SELECT * FROM employees WHERE 1=1"
            params = []

            if source == "real":
                sql += " AND is_demo = 0"
            elif source == "demo":
                sql += " AND is_demo = 1"

            if dept != "ALL":
                sql += " AND department = ?"
                params.append(dept)

            if search:
                sql += " AND (LOWER(first_name) LIKE ? OR LOWER(last_name) LIKE ? OR LOWER(designation) LIKE ? OR LOWER(employee_code) LIKE ?)"
                wildcard = f"%{search}%"
                params.extend([wildcard, wildcard, wildcard, wildcard])

            if sort_by == "salary_desc":
                sql += " ORDER BY salary_base DESC"
            elif sort_by == "risk_desc":
                sql += " ORDER BY flight_risk_score DESC"
            elif sort_by == "name_asc":
                sql += " ORDER BY first_name ASC"
            else:
                sql += " ORDER BY is_demo ASC, created_at DESC"

            c.execute(sql, params)
            rows = [dict(r) for r in c.fetchall()]

            # Count summary
            c.execute("SELECT COUNT(*), SUM(CASE WHEN is_demo = 0 THEN 1 ELSE 0 END) FROM employees")
            tot, r_cnt = c.fetchone()
            conn.close()

            formatted = []
            for r in rows:
                formatted.append({
                    "id": r["id"],
                    "employeeCode": r["employee_code"],
                    "firstName": r["first_name"],
                    "lastName": r["last_name"],
                    "email": r["email"],
                    "avatar": r["avatar"],
                    "department": r["department"],
                    "designation": r["designation"],
                    "managerName": r["manager_name"],
                    "workMode": r["work_mode"],
                    "location": r["location"],
                    "salary": {
                        "baseAnnual": r["salary_base"],
                        "currency": "USD"
                    },
                    "performance": {
                        "rating": r["performance_rating"]
                    },
                    "flightRisk": {
                        "score": r["flight_risk_score"],
                        "level": r["flight_risk_level"],
                        "recommendation": r["flight_risk_recommendation"]
                    },
                    "skills": [s.strip() for s in (r["skills"] or "").split(",") if s.strip()],
                    "isDemo": bool(r["is_demo"]),
                    "createdAt": r["created_at"]
                })

            return self._send_json({
                "success": True,
                "data": formatted,
                "meta": {
                    "total": len(formatted),
                    "totalInDB": tot,
                    "realVerifiedCount": r_cnt or 0,
                    "demoCount": (tot - (r_cnt or 0))
                }
            })

        # API: Analytics & Dynamic Stats
        if path == "/api/v1/analytics/stats":
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            c = conn.cursor()

            c.execute("SELECT COUNT(*), SUM(CASE WHEN is_demo = 0 THEN 1 ELSE 0 END), AVG(salary_base), SUM(salary_base), AVG(flight_risk_score) FROM employees")
            total, real, avg_sal, total_burn, avg_risk = c.fetchone()

            c.execute("SELECT department, COUNT(*), SUM(salary_base) FROM employees GROUP BY department")
            dept_stats = [{"department": r[0], "count": r[1], "spend": r[2]} for r in c.fetchall()]

            c.execute("SELECT flight_risk_level, COUNT(*) FROM employees GROUP BY flight_risk_level")
            risk_breakdown = {r[0]: r[1] for r in c.fetchall()}

            conn.close()
            return self._send_json({
                "success": True,
                "stats": {
                    "totalEmployees": total or 0,
                    "realEmployees": real or 0,
                    "demoEmployees": (total or 0) - (real or 0),
                    "averageSalary": round(avg_sal or 0),
                    "annualPayroll": total_burn or 0,
                    "monthlyBurn": round((total_burn or 0) / 12),
                    "averageFlightRisk": round(avg_risk or 0),
                    "criticalRiskCount": risk_breakdown.get("HIGH", 0) + risk_breakdown.get("CRITICAL", 0),
                    "departmentDistribution": dept_stats,
                    "riskBreakdown": risk_breakdown
                }
            })

        # API: Leaves
        if path == "/api/v1/leaves":
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            c = conn.cursor()
            c.execute("SELECT * FROM leaves ORDER BY applied_at DESC")
            leaves = [dict(r) for r in c.fetchall()]
            conn.close()
            return self._send_json({
                "success": True,
                "data": leaves
            })

        # Default fallback to static file serving
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_len = int(self.headers.get('Content-Length', 0))
        post_body = self.rfile.read(content_len).decode('utf-8')
        try:
            payload = json.loads(post_body) if post_body else {}
        except Exception:
            return self._send_json({"success": False, "error": "Malformed JSON body"}, 400)

        # POST: Create Real Employee
        if path == "/api/v1/employees":
            first_name = (payload.get("firstName") or "").strip()
            last_name = (payload.get("lastName") or "").strip()
            email = (payload.get("email") or "").strip()
            dept = payload.get("department") or "Core Engineering"
            designation = (payload.get("designation") or "").strip()
            salary = int(payload.get("salary") or 120000)
            work_mode = payload.get("workMode") or "HYBRID"
            location = (payload.get("location") or "San Francisco, CA").strip()
            skills = payload.get("skills") or "TypeScript, React, Spring Boot"

            # Validation
            errors = []
            if not first_name or len(first_name) < 2:
                errors.append("First name must be at least 2 characters.")
            if not last_name or len(last_name) < 2:
                errors.append("Last name must be at least 2 characters.")
            if not email or "@" not in email or "." not in email:
                errors.append("A valid corporate email address is required.")
            if salary < 30000:
                errors.append("Annual base salary must be at least $30,000.")

            if errors:
                return self._send_json({"success": False, "error": "Validation failed", "details": errors}, 422)

            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()

            # Check email uniqueness
            c.execute("SELECT id FROM employees WHERE email = ?", (email,))
            if c.fetchone():
                conn.close()
                return self._send_json({"success": False, "error": f"Employee with email '{email}' already exists in database."}, 409)

            c.execute("SELECT COUNT(*) FROM employees WHERE is_demo = 0")
            count_real = c.fetchone()[0] + 1
            code = f"NEX-LIVE-{str(count_real).zfill(3)}"
            emp_id = f"emp-live-{datetime.datetime.now().strftime('%M%S')}"

            # Compute initial flight risk score based on market calibration
            risk_score = 15 if salary > 150000 else 28
            risk_level = "LOW" if risk_score < 30 else "MEDIUM"

            avatar = payload.get("avatar") or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
            now = datetime.datetime.now().isoformat()

            c.execute("""
                INSERT INTO employees VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """, (
                emp_id, code, first_name, last_name, email, avatar, dept, designation,
                "Dr. Aaron Vance", work_mode, location, salary, 4.8, risk_score,
                risk_level, "Real employee onboarded via REST API.", skills, 0, now
            ))

            c.execute("INSERT INTO audit_logs VALUES (?,?,?,?,?,?)", (
                f"audit-{datetime.datetime.now().strftime('%f')}", "EMPLOYEE_CREATE", emp_id, "HR_ADMIN",
                f"Created real DB employee {first_name} {last_name} ({code})", now
            ))

            conn.commit()
            conn.close()

            return self._send_json({
                "success": True,
                "message": f"Real employee record {code} successfully inserted into SQLite database.",
                "data": {
                    "id": emp_id,
                    "employeeCode": code,
                    "firstName": first_name,
                    "lastName": last_name,
                    "email": email,
                    "isDemo": False
                }
            }, 201)

        # POST: Submit Leave Request
        if path == "/api/v1/leaves":
            emp_name = payload.get("employeeName") or "Active User"
            emp_id = payload.get("employeeId") or "emp-user"
            leave_type = payload.get("leaveType") or "ANNUAL"
            start_date = payload.get("startDate") or datetime.date.today().isoformat()
            end_date = payload.get("endDate") or datetime.date.today().isoformat()
            days = int(payload.get("days") or 1)
            reason = payload.get("reason") or "Vacation"

            leave_id = f"leave-live-{datetime.datetime.now().strftime('%M%S')}"
            now = datetime.datetime.now().isoformat()

            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()
            c.execute("""
                INSERT INTO leaves VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """, (
                leave_id, emp_id, emp_name,
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
                "Core Engineering", leave_type, start_date, end_date, days, reason,
                "PENDING", now, None, 0
            ))
            conn.commit()
            conn.close()

            return self._send_json({
                "success": True,
                "message": "Leave request submitted to live database queue.",
                "id": leave_id
            }, 201)

        # POST: Clock Punch
        if path == "/api/v1/attendance/punch":
            emp_id = payload.get("employeeId") or "emp-001"
            emp_name = payload.get("employeeName") or "User"
            punch_type = payload.get("type") or "IN"
            work_mode = payload.get("workMode") or "IN_OFFICE"
            ip = self.client_address[0]
            now = datetime.datetime.now().isoformat()

            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()
            c.execute("INSERT INTO attendance VALUES (?,?,?,?,?,?,?)", (
                f"punch-{datetime.datetime.now().strftime('%f')}", emp_id, emp_name, punch_type, work_mode, ip, now
            ))
            conn.commit()
            conn.close()

            return self._send_json({
                "success": True,
                "message": f"Punch {punch_type} successfully logged.",
                "timestamp": now,
                "verifiedIp": ip
            })

        return self._send_json({"success": False, "error": f"Endpoint '{path}' not found"}, 404)

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path.startswith("/api/v1/employees/"):
            emp_id = path.replace("/api/v1/employees/", "").strip()
            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()

            c.execute("SELECT employee_code, is_demo FROM employees WHERE id = ?", (emp_id,))
            row = c.fetchone()
            if not row:
                conn.close()
                return self._send_json({"success": False, "error": "Employee not found in database"}, 404)

            # Prevent deleting demo records if desired, or allow removing real records
            c.execute("DELETE FROM employees WHERE id = ?", (emp_id,))
            c.execute("INSERT INTO audit_logs VALUES (?,?,?,?,?,?)", (
                f"audit-{datetime.datetime.now().strftime('%f')}", "EMPLOYEE_DELETE", emp_id, "HR_ADMIN",
                f"Deleted employee {row[0]} from database", datetime.datetime.now().isoformat()
            ))
            conn.commit()
            conn.close()

            return self._send_json({
                "success": True,
                "message": f"Employee {row[0]} successfully deleted from database."
            })

        return self._send_json({"success": False, "error": "Not found"}, 404)

    def do_PATCH(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path.startswith("/api/v1/leaves/"):
            leave_id = path.replace("/api/v1/leaves/", "").strip()
            content_len = int(self.headers.get('Content-Length', 0))
            payload = json.loads(self.rfile.read(content_len).decode('utf-8'))
            status = payload.get("status") or "APPROVED"
            approver = payload.get("approvedBy") or "Manager"

            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()
            c.execute("UPDATE leaves SET status = ?, approved_by = ? WHERE id = ?", (status, approver, leave_id))
            conn.commit()
            conn.close()

            return self._send_json({
                "success": True,
                "message": f"Leave {leave_id} updated to {status}."
            })

        return self._send_json({"success": False, "error": "Not found"}, 404)

if __name__ == "__main__":
    init_db()
    PORT = 8080
    server = HTTPServer(("0.0.0.0", PORT), NexusHRHandler)
    print(f"🚀 NexusHR Enterprise Unified REST API & Static Server running on http://0.0.0.0:{PORT}")
    server.serve_forever()
