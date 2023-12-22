package backend

import (
	"context"
	"embed"
	"regexp"
)

var content embed.FS

// user json struct
type UserData struct {
	Website  string `json:"website"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Editing configuration struct
type EditConfig struct {
	WebsiteToEdit string
	NewEmail      string
	NewPassword   string
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

func (a *App) Search(webToSearch string) ([]interface{}, error) {
	return SearchWebsite(webToSearch)
}

func (a *App) AllData() []UserData {
	return ShowAll()
}

func (a *App) Edit(web, email string) string {
	emailVal := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	re := regexp.MustCompile(emailVal)

	if re.MatchString(email) {
		data := EditConfig{
			WebsiteToEdit: web,
			NewEmail:      email,
		}
		return EditJSON(data)
	} else {
		data := EditConfig{
			WebsiteToEdit: web,
			NewPassword:   email,
		}

		return EditJSON(data)
	}

}
