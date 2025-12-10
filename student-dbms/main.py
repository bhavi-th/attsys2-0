import sys
import tabula
import pandas as pd
import sqlite3

# === 1. Parse command-line arguments ===
if len(sys.argv) != 3:
    print("Usage: python script.py <input.pdf> <output.db>")
    sys.exit(1)

pdf_file = sys.argv[1]
db_file = sys.argv[2]

# === 2. Extract table from PDF ===
dfs = tabula.read_pdf(
    pdf_file, pages="all", lattice=True, pandas_options={"header": None}
)
df = pd.concat(dfs, ignore_index=True)

# Drop empty columns
df = df.dropna(axis=1, how="all")

# Assign column names (up to the number of columns found)
df.columns = ["Sno.", "Name", "USN", "Some id"][: df.shape[1]]

# Select only required columns
required = df[["Name", "USN"]]

# === 3. Insert into SQLite database ===
conn = sqlite3.connect(db_file)
cur = conn.cursor()

# Create table if not exists
cur.execute(
    """
CREATE TABLE IF NOT EXISTS students (
    uid      TEXT,
    name     TEXT,
    usn      TEXT,
    branch   TEXT,
    password TEXT
)
"""
)

# Insert rows
for _, row in required.iterrows():
    name = row.get("Name") or None
    usn = row.get("USN") or None

    cur.execute(
        "INSERT INTO students (uid, name, usn, branch) VALUES (?, ?, ?, ?)",
        (None, name, usn, None),
    )

# Commit and close
conn.commit()
conn.close()

print(f"Database '{db_file}' created and filled successfully from '{pdf_file}'.")

