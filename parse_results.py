import sys

try:
    with open("test_results.txt", "rb") as f:
        content = f.read().decode('utf-16')
    
    print("Parsing success models...")
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if "SUCCESS" in line:
            # The model is usually in the previous line or same line
            print(f"FOUND: {line.strip()}")
            if i > 0:
                print(f"CONTEXT PREV: {lines[i-1].strip()}")
except Exception as e:
    print(f"Error parsing: {e}")
