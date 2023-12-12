package backend

import (
	"encoding/json"
	"fmt"
	"os"

	// "os"
	"strings"
)

func SearchWebsite(webToSearch string) string {
	filename := "./backend/embed/data.json"
	// dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	// if err != nil {
	// 	return fmt.Sprintf("Failed to get absolute path: %v", err)
	// }

	// filename := filepath.Join(dir, "embed", "data.json")

	data, err := os.ReadFile(filename)
	if err != nil {
		return fmt.Sprintf("Failed to read JSON file: %v", err)
	}

	var users []UserData
	if err := json.Unmarshal(data, &users); err != nil {
		return "Failed to unmarshal JSON data"
	}

	for _, user := range users {
		if strings.ToLower(user.Website) == strings.ToLower(webToSearch) {
			return "yes"
		}
	}

	// If the loop completes and the website is not found, then return "Not found"
	return "no"
}
