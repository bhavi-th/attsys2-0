import tabula
import pandas as pd

dfs = tabula.read_pdf(
    "./cse-9.pdf", pages="all", lattice=True, pandas_options={"header": None}
)
df = pd.concat(dfs, ignore_index=True)

df = df.dropna(axis=1, how="all")

df.columns = ["Sno.", "Name", "USN", "Some id"][: df.shape[1]]

required = df[["Name", "USN"]]

required.to_csv("students.csv", index=False)

