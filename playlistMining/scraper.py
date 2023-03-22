import re

# Define the regular expression pattern to search for
pattern = r'title="top songs - (\w+)" class="\w+" dir="auto" href="(/playlist/[a-zA-Z0-9]+)"'

# Open the file for reading
with open('globalCharts.txt', 'r') as file:
    # Read the contents of the file
    text = file.read()

    # Search for the pattern in the text
    matches = re.findall(pattern, text, re.IGNORECASE)

    # Print the matches
    print(matches)
