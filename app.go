package main

import (
	"context"
	"encoding/json"
	"math/rand"
	"os"
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

func appendToJSONFile(filename, website, email, password string) error {
	// Convert input parameters to UserData struct
	data := UserData{
		Website:  website,
		Email:    email,
		Password: password,
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
			return err
		}
	}

	// Append new data
	existingData = append(existingData, data)

	// Create/open the JSON for writing
	file, err = os.Create(filename)
	if err != nil {
		return err
	}
	defer file.Close()

	// Encode and write updated data to the file
	encoder := json.NewEncoder(file)
	if err := encoder.Encode(existingData); err != nil {
		return err
	}

	return nil
}

func palindrome(s string) bool {
	reversed := ""
	for _, c := range s {
		reversed = string(c) + reversed
	}
	return reversed == s
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

func (a *App) Palindrome(s string) bool {
	return palindrome(s)
}

func (a *App) Add(filename, website, email, password string) error {
	return appendToJSONFile(filename, website, email, password)
}
