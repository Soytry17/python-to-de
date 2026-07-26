# 🐍 Python for Data Engineering — Progress Tracker (v2 — Restructured)

**Goal:** Transition into a Data Engineering role by 2027 (AWS/GCP, SEA or remote).
**Format:** 8 core weeks · weekly lessons (7 days) + mini project → Week 8 capstones → optional Week 9 cloud deployment.

> **Changelog from v1:** Fixed tracker bug, added standing SQL practice habit, added Data Modeling primer (Week 3), moved dbt preview earlier + expanded dbt depth in Week 7, added optional Week 9 Cloud Deployment Sprint, added Git prerequisite check.
> **Changelog from v2:** Tagged every day with 🔴 Core (80/20 — go deep) or 🟡 Exposure (skim, don't over-invest) so you always know where to spend real repetition vs. where "good enough" is fine. Added a Fast Track section for compressing the whole plan to ~6 weeks if you're short on time.

---

## 🎯 PRIORITY LEGEND (80/20)

- 🔴 **Core** — in the vital 20% that drives ~80% of interview/job value. Repeat until fluent, don't just "complete" it once.
- 🟡 **Exposure** — part of the trivial 80%. Get it working once, understand *why* it exists, then move on. Don't chase mastery here on a first pass.

---

## ✅ PREREQUISITE CHECK (do once, before Week 1)

- [ ] Comfortable with Git basics: `clone`, `branch`, `commit`, `push`, `pull request`
- [ ] Comfortable with basic SQL: `SELECT`, `JOIN`, `GROUP BY`, `WHERE`
  - If not confident yet, spend 2-3 days here first — everything downstream assumes this.

---

## 📍 CURRENT POSITION

| Field | Value |
|---|---|
| Week | 1 |
| Day | 5 (next) |
| Last completed | Week 1 · Day 4 — Type hints + Pydantic v2 (validate API responses) |
| Last updated | 2026-07-20 |

Legend: `[x]` done · `[~]` in progress · `[ ]` not started

---

## 🧠 STANDING HABIT — Daily SQL Practice (runs in parallel, all 8+ weeks)

SQL is ~50% of real DE work but has no dedicated week below — it's trained continuously instead, since ETL/dbt/warehouse work will force practice anyway. **15–20 min/day, non-negotiable.**

Use StrataScratch, DataLemur, or LeetCode SQL. Focus areas by phase:

| Weeks | SQL Focus |
|---|---|
| 1–2 | Basic `SELECT`, `JOIN` types, `GROUP BY`, `HAVING`, aggregate functions |
| 3–4 | Window functions (`ROW_NUMBER`, `RANK`, `LAG/LEAD`), CTEs, subqueries |
| 5–6 | Query optimization, `EXPLAIN` plans, indexing basics |
| 7–8 | Mock interview SQL questions (timed, 20-30 min each) |

Track it:

| Week | Days practiced | Notes |
|---|---|---|
| 1 | ` / 7` | |
| 2 | ` / 7` | |
| 3 | ` / 7` | |
| 4 | ` / 7` | |
| 5 | ` / 7` | |
| 6 | ` / 7` | |
| 7 | ` / 7` | |
| 8 | ` / 7` | |

---

## ⚡ 80/20 FAST TRACK — Compressed ~6-Week Path

If you're time-constrained (deadline, burnout, or just want to get job-ready faster), **skip or skim every 🟡 Exposure item** below and only go deep on 🔴 Core. This is not "worse" — it's the version of this roadmap optimized purely for interview/job readiness over completeness.

| Week | Full plan | Fast Track cut | Fast Track length |
|---|---|---|---|
| 1 — Python Core | All 7 days | Nothing to cut — all 🔴 Core | 7 days (unchanged) |
| 2 — Pandas & Polars | 7 days | Skim Polars (Days 3-4) and DuckDB (Day 5) — read docs, don't build exercises. Keep Pandas + Pandera days | ~4 days |
| 3 — ETL/ELT + Modeling | 7 days | Skim dlt (Day 5) — use `requests` + SQLAlchemy directly instead of learning the library deeply | ~6 days |
| 4 — Cloud & Docker | 7 days | Skip SQLAlchemy pooling depth (Day 1), skip MinIO (Day 3 — go straight to real S3 free tier), skim CDC/Debezium (Day 5, conceptual only) | ~4 days |
| 5 — Airflow | 7 days | Skim XComs/branching (Day 5) and Datasets scheduling (Day 7) — know they exist, don't build exercises | ~5 days |
| 6 — PySpark | 7 days | Skim broadcast join tuning (Day 6), skip Delta Lake (Day 7) entirely | ~5 days |
| 7 — Production + dbt | 7 days | Skim integration test/mocking depth (Day 3), skim dbt macros/Jinja (Day 5 — stick to models + tests) | ~5-6 days |
| 8 — Capstones | 7 days | Build **Capstone 1 fully** (this is your primary portfolio piece). Treat Capstone 2 as optional/stretch — only attempt if time remains | 4-7 days |
| 9 — Cloud Deployment | 7 days | Keep this — it's 🔴 Core-level leverage for your AWS/GCP goal despite being "Week 9" | 5-7 days |

**Net result:** ~40-45 focused days (~6 weeks at 7 days/week) instead of 9 full weeks, while keeping essentially all of the interview-relevant skill and one full capstone with real cloud deployment. You can always circle back to the skimmed 🟡 items later — once you're employed, you'll pick them up naturally on the job, or once you have more runway before 2027.

---

## 🗺️ 9-WEEK OVERVIEW

| Week | Focus | Mini Project | 🔴/🟡 Mix | Status |
|---|---|---|---|---|
| 1 | Python Core for DE | OpenAQ Air Fetcher | 🔴🔴🔴🔴🔴🔴🔴 (all core) | `[~]` |
| 2 | Pandas & Polars | Olist Data Profiler | 🔴🔴🟡🟡🟡🔴🟡 | `[ ]` |
| 3 | ETL/ELT Scripting + Data Modeling + dbt Preview | Bronze ETL Loader | 🔴🔴🔴🔴🟡🔴🔴 | `[ ]` |
| 4 | Cloud Storage & Docker | Dockerized Incremental Loader | 🟡🔴🟡🔴🟡🔴🔴 | `[ ]` |
| 5 | Airflow Orchestration | Scheduled OpenAQ Pipeline DAG | 🔴🔴🔴🔴🟡🔴🟡 | `[ ]` |
| 6 | PySpark | Bronze→Silver Spark Transform | 🔴🔴🔴🔴🔴🟡🟡 | `[ ]` |
| 7 | Production Practices + dbt Deep Dive | Production Hardening Sprint | 🔴🔴🟡🔴🟡🔴🔴 | `[ ]` |
| 8 | Capstones | Olist (🔴 core) + Adventure Works (🟡 stretch) | — | `[ ]` |
| 9 *(numbered optional, actually 🔴 core)* | Real Cloud Deployment | Capstone 1 live on AWS/GCP | 🔴 all week | `[ ]` |

---

## 📦 REUSABLE COMPONENTS TRACKER

Save each to `/components/` after finishing the week.

| Week | Component | Reused In | Saved? |
|---|---|---|---|
| 1 | `validators.py` (Pydantic) | Capstone 1 Bronze ingestion | `[ ]` |
| 1 | `fetcher.py` (HTTP client) | Capstone 1 API extraction | `[ ]` |
| 1 | `logger.py` | Both capstones | `[ ]` |
| 2 | `profiler.py` (DQ report) | Capstone 1 data quality | `[ ]` |
| 3 | `loader.py` (SQLAlchemy) | Both capstones Bronze load | `[ ]` |
| 3 | `transformer.py` | Both capstones | `[ ]` |
| 3 | `models/` (dimensional model sketch) | Capstone 2 star schema | `[ ]` |
| 4 | `Dockerfile` + `.env.example` | Both capstones Docker setup | `[ ]` |
| 4 | `docker-compose.yml` | Both capstones | `[ ]` |
| 5 | `dag_etl.py` (Airflow DAG) | Both capstones orchestration | `[ ]` |
| 6 | `spark_silver.py` | Capstone 2 Silver transform | `[ ]` |
| 7 | `tests/` + `dbt/` | Both capstones production layer | `[ ]` |
| 9 | `terraform/` or IaC scripts (optional) | Cloud deployment | `[ ]` |

---

## WEEK 1 — Python Core for Data Engineering

**Goal:** validation, logging, HTTP, clean project structure.

### Daily progress
- [x] 🔴 Day 1 — Comprehensions, generators, decorators
- [x] 🔴 Day 2 — OOP for pipelines (classes, dataclasses)
- [x] 🔴 Day 3 — Error handling, logging, retry + exponential backoff
- [x] 🔴 Day 4 — Type hints + Pydantic v2 (validate API responses)
- [ ] 🔴 Day 5 — File handling: CSV, JSON, JSONL
- [ ] 🔴 Day 6 — HTTP requests: pagination, error codes, rate limits, timeouts
- [ ] 🔴 Day 7 — Project structure, venv, `.env` + mini project finish

### Mini Project — "OpenAQ Air Fetcher" (DoD)
- [ ] Script runs end-to-end without crashing on bad data
- [ ] Pydantic rejects and logs at least one malformed record
- [ ] Output: `air_quality.jsonl` + `air_quality.csv` with 100+ records
- [ ] All secrets/config in `.env` (not hardcoded)
- [ ] README.md with setup instructions + example output

**Stretch:** `[ ]` `--city` CLI arg (argparse) · `[ ]` summary log (X fetched, Y rejected, Z written)

### End-of-week quiz `[ ]`
Generators vs lists · decorator use cases · Pydantic field validation · logging levels · retry patterns · HTTP error handling.

---

## WEEK 2 — Pandas & Polars

**Goal:** modern data-manipulation stack (Pandas, Polars, DuckDB, Pandera).

### Daily progress
- [ ] 🔴 Day 1 — Pandas core: `groupby`, `merge`, `pivot`
- [ ] 🔴 Day 2 — Pandas performance: chunked reads, dtypes, `.pipe()`
- [ ] 🟡 Day 3 — Polars fundamentals: LazyFrame, expressions, `.collect()`
- [ ] 🟡 Day 4 — Polars advanced: streaming, joins, aggregations
- [ ] 🟡 Day 5 — DuckDB: SQL on DataFrames/CSV/Parquet
- [ ] 🔴 Day 6 — Pandera validation + data profiling
- [ ] 🟡 Day 7 — Pandas vs Polars benchmark + mini project finish

### Mini Project — "Olist Data Profiler" (DoD)
- [ ] All 9 Olist CSVs profiled (null %, row counts, cardinality)
- [ ] HTML quality report generated + readable in browser
- [ ] Benchmark table: Pandas vs Polars for same operation
- [ ] 3+ real DQ issues documented (column + description)

**Stretch:** `[ ]` DuckDB profiling query + speed compare · `[ ]` Pandera contract for `olist_orders`

### End-of-week quiz `[ ]`
LazyFrame eval · Pandera contracts · DuckDB use cases · memory optimization · merge join types.

---

## WEEK 3 — ETL/ELT Pipeline Scripting + Data Modeling + dbt Preview

**Goal:** full production-style ETL into PostgreSQL with idempotency + logging, grounded in proper dimensional design.

> **What changed:** Added a Data Modeling primer (Day 3) so Capstone 2's star schema isn't a surprise in Week 8. Added a dbt preview (Day 6) so Week 7's deep dive isn't your first contact with the tool. SQLAlchemy ORM trimmed to essentials since Core/raw SQL matters more day-to-day in DE.

### Daily progress
- [ ] 🔴 Day 1 — Extract patterns: API, CSV, DB reads
- [ ] 🔴 Day 2 — Transform: cleaning, type casting, dedup
- [ ] 🔴 Day 3 — **Data modeling primer:** star schema, fact vs. dimension tables, SCD Type 1/2, normalization vs. denormalization tradeoffs — sketch a star schema for Olist
- [ ] 🔴 Day 4 — SQLAlchemy Core (INSERT, UPSERT) + ORM essentials (models, sessions) — combined, lighter on ORM (Core = 🔴, ORM itself = 🟡, don't over-invest in ORM depth)
- [ ] 🟡 Day 5 — dlt fundamentals: pipeline, resource, destination
- [ ] 🔴 Day 6 — **dbt preview:** what it is, `models/`, `sources.yml`, `ref()`, running your first `stg_` model (depth comes in Week 7)
- [ ] 🔴 Day 7 — Idempotency + DQ checks + run logging + connect all layers end-to-end + mini project finish

### Mini Project — "Bronze ETL Loader" (DoD)
- [ ] Runs twice: second run inserts 0 duplicates (verified in DB)
- [ ] 1+ intentionally bad record caught, logged, skipped
- [ ] Bronze table in PostgreSQL with correct schema
- [ ] Run summary: `Extracted: X | Rejected: Y | Loaded: Z`
- [ ] Star schema sketch for Olist saved to `/components/models/` (from Day 3)

**Stretch:** `[ ]` `--dry-run` flag · `[ ]` `pipeline_runs` audit table

### End-of-week quiz `[ ]`
UPSERT vs INSERT · idempotency · Core vs ORM · dlt resources · fact vs. dimension tables · SCD Type 1 vs 2 · quality check placement.

---

## WEEK 4 — Cloud Storage & Docker

**Goal:** S3/MinIO archiving, incremental loads (watermark), Dockerize pipeline.

### Daily progress
- [ ] 🟡 Day 1 — SQLAlchemy advanced: pooling, transactions, rollback
- [ ] 🔴 Day 2 — AWS S3 with `boto3`: upload, list, download
- [ ] 🟡 Day 3 — MinIO local setup (S3-compatible)
- [ ] 🔴 Day 4 — Incremental loads: watermark / `MAX(updated_at)`
- [ ] 🟡 Day 5 — CDC concepts + Debezium (conceptual)
- [ ] 🔴 Day 6 — Docker fundamentals: Dockerfile for Week 3 ETL
- [ ] 🔴 Day 7 — Docker Compose (PG + Python) + secrets + mini project finish

### Mini Project — "Dockerized Incremental Loader" (DoD)
- [ ] First run loads N; second run loads only new (delta verified)
- [ ] Raw JSON files appear in S3/MinIO after each run
- [ ] `docker build` + `docker run` complete without errors
- [ ] No hardcoded credentials (`grep -r "password" .` clean)

**Stretch:** `[ ]` MinIO web UI check · `[ ]` S3 key pattern `raw/openaq/YYYY/MM/DD/run_{ts}.json`

### End-of-week quiz `[ ]`
Watermark patterns · Docker layer caching · boto3 S3 ops · connection pooling · secrets mgmt.

---

## WEEK 5 — Orchestration with Apache Airflow

**Goal:** automated, scheduled, monitored pipelines (TaskFlow API).

### Daily progress
- [ ] 🔴 Day 1 — Airflow setup (Docker Compose) + architecture
- [ ] 🔴 Day 2 — First DAG: Python tasks, schedule, manual trigger
- [ ] 🔴 Day 3 — TaskFlow API: rewrite Week 3 ETL
- [ ] 🔴 Day 4 — Connections, Variables, PostgresOperator
- [ ] 🟡 Day 5 — XComs, branching, conditional execution
- [ ] 🔴 Day 6 — Retries, SLAs, failure callbacks, monitoring
- [ ] 🟡 Day 7 — Data-aware scheduling (Datasets) + mini project finish

### Mini Project — "Scheduled OpenAQ Pipeline DAG" (DoD)
- [ ] DAG visible + triggerable in Airflow UI
- [ ] All 5 tasks succeed on manual trigger (graph view)
- [ ] Broken row-count check causes DAG failure (tested)
- [ ] DAG runs on schedule (`catchup=False`)

**Stretch:** `[ ]` Slack/email failure notification · `[ ]` SensorOperator waiting for S3 file

### End-of-week quiz `[ ]`
DAG scheduling · XCom limits · TaskFlow vs operators · backfill · connection types.

---

## WEEK 6 — Big Data with PySpark

**Goal:** PySpark local mode, Silver transforms, Parquet output.

### Daily progress
- [ ] 🔴 Day 1 — Spark architecture + PySpark local via Docker
- [ ] 🔴 Day 2 — DataFrame basics: read, select, filter, show
- [ ] 🔴 Day 3 — Transformations: `withColumn`, `when`, window functions
- [ ] 🔴 Day 4 — Aggregations, joins, null handling
- [ ] 🔴 Day 5 — Read PostgreSQL via JDBC + write Parquet
- [ ] 🟡 Day 6 — Partitioning, caching, broadcast joins
- [ ] 🟡 Day 7 — Delta Lake intro + mini project finish

### Mini Project — "Bronze to Silver Spark Transform" (DoD)
- [ ] PySpark job runs in Docker local mode without errors
- [ ] Parquet written with `country=*/date=*` partitions
- [ ] Row counts logged: Bronze in vs Silver out (+ rejection rate)
- [ ] Airflow DAG runs Spark job downstream of Bronze load

**Stretch:** `[ ]` Delta Lake output · `[ ]` Spark UI screenshot of job plan

### End-of-week quiz `[ ]`
Lazy eval · Parquet vs CSV · broadcast joins · Delta vs Parquet · JDBC performance.

---

## WEEK 7 — Production-Grade Practices + dbt Deep Dive

**Goal:** tests, dbt, CI/CD, observability — the production wrapper for both capstones.

> **What changed:** dbt now gets 2 full days (building on the Week 3 preview) instead of 1, since both capstones lean heavily on it. Integration tests + mocking merged into one day to make room.

### Daily progress
- [ ] 🔴 Day 1 — pytest fundamentals: unit tests for transforms
- [ ] 🔴 Day 2 — Fixtures, parametrize, edge/bad-data tests
- [ ] 🟡 Day 3 — Integration tests against test DB + mocking API/S3 (`unittest.mock`)
- [ ] 🔴 Day 4 — **dbt deep dive I:** staging models, `ref()`/`source()`, schema tests (`not_null`, `unique`, `relationships`)
- [ ] 🟡 Day 5 — **dbt deep dive II:** incremental models, macros/Jinja basics, `dbt docs generate`
- [ ] 🔴 Day 6 — Docker Compose full stack + GitHub Actions CI
- [ ] 🔴 Day 7 — Structured logging + observability + mini project finish

### Mini Project — "Production Hardening Sprint" (DoD)
- [ ] pytest passes with 80%+ coverage on transforms
- [ ] `dbt run` + `dbt test` pass with 0 failures
- [ ] `docker compose up` starts all services (Airflow, Postgres, MinIO)
- [ ] GitHub Actions CI badge green in README

**Stretch:** `[ ]` `dbt docs generate` + lineage screenshot · `[ ]` `ruff` lint as CI check

### End-of-week quiz `[ ]`
pytest fixtures vs parametrize · dbt `ref()` vs `source()` · incremental models · mocking · Compose deps · CI/CD stages.

---

## WEEK 8 — Capstone Projects

Suggested split: Days 1–4 Capstone 1 · Days 5–7 Capstone 2 · buffer → prioritize Capstone 1.

🔴 **Capstone 1 is Core** — it's your primary portfolio piece and combines nearly every vital-20% skill. 🟡 **Capstone 2 is valuable but treat it as the first thing to cut** if you're behind schedule — Capstone 1 + Week 9's real cloud deployment already demonstrates everything an interviewer needs to see.

### Capstone 1 — Olist E-Commerce Pipeline Modernization
- [ ] GitHub repo: clean structure + `.gitignore`
- [ ] README: ASCII architecture diagram + one-command startup
- [ ] `dbt docs generate` screenshot (full lineage)
- [ ] 1+ Power BI / SQL KPI screenshot
- [ ] `dbt test` exits 0 failures
- [ ] pytest CI badge green in README
- [ ] Airflow DAG screenshot (all tasks green)

### Capstone 2 — Adventure Works OLTP-to-OLAP Warehouse
- [ ] GitHub repo: clean structure + `.gitignore` + README
- [ ] Star schema ERD in README (draw.io or ASCII) — reuse Week 3 Day 3 sketch
- [ ] `dbt docs generate` screenshot (Gold lineage)
- [ ] Airflow DAG screenshot (all tasks green)
- [ ] Sample analytical SQL in README (top 10 products by revenue by region)
- [ ] pytest integration test passing in CI

---

## WEEK 9 (Optional, High-Value) — Real Cloud Deployment Sprint

🔴 **This whole week is Core, despite being numbered last.** It's the single highest-leverage week for AWS/GCP job interviews — "I ran this in production on AWS" beats "I ran this in Docker Compose" every time. Don't treat "optional" as "skippable" if your goal is landing an AWS/GCP role.

**Goal:** move Capstone 1 off `localhost`/Docker Compose onto real managed cloud infra.

**Pick ONE cloud track:**

**AWS track**
- [ ] Day 1-2 — S3 (raw storage) + IAM roles/policies basics
- [ ] Day 3-4 — Redshift Serverless or RDS Postgres as warehouse
- [ ] Day 5 — Lambda or ECS Fargate to run the pipeline on a schedule (EventBridge)
- [ ] Day 6 — Wire Airflow (MWAA or self-hosted on EC2) or a lightweight scheduler to trigger it
- [ ] Day 7 — Cost check, teardown/cleanup script, screenshot everything for README

**GCP track**
- [ ] Day 1-2 — Cloud Storage (raw storage) + IAM basics
- [ ] Day 3-4 — BigQuery as warehouse
- [ ] Day 5 — Cloud Run or Cloud Functions to run the pipeline on a schedule (Cloud Scheduler)
- [ ] Day 6 — Cloud Composer (managed Airflow) or lightweight scheduler
- [ ] Day 7 — Cost check, teardown/cleanup script, screenshot everything for README

### Mini Project — "Capstone 1, Live on Cloud" (DoD)
- [ ] Pipeline runs end-to-end on managed cloud services, not local Docker
- [ ] IAM roles scoped correctly (no `*` admin permissions used)
- [ ] Cost stays within free tier (verified in billing dashboard)
- [ ] Architecture diagram updated to show real cloud services
- [ ] Teardown script included (so you're not paying for idle resources)

---

## 📓 DAILY LOG

Add a line each day you study.
