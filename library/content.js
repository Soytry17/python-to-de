const LIBRARY = {
  title: "DE Tool Library",
  parts: [
    {
      id: "python-core",
      label: "01 · PYTHON CORE",
      tools: ["pydantic", "requests", "logging"],
    },
    {
      id: "data-manipulation",
      label: "02 · DATA MANIPULATION",
      tools: ["pandas", "polars", "pandera", "duckdb"],
    },
    {
      id: "etl",
      label: "03 · ETL & DATABASES",
      tools: ["sqlalchemy", "dlt"],
    },
    {
      id: "storage",
      label: "04 · STORAGE & CONTAINERS",
      tools: ["boto3", "docker"],
    },
    {
      id: "orchestration",
      label: "05 · ORCHESTRATION",
      tools: ["airflow"],
    },
    {
      id: "big-data",
      label: "06 · BIG DATA",
      tools: ["pyspark"],
    },
    {
      id: "quality",
      label: "07 · TRANSFORM & QUALITY",
      tools: ["dbt", "pytest"],
    },
    {
      id: "cloud",
      label: "08 · CLOUD",
      tools: ["aws", "gcp"],
    },
  ],
  tools: {
    pydantic: {
      id: "pydantic",
      name: "Pydantic",
      week: "Week 1",
      part: "Python Core",
      summary: "Runtime schema validation for Python objects — contracts at ingestion boundaries.",
      business: [
        "Rejects bad API/event payloads before they pollute Bronze/raw storage.",
        "Documents the expected shape of records for the team (schema as code).",
        "Reduces silent data bugs that only show up in dashboards days later.",
        "Useful for pipeline configs (.env-like settings) so misconfig fails fast.",
      ],
      technical: [
        "Define models with BaseModel + type hints; Field() for constraints (ge, min_length, regex).",
        "Parsing coerces types (str→datetime) or raises ValidationError.",
        "model_validate / model_dump for dict ↔ object (Pydantic v2).",
        "Best at row/event/API level — not for validating 10M-row Parquet batches (use Pandera/dbt).",
      ],
      whenNot: "Do not loop Pydantic over millions of rows in batch ETL — use Pandera, GE, or dbt tests on the whole dataset.",
      example: `from pydantic import BaseModel, Field, ValidationError
from datetime import datetime

class Order(BaseModel):
    order_id: int
    amount: float = Field(ge=0)
    status: str
    created_at: datetime

raw = {"order_id": 1, "amount": 19.5, "status": "paid", "created_at": "2026-07-20T10:00:00"}
try:
    order = Order.model_validate(raw)
    print(order.model_dump())
except ValidationError as e:
    print("REJECTED:", e.errors())`,
    },

    requests: {
      id: "requests",
      name: "HTTP / requests",
      week: "Week 1",
      part: "Python Core",
      summary: "Pull data from REST APIs with pagination, timeouts, retries, and rate-limit handling.",
      business: [
        "Most SaaS sources (OpenAQ, Stripe, CRM) only expose data via HTTP APIs.",
        "Reliable extraction = complete, timely Bronze data for analytics.",
        "Timeouts/retries prevent flaky networks from killing nightly jobs.",
      ],
      technical: [
        "GET/POST with params, headers, timeout=… always set a timeout.",
        "Pagination: page/cursor/offset loops until empty page.",
        "Handle 429 (rate limit) with sleep/backoff; 5xx with retries.",
        "Pair with tenacity for exponential backoff; never hardcode secrets — use env vars.",
      ],
      whenNot: "Not for bulk warehouse extracts (prefer DB dump/CDC) or continuous streams (prefer Kafka consumer).",
      example: `import os, time, requests

API = "https://api.example.com/v1/items"
TOKEN = os.environ["API_TOKEN"]

def fetch_all(max_pages=50):
    page, rows = 1, []
    while page <= max_pages:
        r = requests.get(
            API,
            params={"page": page, "limit": 100},
            headers={"Authorization": f"Bearer {TOKEN}"},
            timeout=30,
        )
        if r.status_code == 429:
            time.sleep(int(r.headers.get("Retry-After", 5)))
            continue
        r.raise_for_status()
        batch = r.json().get("data", [])
        if not batch:
            break
        rows.extend(batch)
        page += 1
    return rows`,
    },

    logging: {
      id: "logging",
      name: "Python logging",
      week: "Week 1",
      part: "Python Core",
      summary: "Structured observability for pipelines — what ran, what failed, how many rows.",
      business: [
        "Ops/on-call need to know why a job failed at 3am without SSH-debugging.",
        "Run summaries (extracted/rejected/loaded) prove data SLAs to stakeholders.",
        "Audit trail for compliance when pipelines touch PII.",
      ],
      technical: [
        "Use logging module, not print — levels: DEBUG/INFO/WARNING/ERROR.",
        "Configure once (dictConfig/basicConfig); getLogger(__name__) per module.",
        "Include run_id, source, row counts in every important log line.",
        "In production ship logs to CloudWatch/Stackdriver/Datadog.",
      ],
      whenNot: "Don't log secrets, full PII payloads, or millions of per-row DEBUG lines in prod.",
      example: `import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
log = logging.getLogger("etl.bronze")

def load(rows, rejected):
    log.info("run_summary extracted=%s rejected=%s loaded=%s",
             len(rows) + rejected, rejected, len(rows))
    if rejected:
        log.warning("rejected_rows=%s — see quarantine", rejected)`,
    },

    pandas: {
      id: "pandas",
      name: "Pandas",
      week: "Week 2",
      part: "Data Manipulation",
      summary: "The default Python toolkit for tabular cleaning, joins, groupbys, and profiling.",
      business: [
        "Analysts and DEs share one mental model for transforming CSVs/exports.",
        "Fast to prototype Silver cleaning logic before scaling to Spark/SQL.",
        "Powers ad-hoc DQ checks and one-off stakeholder requests.",
      ],
      technical: [
        "Core: DataFrame, Series; ops: merge, groupby, pivot, assign, pipe.",
        "Performance: use correct dtypes, chunked read_csv, avoid row-wise apply.",
        "Fits in memory — for bigger-than-RAM prefer Polars/DuckDB/Spark.",
      ],
      whenNot: "Multi-GB files on a laptop, or production distributed transforms — use Spark/Polars/SQL warehouse.",
      example: `import pandas as pd

orders = pd.read_csv("orders.csv", dtype={"order_id": "string"})
orders["order_date"] = pd.to_datetime(orders["order_date"])
orders = orders.drop_duplicates("order_id")

daily = (
    orders.loc[orders["status"].eq("delivered")]
    .groupby(orders["order_date"].dt.date, as_index=False)
    .agg(revenue=("amount", "sum"), orders=("order_id", "nunique"))
)
print(daily.head())`,
    },

    polars: {
      id: "polars",
      name: "Polars",
      week: "Week 2",
      part: "Data Manipulation",
      summary: "Fast DataFrame library with lazy evaluation — Pandas alternative for larger local workloads.",
      business: [
        "Cuts runtime/cost on heavy laptop/ETL scripts vs Pandas.",
        "Lazy plans let you optimize before collecting results.",
        "Good bridge skill when Spark feels heavy but Pandas OOMs.",
      ],
      technical: [
        "LazyFrame vs DataFrame; expressions API (pl.col); .collect() materializes.",
        "Streaming collect for larger-than-RAM scans.",
        "Exposure skill on the Fast Track — know why it exists; Pandas still gets you hired.",
      ],
      whenNot: "Tiny CSVs and team-only-knows-Pandas codebases — switching costs may outweigh gains.",
      example: `import polars as pl

lf = pl.scan_csv("orders.csv")
result = (
    lf.filter(pl.col("amount") > 0)
    .group_by("status")
    .agg(pl.col("amount").sum().alias("revenue"))
    .collect()
)
print(result)`,
    },

    pandera: {
      id: "pandera",
      name: "Pandera",
      week: "Week 2",
      part: "Data Manipulation",
      summary: "DataFrame schema contracts — validate whole tables like type hints for data.",
      business: [
        "Catches null/type/range violations before loading Silver/Gold.",
        "Makes DQ rules reviewable in PR (schema next to transform code).",
        "Stops bad upstream files from silently breaking KPI dashboards.",
      ],
      technical: [
        "DataFrameSchema + Column + Check (ge, isin, unique, etc.).",
        "Works on Pandas (and Polars via extensions).",
        "Complement to Pydantic: Pandera = batch tables; Pydantic = single records.",
      ],
      whenNot: "SQL-in-warehouse validation at scale — prefer dbt tests living next to models.",
      example: `import pandera as pa
import pandas as pd

schema = pa.DataFrameSchema({
    "order_id": pa.Column(str, unique=True),
    "amount": pa.Column(float, pa.Check.ge(0)),
    "status": pa.Column(str, pa.Check.isin(["pending", "shipped", "cancelled"])),
})

df = pd.DataFrame({"order_id": ["A1", "A2"], "amount": [10.0, -1.0], "status": ["shipped", "shipped"]})
try:
    schema.validate(df, lazy=True)
except pa.errors.SchemaErrors as e:
    print(e.failure_cases)`,
    },

    duckdb: {
      id: "duckdb",
      name: "DuckDB",
      week: "Week 2",
      part: "Data Manipulation",
      summary: "In-process analytical SQL engine over CSV/Parquet/DataFrames — no server required.",
      business: [
        "Lets you answer SQL questions on local files without standing up Postgres.",
        "Great for profiling and ad-hoc joins during pipeline development.",
        "Cheap prototyping of warehouse SQL before paying for BigQuery/Redshift.",
      ],
      technical: [
        "SQL on files: read_csv_auto, read_parquet; query Pandas via REGISTER.",
        "Columnar, OLAP-oriented — fast aggregations locally.",
        "Exposure on Fast Track — powerful, but Pandas+SQL warehouse cover interviews.",
      ],
      whenNot: "Multi-user shared warehouse, heavy concurrency, or governed prod marts — use a real warehouse.",
      example: `import duckdb

con = duckdb.connect()
df = con.sql("""
  SELECT status, count(*) AS n, sum(amount) AS revenue
  FROM read_csv_auto('orders.csv')
  GROUP BY 1
  ORDER BY revenue DESC
""").df()
print(df)`,
    },

    sqlalchemy: {
      id: "sqlalchemy",
      name: "SQLAlchemy",
      week: "Week 3",
      part: "ETL & Databases",
      summary: "Python DB toolkit — connections, Core SQL, UPSERT, and optional ORM.",
      business: [
        "Loads Bronze/Silver into PostgreSQL reliably for analytics apps.",
        "Idempotent UPSERT prevents duplicate-order scandals after pipeline retries.",
        "Transactions/rollback protect against half-loaded corrupt tables.",
      ],
      technical: [
        "Engine + connection pooling; prefer Core/text SQL for ETL over heavy ORM.",
        "INSERT…ON CONFLICT (Postgres) for idempotent loads.",
        "Never concatenate user input into SQL — bind parameters.",
        "ORM = exposure depth; Core/raw SQL = day-to-day DE.",
      ],
      whenNot: "Huge bulk loads (prefer COPY/Parquet→warehouse) or pure dbt ELT inside the warehouse.",
      example: `import os
from sqlalchemy import create_engine, text

engine = create_engine(os.environ["DATABASE_URL"], pool_pre_ping=True)

rows = [{"order_id": "A1", "amount": 10.0}, {"order_id": "A2", "amount": 5.0}]

upsert = text("""
INSERT INTO bronze.orders (order_id, amount)
VALUES (:order_id, :amount)
ON CONFLICT (order_id) DO UPDATE SET amount = EXCLUDED.amount
""")

with engine.begin() as conn:
    conn.execute(upsert, rows)`,
    },

    dlt: {
      id: "dlt",
      name: "dlt (data load tool)",
      week: "Week 3",
      part: "ETL & Databases",
      summary: "Python-first ELT framework — resources, pipelines, and destinations with less boilerplate.",
      business: [
        "Speeds up standing up new API→warehouse sources.",
        "Built-in schema evolution/normalization reduces custom loader code.",
        "Good for startups needing many connectors fast.",
      ],
      technical: [
        "pipeline = dlt.pipeline(...); @dlt.resource yields records.",
        "Destinations: Postgres, BigQuery, Snowflake, files, etc.",
        "Exposure on Fast Track — understand idea; requests+SQLAlchemy still teach fundamentals.",
      ],
      whenNot: "When you must deeply control every UPSERT/SQL detail or team standard is Airbyte/Fivetran only.",
      example: `import dlt

@dlt.resource(name="orders", write_disposition="merge", primary_key="order_id")
def orders():
    yield {"order_id": "A1", "amount": 10.0}
    yield {"order_id": "A2", "amount": 5.0}

pipeline = dlt.pipeline(pipeline_name="shop", destination="duckdb", dataset_name="bronze")
info = pipeline.run(orders())
print(info)`,
    },

    boto3: {
      id: "boto3",
      name: "boto3 (AWS S3)",
      week: "Week 4",
      part: "Storage & Containers",
      summary: "AWS SDK for Python — land raw files in S3 as the durable Bronze lake.",
      business: [
        "Cheap durable storage for raw JSON/Parquet (replayable source of truth).",
        "Decouples producers (APIs) from consumers (Spark/dbt/Athena).",
        "Partitioned keys (raw/src/YYYY/MM/DD/) enable selective reprocessing.",
      ],
      technical: [
        "client('s3') upload_file / put_object / list_objects_v2 / download_file.",
        "Credentials via env/IAM role — never hardcode keys.",
        "MinIO is S3-compatible for local practice.",
      ],
      whenNot: "Tiny local-only student demos with no cloud goal — local disk is fine until Week 9.",
      example: `import os, boto3
from datetime import datetime, timezone

s3 = boto3.client(
    "s3",
    endpoint_url=os.getenv("S3_ENDPOINT"),  # MinIO or omit for real AWS
    aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
    aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
)

ts = datetime.now(timezone.utc).strftime("%Y/%m/%d")
key = f"raw/openaq/{ts}/run.json"
s3.upload_file("air_quality.json", os.environ["BUCKET"], key)
print("uploaded", key)`,
    },

    docker: {
      id: "docker",
      name: "Docker & Compose",
      week: "Week 4",
      part: "Storage & Containers",
      summary: "Package pipelines + Postgres/Airflow so 'works on my machine' becomes reproducible.",
      business: [
        "Same environment for laptop, CI, and teammates — fewer deploy surprises.",
        "One-command demo for portfolio (docker compose up).",
        "Isolates dependencies (Python versions, system libs).",
      ],
      technical: [
        "Dockerfile: FROM, COPY, RUN pip, CMD; layer caching matters.",
        "Compose: services for app + postgres + minio; env_file for secrets.",
        "Don't bake secrets into images; use env/secrets mounts.",
      ],
      whenNot: "You don't need Kubernetes depth as a junior — Compose fluency is enough for v1.",
      example: `# Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "etl.py"]

# docker-compose.yml (excerpt)
# services:
#   etl:
#     build: .
#     env_file: .env
#     depends_on: [db]
#   db:
#     image: postgres:16
#     environment:
#       POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}`,
    },

    airflow: {
      id: "airflow",
      name: "Apache Airflow",
      week: "Week 5",
      part: "Orchestration",
      summary: "Schedule, monitor, and retry multi-step data pipelines as DAGs.",
      business: [
        "Nightly SLAs: pipelines must finish before dashboards open.",
        "Failure callbacks alert Slack/email so humans fix breaks fast.",
        "Dependency graph (extract→validate→load→transform) is visible to the team.",
      ],
      technical: [
        "DAG + tasks; TaskFlow API (@task) for Pythonic pipelines.",
        "schedule, catchup=False, retries, SLA, Connections/Variables.",
        "Sensors wait for files; Datasets enable data-aware scheduling.",
        "XComs pass small metadata — not giant DataFrames.",
      ],
      whenNot: "Single trivial cron curl; or ultra-low-latency streaming (use stream processors).",
      example: `from datetime import datetime
from airflow.decorators import dag, task

@dag(start_date=datetime(2026, 1, 1), schedule="@daily", catchup=False, tags=["openaq"])
def openaq_bronze():
    @task
    def extract():
        return {"rows": 120, "path": "raw/openaq/day.json"}

    @task
    def validate(meta: dict):
        if meta["rows"] < 1:
            raise ValueError("empty extract")
        return meta

    @task
    def load(meta: dict):
        print("loading", meta["path"])

    load(validate(extract()))

openaq_bronze()`,
    },

    pyspark: {
      id: "pyspark",
      name: "PySpark",
      week: "Week 6",
      part: "Big Data",
      summary: "Distributed DataFrame processing for Bronze→Silver at scale; Parquet output.",
      business: [
        "Processes datasets that don't fit on one machine.",
        "Standard engine behind many lakehouse Silver/Gold jobs.",
        "Partitioned Parquet makes BI/Athena queries cheaper/faster.",
      ],
      technical: [
        "Lazy transformations vs actions (show/count/write).",
        "withColumn, join, window, repartition; JDBC read/write.",
        "Broadcast joins / caching = tuning (exposure on Fast Track).",
        "Delta Lake = optional upgrade over plain Parquet.",
      ],
      whenNot: "Small CSVs — Spark overhead kills you; use Pandas/SQL instead.",
      example: `from pyspark.sql import SparkSession
from pyspark.sql import functions as F

spark = SparkSession.builder.appName("bronze_to_silver").getOrCreate()
bronze = spark.read.json("s3a://bucket/raw/openaq/")

silver = (
    bronze
    .filter(F.col("value").isNotNull())
    .withColumn("event_date", F.to_date("datetime"))
)

silver.write.mode("overwrite").partitionBy("country", "event_date").parquet("silver/openaq/")
print("in", bronze.count(), "out", silver.count())`,
    },

    dbt: {
      id: "dbt",
      name: "dbt",
      week: "Week 7",
      part: "Transform & Quality",
      summary: "SQL-first transforms in the warehouse with tests, docs, and lineage (ref/source).",
      business: [
        "Analysts/DEs collaborate on versioned SQL models in Git.",
        "Built-in tests (not_null, unique, relationships) protect KPI tables.",
        "Lineage (dbt docs) answers 'where did this metric come from?'",
      ],
      technical: [
        "models/ + sources.yml; ref('model') / source('raw','table').",
        "Materializations: view, table, incremental.",
        "schema.yml tests; dbt run / dbt test / dbt docs generate.",
        "Macros/Jinja = exposure depth — models+tests are Core.",
      ],
      whenNot: "Heavy Python ML feature engineering outside SQL — keep that in Spark/Python.",
      example: `-- models/staging/stg_orders.sql
with src as (
  select * from {{ source('bronze', 'orders') }}
)
select
  order_id::varchar as order_id,
  amount::numeric as amount,
  status,
  order_date::date as order_date
from src

-- models/staging/schema.yml
# models:
#   - name: stg_orders
#     columns:
#       - name: order_id
#         tests: [not_null, unique]`,
    },

    pytest: {
      id: "pytest",
      name: "pytest",
      week: "Week 7",
      part: "Transform & Quality",
      summary: "Unit/integration tests for transform functions so pipelines don't rot silently.",
      business: [
        "Prevents regressions when someone 'quick-fixes' a transform.",
        "CI green badge proves portfolio quality to employers.",
        "Documents expected behavior with executable examples.",
      ],
      technical: [
        "test_*.py; assert results; fixtures & parametrize for edge cases.",
        "Mock API/S3 with unittest.mock for unit tests.",
        "Integration tests hit a test Postgres — slower but higher confidence.",
      ],
      whenNot: "Don't aim for 100% coverage theater — prioritize transform + idempotency paths.",
      example: `import pytest
from transformer import clean_amount

@pytest.mark.parametrize("raw,expected", [("10", 10.0), ("$5.5", 5.5), ("", None)])
def test_clean_amount(raw, expected):
    assert clean_amount(raw) == expected

def test_rejects_negative():
    with pytest.raises(ValueError):
        clean_amount("-1")`,
    },

    aws: {
      id: "aws",
      name: "AWS (S3 + warehouse + schedule)",
      week: "Week 9",
      part: "Cloud",
      summary: "Run Capstone pipelines on real AWS: S3, IAM, Redshift/RDS, Lambda/ECS, EventBridge.",
      business: [
        "Employers hire for cloud-operated pipelines, not only localhost Compose.",
        "Managed services reduce ops burden vs self-hosted everything.",
        "IAM least-privilege is a security/compliance requirement.",
      ],
      technical: [
        "S3 = raw/Bronze; Redshift Serverless or RDS = warehouse.",
        "Lambda/ECS + EventBridge for schedule; MWAA = managed Airflow.",
        "Always set billing alarms; tear down free-tier experiments.",
      ],
      whenNot: "Don't learn AWS and GCP in parallel as a junior — pick one track.",
      example: `# Conceptual flow (not a full IaC script)
# 1) Put raw files in s3://my-bucket/raw/...
# 2) IAM role allows s3:GetObject + redshift:Write only
# 3) EventBridge rule cron(0 6 * * ? *) triggers Lambda/ECS task
# 4) Task runs ETL → Redshift/RDS
# 5) Teardown script deletes stack when demo ends

import boto3
s3 = boto3.client("s3")
print(s3.list_buckets()["Buckets"])`,
    },

    gcp: {
      id: "gcp",
      name: "GCP (GCS + BigQuery + schedule)",
      week: "Week 9",
      part: "Cloud",
      summary: "Alternative cloud track: Cloud Storage, BigQuery, Cloud Run/Functions, Cloud Scheduler.",
      business: [
        "BigQuery is a common analytical warehouse in product/startup stacks.",
        "Serverless scheduling lowers ops for small teams.",
        "Same interview story as AWS: 'I ran this in production on cloud'.",
      ],
      technical: [
        "GCS buckets for raw; BigQuery datasets for curated tables.",
        "Cloud Run/Functions + Cloud Scheduler; Composer = managed Airflow.",
        "IAM roles (not owner keys) for least privilege.",
      ],
      whenNot: "If your local job market is AWS-heavy, prefer the AWS track instead.",
      example: `# Conceptual BigQuery load with Python client
# from google.cloud import bigquery
# client = bigquery.Client()
# job = client.load_table_from_uri(
#     "gs://my-bucket/raw/orders/*.parquet",
#     "project.dataset.bronze_orders",
# )
# job.result()
print("Use GCP track in Week 9 if targeting BigQuery-heavy roles")`,
    },
  },
};
