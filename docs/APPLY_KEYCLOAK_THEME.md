# 🎨 Apply Keycloak Custom Theme

## Option 1: Via Keycloak Admin Console (RECOMMENDED)

### Step 1: Access Admin Console
1. Open: http://localhost:8180/admin
2. Login: **admin** / **admin**

### Step 2: Configure Realm Theme
1. Select **"library-realm"** (top-left dropdown)
2. Go to **Realm settings** (left sidebar)
3. Click **Themes** tab
4. Configure:
   - **Login theme**: `library-theme`
   - **Account theme**: `library-theme`
   - **Email theme**: `library-theme`
   - **Admin console theme**: Leave as `keycloak`
5. Click **Save**

### Step 3: Configure Internationalization (Optional)
1. Still in **Realm settings**
2. Click **Localization** tab
3. Enable **Internationalization**: ON
4. **Supported locales**: 
   - ✅ English (en)
   - ✅ Français (fr)
5. **Default locale**: `Français` (fr)
6. Click **Save**

### Step 4: Test the Theme
1. **Logout from admin console**
2. Go to: http://localhost:3000
3. You should see the custom themed login page:
   - 📚 Book icon
   - Blue Material-UI colors (#1976d2)
   - Modern card-based design
   - Gradient purple background

---

## Option 2: Via Docker Rebuild (Nuclear Option)

If Option 1 doesn't work:

### Step 1: Stop and Remove Keycloak
```bash
docker-compose stop keycloak
docker-compose rm -f keycloak
docker volume rm application-web-distribuée_keycloak-data
```

### Step 2: Start Fresh
```bash
docker-compose up -d keycloak
```

**Wait 20 seconds**, then check:
```bash
docker-compose logs keycloak | findstr "started"
```

### Step 3: Verify Theme Applied
- Go to: http://localhost:3000
- Click "Se connecter"
- Observe custom theme

---

## Option 3: Manual Theme Application (If realm exists)

If you don't want to lose existing data:

### Via Keycloak CLI (Inside Container)
```bash
# Enter container
docker exec -it keycloak bash

# Apply theme
/opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --realm master --user admin --password admin

/opt/keycloak/bin/kcadm.sh update realms/library-realm -s loginTheme=library-theme -s accountTheme=library-theme -s emailTheme=library-theme

# Exit
exit
```

---

## Verification Checklist

### ✅ Theme Files Exist
Check if theme files are properly mounted:
```bash
docker exec keycloak ls -la /opt/keycloak/themes/library-theme
```

Expected output:
```
drwxr-xr-x account
drwxr-xr-x email  
drwxr-xr-x login
-rw-r--r-- README.md
```

### ✅ Theme CSS Loaded
```bash
docker exec keycloak cat /opt/keycloak/themes/library-theme/login/resources/css/login.css | head -20
```

Should show CSS with `--primary-color: #1976d2;`

### ✅ Realm Uses Theme
Go to: http://localhost:8180/admin/master/console/#/library-realm/realm-settings/themes

Should show:
- Login theme: **library-theme**
- Account theme: **library-theme**
- Email theme: **library-theme**

---

## Troubleshooting

### Theme Not Showing
1. **Clear browser cache**: Ctrl + Shift + Delete
2. **Hard refresh**: Ctrl + F5
3. **Check Keycloak logs**:
   ```bash
   docker-compose logs keycloak | findstr -i theme
   ```

### "Theme not found" Error
- **Restart Keycloak**:
  ```bash
  docker-compose restart keycloak
  ```
- **Verify volume mount** in docker-compose.yml:
  ```yaml
  volumes:
    - ./keycloak/themes:/opt/keycloak/themes
  ```

### Old Theme Still Showing
- **Clear Keycloak cache**:
  ```bash
  docker-compose stop keycloak
  docker-compose up -d keycloak
  ```

---

## Expected Result

### Before (Default Theme)
- Red Keycloak logo
- Simple white form
- Standard Keycloak branding

### After (Custom Theme)
- 📚 Book emoji icon
- "Bibliothèque en ligne" header
- Blue (#1976d2) buttons
- Purple gradient background
- Modern card design
- Matches frontend perfectly!

---

## Quick Test Commands

### Test Login Page
```bash
# Open in browser
start http://localhost:3000
```

### Test Account Console
```bash
# After logging in
start http://localhost:8180/realms/library-realm/account
```

### Check Theme Version
```bash
docker exec keycloak cat /opt/keycloak/themes/library-theme/login/theme.properties
```

---

## Screenshots to Take for Professor

1. **Before**: Default Keycloak login (if you have screenshot)
2. **After**: Custom themed login with book icon and blue colors
3. **Admin Console**: Realm settings showing theme configuration
4. **Comparison**: Frontend + Keycloak side-by-side showing matching colors

---

## Score Impact

- ✅ **Custom theme matching frontend**: +1-2 points
- ✅ **Professional appearance**: Better impression
- ✅ **Attention to detail**: Shows thoroughness
- ✅ **Complete branding**: Demonstrates full-stack skills

**Estimated improvement**: 15-16/20 → **16-17/20** with custom theme! 🎉
