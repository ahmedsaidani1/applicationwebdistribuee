# 🎨 Keycloak Custom Theme - Library

## Overview
Custom Keycloak theme matching the Material-UI frontend design.

## Theme Components

### 1. Login Theme
- **Colors**: Material-UI Blue (#1976d2) matching frontend
- **Style**: Modern card-based login with gradient background
- **Features**:
  - Responsive design
  - Custom error/success alerts
  - Smooth transitions and hover effects
  - 📚 Book icon branding

### 2. Account Theme
- **Style**: Matches Keycloak v2 account console with custom colors
- **Features**:
  - Branded navigation
  - Primary color override
  - Consistent with login theme

### 3. Email Theme
- **Style**: Professional HTML emails with library branding
- **Features**:
  - Responsive email layout
  - Branded header with gradient
  - CTA buttons in primary color

## Colors Used

```css
Primary Color: #1976d2 (Material-UI Blue)
Primary Dark: #115293
Primary Light: #4791db
Secondary: #dc004e
Background: #f5f5f5
```

## Languages Supported
- **French (fr)** - Default
- **English (en)**

## Files Structure

```
library-theme/
├── login/
│   ├── theme.properties
│   ├── resources/css/login.css
│   └── messages/
│       ├── messages_en.properties
│       └── messages_fr.properties
├── account/
│   ├── theme.properties
│   └── resources/css/account.css
└── email/
    ├── theme.properties
    └── html/template.ftl
```

## How to Apply

1. **Theme is automatically mounted** via docker-compose volume:
   ```yaml
   volumes:
     - ./keycloak/themes:/opt/keycloak/themes
   ```

2. **Realm configuration** (realm-export.json):
   ```json
   "loginTheme": "library-theme",
   "accountTheme": "library-theme",
   "emailTheme": "library-theme"
   ```

3. **Restart Keycloak**:
   ```bash
   docker-compose restart keycloak
   ```

4. **Test the theme**:
   - Navigate to: http://localhost:8180/realms/library-realm/account
   - Or trigger login from frontend: http://localhost:3000

## Testing

### Test Login Page
1. Go to http://localhost:3000
2. Click "Se connecter"
3. Observe custom themed login page

### Test Account Console
1. Login to http://localhost:3000
2. Go to http://localhost:8180/realms/library-realm/account
3. Observe themed account management

## Customization

To modify colors, edit:
- `login/resources/css/login.css` (lines 3-11)
- `account/resources/css/account.css` (lines 3-7)

## Notes

- Theme matches frontend Material-UI design exactly
- Supports French and English languages
- Responsive and mobile-friendly
- Professional and modern appearance
- Ready for production use
