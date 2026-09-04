const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const path = require('path');
const fs = require('fs');
const config = require('../config.json');

module.exports = (client) => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 60 * 24 },
  }));

  passport.use(new DiscordStrategy({
    clientID: config.clientId,
    clientSecret: config.clientSecret,
    callbackURL: `${config.dashboardUrl}/auth/callback`,
    scope: ['identify', 'guilds'],
  }, (accessToken, refreshToken, profile, done) => {
    profile.accessToken = accessToken;
    return done(null, profile);
  }));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  app.use(passport.initialize());
  app.use(passport.session());

  const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
  };

  app.get('/login', (req, res) => res.render('login', { botName: config.botName }));
  app.get('/auth/discord', passport.authenticate('discord'));
  app.get('/auth/callback',
    passport.authenticate('discord', { failureRedirect: '/login' }),
    (req, res) => res.redirect('/')
  );
  app.get('/logout', (req, res) => req.logout(() => res.redirect('/login')));

  app.get('/', isAuth, (req, res) => {
    const userGuilds = req.user.guilds || [];
    const botGuilds = client.guilds.cache;
    const commonGuilds = userGuilds.filter(g => botGuilds.has(g.id));
    res.render('index', { user: req.user, guilds: commonGuilds, botName: config.botName });
  });

  app.get('/guild/:guildId', isAuth, (req, res) => {
    const guild = client.guilds.cache.get(req.params.guildId);
    if (!guild) return res.redirect('/');
    const userGuild = (req.user.guilds || []).find(g => g.id === req.params.guildId);
    if (!userGuild) return res.redirect('/');

    const channels = guild.channels.cache
      .filter(c => c.type === 0)
      .map(c => ({ id: c.id, name: c.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const roles = guild.roles.cache
      .filter(r => r.name !== '@everyone')
      .map(r => ({ id: r.id, name: r.name, color: r.hexColor }))
      .sort((a, b) => a.name.localeCompare(b.name));

    res.render('guild', { user: req.user, guild, channels, roles, config: client.config, botName: config.botName });
  });

  const saveConfig = (res, updates) => {
    try {
      const configPath = path.join(__dirname, '../config.json');
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      Object.assign(cfg.channels, updates.channels || {});
      Object.assign(cfg.roles, updates.roles || {});
      fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2));
      Object.assign(client.config.channels, updates.channels || {});
      Object.assign(client.config.roles, updates.roles || {});
      res.json({ success: true, message: 'Configuration sauvegardée !' });
    } catch (err) {
      res.json({ success: false, message: 'Erreur lors de la sauvegarde.' });
    }
  };

  app.post('/api/:guildId/welcome', isAuth, (req, res) => {
    saveConfig(res, { channels: { welcome: req.body.channelId }, roles: { member: req.body.roleId } });
  });
  app.post('/api/:guildId/tickets', isAuth, (req, res) => {
    saveConfig(res, { channels: { tickets: req.body.channelId }, roles: { staff: req.body.staffRoleId } });
  });
  app.post('/api/:guildId/logs', isAuth, (req, res) => {
    saveConfig(res, { channels: { logs: req.body.channelId } });
  });
  app.post('/api/:guildId/moderation', isAuth, (req, res) => {
    saveConfig(res, { roles: { staff: req.body.staffRoleId } });
  });

  app.listen(config.dashboardPort, () => {
    console.log(`🌐 Dashboard disponible sur http://localhost:${config.dashboardPort}`);
  });
};
