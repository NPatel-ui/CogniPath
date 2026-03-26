"""
Raisoni Placement Predictor - Firebase Sync
=============================================
Syncs NN predictions to Firebase Realtime Database / Firestore.

Install:
    pip install firebase-admin

Usage:
    python firebase_sync.py --data artifacts/dashboard_data.json \
                             --cred path/to/serviceAccountKey.json \
                             --db https://your-project.firebaseio.com
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime
from typing import Optional


def get_firebase_app(cred_path: str, db_url: str):
    """Initialize Firebase Admin SDK."""
    try:
        import firebase_admin
        from firebase_admin import credentials, db as rtdb, firestore

        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred, {"databaseURL": db_url})
            print(f"✅  Firebase initialized: {db_url}")

        return firebase_admin, rtdb, firestore
    except ImportError:
        print("❌  firebase-admin not installed. Run: pip install firebase-admin")
        sys.exit(1)
    except Exception as e:
        print(f"❌  Firebase init error: {e}")
        sys.exit(1)


def sync_to_realtime_db(data: dict, rtdb, batch_size: int = 100):
    """
    Syncs dashboard data to Firebase Realtime Database.
    Structure:
        /placement_predictor/
            metadata/
            students/{student_id}/
            analytics/
    """
    ref = rtdb.reference("/placement_predictor")

    # 1. Metadata
    meta = {
        "last_updated": datetime.utcnow().isoformat() + "Z",
        "model_accuracy": data["overall"]["model_accuracy"],
        "model_auc": data["overall"]["model_auc"],
        "total_students": data["overall"]["total_students"],
        "at_risk_count": data["overall"]["at_risk_count"],
        "placed_count": data["overall"]["placed_count"],
    }
    ref.child("metadata").set(meta)
    print(f"✅  Metadata synced")

    # 2. Students (batched)
    students_ref = ref.child("students")
    students     = data["students"]
    for i in range(0, len(students), batch_size):
        batch = {str(s["id"]): s for s in students[i: i + batch_size]}
        students_ref.update(batch)
        print(f"   Synced students {i}–{min(i+batch_size, len(students))}")
    print(f"✅  {len(students)} students synced")

    # 3. Analytics
    analytics = {
        "skill_gaps":        data["skill_gaps"],
        "branch_stats":      data["branch_stats"],
        "feature_importance": data["feature_importance"],
        "cgpa_buckets":      data["cgpa_buckets"],
    }
    ref.child("analytics").set(analytics)
    print(f"✅  Analytics synced")


def sync_to_firestore(data: dict, firestore_client):
    """
    Syncs data to Firestore using collection/document structure.
    """
    db = firestore_client.client()

    # Metadata doc
    db.collection("placement_predictor").document("metadata").set({
        "last_updated": datetime.utcnow(),
        **data["overall"]
    })

    # Batch write students
    batch  = db.batch()
    count  = 0
    for student in data["students"]:
        ref = db.collection("students").document(str(student["id"]))
        batch.set(ref, student)
        count += 1
        if count % 499 == 0:          # Firestore batch limit = 500
            batch.commit()
            batch = db.batch()
            print(f"   Committed batch at {count}")
    batch.commit()
    print(f"✅  {count} student documents written to Firestore")

    # Analytics
    db.collection("placement_predictor").document("analytics").set({
        "skill_gaps":        data["skill_gaps"],
        "branch_stats":      data["branch_stats"],
        "feature_importance": data["feature_importance"],
        "cgpa_buckets":      data["cgpa_buckets"],
        "updated_at":        datetime.utcnow(),
    })
    print(f"✅  Analytics synced to Firestore")


def main():
    parser = argparse.ArgumentParser(description="Sync NN predictions to Firebase")
    parser.add_argument("--data",  default="artifacts/dashboard_data.json")
    parser.add_argument("--cred",  default="serviceAccountKey.json")
    parser.add_argument("--db",    default="https://raisoni-placement.firebaseio.com")
    parser.add_argument("--mode",  choices=["rtdb", "firestore"], default="rtdb")
    args = parser.parse_args()

    # Load data
    if not os.path.exists(args.data):
        print(f"❌  Data file not found: {args.data}")
        sys.exit(1)

    with open(args.data) as f:
        data = json.load(f)
    print(f"📂  Loaded {len(data['students'])} students from {args.data}")

    firebase_admin, rtdb, firestore = get_firebase_app(args.cred, args.db)

    start = time.time()
    if args.mode == "rtdb":
        sync_to_realtime_db(data, rtdb)
    else:
        sync_to_firestore(data, firestore)

    elapsed = time.time() - start
    print(f"\n🚀  Sync complete in {elapsed:.2f}s")


if __name__ == "__main__":
    main()
