import { Logger } from '../utils/Logger';
import * as express from 'express';
import { Express, Request, Response, NextFunction } from 'express';
import * as kleur from 'kleur';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import { Strategy } from 'passport-discord';
import DiscordScopes from './DiscordScopes';
import * as session from 'express-session';
import GuildManager from '../database/GuildManager';

export type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'MIDDLEWARE';

class HTTPServer extends Logger {
  private static instance: HTTPServer;

  private readonly app: Express;

  private readonly server: http.Server;

  private constructor() {
    super();
    HTTPServer.instance = this;

    const app = express();
    this.app = app;

    // TODO: Properly implement all of this passport stuff!
    passport.serializeUser(function(user, done) {
      done(null, user);
    });
    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });

    passport.use(
      new Strategy(
        {
          clientID: '647856078612332614',
          clientSecret: 'X9IqqE-1cfpilrVTJHDuVMZkh1bOBh7w',
          callbackURL: 'http://localhost:5000/callback', // TODO: Configure
          scope: DiscordScopes
        },
        (accessToken, refreshToken, profile, done) => {
          process.nextTick(function() {
            return done(null, profile);
          });
        }
      )
    );

    function checkAuth(req: Request, res: Response, next: NextFunction) {
      if (req.isAuthenticated()) return next();
      res.send('not logged in :(');
    }

    app.use(
      session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.get(
      '/',
      passport.authenticate('discord', {
        scope: DiscordScopes,
        prompt: 'consent'
      }),
      function(req, res) {
        // do nothing
      }
    );
    app.get(
      '/callback',
      passport.authenticate('discord', { failureRedirect: '/' }),
      function(req, res) {
        res.redirect('/info');
      } // auth success
    );
    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });
    app.get('/info', checkAuth, async function(req, res) {
      const user: any = req.user;
      const guilds = user.guilds.map((g: any) => g.id);

      console.log(guilds);

      const overlappingGuilds = await GuildManager.get()
        .getGuilds(guilds)
        .then(g => g.toArray());

      //console.log(req.user)
      res.json({
        guilds: overlappingGuilds
      });
    });

    app.use(HTTPServer.logRequest.bind(this));
    app.use(bodyParser.json());

    this.server = http.createServer(this.app);

    http.createServer();
  }

  public static get() {
    return HTTPServer.instance || new HTTPServer();
  }

  private static logRequest(
    request: Request,
    _response: Response,
    next: NextFunction
  ) {
    HTTPServer.log(
      `${kleur.magenta(request.method)} ${kleur.cyan(request.path)}`
    );
    next();
  }

  public listen() {
    this.server.listen(process.env.PORT || 5000);
    HTTPServer.log(
      'Server listening on port ' + kleur.magenta(process.env.PORT || 5000)
    );
  }

  public addRoute(
    path: string,
    method: HTTPMethod,
    func: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ) {
    switch (method) {
      case 'GET':
        this.app.get(path, func);
        break;
      case 'POST':
        this.app.post(path, func);
        break;
      case 'PATCH':
        this.app.patch(path, func);
        break;
      case 'DELETE':
        this.app.delete(path, func);
        break;
      case 'MIDDLEWARE':
        this.app.use(path, func);
        break;
    }
  }
}

export default HTTPServer;
