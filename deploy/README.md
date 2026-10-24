# Deploying the web app

`.github/workflows/deploy.yml` builds the Next.js app and ships it to the server over SSH on every
push to `main` (or manually via **Actions → Deploy Web → Run workflow**).

The app needs a **Node process on the server**: `next start`, managed by the `monte-y-cielo-web`
systemd unit, listening on `127.0.0.1:3001`, with nginx reverse-proxying `www.monteycieloapartments.com`
to it. Port 3001 (not 3000) so it can share a box with another Node app.

Each deploy lands in `/opt/monte-y-cielo-web/releases/<commit-sha>` (with `node_modules` installed
there), then `current` is atomically repointed and the service is restarted. The five newest releases
are kept, so a rollback is a symlink swap plus a restart.

Uploaded photos and property edits live in **`/opt/monte-y-cielo-web/storage`**, outside the
releases, so deploys never touch them. Back this folder up.

### Why the build pulls `storage/*.json` from the server

`/es`, `/en` and `/fr` are **prerendered at build time**, and that render reads `photos.json` and
`properties.json`. A CI build with an empty `storage/` would ship pages with no photos until the next
admin edit. So before `npm run build` the workflow copies those two files from the server (not the
images; those are served from disk at request time). An admin edit made while a deploy is running may
not show until the next edit or deploy.

## Environment secrets and variables

The workflow runs in the **`prod`** environment. Create it under **Settings → Environments**, limit
deployment branches to `main`, then add:

| Kind | Name | Value |
|---|---|---|
| Secret | `DEPLOY_SSH_KEY` | private key, full PEM including BEGIN/END lines |
| Secret | `DEPLOY_HOST` | server host or IP |
| Secret | `DEPLOY_USER` | `ec2-user` (or `ubuntu`) |
| Secret | `DEPLOY_PORT` | optional, defaults to `22` |
| Secret | `DEPLOY_KNOWN_HOSTS` | optional; `ssh-keyscan <host>` output to pin the fingerprint |
| Variable **or** Secret | `WHATSAPP_NUMBER` | country code + number, digits only |

`WHATSAPP_NUMBER` is baked into the prerendered pages at build time, so it must be set in GitHub. Keep
it equal to the value in the server's env file (used by the pages rendered at request time).

`ADMIN_PASSWORD` and `SESSION_SECRET` are **not** in GitHub: they are only needed at runtime and live
in `/etc/monte-y-cielo-web.env` on the server.

## One-time server setup

Requires nginx, certbot and rsync, plus **Node 22 installed system-wide** so `npm` is on the PATH for
non-interactive SSH and for the systemd service. An **nvm-only** install (under `~/.nvm`) will NOT
work — the deploy's `npm ci` and the service both run in shells that never source your `~/.bashrc`.

```bash
# 0. Node 22 + rsync, system-wide. Confirm `which npm` prints /usr/bin/npm (or /usr/local/bin/npm).
#    Amazon Linux 2023 / RHEL:
sudo dnf install -y nodejs22 rsync
#    Ubuntu / Debian (NodeSource):
#      curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs rsync
which npm

# 1. A dedicated service user (runs the Node process, owns the photo storage).
sudo useradd --system --create-home --shell /usr/sbin/nologin monteycielo || true

# 2. Layout. The SSH deploy user (the DEPLOY_USER secret) must OWN the releases tree, or the
#    deploy's `mkdir` fails with "Permission denied". The service user owns storage, since the
#    admin panel writes photos there. Set DEPLOY_USER to a real value here.
DEPLOY_USER=ec2-user
sudo mkdir -p /opt/monte-y-cielo-web/releases /opt/monte-y-cielo-web/storage
sudo chown "$DEPLOY_USER":"$DEPLOY_USER" /opt/monte-y-cielo-web /opt/monte-y-cielo-web/releases
sudo chown monteycielo:monteycielo /opt/monte-y-cielo-web/storage
sudo chmod 755 /opt/monte-y-cielo-web /opt/monte-y-cielo-web/releases /opt/monte-y-cielo-web/storage

# 3. Runtime secrets. Fill in ADMIN_PASSWORD, SESSION_SECRET and WHATSAPP_NUMBER.
sudo cp deploy/monte-y-cielo-web.env.example /etc/monte-y-cielo-web.env
sudo chmod 600 /etc/monte-y-cielo-web.env
sudo nano /etc/monte-y-cielo-web.env

# 4. Install the systemd service, then enable it (it will fail to start until the first deploy
#    creates /opt/monte-y-cielo-web/current — that is expected).
sudo cp deploy/monte-y-cielo-web.service /etc/systemd/system/monte-y-cielo-web.service
sudo systemctl daemon-reload
sudo systemctl enable monte-y-cielo-web

# 5. TLS first. The site config terminates HTTPS and redirects all HTTP to it, so nginx will not
#    load it until the certificate exists. DNS for www.monteycieloapartments.com (and the apex)
#    must resolve to this box first.
sudo systemctl enable --now nginx
sudo certbot certonly --nginx -d www.monteycieloapartments.com -d monteycieloapartments.com

# 6. Now the cert exists — install the site config.
#    Amazon Linux / RHEL:
sudo cp deploy/nginx-monte-y-cielo-web.conf /etc/nginx/conf.d/monte-y-cielo-web.conf
#    Debian / Ubuntu:
#      sudo cp deploy/nginx-monte-y-cielo-web.conf /etc/nginx/sites-available/monte-y-cielo-web
#      sudo ln -s /etc/nginx/sites-available/monte-y-cielo-web /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 7. Let the deploy user restart the service without a password — and only that.
SYSTEMCTL=$(command -v systemctl)
sudo tee /etc/sudoers.d/monte-y-cielo-web >/dev/null <<EOF
$USER ALL=(root) NOPASSWD: $SYSTEMCTL restart monte-y-cielo-web, $SYSTEMCTL reload nginx
EOF
sudo chmod 440 /etc/sudoers.d/monte-y-cielo-web
sudo visudo -c   # verify before logging out; a bad sudoers file locks you out of sudo
```

If the box already hosts another site with this layout (e.g. volao.web), steps 0 and the nginx/certbot
install are already done; the rest is per-site.

### Seeding existing photos (optional)

To start from the photos you uploaded locally, copy your local `storage/` up once, before the first
deploy (from the project root, with the deploy key):

```bash
rsync -az storage/ <DEPLOY_USER>@<DEPLOY_HOST>:/tmp/monte-y-cielo-storage/
```

Then on the server:

```bash
sudo rsync -a /tmp/monte-y-cielo-storage/ /opt/monte-y-cielo-web/storage/
sudo chown -R monteycielo:monteycielo /opt/monte-y-cielo-web/storage
rm -rf /tmp/monte-y-cielo-storage
```

## HTTPS

The certificate is obtained in step 5, and `nginx-monte-y-cielo-web.conf` terminates TLS and
301-redirects HTTP → HTTPS (and apex → www). certbot installs a systemd timer that renews unattended.

```bash
curl -sI http://www.monteycieloapartments.com | grep -i location   # -> https://www.monteycieloapartments.com/
```

## Rolling back

```bash
ls -1t /opt/monte-y-cielo-web/releases                                 # newest first
sudo ln -sfn /opt/monte-y-cielo-web/releases/<sha> /opt/monte-y-cielo-web/current
sudo systemctl restart monte-y-cielo-web
```

## When a deploy fails

The workflow prints the service status/journal and `nginx -t` if the site does not return 200.
On the box:

```bash
sudo systemctl status monte-y-cielo-web --no-pager
sudo journalctl -u monte-y-cielo-web -n 100 --no-pager
curl -sI http://127.0.0.1:3001/es                                     # the Node app directly
sudo nginx -t && sudo tail -n 50 /var/log/nginx/error.log
```

**`mkdir: cannot create directory '/opt/monte-y-cielo-web/releases': Permission denied`** during
"Upload release" means the SSH deploy user does not own the releases tree. Re-run step 2 with
`DEPLOY_USER` set to the SSH user.

**`npm: command not found`** during "Install production dependencies" (or the service failing to
start) means Node is not on the system PATH — usually an nvm-only install. Install Node 22
system-wide (step 0).

**`rsync: command not found`** during "Upload release" means rsync is missing on the server (step 0).

**`Failed to restart monte-y-cielo-web.service: Unit ... not found`** during "Activate" means the
systemd unit was never installed — the deploy ships only the build, not the `deploy/` files. Run
steps 1, 3 and 4. If the server has no clone of this repo, paste the files with `sudo tee`.

**`SESSION_SECRET must be set to at least 32 characters`** in the journal means
`/etc/monte-y-cielo-web.env` is missing or incomplete (step 3).

**Photo uploads fail with `413`** means nginx is rejecting the body; check `client_max_body_size` in
the site config. **`EACCES` on upload** means `/opt/monte-y-cielo-web/storage` is not owned by
`monteycielo` (step 2).

**`nginx: [emerg] cannot load certificate`** means the site config was installed before the cert
exists (step 6 before step 5). Move the config aside, reload nginx, get the cert, restore it:

```bash
sudo mv /etc/nginx/conf.d/monte-y-cielo-web.conf /tmp/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot certonly --nginx -d www.monteycieloapartments.com -d monteycieloapartments.com
sudo mv /tmp/monte-y-cielo-web.conf /etc/nginx/conf.d/
sudo nginx -t && sudo systemctl reload nginx
```
