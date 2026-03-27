import json
import os
import shutil
import re

def migrate():
    input_file = "learninggoals.json"
    template_dir = "template"
    output_base_dir = "learning_goals"
    verification_file = "VERIFICATION.jsonc"

    # Track mapping: ALLES -> EVERYTHING
    TRACK_MAPPING = {
        "ALLES": "EVERYTHING"
    }

    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found.")
        return

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Prepare output directory (don't delete if it exists)
    if not os.path.exists(output_base_dir):
        os.makedirs(output_base_dir)

    all_categories = []
    
    # Sort categories and goals to ensure consistent order
    sorted_majors = sorted(data.keys(), key=lambda x: int(re.match(r"(\d+)", x).group(1)) if re.match(r"(\d+)", x) else 999)

    for major_key in sorted_majors:
        goals = data[major_key]
        major_match = re.match(r"(\d+)", major_key)
        if not major_match:
            continue
        major_num = major_match.group(1)
        major_name = major_key.split(' ', 1)[1] if ' ' in major_key else major_key
        
        major_dir = os.path.join(output_base_dir, major_num)
        os.makedirs(major_dir, exist_ok=True)

        current_category = {
            "name": major_name,
            "goals": []
        }

        sorted_goals = sorted(goals.keys(), key=lambda x: [int(i) for i in re.match(r"(\d+\.\d+)", x).group(1).split(".")] if re.match(r"(\d+\.\d+)", x) else [999, 999])

        for goal_key in sorted_goals:
            goal_data = goals[goal_key]
            goal_match = re.match(r"(\d+\.\d+)", goal_key)
            if not goal_match:
                continue
            goal_num = goal_match.group(1)
            goal_title = goal_key.split(goal_num, 1)[1].strip()

            # Map tracks (e.g. ALLES -> EVERYTHING) - Case-insensitive check
            tracks = [TRACK_MAPPING.get(t.upper(), t.upper()) for t in goal_data.get("type", [])]

            goal_dir = os.path.join(major_dir, goal_num)
            
            # Record goal for verification file
            current_category["goals"].append({"num": goal_num, "title": goal_title})

            status = ""
            if goal_data.get("status") == "":
                if "DI" in tracks:
                    status = "Todo"
            else:
                if goal_data.get("status") == "td":
                    status = "Todo"
                elif goal_data.get("status") == "ip":
                    status = "In Progress"
                elif goal_data.get("status") == "done":
                    status = "Done"

            goal_json_data = {
                "$schema": "../../../src/lib/learningGoalsSchema.jsonc",
                "number": goal_num,
                "title": goal_title,
                "track": tracks,
                "status": status,
                "project": [goal_data.get("project")] if goal_data.get("project") else []
            }

            # Check if goal already exists
            if os.path.exists(goal_dir):
                # We still update the goal.json in case tracks/title changed in the source
                goal_json_file = os.path.join(goal_dir, "goal.json")
                with open(goal_json_file, 'w', encoding='utf-8') as f:
                    json.dump(goal_json_data, f, indent=4, ensure_ascii=False)
                print(f"Updated metadata for {goal_num}")
                continue

            os.makedirs(goal_dir, exist_ok=True)

            # Copy template files
            template_assets = os.path.join(template_dir, "assets")
            goal_assets = os.path.join(goal_dir, "assets")
            if os.path.exists(template_assets):
                shutil.copytree(template_assets, goal_assets, dirs_exist_ok=True)
            
            template_evidence = os.path.join(template_dir, "evidence.svx")
            goal_evidence = os.path.join(goal_dir, "evidence.svx")
            if os.path.exists(template_evidence):
                shutil.copy2(template_evidence, goal_evidence)

            # Create goal.json
            with open(os.path.join(goal_dir, "goal.json"), 'w', encoding='utf-8') as f:
                json.dump(goal_json_data, f, indent=4, ensure_ascii=False)
            
            print(f"Migrated {goal_num}")

        all_categories.append(current_category)

    # Re-generate VERIFICATION.jsonc only if it doesn't exist, to avoid data loss
    if not os.path.exists(verification_file):
        with open(verification_file, 'w', encoding='utf-8') as f:
            f.write("{\n")
            
            total_categories = len(all_categories)
            for i, cat in enumerate(all_categories):
                f.write(f"    //\n    // {cat['name']}\n")
                
                total_goals = len(cat['goals'])
                for j, goal in enumerate(cat['goals']):
                    # Check if this is truly the last goal of the last category
                    is_last = (i == total_categories - 1) and (j == total_goals - 1)
                    comma = "" if is_last else ","
                    f.write(f"    \"{goal['num']}\": \"\"{comma} // {goal['title']}\n")
                    
            f.write("}\n")
        print(f"Generated {verification_file}")
    else:
        print(f"{verification_file} already exists, skipping generation.")

    print("Migration task finished.")

if __name__ == "__main__":
    migrate()
