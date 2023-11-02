package main

import (
	"context"
	"math/rand"
	"time"
	// "encoding/json"
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

// Generates a random password of length 'length'
func (a *App) Generate(length int) string {
	return generateRandomPassword(length)
}

func (a *App) Palindrome(s string) bool {
	return palindrome(s)
}
