import json
import os
import argparse
import glob

def setup_track(track_name):
    # Normalize track name to uppercase
    target_track = track_name.upper()
    # List of tracks that we want to support specifically for initialization
    valid_tracks = ["AI", "CCS", "APP"]
    
    if target_track not in valid_tracks:
        print(f"Error: Invalid track '{target_track}'. Choose from {valid_tracks}")
        return

    goals_dir = "learning_goals"
    if not os.path.exists(goals_dir):
        print(f"Error: {goals_dir} directory not found.")
        return

    # Find all goal.json files
    goal_files = glob.glob(os.path.join(goals_dir, "*/*/goal.json"))
    
    updated_count = 0
    skipped_count = 0
    match_count = 0

    for goal_file in goal_files:
        with open(goal_file, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                print(f"Skipping {goal_file} due to invalid JSON")
                continue

        # Check if goal belongs to the target track
        tracks = data.get("track", [])
        if target_track in tracks:
            match_count += 1
            # Only update if status is empty
            if data.get("status") == "":
                data["status"] = "Todo"
                with open(goal_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=4, ensure_ascii=False)
                updated_count += 1
            else:
                skipped_count += 1

    print(f"Finished setup for track: {target_track}")
    print(f"Total matching goals: {match_count}")
    print(f"Updated to 'Todo': {updated_count}")
    print(f"Skipped (already have status): {skipped_count}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Initialize goal statuses to 'Todo' based on selected track.")
    parser.add_argument("track", help="Specialization track (AI, CCS, or APP)")
    args = parser.parse_args()
    
    setup_track(args.track)
