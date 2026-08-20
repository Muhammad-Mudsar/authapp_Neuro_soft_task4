# authapp_Neuro_soft_task4
Auth app neuroFive 

authFlow — Premium Authentication & User Management System
authFlow is a modern, production‑ready Django application that provides a complete authentication flow (signup, login, protected dashboard) with a premium, futuristic dark UI. It combines Django’s robustness with a carefully crafted frontend built with HTML, Tailwind CSS, and vanilla JavaScript – delivering a high‑end SaaS‑like experience.

# ✨ Features
Beautiful Landing Page – Hero section with animated CTAs.

Signup – Email, password (with strength meter), confirm password, terms agreement.

Login – Email/username, password, “Remember me”,.

Protected Dashboard – User management with:

KPI summary cards (total, active, pending, suspended).

Search, filtering (status/role), sorting, pagination.

Bulk actions (suspend/delete).

Add/Edit user modal.

User details drawer.

Responsive sidebar and table.

Toast Notifications – Both server‑side (Django messages) and client‑side (AJAX) feedback.

Fully Responsive – Mobile‑first, adapts to all screen sizes.

Accessibility – Keyboard navigation, focus management, prefers‑reduced‑motion support.

Premium Design System – Dark surfaces, electric blue/purple accents, subtle glassmorphism, and polished micro‑interactions.

# 🛠️ Tech Stack
Layer	Technologies
Backend	Django (Python)
Frontend	HTML, Tailwind CSS (via CDN), vanilla JavaScript, Font Awesome icons
Styling	Custom CSS with design tokens, responsive utilities
Icons	Font Awesome 6
Fonts	Google Fonts (Inter)
Build	None – all static files served directly

# 📁 Project Structure
text
authFlow/
├── authFlow/                  # Project settings
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── home/                      # Landing page app
│   ├── __init__.py
│   ├── views.py
│   ├── urls.py
│   ├── templates/
│   │   └── home/
│   │       └── index.html     # Landing page
│   └── static/
│       └── (shared static files)
├── accounts/                  # Authentication app (signup, login, dashboard)
│   ├── __init__.py
│   ├── views.py               # Login, signup, dashboard views
│   ├── urls.py
│   ├── templates/
│   │   └── accounts/
│   │       ├── login.html
│   │       ├── signup.html
│   │       └── dashboard.html
│   └── static/
│       └── accounts/
│           ├── css/
│           │   └── style2.css # Global design tokens & components
│           └── js/
│               ├── common.js  # Toast, password toggle, strength utilities
│               └── dashboard.js # User management logic
├── static/                    # Project‑level static (symlinked or collected)
│   └── (same structure as above)
├── manage.py
└── db.sqlite3                 # Default database
Note: The frontend files (CSS, JS) are placed in the accounts/static/accounts/ directory. For a simpler setup, you can move them to a shared static/ folder and update the template {% static %} paths accordingly.

# 🚀 Installation
Prerequisites
Python 3.8+ installed

pip (Python package manager)

Virtual environment (recommended)

Steps
Clone the repository

bash
git clone https://github.com/muhammad-mudsar/authFlow.git
cd authFlow
Create and activate a virtual environment

bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
Install dependencies

bash
pip install django
(Only Django is required – no other packages.)

Apply migrations

bash
python manage.py migrate
Create a superuser (optional)

bash
python manage.py createsuperuser
Run the development server

bash
python manage.py runserver
Open http://127.0.0.1:8000/ in your browser.

🧭 Usage
Pages
URL path	Page	Description
/	Landing (index)	Hero section with signup/login CTAs
/signup/	Signup	Create a new account
/login/	Login	Sign in with existing credentials
/dashboard/	Dashboard	Protected user management (requires login)
The authentication views are placeholders; you can connect them to Django’s built‑in User model or a custom user model.


🎨 Customisation
Design Tokens
All colours, spacing, radius, shadows and transitions are defined as CSS custom properties in css/styles.css. You can easily rebrand the application by modifying these variables.

Adding New Pages
Create a new template in the appropriate app’s templates/ folder.

Extend the base template if you create one – or reuse the same structure (glassy containers, ambient background).

Include style2.css and common.js in your page.

🧪 Testing
The project currently uses a mock data set for the dashboard (48 sample users). To replace with real data, update the allUsers array in dashboard.js or connect to a REST API.

# 🤝 Contributing
Contributions are welcome! Please follow these steps:

# Fork the project.

Create a feature branch (git checkout -b feature/amazing-feature).

Commit your changes (git commit -m 'Add some feature').

Push to the branch (git push origin feature/amazing-feature).

Open a Pull Request.

# 📄 License
This project is licensed under the MIT License – see the LICENSE file for details.

# 🙏 Acknowledgements
Tailwind CSS – for the utility‑first CSS framework.

Font Awesome – for the icon set.

Google Fonts (Inter) – for the typeface.

Django community – for the fantastic web framework.

Built with ❤️ by your team at  NeuroFive Solutions .