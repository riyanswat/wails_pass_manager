package main

import (
	"context"
	"encoding/json"

	// "fmt"
	"math/rand"
	"os"
	"regexp"
	"time"
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

func addToJSON(filename, website, email, password string) bool {
	// Convert input parameters to UserData struct
	data := UserData{
		Website:  website,
		Email:    email,
		Password: password,
	}

	if password == "" || website == "" || email == "" {
		return false // "Empty field(s) spotted!!!"
	}
	emailRegex := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	re := regexp.MustCompile(emailRegex)

	if !re.MatchString(email) {
		return false
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
			return false // fmt.Sprintf("Error: %v", err)
		}
	}

	// Append new data
	existingData = append(existingData, data)

	// Create/open the JSON for writing
	file, err = os.Create(filename)
	if err != nil {
		return false // fmt.Sprintf("Error: %v", err)
	}
	defer file.Close()

	// Encode and write updated data to the file
	encoder := json.NewEncoder(file)
	if err := encoder.Encode(existingData); err != nil {
		return false // fmt.Sprintf("Error: %v", err)
	}

	return true // "Successful"
}

func generateRandomPassword(length int) string {
	lower := "abcdefghijklmnopqrstuvwxyz"
	upper := "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	nums := "1234567890"
	chars := "!@#$%^&"
	allChars := upper + lower + nums + chars

	rand.Seed(time.Now().UnixNano())
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

// Expose backend apis to frontened
func (a *App) Generate(length int) string {
	return generateRandomPassword(length)
}

func (a *App) Add(filename, website, email, password string) bool {
	return addToJSON(filename, website, email, password)
}
