# Emp-Mgmt-Webapp
MVP employee salary management webapp
## Quick Start
Step 1: Make sure [Docker](https://docs.docker.com/) installed on your machine
```
docker-compose up -d --build
```
Step 2: Open browser

[http://localhost:8000/](http://localhost:8000/)
![alt text](https://raw.githubusercontent.com/zivezab/emp-mgmt-webapp/main/screenshot/LandingPage_en.png "Landing Page (Default)")
![alt text](https://raw.githubusercontent.com/zivezab/emp-mgmt-webapp/main/screenshot/LandingPage_zh-cn.png "Landing Page (Chinese Simplified)")
![alt text](https://raw.githubusercontent.com/zivezab/emp-mgmt-webapp/main/screenshot/LandingPage_zh-tw.png "Landing Page (Chinese Traditional)")
![alt text](https://raw.githubusercontent.com/zivezab/emp-mgmt-webapp/main/screenshot/LandingPage_fr.png "Landing Page (French)")

To adjust browser languages
[chrome://settings/?search=languages](chrome://settings/?search=languages)
![alt text](https://raw.githubusercontent.com/zivezab/emp-mgmt-webapp/main/screenshot/Languages.png "Chrome Languages")

## Tech Stack
- Django (Python)
- Postgresl
- Bootstrap (jQuery)

![alt text](https://raw.githubusercontent.com/zivezab/emp-mgmt-webapp/main/screenshot/TechStack.png "Tech Stack")

## Architecture
![alt text](https://raw.githubusercontent.com/zivezab/emp-mgmt-webapp/main/screenshot/Architecture.png "Architecture")


### CRUD Testing
Django REST framework tool [http://localhost:8000/users/](http://localhost:8000/users/) 

### Task Status
- [x] USER STORY 1: Upload Users
- [x] USER STORY 2: Employee Dashboard Feature
- [x] USER STORY 3: CRUD Feature
- [x] USER STORY 4: Better UX When Uploading Large CSV Files
- [x] USER STORY 5: UI Localization