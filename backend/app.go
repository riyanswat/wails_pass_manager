package backend

import (
	"context"
	"embed"
)

var content embed.FS

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

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

// Expose backend apis to frontend
func (a *App) Generate(length int) string {
	return GenerateRandomPassword(length)
}

func (a *App) Add(website, email, password string) string {
	return AddToJSON(website, email, password)
}

func (a *App) Delete(websiteToDelete string) string {
	return DeleteFromJSON(websiteToDelete)
}

// func (a *App) Search(webToSearch string) (UserData, string) {
// 	return SearchWebsite(webToSearch)
// }

func (a *App) Search(webToSearch string) ([]interface{}, error) {
	return SearchWebsite(webToSearch)
}
