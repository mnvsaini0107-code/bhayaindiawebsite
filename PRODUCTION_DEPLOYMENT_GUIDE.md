# BHAYA INDIA — LIVE PRODUCTION DEPLOYMENT GUIDE

This guide provides step-by-step instructions to take the **BHAYA INDIA** website live on **Render**, **Railway**, **Hostinger VPS**, or **Netlify**.

---

## 1. Push Latest Code to GitHub

All changes, authentic image assets, and deployment configurations are committed to your local `main` branch. Push to GitHub with:

```bash
git push origin main
```

*(Repository: `https://github.com/mnvsaini0107-code/bhayaindiawebsite.git`)*

---

## 2. Option A: Render (Easiest Cloud Web Service)

Render automatically builds and deploys your Next.js application from GitHub with automatic HTTPS/SSL and zero server management.

### Render Setup Steps

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `mnvsaini0107-code/bhayaindiawebsite`.
4. Configure settings:
   - **Name:** `bhaya-india`
   - **Language / Environment:** `Node`
   - **Branch:** `main`
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm run start`
   - **Plan:** Free or Starter
5. Add **Environment Variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
   - `COMMERCE_MODE` = `standalone`
   - `NEXT_PUBLIC_SITE_URL` = `https://your-render-url.onrender.com` (or your custom domain)
   - `ADMIN_PASSWORD` = `<your-secure-admin-password>`
   - `ADMIN_JWT_SECRET` = `<random-32-char-string>`
6. Click **Create Web Service**. Your website will be live in 2–3 minutes with automatic SSL.

---

## 3. Option B: Railway (High Performance Cloud Container)

Railway automatically detects either the `Dockerfile` or standard Next.js build.

### Railway Setup Steps

1. Log in to [Railway](https://railway.app/).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select `bhayaindiawebsite`.
4. Under **Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
   - `COMMERCE_MODE` = `standalone`
   - `NEXT_PUBLIC_SITE_URL` = `https://${{RAILWAY_PUBLIC_DOMAIN}}`
   - `ADMIN_PASSWORD` = `<your-secure-admin-password>`
   - `ADMIN_JWT_SECRET` = `<random-32-char-string>`
5. Under **Settings** → **Networking**, click **Generate Domain** to get a public URL or link your custom domain (e.g., `bhayaindia.com`).

---

## 4. Option C: Hostinger VPS or Ubuntu Linux

If deploying to a Hostinger KVM VPS running Ubuntu:

### Step 1: Initial Server Setup (SSH into VPS)

```bash
ssh root@YOUR_SERVER_IP

# Update system and install Node 20 LTS & PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx
sudo npm install -g pm2
```

### Step 2: Clone and Build App

```bash
sudo mkdir -p /var/www
cd /var/www
git clone https://github.com/mnvsaini0107-code/bhayaindiawebsite.git bhaya-india
cd bhaya-india

# Install dependencies and build production package
npm ci
npm run build
```

### Step 3: Configure Environment

Create `/var/www/bhaya-india/.env.production`:

```bash
NODE_ENV=production
PORT=3000
COMMERCE_MODE=standalone
NEXT_PUBLIC_SITE_URL=https://bhayaindia.com
ADMIN_PASSWORD=your_secure_password
ADMIN_JWT_SECRET=your_random_jwt_secret
```

### Step 4: Start Process with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 5: Configure Nginx Reverse Proxy

Edit `/etc/nginx/sites-available/default`:

```nginx
server {
    listen 80;
    server_name bhayaindia.com www.bhayaindia.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Reload Nginx:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### Step 6: Free SSL with Certbot

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d bhayaindia.com -d www.bhayaindia.com
```

---

## 5. Option D: Netlify

The repository includes `netlify.toml` preconfigured for Next.js.

1. Connect repo on [Netlify Dashboard](https://app.netlify.com/).
2. Select `bhayaindiawebsite`.
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add production environment variables in Netlify UI and deploy.

---

## 6. Production Health Check

Once live, verify:

- Homepage: `https://your-domain/`
- Catalogue: `https://your-domain/products`
- Founder Profile: `https://your-domain/founder-profile`
- Admin Login: `https://your-domain/admin/login`
- Health check API: `https://your-domain/api/site-health`
