package main

import (
	"context"
	"encoding/json"
	"math/rand"
	"os"
	"regexp"
	"strings"
)

// user json struct
type UserData struct {
	Website  string `json:"website"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// my functions

// func fileExists(filename string) bool {
// 	_, err := os.Stat(filename)
// 	return err == nil
// }

func addToJSON(website, email, password string) string {
	filename := "./frontend/data/data.json"

	// create data dir
	if err := os.MkdirAll("./frontend/data", os.ModePerm); err != nil {
		return "Error creating data dir: " + err.Error()
	}

	// Convert input args to UserData struct
	data := UserData{
		Website:  strings.ToLower(website),
		Email:    email,
		Password: password,
	}

	spacesRegex := `^\s+$`
	spacesReg := regexp.MustCompile(spacesRegex)

	if password == "" ||
		website == "" ||
		email == "" ||
		spacesReg.MatchString(website) ||
		spacesReg.MatchString(email) ||
		spacesReg.MatchString(password) {
		return "Fill all fields"
	}

	// email validation
	emailRegex := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	re := regexp.MustCompile(emailRegex)

	if !re.MatchString(email) {
		return "Invalid email"
	}

	// Read existing JSON file
	var existingData []UserData
	file, err := os.Open(filename)
	if err != nil {
		existingData = make([]UserData, 0)
	} else {
		defer file.Close()
		decoder := json.NewDecoder(file)
		if err := decoder.Decode(&existingData); err != nil {
			return "Error decoding json"
		}
	}

	// check if website already exists
	for _, entry := range existingData {
		if entry.Website == data.Website {
			return "Website already exists"
		}
	}

	// Append new data
	existingData = append(existingData, data)

	// Create/open the JSON for writing
	file, err = os.Create(filename)
	if err != nil {
		return "Error creating data file"
	}
	defer file.Close()

	// Encode and write updated data to the file
	encoder := json.NewEncoder(file)
	if err := encoder.Encode(existingData); err != nil {
		return "Error writing to json"
	}

	return "Successful"
}

func deleteFromJSON(websiteToDelete string) string {
	filename := "./frontend/data/data.json"

	data, err := os.ReadFile(filename)
	if err != nil {
		return "Failed to read JSON file"
	}

	// Unmarshal JSON data into a slice of UserData
	var users []UserData
	if err := json.Unmarshal(data, &users); err != nil {
		return "Failed to unmarshal JSON data"
	}

	// Create a new slice to store updated data
	var updatedUsers []UserData
	websiteFound := false

	// Check if the website == websiteToDelete
	for _, user := range users {

		if strings.ToLower(user.Website) == strings.ToLower(websiteToDelete) {
			websiteFound = true
		} else {
			// Append to updatedUsers only if the website doesn't match
			updatedUsers = append(updatedUsers, user)
		}
	}

	// If the website is not found, return an error
	if !websiteFound {
		return "Website not found"
	}

	// Marshal the updated slice back to JSON
	updatedData, err := json.Marshal(updatedUsers)
	if err != nil {
		return "Failed to marshal updated data"
	}

	// Write the updated data back to the file
	if err := os.WriteFile(filename, updatedData, os.ModePerm); err != nil {
		return "Failed to update the file"
	}

	return "Deleted successfully"
}

// func deleteFromJSON(websiteToDelete string) string {
// 	filename := "./frontend/data/data.json"

// 	data, err := os.ReadFile(filename)
// 	if err != nil {
// 		return "Failed to read JSON file"
// 	}

// 	// Unmarshal JSON data into a slice of UserData
// 	var users []UserData
// 	if err := json.Unmarshal(data, &users); err != nil {
// 		return "Failed to unmarshal JSON data"
// 	}

// 	// Create a new slice to store updated data
// 	var updatedUsers []UserData
// 	websiteFound := false

// 	// Check if the website == websiteToDelete
// 	for _, user := range users {
// 		if strings.ToLower(user.Website) == strings.ToLower(websiteToDelete) {
// 			websiteFound = true
// 		} else {
// 			updatedUsers = append(updatedUsers, user)
// 		}
// 	}

// 	// If the website is not found, return an error
// 	if !websiteFound {
// 		return "Website not found"
// 	}

// 	// Marshal the updated slice back to JSON
// 	updatedData, err := json.Marshal(updatedUsers)
// 	if err != nil {
// 		return "Failed to marshal updated data"
// 	}

// 	// Write the updated data back to the file
// 	if err := os.WriteFile(filename, updatedData, os.ModePerm); err != nil {
// 		return "Failed to update the file"
// 	}

// 	return "Deleted successfully"
// }

func generateRandomPassword(length int) string {
	lower := "abcdefghijklmnopqrstuvwxyz"
	upper := "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	nums := "1234567890"
	chars := "!@#$%^&"
	allChars := upper + lower + nums + chars

	// rand.Seed(time.Now().UnixNano())
	password := make([]byte, length)
	for c := range password {
		password[c] = allChars[rand.Intn(len(allChars))]
	}
	return string(password)
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Expose backend apis to frontend
func (a *App) Generate(length int) string {
	return generateRandomPassword(length)
}

func (a *App) Add(website, email, password string) string {
	return addToJSON(website, email, password)
}

func (a *App) Delete(websiteToDelete string) string {
	return deleteFromJSON(websiteToDelete)
}
