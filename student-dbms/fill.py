import csv
import sqlite3

# Connect to (or create) SQLite database
conn = sqlite3.connect("students.db")
cur = conn.cursor()

# Create table
cur.execute(
    """
CREATE TABLE IF NOT EXISTS students (
    uid    TEXT,
    name   TEXT,
    usn    TEXT,
    branch TEXT
)
"""
)

# Open CSV and insert data
with open("students.csv", "r") as f:
    reader = csv.DictReader(f)  # CSV has columns: Name,USN

    for row in reader:
        name = row.get("Name") or None  # match exact CSV header
        usn = row.get("USN") or None

        cur.execute(
            "INSERT INTO students (uid, name, usn, branch) VALUES (?, ?, ?, ?)",
            (None, name, usn, None),
        )

# Commit and close
conn.commit()
conn.close()
print("Database created and filled successfully.")

